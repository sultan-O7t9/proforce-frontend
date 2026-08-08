<script lang="ts">
  import { twMerge } from "tailwind-merge";
  import { onMount } from "svelte";
  import IconAero from "@/components/icons/IconAero.svelte"; // Adjust path as needed
    import { SplitText,gsap } from "@/lib/gsap";

  export let label: string | undefined = undefined;
  export let href: string = "";
  export let className: string = "";
  export let showAero: boolean = false;
  export let aeroClass: string = "";
  export let type: "button" | "link" = "link";
  export let htmlType: "button" | "submit" | "reset" = "button";

  let buttonEl: HTMLElement;

  onMount(() => {
    if (!buttonEl) return;

    let cleanup: (() => void) | undefined;

    // Dynamically import GSAP without using async/await directly in onMount

      if (!buttonEl) return;

      const labelEl = buttonEl.querySelector("span.label");
      if (!labelEl) return;

      const split = new SplitText(labelEl, { type: "chars" });
      const hoverTl = gsap.timeline({ paused: true });

      hoverTl
        .to(split.chars, {
          translateY: 6,
          duration: 0.1,
          stagger: 0.01,
          ease: "power2.in",
        })
        .to(
          split.chars,
          {
            translateY: 0,
            duration: 0.15,
            stagger: 0.01,
            ease: "power2.out",
          },
          0.1,
        );

      const handleMouseEnter = () => {
        hoverTl.restart();
      };

      buttonEl.addEventListener("mouseenter", handleMouseEnter);

      cleanup = () => {
        buttonEl?.removeEventListener("mouseenter", handleMouseEnter);
        split.revert();
      };


    return () => {
      if (cleanup) cleanup();
    };
  });

  const baseClasses = twMerge(
    "cursor-pointer w-full text-sm md:text-base text-white rounded-sm font-pf-galano-grotesque font-semibold uppercase tracking-[1%] px-6 md:px-7.25 py-4 bg-[rgba(6,10,20,0.1)] backdrop-blur-[10px] border border-white sm:w-auto overflow-hidden flex gap-2.5 items-center group hero-btn hover:backdrop-blur-3xl hover:bg-[rgba(6,10,20,0.3)]",
    className
  );
</script>

{#if type === 'link'}
  <a
    bind:this={buttonEl}
    {href}
    class={baseClasses}
    {...$$restProps}
  >
    <span class="label inline-block">
      {label}
    </span>
    {#if showAero}
      <IconAero
        fillClass={aeroClass}
        class="transition-transform duration-300 group-hover:translate-x-2"
      />
    {/if}
    <slot />
  </a>
{:else}
  <button
    bind:this={buttonEl}
    type={htmlType}
    class={baseClasses}
    {...$$restProps}
  >
    <span class="label inline-block">
      {label}
    </span>
    {#if showAero}
      <IconAero
        fillClass={aeroClass}
        class="transition-transform duration-300 group-hover:translate-x-2"
      />
    {/if}
    <slot />
  </button>
{/if}