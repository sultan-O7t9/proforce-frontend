<script lang="ts">
  import type { HTMLSelectAttributes } from 'svelte/elements';
  import { twMerge } from 'tailwind-merge';

  interface Option {
    label: string;
    value: string | number;
  }

  interface $$Props extends HTMLSelectAttributes {
    label: string;
    labelClass?: string;
    containerClass?: string;
    selectClass?: string;
    id: string;
    name: string;
    options: Option[];
    placeholder?: string;
    value?: string | number;
  }

  export let label: string;
  export let name: string;
  export let id: string;
  export let options: Option[] = [];
  export let placeholder: string | undefined = undefined;
  export let labelClass: string = "";
  export let selectClass: string = "";
  export let containerClass: string = "";
  export let value: string | number = "";

  $: isPlaceholderSelected = value === "" || value === undefined || value === null;
</script>

<div class={twMerge("w-full mb-1.5", containerClass)}>
  <label
    for={name}
    class={twMerge(
      "block text-sm font-semibold text-pf-black mb-1.5 md:mb-3.5",
      labelClass,
    )}
  >
    {label}
  </label>
  <div class="relative w-full">
    <!-- Svelte automatically forwards events like on:change placed on custom components -->
    <select
      {id}
      {name}
      bind:value
      class={twMerge(
        "custom-select w-full px-5 py-3 md:py-4 rounded-sm border border-pf-navy/30 bg-transparent text-sm outline-0 focus:outline-none focus:ring-2 focus:ring-pf-navy-dark focus:border-pf-navy-dark transition-colors appearance-none cursor-pointer pr-12",
        isPlaceholderSelected ? "text-gray-400" : "text-pf-black",
        selectClass,
        "[&>option]:text-pf-navy [&>option]:bg-pf-gohst-white",
      )}
      {...$$restProps}
      on:change
    >
      {#if placeholder}
        <option value="" disabled selected hidden>
          {placeholder}
        </option>
      {/if}
      {#each options as opt}
        <option value={opt.value}>{opt.label}</option>
      {/each}
    </select>

    <!-- Dropdown Chevron Icon -->
    <div
      class="text-pf-navy-dark/40 pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="currentColor"
        class="h-5 w-5"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          d="M19.5 8.25l-7.5 7.5-7.5-7.5"
        ></path>
      </svg>
    </div>
  </div>
</div>