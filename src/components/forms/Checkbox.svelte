<script lang="ts">
    import { twMerge } from "tailwind-merge";

    export let id: string = "vehicle3";
    export let name: string = "vehicle3";
    export let value: string = "Boat";
    export let label: string | undefined = undefined;
    export let checked: boolean = false;
    export let containerClass: string = "";
    export let error: string = "";
</script>

<div class={twMerge("w-full flex flex-col gap-1.5", containerClass)}>
    <label class="group flex w-fit cursor-pointer items-center gap-4">
        <input
            type="checkbox"
            {id}
            {name}
            {value}
            bind:checked
            class="peer checkbox-input sr-only"
        />

        <div
            class={twMerge(
                "relative m-0 flex h-6 w-6 items-center justify-center rounded-md border bg-transparent outline-0 transition-all shrink-0",
                error
                    ? "border-red-500 peer-checked:bg-red-500 peer-checked:border-red-500"
                    : "border-pf-navy/30 peer-checked:bg-pf-navy peer-checked:border-pf-navy"
            )}
        >
            {#if checked}
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    fill="none"
                    stroke="white"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <polyline points="20 6 9 17 4 12" />
                </svg>
            {/if}
        </div>

        <span class="text-pf-black/70 text-sm font-medium select-none">
            {#if label}
                {label}
            {:else}
                <slot />
            {/if}
        </span>
    </label>

    {#if error}
        <p class="text-xs font-medium text-red-500">{error}</p>
    {/if}
</div>