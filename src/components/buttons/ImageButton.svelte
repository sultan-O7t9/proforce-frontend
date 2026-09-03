<script lang="ts">
  import { twMerge } from "tailwind-merge";

  export let href: string = "";
  export let className: string = "";
  export let type: "button" | "link" = "link";
  export let htmlType: "button" | "submit" | "reset" = "button";
  export let lightSrc: string = "";
  export let darkSrc: string = "";
  export let alt: string = "Logo";
  export let imgClass:string = "";

 let isHovered = false;

 // Determine active source based on hover state and available sources
  $: currentSrc = isHovered && darkSrc ? darkSrc : lightSrc;

  const baseClasses = twMerge(
    "cursor-pointer w-full text-sm md:text-base text-white rounded-sm font-pf-galano-grotesque font-semibold uppercase tracking-[1%] px-6 md:px-7.25 py-4 bg-[rgba(6,10,20,0.1)] backdrop-blur-[10px] border border-white sm:w-auto overflow-hidden flex gap-2.5 items-center group hero-btn hover:backdrop-blur-3xl hover:bg-[rgba(6,10,20,0.3)]",
    className
  );
</script>

{#if type === 'link'}
  <a
    {href}
    class={baseClasses}
    {...$$restProps}
    on:mouseenter={() => (isHovered = true)}
    on:mouseleave={() => (isHovered = false)}
  >
   <slot>
      {#if lightSrc}
        <img src={currentSrc} {alt} class={twMerge("transition-all",imgClass)} />
      {/if}
    </slot>
  </a>
{:else}
  <button
    type={htmlType}
    class={baseClasses}
    {...$$restProps}
    on:mouseenter={() => (isHovered = true)}
    on:mouseleave={() => (isHovered = false)}
  >
   <slot>
      {#if lightSrc}
        <img src={currentSrc} {alt} class={twMerge("transition-all",imgClass)} />
      {/if}
    </slot>
  </button>
{/if}