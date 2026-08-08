<script lang="ts">
    import type { HTMLInputAttributes, HTMLInputTypeAttribute } from 'svelte/elements';
    import { twMerge } from 'tailwind-merge';

    interface $$Props extends HTMLInputAttributes {
        label?: string;
        labelClass?: string;
        containerClass?: string;
        inputClass?: string;
        id: string;
        name: string;
        postIconClass?: string;
        value?: string | number;
        placeholder?: string | null;
        type?: HTMLInputTypeAttribute | null;
    }

    export let label: string | undefined = undefined;
    export let name: string;
    export let placeholder: string | undefined | null = undefined;
    export let type: HTMLInputTypeAttribute | null | undefined = "text";
    export let labelClass: string = "";
    export let inputClass: string = "";
    export let containerClass: string = "";
    export let id: string;
    export let postIconClass: string = "";
    export let value: string | number = "";

    let showPassword = false;

    function togglePassword() {
        showPassword = !showPassword;
    }

    // Normalize types safely
    $: safeType = type ?? "text";
    $: inputType = safeType === 'password' ? (showPassword ? 'text' : 'password') : safeType;
    $: safePlaceholder = placeholder ?? undefined;
</script>

<div class={twMerge("w-full mb-1.5", containerClass)}>
    {#if label}
        <label for={name} class={twMerge("block text-sm font-semibold text-pf-black mb-1.5 md:mb-3.5", labelClass)}>{label}</label>
    {/if}
    <div class="relative w-full">
        <input
            type={inputType}
            {id}
            {name}
            placeholder={safePlaceholder}
            bind:value
            class={twMerge(
                "w-full px-5 py-3 md:py-4 rounded-sm border border-pf-navy/30 text-pf-black placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-pf-navy-dark focus:border-pf-navy-dark transition-colors",
                safeType === 'password' ? 'pr-12' : '',
                inputClass
            )}
            {...$$restProps}
        />

        <!-- Slot for Custom Post Icons (Search, etc.) -->
        {#if safeType !== 'password'}
            <div class={twMerge("absolute inset-y-0 right-0 flex items-center pointer-events-none", postIconClass)}>
                <slot />
            </div>
        {/if}

        <!-- Password Visibility Toggle -->
        {#if safeType === 'password'}
            <button
                type="button"
                on:click={togglePassword}
                class="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-pf-black focus:outline-none cursor-pointer"
                aria-label="Toggle password visibility"
            >
                <!-- Eye Icon (Show) -->
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class={`w-5 h-5 ${showPassword ? 'hidden' : ''}`}>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>

                <!-- Eye Slash Icon (Hide) -->
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class={`w-5 h-5 ${showPassword ? '' : 'hidden'}`}>
                    <path stroke-linecap="round" stroke-linejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243l4.242 4.242z" />
                </svg>
            </button>
        {/if}
    </div>
</div>