<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import { twMerge } from 'tailwind-merge';

  interface Option {
    label: string;
    value: string | number;
  }

  export let label: string = "";
  export let name: string = "";
  export let id: string = "";
  export let options: Option[] = [];
  export let placeholder: string = "Select Option";
  export let labelClass: string = "";
  export let containerClass: string = "";
  export let value: string | number = "";
  export let error: string = "";
  export let inModal: boolean = false;

  const dispatch = createEventDispatcher();

  let isOpen = false;
  let dropdownRef: HTMLDivElement;

  // Find the currently selected option label
  $: selectedOption = options.find(opt => opt.value === value);
  $: displayText = selectedOption ? selectedOption.label : placeholder;

  function toggleDropdown() {
    isOpen = !isOpen;
  }

  function selectOption(opt: Option) {
    value = opt.value;
    isOpen = false;
    dispatch('change', value);
  }

  // Close dropdown when clicking outside
  function handleClickOutside(event: MouseEvent) {
    if (dropdownRef && !dropdownRef.contains(event.target as Node)) {
      isOpen = false;
    }
  }

  onMount(() => {
    document.addEventListener('click', handleClickOutside);
  });

  onDestroy(() => {
    document.removeEventListener('click', handleClickOutside);
  });
</script>

<div class={twMerge("w-full mb-1.5 relative", containerClass)} bind:this={dropdownRef}>
  {#if label}
    <label
      for={name}
      class={twMerge(
        "block text-sm font-semibold text-pf-black mb-1.5 md:mb-3.5",
        labelClass,
      )}
    >
      {label}
    </label>
  {/if}

  <!-- Hidden native input/select for form submission -->
  <input type="hidden" {name} {id} {value} />

  <!-- Trigger Button -->
  <button
    type="button"
    on:click={toggleDropdown}
    class={twMerge(
      "cursor-pointer w-full min-h-[52px] px-5 flex items-center justify-between border rounded bg-transparent text-sm transition-all",
      error ? "border-red-500" : "border-black/20 hover:border-[#0d1833] focus:border-[#0d1833] focus:ring-1 focus:ring-[#0d1833]",
      isOpen && "border-[#0d1833] ring-1 ring-[#0d1833]"
    )}
  >
    <span class={selectedOption ? "text-[#21314d]" : "text-gray-400"}>
      {displayText}
    </span>
    <!-- Chevron Icon -->
    <svg
      class={twMerge("w-4 h-4 transition-transform text-gray-500", isOpen && "rotate-180")}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
    </svg>
  </button>

  <!-- Dropdown Menu -->
  {#if isOpen}
    <div
      class={twMerge(
        "absolute left-0 right-0 z-50 bg-white border border-black/20 rounded py-3.5 px-2.5 mt-1.5 max-h-60 overflow-y-auto flex flex-col gap-1.25 shadow-[0px_2px_20px_rgba(0,0,0,0.1)]",
        inModal && "top-0 mt-0" // Perfectly handles your modal requirement!
      )}
    >
      {#each options as opt}
        <button
          type="button"
          on:click={() => selectOption(opt)}
          class={twMerge(
            "w-full text-left px-4 py-3.5 text-sm rounded transition-colors text-[#21314d] hover:bg-gray-100",
            value === opt.value && "bg-gray-100 font-medium text-[#0d1833]"
          )}
        >
          {opt.label}
        </button>
      {/each}
    </div>
  {/if}

  {#if error}
    <p class="absolute -bottom-5 text-xs text-red-500 font-medium">{error}</p>
  {/if}
</div>