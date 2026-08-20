<script lang="ts">
    import type { HTMLInputAttributes } from "svelte/elements";
    import { twMerge } from "tailwind-merge";

    interface $$Props extends HTMLInputAttributes {
        label?: string;
        labelClass?: string;
        containerClass?: string;
        inputClass?: string;
        id: string;
        name: string;
        placeholder?: string;
        value?: FileList | null;
        error?: string;
    }

    export let label: string | undefined = undefined;
    export let name: string;
    export let placeholder: string = "Upload File (Max 5MB)";
    export let labelClass: string = "";
    export let inputClass: string = "";
    export let containerClass: string = "";
    export let id: string;
    export let value: FileList | null = null;
    export let error: string | undefined = undefined;

    let fileInput: HTMLInputElement;
    let selectedFile: File | null = null;
    let previewUrl: string = "";
    let fileSizeFormatted: string = "";

    function handleFileChange(e: Event) {
        const target = e.target as HTMLInputElement;
        const files = target.files;
        value = files;

        if (!files || files.length === 0) {
            handleDiscard();
            return;
        }

        const file = files[0];
        selectedFile = file;

        // Format file size
        const sizeKB = (file.size / 1024).toFixed(1);
        const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
        fileSizeFormatted = file.size > 1024 * 1024 ? `${sizeMB} MB` : `${sizeKB} KB`;

        // Handle image preview
        if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onload = (uploadEvent) => {
                previewUrl = (uploadEvent.target?.result as string) || "";
            };
            reader.readAsDataURL(file);
        } else {
            previewUrl = "";
        }
    }

    function handleDiscard() {
        if (fileInput) {
            fileInput.value = "";
        }
        value = null;
        selectedFile = null;
        previewUrl = "";
        fileSizeFormatted = "";
    }
</script>

<div class={twMerge("w-full mb-1.5 file-picker-wrapper", containerClass)}>
    {#if label}
        <label
            for={id}
            class={twMerge(
                "text-pf-black mb-1.5 block text-sm font-semibold md:mb-3.5",
                labelClass,
            )}
        >
            {label}
        </label>
    {/if}
    <div class="relative w-full">
        <!-- Input Container (Shown when no file is selected) -->
        <div class={selectedFile ? "hidden" : "block"}>
            <input
                type="file"
                {id}
                {name}
                bind:this={fileInput}
                on:change={handleFileChange}
                class="file-input-element hidden"
                {...$$restProps}
            />
            <label
                for={id}
                class={twMerge(
                    "flex items-center justify-center gap-2 w-full px-5 py-3 md:py-4 rounded-sm border border-dashed border-pf-navy/30 text-pf-black bg-white text-sm cursor-pointer hover:border-pf-navy-dark focus:outline-none focus:ring-2 focus:ring-pf-navy-dark focus:border-pf-navy-dark transition-colors",
                    error && "border-red-500",
                    inputClass,
                )}
            >
                <!-- Upload Icon -->
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="h-5 w-5 text-gray-500"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                    ></path>
                </svg>
                <span class="text-gray-500">{placeholder}</span>
            </label>
        </div>

        <!-- Thumbnail / File Preview Container (Shown when file is selected) -->
        <div
            class={twMerge(
                "file-preview-container border-pf-navy/30 flex w-full items-center justify-between rounded-sm border bg-white px-4 py-2.5",
                selectedFile ? "flex" : "hidden",
            )}
        >
            <div class="flex items-center gap-3 overflow-hidden">
                <div
                    class="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded border border-gray-200 bg-gray-100"
                >
                    {#if previewUrl}
                        <img
                            src={previewUrl}
                            alt="Thumbnail"
                            class="h-full w-full object-cover"
                        />
                    {:else}
                        <!-- Generic Document Icon for non-images -->
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke-width="1.5"
                            stroke="currentColor"
                            class="h-5 w-5 text-gray-400"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
                            ></path>
                        </svg>
                    {/if}
                </div>
                <div class="flex flex-col truncate">
                    <span class="text-pf-black truncate text-sm font-medium">
                        {selectedFile?.name || ""}
                    </span>
                    <span class="text-xs text-gray-500">{fileSizeFormatted}</span>
                </div>
            </div>
            <!-- Discard Button -->
            <button
                type="button"
                on:click={handleDiscard}
                class="hover:text-pf-black ml-2 flex-shrink-0 rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 focus:outline-none cursor-pointer"
                aria-label="Remove file"
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
                        d="M6 18L18 6M6 6l12 12"
                    ></path>
                </svg>
            </button>
        </div>
    </div>
    {#if error}
        <p class="mt-1.5 text-xs text-red-500 font-medium">{error}</p>
    {/if}
</div>