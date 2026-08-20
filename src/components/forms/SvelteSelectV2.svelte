<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import SlimSelect from 'slim-select';
  import 'slim-select/styles';
  import './select.css';
  import { twMerge } from 'tailwind-merge';

  interface Option {
    label: string;
    value: string | number;
  }

  export let label: string = "";
  export let name: string = "";
  export let id: string = "";
  export let options: Option[] = [];
  export let placeholder: string = "Select Studio";
  export let labelClass: string = "";
  export let containerClass: string = "";
  export let value: string | number = "";

  let selectElement: HTMLSelectElement;
  let slimSelectInstance: SlimSelect | null = null;

  onMount(() => {
    slimSelectInstance = new SlimSelect({
      select: selectElement,
      settings: {
        placeholderText: placeholder,
        showSearch: true,
      },
      events: {
        afterChange: (newVal) => {
          if (newVal && newVal.length > 0) {
            value = newVal[0].value;
          } else {
            value = "";
          }
        }
      }
    });

    if (value) {
      slimSelectInstance.setSelected(value.toString());
    }
  });

  onDestroy(() => {
    if (slimSelectInstance) {
      slimSelectInstance.destroy();
    }
  });

  $: if (slimSelectInstance && value !== undefined) {
    const current = slimSelectInstance.getSelected();
    if (current[0] !== value?.toString()) {
      slimSelectInstance.setSelected(value ? [value.toString()] : []);
    }
  }
</script>

<div class={twMerge("w-full mb-1.5", containerClass)}>
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

  <div class="relative w-full custom-slim-wrapper">
    <select bind:this={selectElement} {name} {id} class="hidden custom-slim-select">
      <option value="" data-placeholder="true">{placeholder}</option>
      {#each options as opt}
        <option value={opt.value}>{opt.label}</option>
      {/each}
    </select>
  </div>
</div>

<style>
  .custom-slim-wrapper {
    font-family: var(--font-galano-grotesque, sans-serif);
  }
  :global(.custom-slim-wrapper .ss-search) {

      height:0;
      display:none !important;
  }

  /* Main Select Box Layout */
  :global(.custom-slim-wrapper .ss-main) {
    min-height: 52px !important;
    padding: 0 1.25rem !important;
    display: flex !important;
    align-items: center !important;
    border: 1px solid rgba(0, 0, 0, 0.2) !important;
    border-radius: 0.25rem !important;
    background-color: transparent !important;
    box-shadow: none !important;
  }

  /* Active/Open State - Navy Outline */
  :global(.custom-slim-wrapper .ss-main:hover),
  :global(.custom-slim-wrapper .ss-main:focus),
  :global(.custom-slim-wrapper .ss-main.ss-open) {
    border-color: #0d1833 !important;
    box-shadow: 0 0 0 1px #0d1833 !important;
  }

  /* Placeholder Styling */
  :global(.custom-slim-wrapper .ss-placeholder) {
    color: #9ca3af !important;
    font-size: 0.875rem !important;
  }

  /* Dropdown Container Panel */
  :global(.custom-slim-wrapper .ss-content) {
    background-color: #ffffff !important;
    border: 1px solid rgba(0, 0, 0, 0.2) !important;
    border-radius: 0.25rem !important;
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.05) !important;
    margin-top: 6px !important;
    padding: 6px !important; /* Adds inner spacing so items match card inset look */
  }

  /* Dropdown Option Items - Equal padding and clean rounded highlight */
  :global(.custom-slim-wrapper .ss-list .ss-option) {
    padding: 0.875rem 1rem !important;
    margin-bottom: 2px !important;
    border-radius: 0.2rem !important;
    color: #21314d !important;
    font-size: 0.875rem !important;
    background-color: transparent !important;
  }

  /* Hover, Highlighted, and Selected Item Backgrounds (Matching the card row style) */
  :global(.custom-slim-wrapper .ss-list .ss-option:hover),
  :global(.custom-slim-wrapper .ss-list .ss-option.ss-highlighted),
  :global(.custom-slim-wrapper .ss-list .ss-option.ss-selected) {
    background-color: #f4f6f8 !important; /* Light grey-blue fill matching your screenshot */
    color: #0d1833 !important;
  }
</style>