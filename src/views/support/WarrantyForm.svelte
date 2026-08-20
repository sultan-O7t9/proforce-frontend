<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import Input from "@/components/forms/Input.svelte";
    import Select from "@/components/forms/Select.svelte";
    import DatePicker from "@/components/forms/DatePicker.svelte";
    import RadioGroup from "@/components/forms/RadioGroup.svelte";
    import Checkbox from "@/components/forms/Checkbox.svelte";
    import MainButton from "@/components/buttons/MainButton.svelte";
    import { COUNTRY_OPTIONS, ROUTES } from "@/lib/site";

    const dispatch = createEventDispatcher();

    const productRadioOptions = [
        { name: "Proforce Phantom", description: "PFP7-60-50", value: "PFP7-60-50" },
        { name: "Proforce Phantom +", description: "PFP8-60-50", value: "PFP8-60-50" },
        { name: "Proforce Apex", description: "PFA8-60-50", value: "PFA8-60-50" },
    ];

    // Form field states
    let product_model = "";
    let customerName = "";
    let email = "";
    let customerPhone = "";
    let installerCountry = "";
    let installerCity = "";
    let installer = "";
    let carBrand = "";
    let carModel = "";
    let chasisNumber = "";
    let productRollId = "";
    let warrantyNumber = "";
    let applicationDate = "";
    let termsAccepted = false;

    // Error state dictionary
    let errors: Record<string, string> = {};

    function handleSubmit() {
        errors = {}; // Reset errors

        if (!product_model) errors.product_model = "Please select a product model.";
        if (!customerName) errors.customerName = "This field is required.";

        if (!email) {
            errors.email = "This field is required.";
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                errors.email = "Please enter a valid email address.";
            }
        }

        if (!customerPhone) {
            errors.customerPhone = "This field is required.";
        } else {
            const phoneRegex = /^\+?[0-9]{7,15}$/;
            if (!phoneRegex.test(customerPhone.replace(/[\s-]/g, ""))) {
                errors.customerPhone = "Please enter a valid mobile number.";
            }
        }

        if (!installerCountry) errors.installerCountry = "This field is required.";
        if (!installerCity) errors.installerCity = "This field is required.";
        if (!installer) errors.installer = "This field is required.";
        if (!carBrand) errors.carBrand = "This field is required.";
        if (!carModel) errors.carModel = "This field is required.";
        if (!chasisNumber) errors.chasisNumber = "This field is required.";
        if (!productRollId) errors.productRollId = "This field is required.";
        if (!warrantyNumber) errors.warrantyNumber = "This field is required.";
        if (!applicationDate) errors.applicationDate = "This field is required.";
        if (!termsAccepted) errors.terms = "You must accept the terms and conditions.";

        if (Object.keys(errors).length === 0) {
            const formData = {
                product_model,
                customerName,
                email,
                customerPhone,
                installerCountry,
                installerCity,
                installer,
                carBrand,
                carModel,
                chasisNumber,
                productRollId,
                warrantyNumber,
                applicationDate,
                termsAccepted
            };

            // Dispatch success event to parent component
            dispatch("success", formData);
        }
    }
</script>

<form on:submit|preventDefault={handleSubmit} class="font-pf-galano-grotesque mt-10" novalidate>
    <!-- (Fields remain exactly the same as your existing code) -->
    <!-- Radio Group -->
    <div class="mb-8">
        <RadioGroup
            name="product_model"
            options={productRadioOptions}
            bind:value={product_model}
            error={errors.product_model}
            containerClass="w-full max-w-168.5 justify-between"
        />
    </div>

    <div class="flex flex-col gap-6 lg:flex-row lg:gap-15">
        <div class="flex flex-1 flex-col gap-6">
            <Input label="Customer Name" placeholder="Full Name" id="customer-name" name="customer-name" bind:value={customerName} error={errors.customerName} on:input={() => delete errors.customerName} />
            <Input label="Email" placeholder="Customer Email Address" id="customer-email" name="customer-email" type="email" bind:value={email} error={errors.email} on:input={() => delete errors.email} />
            <Input label="Mobile Number" placeholder="Customer WhatsApp Number" id="customer-phone" name="customer-phone" bind:value={customerPhone} error={errors.customerPhone} on:input={() => delete errors.customerPhone} />
            <Select label="Country" placeholder="Select Country" id="installer-country" name="installer-country" options={COUNTRY_OPTIONS} bind:value={installerCountry} error={errors.installerCountry} />
            <Select label="City" placeholder="Select City" id="installer-city" name="installer-city" options={COUNTRY_OPTIONS} bind:value={installerCity} error={errors.installerCity} />
            <Select options={COUNTRY_OPTIONS} label="Installer" placeholder="Select Studio" id="installer" name="installer" bind:value={installer} error={errors.installer} />
        </div>

        <div class="flex flex-1 flex-col gap-6">
            <Input label="Car Brand" placeholder="Car Brand" id="car-brand" name="car-brand" bind:value={carBrand} error={errors.carBrand} on:input={() => delete errors.carBrand} />
            <Input label="Car Model" placeholder="Car Model" id="car-model" name="car-model" type="text" bind:value={carModel} error={errors.carModel} on:input={() => delete errors.carModel} />
            <Input label="Chasis / Registration Number" placeholder="Chasis / Registration Number" id="chasis-number" name="chasis-number" bind:value={chasisNumber} error={errors.chasisNumber} on:input={() => delete errors.chasisNumber} />
            <Input label="Product Roll ID" placeholder="Enter ID mentioned on PFF Roll" id="product-roll-id" name="product-roll-id" bind:value={productRollId} error={errors.productRollId} on:input={() => delete errors.productRollId} />
            <Input label="Warranty Number" placeholder="Warranty Number" id="warranty-number" name="warranty-number" bind:value={warrantyNumber} error={errors.warrantyNumber} on:input={() => delete errors.warrantyNumber} />
            <DatePicker label="Date of Application" placeholder="Select date when the PFF was applied" id="application-date" name="application-date" bind:value={applicationDate} error={errors.applicationDate} />
        </div>
    </div>

    <Checkbox containerClass="mb-8 md:mb-15 mt-4" id="vehicle3" name="vehicle3" value="Accepted" bind:checked={termsAccepted} error={errors.terms}>
        <span>
            I agree with the Proforce Warranty{" "}
            <a href={ROUTES.TERMS.href} aria-label={ROUTES.TERMS.name} class="text-pf-navy-dark font-semibold underline">
                Terms and Conditions.
            </a>
        </span>
    </Checkbox>

    <MainButton label="Submit for Registration" htmlType="submit" type="button" className="bg-pf-navy hover:text-pf-navy border-pf-navy mx-auto flex max-w-95 justify-center px-5 py-3.5 text-xs font-semibold tracking-[1%] transition-colors duration-200 hover:bg-transparent sm:w-4/5 md:px-4 md:py-4 md:text-sm" />
</form>