<script lang="ts">
  import { onMount } from "svelte";
  import "leaflet/dist/leaflet.css";

  export let nearbyInstallers: any[] = [];
  export let otherInstallers: Record<string, any[]> = {};

  const allInstallers = [
    ...nearbyInstallers,
    ...Object.values(otherInstallers).flat(),
  ];

  let searchQuery = "";
  let selectedInstaller: any = null;
  let mapElement: HTMLDivElement;
  let map: any;
  let markersMap = new Map();

  $: filteredInstallers = searchQuery.trim() === ""
    ? []
    : allInstallers.filter(inst =>
        inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inst.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inst.address.toLowerCase().includes(searchQuery.toLowerCase())
      );

  onMount(async () => {
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

    const bounds = L.latLngBounds([]);

    allInstallers.forEach((installer) => {
      const coords = getCoordinatesForInstaller(installer);
      const marker = L.marker([coords.lat, coords.lng]).addTo(map);

      // HTML Popup with Get Directions button
      const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`;
      const popupContent = `
        <div style="font-family: inherit; font-size: 13px;">
          <b style="font-size: 14px; color: #0d1b2a;">${installer.name}</b><br>
          <span style="color: #555;">${installer.address}</span><br><br>
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

    if (allInstallers.length > 0) {
      map.fitBounds(bounds, { padding: [30, 30] });
    }

    setTimeout(() => {
      map.invalidateSize();
    }, 200);
  });

  function selectInstaller(installer: any, coords?: { lat: number; lng: number }) {
    selectedInstaller = installer;
    searchQuery = installer.name;
    const targetCoords = coords || getCoordinatesForInstaller(installer);

    if (map) {
      map.setView([targetCoords.lat, targetCoords.lng], 15, { animate: true });
      const marker = markersMap.get(installer.name);
      if (marker) {
        marker.openPopup();
      }
    }
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

<div class="flex flex-col items-center w-full">
  <!-- Map Container -->
  <div
    bind:this={mapElement}
    class="mx-auto h-[320px] md:h-[450px] w-full rounded-xs shadow-lg mb-4 md:mb-8 border border-white/20 z-10"
  ></div>

  <h4 class="font-pf-mera-pro search-heading mt-7 mb-4 text-center text-base tracking-[23%] text-white uppercase md:mt-17 md:mb-8 md:text-xl">
    Search
  </h4>

  <div class="relative w-full max-w-175">
    <div class="relative flex items-center">
      <input
        type="text"
        bind:value={searchQuery}
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

    <!-- Dropdown results -->
    {#if filteredInstallers.length > 0}
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

  <!-- Optional quick action bar when an installer is explicitly selected via search -->
  {#if selectedInstaller}
    <div class="mt-4 flex flex-col sm:flex-row items-center justify-between bg-white/10 border border-white/20 p-4 rounded-xs w-full max-w-175 text-white gap-4">
      <div>
        <span class="text-xs uppercase tracking-wider text-white/60 block">Selected Installer:</span>
        <strong class="text-base">{selectedInstaller.name}</strong>
        <span class="text-xs block text-white/80">{selectedInstaller.address}</span>
      </div>
      <a
        href={getGoogleMapsLink(selectedInstaller)}
        target="_blank"
        rel="noopener noreferrer"
        class="bg-white text-pf-navy-dark hover:bg-white/90 px-5 py-2.5 rounded-xs font-bold text-xs uppercase tracking-wider transition-colors whitespace-nowrap flex items-center gap-2"
      >
        Get Directions ↗
      </a>
    </div>
  {/if}
</div>