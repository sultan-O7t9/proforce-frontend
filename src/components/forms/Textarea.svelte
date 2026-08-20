<script lang="ts">
    import type { HTMLTextareaAttributes } from "svelte/elements";
    import { twMerge } from "tailwind-merge";

    interface $Props extends HTMLTextareaAttributes {
        label?: string;
        labelClass?: string;
        containerClass?: string;
        textareaClass?: string;
        id: string;
        name: string;
        rows?: number;
        value?: string;
        error?: string;
    }

    export let label: string | undefined = undefined;
    export let name: string;
    export let placeholder: string | undefined = undefined;
    export let rows: number = 4;
    export let labelClass: string = "";
    export let textareaClass: string = "";
    export let containerClass: string = "";
    export let id: string;
    export let value: string = "";
    export let error: string | undefined = undefined;
</script>

<div class={twMerge("w-full mb-1.5", containerClass)}>
    {#if label}
        <label
            for={name}
            class={twMerge(
                "text-pf-black mb-1.5 block text-sm font-semibold md:mb-3.5",
                labelClass,
            )}
        >
            {label}
        </label>
    {/if}
    <div class="relative w-full">
        <textarea
            {id}
            {name}
            {placeholder}
            {rows}
            bind:value
            class={twMerge(
                "w-full px-5 py-3 md:py-4 rounded-sm border border-pf-navy/30 text-pf-black placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-pf-navy-dark focus:border-pf-navy-dark transition-colors resize-y",
                error && "border-red-500 focus:ring-red-500 focus:border-red-500",
                textareaClass,
            )}
            {...$$restProps}
        ></textarea>
    </div>
    {#if error}
        <p class="mt-1.5 text-xs text-red-500 font-medium">{error}</p>
    {/if}
</div>