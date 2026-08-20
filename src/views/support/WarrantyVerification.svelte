<script lang="ts">
    import Input from "@/components/forms/Input.svelte";
    import MainButton from "@/components/buttons/MainButton.svelte";
    import AlertMessage from "@/components/AlertMessage.svelte";

    // View state: "form" | "success" | "error"
    let viewState: "form" | "result" = "form";
    let alertTitle = "";
    let alertType: "success" | "error" = "success";

    // Form field states
    let productRollId = "";
    let warrantyNumber = "";

    // Error state dictionary
    let errors: Record<string, string> = {};

    // Mock verified data details
    let verifiedData = {
        product: "Proforce Phantom +",
        warrantyNumber: "",
        installer: "AMMO NYC",
        carBrand: "Land Rover",
        applicationDate: "30/04/2026",
        carModel: "Range Rover Sport",
        validUntil: "30/04/2032",
        chasisNumber: "4NUDS13S352703901"
    };

    function handleSubmit() {
        errors = {}; // Reset errors

        if (!productRollId) errors.productRollId = "This field is required.";
        if (!warrantyNumber) errors.warrantyNumber = "This field is required.";

        if (Object.keys(errors).length === 0) {
            // Check for a sample test condition (e.g., matching the sample number)
            if (warrantyNumber === "11223344556") {
                // Example of invalid/already registered or not found scenario during verification
                alertTitle = "Record Not Found";
                alertType = "error";
            } else {
                alertTitle = "Warranty Verified";
                alertType = "success";
                verifiedData.warrantyNumber = warrantyNumber;
            }

            viewState = "result";
        }
    }

    function handleReset() {
        viewState = "form";
        warrantyNumber = "";
        productRollId = "";
    }
</script>

<div
    id="tab-verification"
    style="display: none; opacity: 0;"
    class="tab-panel bg-pf-gohst-white/50 rounded-lg px-4 py-8 sm:px-8 md:px-10 md:py-18.5 lg:px-15"
>
    {#if viewState === "form"}
        <h3 class="font-pf-galano-grotesque mb-8 md:mb-15 text-xl md:text-2xl font-bold tracking-[2%] capitalize">
            Verify Warranty
        </h3>
        <form on:submit|preventDefault={handleSubmit} class="font-pf-galano-grotesque mt-10" novalidate>
            <div class="flex flex-col gap-0 md:gap-6 lg:flex-row lg:gap-15">
                <div class="mb-7.5 flex flex-1 flex-col gap-6">
                    <Input
                        label="Product Roll ID"
                        placeholder="Enter ID mentioned on PFF Roll"
                        id="product-roll-id"
                        name="product-roll-id"
                        bind:value={productRollId}
                        error={errors.productRollId}
                        on:input={() => delete errors.productRollId}
                    />
                </div>
                <div class="flex flex-1 flex-col gap-6">
                    <Input
                        label="Warranty Number"
                        placeholder="Warranty Number"
                        id="warranty-number"
                        name="warranty-number"
                        bind:value={warrantyNumber}
                        error={errors.warrantyNumber}
                        on:input={() => delete errors.warrantyNumber}
                    />
                </div>
            </div>
            <MainButton
                label="Verify"
                htmlType="submit"
                type="button"
                className="bg-pf-navy hover:text-pf-navy border-pf-navy mt-5 flex md:max-w-62.5 justify-center px-5 py-3.5 text-xs font-semibold tracking-[1%] transition-colors duration-200 hover:bg-transparent sm:w-4/5 md:px-4 md:py-4 md:text-sm mb-8 md:mb-15"
            />
        </form>
    {:else}
        <AlertMessage title={alertTitle} type={alertType}>
            <svelte:fragment slot="action">
                {#if alertType === "success"}
                    <div class="border-y border-y-pf-navy/20 w-full">
                        <div class="font-pf-galano-grotesque text-sm md:text-lg font-medium text-pf-black/60 py-12.5 px-0 md:px-12 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-10 mx-auto">
                            <h6>Product</h6>
                            <p class="font-semibold text-pf-black">{verifiedData.product}</p>
                            <h6>Warranty Number</h6>
                            <p class="font-semibold text-pf-black">{verifiedData.warrantyNumber}</p>

                            <h6>Installer</h6>
                            <p class="font-semibold text-pf-black">{verifiedData.installer}</p>
                            <h6>Car Brand</h6>
                            <p class="font-semibold text-pf-black">{verifiedData.carBrand}</p>

                            <h6>Date of Application</h6>
                            <p class="font-semibold text-pf-black">{verifiedData.applicationDate}</p>
                            <h6>Car Model</h6>
                            <p class="font-semibold text-pf-black">{verifiedData.carModel}</p>

                            <h6>Valid Until</h6>
                            <p class="font-semibold text-pf-black">{verifiedData.validUntil}</p>
                            <h6>Chasis Number</h6>
                            <p class="font-semibold text-pf-black">{verifiedData.chasisNumber}</p>
                        </div>
                    </div>
                    <div class="flex gap-4 sm:gap-7 flex-col sm:flex-row mt-10 justify-center items-center mx-auto w-full">
                        <MainButton
                            label="Download Certificate"
                            href=""
                            className="bg-pf-navy hover:text-pf-navy border-pf-navy flex md:max-w-62.5 justify-center px-5 py-3.5 text-xs font-semibold tracking-[1%] transition-colors duration-200 hover:bg-transparent sm:w-4/5 md:px-4 md:py-4 md:text-xs"
                        />
                        <MainButton
                            label="Email Certificate"
                            href=""
                            className="bg-transparent text-pf-navy hover:text-white hover:bg-pf-navy border-pf-navy flex md:max-w-62.5 justify-center px-5 py-3.5 text-xs font-semibold tracking-[1%] transition-colors duration-200 sm:w-4/5 md:px-4 md:py-4 md:text-xs"
                        />
                    </div>
                {:else}
                    <div class="mt-4">
                        <p class="text-pf-black/70 mb-6 text-center">Please verify the Product Roll ID and Warranty Number combination.</p>
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