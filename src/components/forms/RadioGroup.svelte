<script lang="ts">
    import { twMerge } from "tailwind-merge";

    export let options: {
        name: string;
        description?: string;
        value: string;
    }[] = [];
    export let containerClass: string = "";
    export let error: string = "";
    export let name: string = "product_model";
    export let value: string = "";
</script>

<div class={twMerge("w-full flex flex-col gap-2", containerClass)}>
    <div class="flex flex-row flex-wrap gap-5 md:gap-8 items-center">
        {#each options as option}
            <label class="flex items-center gap-5 cursor-pointer group">
                <input
                    type="radio"
                    {name}
                    value={option.value}
                    bind:group={value}
                    class="peer sr-only"
                />
                <!-- Custom Radio Circle with Error State -->
                <div class={twMerge(
                    "w-5 h-5 rounded-full border flex items-center justify-center transition-colors",
                    error
                        ? "border-red-500 peer-checked:bg-[radial-gradient(circle,#ef4444_30%,transparent_40%)]"
                        : "border-pf-navy peer-checked:border-pf-navy peer-checked:bg-[radial-gradient(circle,#21314d_30%,transparent_40%)]"
                )}></div>

                <div class="flex flex-col gap-1">
                    <span class="text-sm sm:text-base font-semibold text-pf-black group-hover:text-pf-navy">
                        {option.name}
                    </span>
                    {#if option.description}
                        <span class="text-sm text-pf-black opacity-60 uppercase font-medium group-hover:text-pf-navy">
                            {option.description}
                        </span>
                    {/if}
                </div>
            </label>
        {/each}
    </div>

    {#if error}
        <p class="mt-1.5 text-xs text-red-500 font-medium">{error}</p>
    {/if}
</div>