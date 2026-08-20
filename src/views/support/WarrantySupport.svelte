<script lang="ts">
    import MainButton from "@/components/buttons/MainButton.svelte";
    import Input from "@/components/forms/Input.svelte";
    import AlertMessage from "@/components/AlertMessage.svelte"; // Adjust path as needed
    import supportLogo from "@/assets/img/support-logo.svg";
    import ContactModal from "@/views/support/ContactModal.svelte";
    import { twMerge } from "tailwind-merge";
    import ReportModal from "./ReportModal.svelte";

    // Form state & validation
    let productRollId = "";
    let rollIdError = "";
    let isSubmitted = false;

    // Alert states
    let alertType: "success" | "error" = "success";
    let alertTitle = "";
    let verifiedData:{product:string;installer:string;status:"USED"|"EXPIRED"|"NEW",productRollId:string} = {
        product: "",
        installer: "",
        status: "USED",
        productRollId: "",

    };
    const badgeColor={
      "EXPIRED":"bg-red-400",
      "USED":"bg-pf-yellow",
      "NEW":"bg-green-400"
    }

    function handleVerify() {
        rollIdError = "";

        if (!productRollId.trim()) {
            rollIdError = "Product Roll ID is required.";
            return;
        }

        // Mock verification logic (replace with your actual API call)
        isSubmitted = true;

        // Example condition: if ID contains "INVALID", throw error view, otherwise success
        if (productRollId.toUpperCase().includes("INVALID")) {
            alertType = "error";
            alertTitle = "Verification Failed";
        } else {
            alertType = "success";
            alertTitle = "Product Verified";
            verifiedData = {
                product: "Proforce Phantom +",
               productRollId:"ID-123456",
                installer: "AMMO NYC",
                status:"USED"
            };
        }
    }

    function handleReset() {
        isSubmitted = false;
        productRollId = "";
        rollIdError = "";
    }
</script>

<div>
    <div class="mb-10 flex flex-col gap-4 md:gap-6">
        <h1 class="font-pf-mera-pro text-center text-xl tracking-[10%] uppercase md:text-2xl">
            Support
        </h1>
        <h6 class="font-pf-galano-grotesque text-center text-sm font-medium tracking-[1%] md:text-base">
            Verify the authenticity of Proforce product to ensure warranty coverage.
        </h6>
    </div>

    <div class="bg-pf-gohst-white/50 flex flex-col items-center justify-between gap-6 rounded-lg px-4 py-8 sm:px-8 md:flex-row md:px-10 md:py-18.5 lg:px-15">
      {#if !isSubmitted}
            <form
                class="font-pf-galano-grotesque flex w-full max-w-120 flex-1 flex-col gap-6 md:gap-10"
                on:submit|preventDefault={handleVerify}
            >
                <h3 class="font-pf-galano-grotesque mb-3 text-2xl font-bold tracking-[2%] capitalize">
                    Product Verification
                </h3>
                <Input
                    label="Product Roll ID"
                    placeholder="Enter ID mentioned on PFF Roll"
                    id="product-roll-id"
                    name="product-roll-id"
                    containerClass="mb-2"
                    bind:value={productRollId}
                    error={rollIdError}
                    on:input={() => (rollIdError = "")}
                />
                <MainButton type="button"
                    label="Verify"
                    htmlType="submit"
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
            {:else}
                <AlertMessage title={alertTitle} type={alertType}>
                    <svelte:fragment slot="action">
                        {#if alertType === "success"}
                            <div class="border-y border-y-pf-navy/20 w-full">
                                <div class="font-pf-galano-grotesque text-sm md:text-lg font-medium text-pf-black/60 py-12.5 px-0 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-10 mx-auto">
                                    <h6>Product</h6>
                                    <p class="font-semibold text-pf-black">{verifiedData.product}</p>
                                    <h6>Product Roll ID</h6>
                                    <p class="font-semibold text-pf-black">{verifiedData.productRollId}</p>

                                    <h6>Installer</h6>
                                    <p class="font-semibold text-pf-black">{verifiedData.installer}</p>
                                    <h6>Product Status</h6>
                                    <div class={twMerge("max-w-[90px] max-h-[28px] flex items-center justify-center px-[25px] py-[9.5px] rounded-[9px] text-center",badgeColor[verifiedData.status])}>

                                          <p class="font-semibold text-pf-black text-sm">{verifiedData.status}</p>
                                    </div>


                                </div>
                            </div>
                            <div class="flex gap-4 sm:gap-7 md:gap-12.5 flex-col mt-10 justify-center items-center mx-auto w-full">
                            <p class="text-lg font-pf-galano-grotesque font-semibold">This product is verified as authentic. It is used and has been already applied by {verifiedData.installer}</p>

                                <ReportModal/>
                            </div>
                        {:else}
                            <div class="mt-4">
                                <p class="text-pf-black/70 mb-6 text-center">Please verify the Product Roll ID combination.</p>
                                <MainButton
                                    label="Try Again"
                                    on:click={handleReset}
                                    className="bg-pf-navy hover:text-pf-navy border-pf-navy mx-auto flex max-w-62.5 justify-center px-5 py-3.5 text-xs font-semibold tracking-[1%] transition-colors duration-200 hover:bg-transparent sm:w-4/5 md:px-4 md:py-4 md:text-sm"
                                />
                            </div>
                        {/if}
                    </svelte:fragment>
                </AlertMessage>
            {/if}
        </div>
</div>