<script lang="ts">
  import { onMount } from "svelte";

  export let nearbyInstallers: any[] = [];
  export let otherInstallers: Record<string, any[]> = {};

  // Combine all installers into a single searchable list
  const allInstallers = [
    ...nearbyInstallers,
    ...Object.values(otherInstallers).flat(),
  ];

  let searchQuery = "";
  let selectedInstaller: any = null;
  let mapElement: HTMLDivElement;
  let map: google.maps.Map;
  let markers: google.maps.Marker[] = [];

  // Filtered list for the search dropdown
  $: filteredInstallers = searchQuery.trim() === ""
    ? []
    : allInstallers.filter(inst =>
        inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inst.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inst.address.toLowerCase().includes(searchQuery.toLowerCase())
      );

  onMount(() => {
    if (window.google && window.google.maps) {
      initMap();
    } else {
      // Fallback check if script loads slightly later
      const checkInterval = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkInterval);
          initMap();
        }
      }, 100);
    }
  });

  function initMap() {
    const bounds = new google.maps.LatLngBounds();

    map = new google.maps.Map(mapElement, {
      zoom: 4,
      center: { lat: 30.3753, lng: 69.3451 }, // Default center
      styles: [
        // Optional: Clean dark-mode-friendly or custom map styling if desired
      ]
    });

    allInstallers.forEach((installer) => {
      const coords = getCoordinatesForInstaller(installer);

      const marker = new google.maps.Marker({
        position: coords,
        map: map,
        title: installer.name,
        // Uncomment and point to your custom pin asset if needed:
        // icon: { url: '/images/custom-pin.png', scaledSize: new google.maps.Size(32, 32) }
      });

      marker.addListener("click", () => {
        selectInstaller(installer, coords);
      });

      markers.push(marker);
      bounds.extend(coords);
    });

    // Fit bounds so all pins are visible zoomed out initially
    if (allInstallers.length > 0) {
      map.fitBounds(bounds);
    }
  }

  function selectInstaller(installer: any, coords?: { lat: number; lng: number }) {
    selectedInstaller = installer;
    searchQuery = installer.name;

    const targetCoords = coords || getCoordinatesForInstaller(installer);

    if (map && targetCoords) {
      map.setCenter(targetCoords);
      map.setZoom(15); // Zoom in tightly on the selected location pin
    }
  }

  // Helper mapping function to bridge mock locations to lat/lng coordinates
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

<div class="flex flex-col items-center w-full">
  <!-- Interactive Google Map Box -->
  <div
    bind:this={mapElement}
    class="mx-auto h-[450px] w-full rounded-xs shadow-lg mb-4 md:mb-8 border border-white/20"
  ></div>

  <h4 class="font-pf-mera-pro search-heading mt-7 mb-4 text-center text-base tracking-[23%] text-white uppercase md:mt-17 md:mb-8 md:text-xl">
    Search
  </h4>

  <!-- Search Input Container with Dropdown Results -->
  <div class="relative w-full max-w-175">
    <div class="relative flex items-center">
      <input
        type="text"
        bind:value={searchQuery}
        placeholder="Search by city or installer name..."
        class="w-full focus:border-white/75 py-4 md:py-6 rounded-xs border border-white/50 bg-transparent text-white px-6 pr-14 outline-none placeholder:text-white/60"
      />
      <div class="absolute right-5 flex items-center pointer-events-none opacity-60">
        <svg
          width="25"
          height="26"
          viewBox="0 0 25 26"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <ellipse
            cx="11.7673"
            cy="11.7677"
            rx="11.0173"
            ry="11.0177"
            stroke="white"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"></ellipse>
          <path
            d="M19.4307 20.0029L23.7501 24.3113"
            stroke="white"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"></path>
        </svg>
      </div>
    </div>

    {#if filteredInstallers.length > 0}
      <ul class="absolute z-50 left-0 right-0 mt-2 bg-white text-black rounded-xs shadow-xl max-h-60 overflow-y-auto">
        {#each filteredInstallers as installer}
          <!-- svelte-ignore a11y-click-events-have-key-events -->
          <!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
          <li
            class="px-6 py-3 hover:bg-gray-100 cursor-pointer border-b border-gray-100 last:border-none transition-colors"
            on:click={() => selectInstaller(installer)}
          >
            <div class="font-bold text-sm text-pf-navy-dark">{installer.name}</div>
            <div class="text-xs text-gray-500">{installer.address}, {installer.location}</div>
          </li>
        {/each}
      </ul>
    {/if}
  </div>
</div>