<script lang="ts">
    import { twMerge } from "tailwind-merge";
    import IconAero from "@/components/icons/IconAero.svelte";

    export let label: string | undefined = undefined;
    export let href: string = "";
    export let className: string = "";
    export let showAero: boolean = false;
    export let aeroClass: string = "";
    export let type: "button" | "link" = "link";
    export let htmlType: "button" | "submit" | "reset" = "button";

    // Explicitly expose an optional click handler prop
    export let onclick: (() => void) | undefined = undefined;

    const baseClasses = twMerge(
        "cursor-pointer w-full text-sm md:text-base text-white rounded-sm font-pf-galano-grotesque font-semibold uppercase tracking-[1%] px-6 md:px-7.25 py-4 bg-[rgba(6,10,20,0.1)] backdrop-blur-[10px] border border-white sm:w-auto overflow-hidden flex gap-2.5 items-center group hero-btn hover:backdrop-blur-3xl hover:bg-[rgba(6,10,20,0.3)]",
        className
    );
</script>

{#if type === 'link' || !htmlType}
    <a {href} class={baseClasses} {onclick} {...$$restProps}>
        <span class="label inline-block">{label}</span>
        {#if showAero}
            <IconAero fillClass={aeroClass} class="transition-transform duration-300 group-hover:translate-x-2" />
        {/if}
        <slot />
    </a>
{:else}
    <button type={htmlType} class={baseClasses} {onclick} {...$$restProps}>
        <span class="label inline-block">{label}</span>
        {#if showAero}
            <IconAero fillClass={aeroClass} class="transition-transform duration-300 group-hover:translate-x-2" />
        {/if}
        <slot />
    </button>
{/if}