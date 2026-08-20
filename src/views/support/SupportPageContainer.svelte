<script lang="ts">
    import { onMount } from "svelte";
    import { gsap } from "@/lib/gsap";
    import MainButton from "@/components/buttons/MainButton.svelte";
    import Input from "@/components/forms/Input.svelte";
    import supportLogo from "@/assets/img/support-logo.svg";

    import WarrantyRegistration from "@/views/support/WarrantyRegistration.svelte";
    import WarrantyVerification from "@/views/support/WarrantyVerification.svelte";
    import ContactModal from "@/views/support/ContactModal.svelte";
    import WarrantySupport from "./WarrantySupport.svelte";

    // Tab state handling
    let activeTab = "tab-registration";
    let containerRef: HTMLElement;

    function handleTabClick(tabId: string) {
        activeTab = tabId;
        switchPanel(tabId);
    }

    function switchPanel(targetTabId: string) {
        if (!containerRef) return;
        const panels = containerRef.querySelectorAll(".tab-panel");

        panels.forEach((panel) => {
            const el = panel as HTMLElement;
            if (panel.id === targetTabId) {
                el.style.display = "block";
                gsap.fromTo(
                    el,
                    { opacity: 0, y: 10 },
                    { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
                );
            } else {
                gsap.to(el, {
                    opacity: 0,
                    y: -10,
                    duration: 0.2,
                    ease: "power2.in",
                    onComplete: () => {
                        el.style.display = "none";
                    },
                });
            }
        });
    }

    onMount(() => {
        const header = document.querySelector(".main-header") as HTMLElement | null;
        const heroSectionContainer = document.querySelector(".support-container") as HTMLElement | null;

        if (header && heroSectionContainer) {
            heroSectionContainer.style.paddingTop = header.getBoundingClientRect().height + "px";
        }

        const tabContainer = containerRef?.querySelector(".tab-buttons-container");
        if (tabContainer) {
            const indicator = tabContainer.querySelector(".tab-indicator") as HTMLElement;
            const buttons = tabContainer.querySelectorAll(".tab-btn");

            const updateIndicator = (activeBtn: HTMLButtonElement, animate = true) => {
                const targetWidth = activeBtn.offsetWidth;
                const targetX = activeBtn.offsetLeft;

                if (animate) {
                    gsap.to(indicator, {
                        width: targetWidth,
                        x: targetX,
                        duration: 0.4,
                        ease: "power2.out",
                    });
                } else {
                    gsap.set(indicator, {
                        width: targetWidth,
                        x: targetX,
                    });
                }
            };

            const initialActive = tabContainer.querySelector(
                `.tab-btn[data-tab="${activeTab}"]`,
            ) as HTMLButtonElement | null;

            if (initialActive) {
                updateIndicator(initialActive, false);
            }

            buttons.forEach((btn) => {
                btn.addEventListener("click", () => {
                    updateIndicator(btn as HTMLButtonElement, true);
                });
            });

            window.addEventListener("resize", () => {
                const currentActive = tabContainer.querySelector(
                    ".tab-btn.text-white",
                ) as HTMLButtonElement | null;
                if (currentActive) {
                    updateIndicator(currentActive, false);
                }
            });
        }
    });
</script>

<div class="relative" bind:this={containerRef}>
    <section class="support-container">
        <div
            class="max-container flex flex-col gap-12 px-4 py-8 sm:px-8 md:gap-24 md:px-16.5 md:py-17.5 lg:px-[clamp(1rem,6.2vw+1rem,100px)]"
        >
            <div>
                <div class="mb-10 flex flex-col gap-4 md:gap-6">
                    <h1
                        class="font-pf-mera-pro text-center text-xl tracking-[10%] uppercase md:text-2xl"
                    >
                        Warranty
                    </h1>
                    <h6
                        class="font-pf-galano-grotesque text-center text-sm font-medium tracking-[1%] md:text-base"
                    >
                        Access your dashboard to manage stock, order products, and scale
                        your business.
                    </h6>
                </div>

                <div
                    class="tab-buttons-container border-pf-navy/20 mx-auto mb-8 max-w-92.5 rounded-full border p-1.25 md:mb-12.5"
                >
                    <div class="relative flex">
                        <div
                            class="tab-indicator bg-pf-navy absolute top-0 bottom-0 left-0 z-0 h-full rounded-full transition-all duration-300 ease-out"
                        ></div>

                        <button
                            type="button"
                            class={`tab-btn relative z-10 h-11 w-full flex-1 cursor-pointer rounded-full px-3 text-sm font-semibold transition-colors duration-300 md:h-13.5 md:px-6 md:text-base ${
                                activeTab === "tab-registration" ? "text-white" : "text-pf-navy/80"
                            }`}
                            data-tab="tab-registration"
                            on:click={() => handleTabClick("tab-registration")}
                        >
                            Registration
                        </button>
                        <button
                            type="button"
                            class={`tab-btn relative z-10 h-11 w-full flex-1 cursor-pointer rounded-full px-3 text-sm font-semibold transition-colors duration-300 md:h-13.5 md:px-6 md:text-base ${
                                activeTab === "tab-verification" ? "text-white" : "text-pf-navy/80"
                            }`}
                            data-tab="tab-verification"
                            on:click={() => handleTabClick("tab-verification")}
                        >
                            Verification
                        </button>
                    </div>
                </div>

                <div id="tab-registration" class="tab-panel" style="display: {activeTab === 'tab-registration' ? 'block' : 'none'};">
                    <WarrantyRegistration bind:activeTab={activeTab} />
                </div>
                <div id="tab-verification" class="tab-panel" style="display: {activeTab === 'tab-verification' ? 'block' : 'none'};">
                    <WarrantyVerification />
                </div>
            </div>
            <WarrantySupport/>

            <!-- <div>
                <div class="mb-10 flex flex-col gap-4 md:gap-6">
                    <h1
                        class="font-pf-mera-pro text-center text-xl tracking-[10%] uppercase md:text-2xl"
                    >
                        Support
                    </h1>
                    <h6
                        class="font-pf-galano-grotesque text-center text-sm font-medium tracking-[1%] md:text-base"
                    >
                        Verify the authenticity of Proforce product to ensure warranty
                        coverage.
                    </h6>
                </div>

                <div
                    class="bg-pf-gohst-white/50 flex flex-col items-center justify-between gap-6 rounded-lg px-4 py-8 sm:px-8 md:flex-row md:px-10 md:py-18.5 lg:px-15"
                >
                    <form
                        class="font-pf-galano-grotesque flex w-full max-w-120 flex-1 flex-col gap-6 md:gap-10"
                        on:submit|preventDefault={() => {}}
                    >
                        <h3
                            class="font-pf-galano-grotesque mb-3 text-2xl font-bold tracking-[2%] capitalize"
                        >
                            Product Verification
                        </h3>
                        <Input
                            label="Product Roll ID"
                            placeholder="Enter ID mentioned on PFF Roll"
                            id="product-roll-id"
                            name="product-roll-id"
                            containerClass="mb-2"
                        />
                        <MainButton
                            label="Verify"
                            htmlType="button"
                            className="bg-pf-navy hover:text-pf-navy border-pf-navy flex justify-center px-5 py-3.5 text-xs font-semibold tracking-[1%] transition-colors duration-200 hover:bg-transparent sm:w-4/5 md:max-w-62.5 md:px-4 md:py-4 md:text-sm"
                        />
                        <ContactModal />
                    </form>
                    <div class="h-full flex-1">
                        <img
                            src={supportLogo.src}
                            alt="Support Logo"
                            class="ml-auto h-full w-auto object-contain"
                        />
                    </div>
                </div>
            </div> -->
        </div>
    </section>
</div>