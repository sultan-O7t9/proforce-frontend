<script lang="ts">
  import { onMount } from "svelte";
  import { setupWordScrollAnimation } from "@/lib/gsap";
  import "leaflet/dist/leaflet.css";
  import InstallerCard from "@/components/InstallerCard.svelte";

  export let nearbyInstallers: any[] = [];
  export let otherInstallers: Record<string, any[]> = {};

  // Combine all installers into a master list for distance calculations
  const allInstallers = [
    ...nearbyInstallers,
    ...Object.values(otherInstallers).flat(),
  ];

  let searchQuery = "";
  let isDropdownOpen = false;
  let selectedInstaller: any = null;
  let mapElement: HTMLDivElement;
  let map: any;
  let markersMap = new Map();
  let userMarker: any = null;

  // Geolocation state
  let userLocation: { lat: number; lng: number } | null = null;
  let isLocating = false;
  let locationDenied = false;

  // Reopen dropdown automatically when typing
  $: if (searchQuery) {
    if (!selectedInstaller || searchQuery !== selectedInstaller.name) {
      isDropdownOpen = true;
    }
  }

  // Reactive sorting of installers based on user location
  $: sortedInstallersByDistance = userLocation
    ? [...allInstallers].sort((a, b) => {
        const coordsA = getCoordinatesForInstaller(a);
        const coordsB = getCoordinatesForInstaller(b);
        const distA = getDistance(userLocation!.lat, userLocation!.lng, coordsA.lat, coordsA.lng);
        const distB = getDistance(userLocation!.lat, userLocation!.lng, coordsB.lat, coordsB.lng);
        return distA - distB;
      })
    : allInstallers;

  // If location is granted, pick top 3 closest as "Nearby", rest as "Other"
  $: dynamicNearby = userLocation ? sortedInstallersByDistance.slice(0, 3) : nearbyInstallers;
  $: dynamicOther = userLocation ? sortedInstallersByDistance.slice(3) : allInstallers.slice(3);

  // Search filter for dropdown
  $: filteredInstallers = searchQuery.trim() === ""
    ? []
    : allInstallers.filter(inst =>
        inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inst.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inst.address.toLowerCase().includes(searchQuery.toLowerCase())
      );

  onMount(async () => {
    requestUserLocation();

    setupWordScrollAnimation(".installer-heading");
    setupWordScrollAnimation(".search-heading");

    // Give the browser a brief moment to finish layout paint for accurate header dimensions
    requestAnimationFrame(() => {
      const header = document.querySelector(".main-header") as HTMLElement | null;
      const heroSectionContainer = document.querySelector(
        ".installers-container",
      ) as HTMLElement | null;

      if (header && heroSectionContainer) {
        const paddingTopValue =
          header.getBoundingClientRect().height +
          (Number(heroSectionContainer.dataset.paddingTop) ?? 0);
        heroSectionContainer.style.paddingTop = `${paddingTopValue}px`;
      }
    });

    const L = await import("leaflet");

    map = L.map(mapElement, {
      zoomControl: true,
      attributionControl: true
    }).setView([30.3753, 69.3451], 3);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      noWrap: false,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    renderMarkers(L);

    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  });

  function getCustomPinIcon(L: any) {
    return L.divIcon({
      className: 'custom-installer-pin',
      html: `
        <svg width="57" height="57" viewBox="0 0 57 57" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g filter="url(#filter0_d_571_524)">
            <path d="M16.2856 17.5714C16.2856 10.944 21.6582 5.57141 28.2856 5.57141C34.9131 5.57141 40.2856 10.944 40.2856 17.5714C40.2856 24.1988 34.9131 29.5714 28.2856 29.5714C21.6582 29.5714 16.2856 24.1988 16.2856 17.5714Z" fill="url(#paint0_linear_571_524)" shape-rendering="crispEdges"/>
            <path d="M28.2856 6.32141C34.4988 6.32141 39.5356 11.3582 39.5356 17.5714C39.5356 23.7846 34.4988 28.8214 28.2856 28.8214C22.0724 28.8214 17.0356 23.7846 17.0356 17.5714C17.0356 11.3582 22.0724 6.32141 28.2856 6.32141Z" stroke="#21314D" stroke-width="1.5" shape-rendering="crispEdges"/>
            <path d="M32.7341 13.4476C32.6672 13.3301 32.561 13.2414 32.3879 13.162C30.0498 12.2209 26.5207 12.2209 24.1825 13.162C23.8132 13.3371 23.7475 13.5363 23.7394 13.9556C23.7071 17.425 24.9696 20.4474 27.8698 22.5196C28.1964 22.7453 28.3764 22.7442 28.7053 22.5184C31.6031 20.4474 32.8668 17.4227 32.8334 13.9556C32.8334 13.7275 32.8022 13.5651 32.7353 13.4465L32.7341 13.4476Z" fill="#21314D"/>
          </g>
          <defs>
            <filter id="filter0_d_571_524" x="-7.00951e-05" y="-1.7643e-05" width="56.5714" height="56.5714" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
              <feFlood flood-opacity="0" result="BackgroundImageFix"/>
              <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha"/>
              <feMorphology radius="5.14286" operator="erode" in="SourceAlpha" result="effect1_dropShadow_571_524"/>
              <feOffset dy="10.7143"/>
              <feGaussianBlur stdDeviation="10.7143"/>
              <feComposite in2="hardAlpha" operator="out"/>
              <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.5 0"/>
              <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_571_524"/>
              <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_571_524" result="shape"/>
            </filter>
            <linearGradient id="paint0_linear_571_524" x1="16.2856" y1="5.57141" x2="40.2856" y2="29.5714" gradientUnits="userSpaceOnUse">
              <stop stop-color="#FDC700"/>
              <stop offset="1" stop-color="#F0B100"/>
            </linearGradient>
          </defs>
        </svg>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20],
      popupAnchor: [0, -20]
    });
  }

  function renderMarkers(L: any) {
    markersMap.forEach(marker => marker.remove());
    markersMap.clear();

    const bounds = L.latLngBounds([]);
    const customIcon = getCustomPinIcon(L);

    allInstallers.forEach((installer) => {
      const coords = getCoordinatesForInstaller(installer);
      const marker = L.marker([coords.lat, coords.lng], { icon: customIcon }).addTo(map);

      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`;

      const whatsappUrl = "https://api.whatsapp.com/send?phone=" + installer.phone.replaceAll(" ", "").replaceAll("+", "");
      const popupContent = `
        <div style="font-family: var(--font-galano-grotesque); font-size: 13px;">
          <b style="font-size: 14px; color: #0d1b2a;">${installer.name}</b><br><br>
          <span style="color: #555;">${installer.address}</span><br>
          <a
        class="flex items-center gap-1.25 text-[#555]" style="color: #555; margin-top:0.5rem;"
        target="_blank" rel="noopener noreferrer"
        href="${whatsappUrl}"
      >
        <svg
  width="16"
  height="16"
  viewBox="0 0 16 16"
  fill="none"
  xmlns="http://www.w3.org/2000/svg"
>
  <g opacity="0.5">
    <path
      d="M11.6713 9.53846L11.6653 9.58846C10.1993 8.85781 10.046 8.76048 9.85665 9.04447C9.72532 9.24114 9.34266 9.68713 9.22733 9.81913C9.11067 9.94912 8.99467 9.95912 8.79667 9.86913C8.59667 9.76913 7.95469 9.55913 7.1947 8.87914C6.60271 8.34915 6.20538 7.69916 6.08805 7.49917C5.89272 7.16184 6.30138 7.11384 6.67338 6.40985C6.74004 6.26986 6.70604 6.15986 6.65671 6.06053C6.60671 5.96053 6.20872 4.98055 6.04205 4.58989C5.88206 4.20056 5.71739 4.24989 5.59406 4.24989C5.21007 4.21656 4.92941 4.22189 4.68208 4.47922C3.6061 5.66187 3.87743 6.88185 4.79808 8.17916C6.60738 10.5471 7.57136 10.9831 9.334 11.5884C9.80999 11.7398 10.244 11.7184 10.5873 11.6691C10.97 11.6084 11.7653 11.1884 11.9313 10.7184C12.1013 10.2485 12.1013 9.85846 12.0513 9.76846C12.0019 9.67846 11.8713 9.62846 11.6713 9.53846Z"
      fill="#21314D"></path>
    <path
      d="M13.6798 2.29958C8.55384 -2.65566 0.0706654 0.938271 0.0673321 7.92881C0.0673321 9.32612 0.433325 10.6888 1.13065 11.8921L0 16L4.22326 14.8987C9.49316 17.7453 15.997 13.9654 15.9997 7.93281C15.9997 5.81552 15.1731 3.82289 13.6698 2.32558L13.6798 2.29958ZM14.6677 7.91081C14.6637 12.9994 9.07784 16.1773 4.65992 13.58L4.41992 13.4374L1.91997 14.0874L2.58995 11.6574L2.43062 11.4074C-0.318661 7.03083 2.83995 1.31093 8.04785 1.31093C9.81715 1.31093 11.4778 2.00092 12.7284 3.2509C13.9784 4.49021 14.6677 6.15084 14.6677 7.91081Z"
      fill="#21314D"></path>
  </g>
</svg>

        <span>${installer.phone}</span>
      </a> <br>
          <a href="${googleMapsUrl}" target="_blank" rel="noopener noreferrer"
             style="background-color: #0d1b2a; color: white; padding: 6px 12px; text-decoration: none; border-radius: 4px; display: inline-block; font-weight: bold;">
            Get Directions ↗
          </a>
        </div>
      `;

      marker.bindPopup(popupContent);
      marker.on("click", () => selectInstaller(installer, coords));

      markersMap.set(installer.name, marker);
      bounds.extend([coords.lat, coords.lng]);
    });

    if (userLocation) {
      if (userMarker) userMarker.remove();
      userMarker = L.marker([userLocation.lat, userLocation.lng], {
        icon: L.divIcon({
          className: 'user-location-pin',
          html: '<div style="background-color: #3b82f6; width: 16px; height: 16px; border: 3px solid white; border-radius: 50%; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>',
          iconSize: [16, 16]
        })
      }).addTo(map).bindPopup("<b>Your Location</b>");

      bounds.extend([userLocation.lat, userLocation.lng]);
      map.fitBounds(bounds, { padding: [50, 50] });
    } else {
      map.fitBounds(bounds, { padding: [30, 30] });
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
      async (position) => {
        userLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        isLocating = false;
        const L = await import("leaflet");
        renderMarkers(L);
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
    isDropdownOpen = false; // Hide dropdown on selection
    const targetCoords = coords || getCoordinatesForInstaller(installer);

    if (map) {
      map.setView([targetCoords.lat, targetCoords.lng], 15, { animate: true });
      const marker = markersMap.get(installer.name);
      if (marker) marker.openPopup();
    }

    // Scroll the map element smoothly into view
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

  function getGoogleMapsLink(installer: any) {
    const coords = getCoordinatesForInstaller(installer);
    return `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`;
  }

  function getCoordinatesForInstaller(installer: any) {
    if (installer.location.includes("Islamabad")) return { lat: 33.6844, lng: 73.0479 };
    if (installer.location.includes("Lahore")) return { lat: 31.5204, lng: 74.3587 };
    if (installer.location.includes("Karachi")) return { lat: 24.8607, lng: 67.0011 };
    if (installer.location.includes("Denver")) return { lat: 39.7392, lng: -104.9903 };
    if (installer.location.includes("Seattle")) return { lat: 47.6062, lng: -122.3321 };
    if (installer.location.includes("Portland")) return { lat: 45.5152, lng: -122.6784 };
    if (installer.location.includes("Austin")) return { lat: 30.2672, lng: -97.7431 };
    if (installer.location.includes("Nashville")) return { lat: 36.1627, lng: -86.7816 };
    return { lat: 30.0, lng: 70.0 };
  }
</script>

<div data-padding-top={64} class="bg-pf-navy-dark installers-container pb-15">
  <div class="max-container flex flex-col items-center px-8 md:px-12.5">
    <h1 class="font-pf-mera-pro installer-heading mb-6 text-center text-lg tracking-[10%] text-white uppercase md:mb-12.5 md:text-2xl">
      Find an Installer
    </h1>

    <div class="flex flex-col items-center w-full">
      <!-- Location Permission Banner / Button -->
      <div class="w-full max-w-175 mb-4 flex justify-between items-center bg-white/5 border border-white/10 px-4 py-3 rounded-xs text-white">
        <div class="text-xs sm:text-sm">
          {#if userLocation}
            <span class="text-green-400 font-bold">✓ Location active</span> — Showing closest installers.
          {:else}
            <span>Want to find installers closest to you?</span>
          {/if}
        </div>
        <button
          on:click={requestUserLocation}
          disabled={isLocating}
          class="bg-white text-pf-navy-dark hover:bg-white/90 px-4 py-2 rounded-xs font-bold text-xs uppercase tracking-wider transition-colors whitespace-nowrap disabled:opacity-50"
        >
          {isLocating ? "Locating..." : userLocation ? "Refresh Location" : "Grant Location"}
        </button>
      </div>

      <!-- Map Container with Floating Selected Installer Header Overlay -->
      <div class="relative w-full max-w-[1266px] mb-4 md:mb-8">
        <div
          bind:this={mapElement}
          class="mx-auto h-[320px] md:h-[450px] w-full rounded-xs shadow-lg border border-white/20 z-10"
        ></div>

        <!-- {#if selectedInstaller}
          <div class="absolute top-4 left-4 right-4 z-20 flex flex-col sm:flex-row items-center justify-between bg-pf-navy-dark/95 backdrop-blur-md border border-white/30 p-4 rounded-xs text-white shadow-2xl gap-4">
            <div>
              <span class="text-xs uppercase tracking-wider text-white/60 block">Selected Installer:</span>
              <strong class="text-base">{selectedInstaller.name}</strong>
              <span class="text-xs block text-white/80">{selectedInstaller.address}</span>

              {#if selectedInstaller.phone || selectedInstaller.whatsapp}
                <a
                  href="tel:{selectedInstaller.phone || selectedInstaller.whatsapp}"
                  class="text-xs text-pf-yellow hover:underline mt-1 inline-block font-semibold"
                >
                  📞 {selectedInstaller.phone || selectedInstaller.whatsapp}
                </a>
              {/if}
            </div>

            <div class="flex items-center gap-2">
              {#if selectedInstaller.whatsapp}
                <a
                  href="https://wa.me/{selectedInstaller.whatsapp.replace(/\D/g, '')}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="bg-green-600 text-white hover:bg-green-500 px-4 py-2.5 rounded-xs font-bold text-xs uppercase tracking-wider transition-colors whitespace-nowrap flex items-center gap-1.5"
                >
                  WhatsApp
                </a>
              {/if}
              <a
                href={getGoogleMapsLink(selectedInstaller)}
                target="_blank"
                rel="noopener noreferrer"
                class="bg-white text-pf-navy-dark hover:bg-white/90 px-4 py-2.5 rounded-xs font-bold text-xs uppercase tracking-wider transition-colors whitespace-nowrap flex items-center gap-1.5"
              >
                Get Directions ↗
              </a>
            </div>
          </div>
        {/if} -->
      </div>

      <h4 class="font-pf-mera-pro search-heading mt-7 mb-4 text-center text-base tracking-[23%] text-white uppercase md:mt-17 md:mb-8 md:text-xl">
        Search
      </h4>

      <div class="relative w-full max-w-175 mb-12">
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
                  <div class="text-xs text-gray-500">{installer.address}, {installer.location}</div>
                </div>
              </li>
            {/each}
          </ul>
        {/if}
      </div>
    </div>
  </div>
</div>

<!-- Dynamic Installers Cards Grid Section -->
<div class="max-container flex flex-col gap-3.75 w-full">
  <div class="bg-pf-yellow/10 px-10 pt-10 pb-8 md:px-14 md:pt-18.5 md:pb-15 lg:px-20">
    <h3 class="font-pf-galano-grotesque text-pf-black mb-6 text-xl font-bold tracking-[2%] uppercase md:mb-12.5 md:text-[40px]">
      Nearby <span class="font-medium">Installers</span> {userLocation ? "(Closest to you)" : ""}
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