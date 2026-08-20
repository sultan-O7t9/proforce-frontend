<script lang="ts">
    import { onMount } from "svelte";
    import { twMerge } from "tailwind-merge";

    export let id: string;
    export let className: string | undefined = undefined;

    let dialogElement: HTMLDialogElement;

    export function showModal() {
        dialogElement?.showModal();
        document.body.classList.add("modal-open");
    }

    export function closeModal() {
        dialogElement?.close();
        document.body.classList.remove("modal-open");
    }

    onMount(() => {
        // Automatically hook up triggers anywhere in the document using data-open-modal="{id}"
        const triggers = document.querySelectorAll(`[data-open-modal="${id}"]`);

        const handleTriggerClick = (e: Event) => {
            e.preventDefault();
            showModal();
        };

        triggers.forEach((trigger) => {
            trigger.addEventListener("click", handleTriggerClick);
        });

        return () => {
            triggers.forEach((trigger) => {
                trigger.removeEventListener("click", handleTriggerClick);
            });
            document.body.classList.remove("modal-open");
        };
    });

    function handleBackdropClick(e: MouseEvent) {
        const rect = dialogElement.getBoundingClientRect();
        const isInDialog =
            e.clientX >= rect.left &&
            e.clientX <= rect.right &&
            e.clientY >= rect.top &&
            e.clientY <= rect.bottom;
        if (!isInDialog) {
            closeModal();
        }
    }
</script>

<slot name="anchor" />

<dialog
    bind:this={dialogElement}
    {id}
    data-modal-id={id}
    on:click={handleBackdropClick}
    on:close={() => document.body.classList.remove("modal-open")}
    class={twMerge(
        "raw-modal backdrop:bg-pf-black/90 m-auto w-[90%] md:w-full max-w-200 rounded-lg bg-white p-0 backdrop:backdrop-blur-[15px] overflow-hidden",
        className,
    )}
>
    <button
        type="button"
        on:click={closeModal}
        class="raw-modal-close-btn absolute top-4.5 right-6 z-10 cursor-pointer transition-transform duration-200 hover:scale-90"
        aria-label="Close modal"
    >
        <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            <path
                opacity="0.5"
                d="M17.5813 0.418746C17.3131 0.150623 16.9493 0 16.5701 0C16.1909 0 15.8271 0.150623 15.5589 0.418746L9 6.97769L2.44106 0.418746C2.17286 0.150623 1.80914 0 1.4299 0C1.05066 0 0.68695 0.150623 0.418746 0.418746C0.150623 0.68695 0 1.05066 0 1.4299C0 1.80914 0.150623 2.17286 0.418746 2.44106L6.97769 9L0.418746 15.5589C0.150623 15.8271 0 16.1909 0 16.5701C0 16.9493 0.150623 17.3131 0.418746 17.5813C0.68695 17.8494 1.05066 18 1.4299 18C1.80914 18 2.17286 17.8494 2.44106 17.5813L9 11.0223L15.5589 17.5813C15.8271 17.8494 16.1909 18 16.5701 18C16.9493 18 17.3131 17.8494 17.5813 17.5813C17.8494 17.3131 18 16.9493 18 16.5701C18 16.1909 17.8494 15.8271 17.5813 15.5589L11.0223 9L17.5813 2.44106C17.8494 2.17286 18 1.80914 18 1.4299C18 1.05066 17.8494 0.68695 17.5813 0.418746Z"
                fill="#21314D"
            ></path>
        </svg>
    </button>

    <div class="px-4 pt-13 md:px-8">
        <!-- Header slot for Title and Subtitle -->
        <div class="mb-8 text-center">
            <slot name="header" />
        </div>

        <!-- Scrollable container for overflowing content -->
        <div class="modal-scroll-area pr-2">
            <div
                class="font-pf-galano-grotesque mx-auto flex w-[clamp(280px,100%,480px)] flex-col items-center gap-6 pb-13"
                role="form"
            >
                <slot name="content" />
            </div>
        </div>
    </div>
</dialog>

<style>
    /* Base styling for smooth transitions on native dialog */
    dialog.raw-modal {
        opacity: 0;
        transform: scale(0.5);
        transition:
            opacity 0.1s ease,
            transform 0.3s ease,
            overlay 0.3s ease allow-discrete,
            display 0.3s ease allow-discrete;
    }

    /* When the dialog is open */
    dialog.raw-modal[open] {
        opacity: 1;
        transform: scale(1);
    }

    /* Animation starting state for entry */
    @starting-style {
        dialog.raw-modal[open] {
            opacity: 0.5;
            transform: scale(0.5);
        }
    }

    /* Backdrop fade animation */
    dialog.raw-modal::backdrop {
        opacity: 0;
        transition:
            opacity 0.3s ease,
            overlay 0.3s ease allow-discrete,
            display 0.3s ease allow-discrete;
    }

    dialog.raw-modal[open]::backdrop {
        opacity: 1;
    }

    @starting-style {
        dialog.raw-modal[open]::backdrop {
            opacity: 0;
        }
    }

    /* Clean Custom Scrollbar Styling */
    .modal-scroll-area {
        max-height: calc(85vh - 100px);
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: rgba(33, 49, 77, 0.2) transparent;
    }

    .modal-scroll-area::-webkit-scrollbar {
        width: 6px;
    }

    .modal-scroll-area::-webkit-scrollbar-track {
        background: transparent;
    }

    .modal-scroll-area::-webkit-scrollbar-thumb {
        background-color: rgba(33, 49, 77, 0.2);
        border-radius: 9999px;
        transition: background-color 0.2s ease;
    }

    .modal-scroll-area::-webkit-scrollbar-thumb:hover {
        background-color: rgba(33, 49, 77, 0.4);
    }
</style>