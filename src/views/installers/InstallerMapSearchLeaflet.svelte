<script lang="ts">
  import { onMount } from "svelte";
  import { setupWordScrollAnimation } from "@/lib/gsap";
  import InstallerCard from "@/components/InstallerCard.svelte";
  import { ALL_COUNTRIES } from "@/lib/site";

  export let installersData: Record<string, Record<string, any[]>> = {};
  export let googleMapsApiKey: string = "";

  // Flatten nested structure and include country metadata on each installer
  const allInstallers = Object.entries(installersData).flatMap(([countryCode, cities]) =>
    Object.entries(cities).flatMap(([cityName, cityList]) =>
      cityList.map(installer => {
        const formattedCity = cityName
          .split(" ")
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

        const fullCountry = ALL_COUNTRIES[countryCode] || countryCode;

        return {
          ...installer,
          phone: installer.contact,
          google_map: installer.google_map || installer.google_maps,
          location: `${formattedCity}, ${fullCountry}`,
          countryName: fullCountry,
          countryCode: countryCode
        };
      })
    )
  );

  let searchQuery = "";
  let isDropdownOpen = false;
  let selectedInstaller: any = null;
  let mapElement: HTMLDivElement;
  let map: google.maps.Map;
  let markersMap = new Map();
  let userMarker: google.maps.Marker | null = null;

  let userLocation: { lat: number; lng: number } | null = null;
  let isLocating = false;
  let locationDenied = false;

  $: if (searchQuery) {
    if (!selectedInstaller || searchQuery !== selectedInstaller.name) {
      isDropdownOpen = true;
    }
  }

  // Distance-based sorting
  $: sortedInstallersByDistance = userLocation
    ? [...allInstallers].sort((a, b) => {
        const distA = getDistance(userLocation!.lat, userLocation!.lng, a.marker.lat, a.marker.lng);
        const distB = getDistance(userLocation!.lat, userLocation!.lng, b.marker.lat, b.marker.lng);
        return distA - distB;
      })
    : allInstallers;

  $: dynamicNearby = sortedInstallersByDistance.slice(0, 3);
  $: dynamicOther = sortedInstallersByDistance.slice(3);

  // Group dynamicOther installers by countryName
  $: dynamicOtherGrouped = dynamicOther.reduce((acc, installer) => {
    const country = installer.countryName;
    if (!acc[country]) {
      acc[country] = [];
    }
    acc[country].push(installer);
    return acc;
  }, {} as Record<string, typeof allInstallers>);

  $: filteredInstallers = searchQuery.trim() === ""
    ? []
    : allInstallers.filter(inst =>
        inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inst.address.toLowerCase().includes(searchQuery.toLowerCase())
      );

  onMount(async () => {
    requestUserLocation();
    setupWordScrollAnimation(".installer-heading");
    setupWordScrollAnimation(".search-heading");

    requestAnimationFrame(() => {
      const header = document.querySelector(".main-header") as HTMLElement | null;
      const heroSectionContainer = document.querySelector(".installers-container") as HTMLElement | null;

      if (header && heroSectionContainer) {
        const paddingTopValue =
          header.getBoundingClientRect().height +
          (Number(heroSectionContainer.dataset.paddingTop) ?? 0);
        heroSectionContainer.style.paddingTop = `${paddingTopValue}px`;
      }
    });

    await loadGoogleMapsScript();
    initMap();
  });

  function loadGoogleMapsScript(): Promise<void> {
    return new Promise((resolve) => {
      if (window.google && window.google.maps) {
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      document.head.appendChild(script);
    });
  }

  function initMap() {
    const defaultCenter = { lat: 30.3753, lng: 69.3451 };

    map = new google.maps.Map(mapElement, {
      center: defaultCenter,
      zoom: 3,
      zoomControl: true,
      fullscreenControl: false,
      streetViewControl: false,
    });

    renderMarkers();
  }

  function getCustomPinIcon(): string {
    const svgString = `
      <svg width="40" height="40" viewBox="0 0 57 57" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g filter="url(#filter0_d_571_524)">
          <path d="M16.2856 17.5714C16.2856 10.944 21.6582 5.57141 28.2856 5.57141C34.9131 5.57141 40.2856 10.944 40.2856 17.5714C40.2856 24.1988 34.9131 29.5714 28.2856 29.5714C21.6582 29.5714 16.2856 24.1988 16.2856 17.5714Z" fill="#FDC700" shape-rendering="crispEdges"/>
          <path d="M28.2856 6.32141C34.4988 6.32141 39.5356 11.3582 39.5356 17.5714C39.5356 23.7846 34.4988 28.8214 28.2856 28.8214C22.0724 28.8214 17.0356 23.7846 17.0356 17.5714C17.0356 11.3582 22.0724 6.32141 28.2856 6.32141Z" stroke="#21314D" stroke-width="1.5" shape-rendering="crispEdges"/>
          <path d="M32.7341 13.4476C32.6672 13.3301 32.561 13.2414 32.3879 13.162C30.0498 12.2209 26.5207 12.2209 24.1825 13.162C23.8132 13.3371 23.7475 13.5363 23.7394 13.9556C23.7071 17.425 24.9696 20.4474 27.8698 22.5196C28.1964 22.7453 28.3764 22.7442 28.7053 22.5184C31.6031 20.4474 32.8668 17.4227 32.8334 13.9556C32.8334 13.7275 32.8022 13.5651 32.7353 13.4465L32.7341 13.4476Z" fill="#21314D"/>
        </g>
      </svg>
    `;
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svgString);
  }

  function renderMarkers(zoomToNearestCity = false) {
    if (!map) return;

    markersMap.forEach(entry => entry.marker.setMap(null));
    markersMap.clear();

    const bounds = new google.maps.LatLngBounds();
    const cityBounds = new google.maps.LatLngBounds();
    const infoWindow = new google.maps.InfoWindow();
    const customIconUrl = getCustomPinIcon();

    let nearestCityName: string | null = null;
    if (zoomToNearestCity && sortedInstallersByDistance.length > 0) {
      nearestCityName = sortedInstallersByDistance[0].location;
    }

    allInstallers.forEach((installer) => {
      const coords = installer.marker;

      const marker = new google.maps.Marker({
        map,
        position: coords,
        title: installer.name,
        icon: {
          url: customIconUrl,
          scaledSize: new google.maps.Size(40, 40),
          anchor: new google.maps.Point(20, 20),
        },
      });

      const mapsUrl = installer.google_map || `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`;
      const whatsappUrl = "https://api.whatsapp.com/send?phone=" + installer.contact.replaceAll(" ", "").replaceAll("+", "");

      const popupContent = `
        <div style="font-family: var(--font-galano-grotesque); font-size: 13px;">
          <b style="font-size: 14px; color: #0d1b2a;">${installer.name}</b><br><br>
          <span style="color: #555;">${installer.address}</span><br>
          <a style="color: #555; margin-top:0.5rem; display:inline-block;" target="_blank" rel="noopener noreferrer" href="${whatsappUrl}">
            <span>📞 ${installer.contact}</span>
          </a><br>
          <a href="${mapsUrl}" target="_blank" rel="noopener noreferrer" style="background-color: #0d1b2a; color: white; padding: 6px 12px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold; margin-top: 6px;">
            Get Directions ↗
          </a>
        </div>
      `;

      marker.addListener("click", () => {
        infoWindow.setContent(popupContent);
        infoWindow.open(map, marker);
        selectInstaller(installer, coords);
      });

      markersMap.set(installer.name, { marker, infoWindow, content: popupContent });
      bounds.extend(coords);

      if (zoomToNearestCity && nearestCityName && installer.location === nearestCityName) {
        cityBounds.extend(coords);
      }
    });

    if (userLocation) {
      if (userMarker) userMarker.setMap(null);

      userMarker = new google.maps.Marker({
        map,
        position: userLocation,
        title: "Your Location",
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent('<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="8" cy="8" r="6" fill="#3b82f6" stroke="white" stroke-width="3"/></svg>'),
          scaledSize: new google.maps.Size(16, 16),
          anchor: new google.maps.Point(8, 8),
        }
      });

      bounds.extend(userLocation);
      if (zoomToNearestCity) {
        cityBounds.extend(userLocation);
      }
    }

    if (zoomToNearestCity && nearestCityName && !cityBounds.isEmpty()) {
      map.fitBounds(cityBounds);
      const listener = google.maps.event.addListener(map, "idle", () => {
        if (map.getZoom()! > 14) map.setZoom(14);
        google.maps.event.removeListener(listener);
      });
    } else {
      map.fitBounds(bounds);
    }
  }

  function requestUserLocation() {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    isLocating = true;
    locationDenied = false;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        isLocating = false;

        renderMarkers(true);
      },
      (error) => {
        isLocating = false;
        locationDenied = true;
        console.warn("Geolocation permission denied or error:", error.message);
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }

  function selectInstaller(installer: any, coords?: { lat: number; lng: number }) {
    selectedInstaller = installer;
    searchQuery = installer.name;
    isDropdownOpen = false;
    const targetCoords = coords || installer.marker;

    if (map) {
      map.setCenter(targetCoords);
      map.setZoom(15);
      const entry = markersMap.get(installer.name);
      if (entry) {
        entry.infoWindow.setContent(entry.content);
        entry.infoWindow.open(map, entry.marker);
      }
    }

    if (mapElement) {
      mapElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }

  function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }
</script>

<div data-padding-top={64} class="bg-pf-navy-dark installers-container pb-15">
  <div class="max-container flex flex-col items-center px-8 md:px-12.5">
    <h1 class="font-pf-mera-pro installer-heading mb-6 text-center text-lg tracking-[10%] text-white uppercase md:mb-7 md:text-2xl">
      Find an Installer
    </h1>

    <div class="flex flex-col items-center w-full">
      <div class="w-full max-w-175 mb-10 flex flex-col gap-4 sm:flex-row justify-between items-center bg-white/5 border border-white/10 px-4 py-3 rounded-lg sm:rounded-full text-white">
        <div class="text-xs sm:text-sm flex items-center gap-2 pl-2">
          {#if userLocation}
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_1084_260)">
<path d="M8 16C3.58862 16 0 12.4114 0 8C0 3.58862 3.58862 0 8 0C12.4114 0 16 3.58862 16 8C16 12.4114 12.4114 16 8 16ZM8 1C4.14001 1 1 4.14001 1 8C1 11.86 4.14001 15 8 15C11.86 15 15 11.86 15 8C15 4.14001 11.86 1 8 1Z" fill="white"/>
<path d="M7.25 10.6666C7.12195 10.6666 6.99402 10.618 6.89661 10.52L4.72998 8.35339C4.53467 8.15796 4.53467 7.84131 4.72998 7.646C4.92529 7.45068 5.24194 7.45068 5.43738 7.646L7.25061 9.45935L11.2307 5.47937C11.426 5.28406 11.7427 5.28406 11.938 5.47937C12.1333 5.67468 12.1333 5.99133 11.938 6.18665L7.60461 10.52C7.50598 10.618 7.37805 10.6666 7.25 10.6666Z" fill="white"/>
</g>
<defs>
<clipPath id="clip0_1084_260">
<rect width="16" height="16" fill="white"/>
</clipPath>
</defs>
</svg>
  Location updated - showing nearby installers.
          {:else}
           <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M8.55817 7.25589C8.55817 6.94765 8.30828 6.69775 8.00003 6.69775C7.69179 6.69775 7.44189 6.94765 7.44189 7.25589V11.721C7.44189 12.0293 7.69179 12.2791 8.00003 12.2791C8.30828 12.2791 8.55817 12.0293 8.55817 11.721V7.25589Z" fill="white"/>
<path fill-rule="evenodd" clip-rule="evenodd" d="M8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0ZM1.11628 8C1.11628 4.19823 4.19823 1.11628 8 1.11628C11.8017 1.11628 14.8837 4.19823 14.8837 8C14.8837 11.8017 11.8017 14.8837 8 14.8837C4.19823 14.8837 1.11628 11.8017 1.11628 8Z" fill="white"/>
<path d="M8.74423 5.02324C8.74423 5.43424 8.41106 5.76742 8.00005 5.76742C7.58903 5.76742 7.25586 5.43424 7.25586 5.02324C7.25586 4.61224 7.58903 4.27905 8.00005 4.27905C8.41106 4.27905 8.74423 4.61224 8.74423 5.02324Z" fill="white"/>
</svg>
Allow location access to discover nearby installers.
          {/if}
        </div>
        <button
          on:click={requestUserLocation}
          disabled={isLocating}
          class="bg-white text-pf-navy-dark rounded-full hover:bg-white/90 px-4 py-2  font-bold text-xs uppercase tracking-wider transition-colors whitespace-nowrap disabled:opacity-50"
        >
          {isLocating ? "Locating..." : userLocation ? "Refresh Location" : "Grant Location"}
        </button>
      </div>

      <div class="relative w-full max-w-[1266px] mb-4 md:mb-8">
        <div
          bind:this={mapElement}
          class="mx-auto h-[320px] md:h-[450px] w-full rounded-xs shadow-lg border border-white/20 z-10"
        ></div>
      </div>

      <h4 class="font-pf-mera-pro search-heading mt-7 mb-4 text-center text-base tracking-[23%] text-white uppercase md:mt-7 md:mb-8 md:text-xl">
        Search
      </h4>

      <div class= "relative w-full max-w-175 mb-0">
        <div class="relative flex items-center">
          <input
            type="text"
            bind:value={searchQuery}
            on:focus={() => { isDropdownOpen = true; }}
            placeholder="Search by city or installer name..."
            class="w-full focus:border-white/75 py-4 md:py-6 rounded-xs border border-white/50 bg-transparent text-white px-6 pr-14 outline-none placeholder:text-white/60"
          />
          <div class="absolute right-5 flex items-center pointer-events-none opacity-60">
            <svg width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="11.7673" cy="11.7677" rx="11.0173" ry="11.0177" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></ellipse>
              <path d="M19.4307 20.0029L23.7501 24.3113" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>
            </svg>
          </div>
        </div>

        {#if isDropdownOpen && filteredInstallers.length > 0}
          <ul class="absolute z-50 left-0 right-0 mt-2 bg-white text-black rounded-xs shadow-xl max-h-60 overflow-y-auto">
            {#each filteredInstallers as installer}
              <!-- svelte-ignore a11y-click-events-have-key-events -->
              <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
              <li
                class="px-6 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-none transition-colors flex justify-between items-center"
                on:click={() => selectInstaller(installer)}
              >
                <div>
                  <div class="font-bold text-sm text-pf-navy-dark">{installer.name}</div>
                  <div class="text-xs text-gray-500">{installer.address}</div>
                </div>
              </li>
            {/each}
          </ul>
        {/if}
      </div>
    </div>
  </div>
</div>

<div class="max-container flex flex-col gap-3.75 w-full mb-8">
  <div class="bg-pf-yellow/10 px-10 pt-10 pb-8 md:px-14 md:pt-18.5 md:pb-15 lg:px-20">
    <h3 class="font-pf-galano-grotesque text-pf-black mb-6 text-xl font-bold tracking-[2%] uppercase md:mb-12.5 md:text-[40px]">
      Nearby <span class="font-medium">Installers</span>
    </h3>
    <ul class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {#each dynamicNearby as installer}
        <slot name="card" {installer}>
          <InstallerCard {...installer} />
        </slot>
      {/each}
    </ul>
  </div>
</div>

<div class="max-container flex flex-col gap-3.75 w-full">
  {#each Object.entries(dynamicOtherGrouped) as [countryName, installers]}
    <div class="bg-pf-gohst-white px-10 pt-10 pb-8 md:px-14 md:pt-18.5 md:pb-15 lg:px-20">
      <h3 class="font-pf-galano-grotesque text-pf-black mb-6 text-xl font-bold tracking-[2%] uppercase md:mb-12.5 md:text-[40px]">
        {countryName}
      </h3>
      <ul class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {#each installers as installer}
          <InstallerCard {...installer} />
        {/each}
      </ul>
    </div>
  {/each}
</div>