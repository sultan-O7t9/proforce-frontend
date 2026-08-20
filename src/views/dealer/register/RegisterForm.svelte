<script lang="ts">
    import { onMount } from "svelte";
    import MainButton from "@/components/buttons/MainButton.svelte";
    import { COUNTRY_OPTIONS } from "@/lib/site";
    import Input from "@/components/forms/Input.svelte";
    import RadioGroup from "@/components/forms/RadioGroup.svelte";
    import Select from "@/components/forms/Select.svelte";
    import FilePicker from "@/components/forms/FilePicker.svelte";// Adjust path to your modal component as needed
    import AlertMessageModal from "@/components/AlertMessageModal.svelte";

    const roleOptions = [
        { name: "Distributor", value: "distributor" },
        { name: "Installer", value: "installer" },
    ];

    // Form field states
    let role = "distributor";
    let businessName = "";
    let businessEmail = "";
    let businessPhone = "";
    let businessAddress = "";
    let country = "";
    let fullName = "";
    let businessWebsite = "";
    let businessAge = "";
    let businessSocial = "";
    let attachment: FileList | null = null;

    // Error states
    let errors: Record<string, string> = {};

    // Modal reference
    let registrationModal: AlertMessageModal;

    function handleSubmit() {
        errors = {};


        if (!businessName.trim()) errors.businessName = "Business name is required.";
        if (!businessEmail.trim()) {
            errors.businessEmail = "Business email is required.";
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(businessEmail)) {
                errors.businessEmail = "Please enter a valid email address.";
            }
        }
        if (!businessPhone.trim()) errors.businessPhone = "Phone number is required.";
        if (!businessAddress.trim()) errors.businessAddress = "Business address is required.";
        if (!country) errors.country = "Please select a country.";
        if (!fullName.trim()) errors.fullName = "Your name is required.";
        if (!businessAge.trim()) errors.businessAge = "Years in business is required.";

        if (Object.keys(errors).length === 0) {
            const partnerData = {
                role,
                businessName,
                businessEmail,
                businessPhone,
                businessAddress,
                country,
                fullName,
                businessWebsite,
                businessAge,
                businessSocial,
                attachment: attachment?.[0] || null,
            };

            console.log("Partner Application Data:", partnerData);

            // Open the success modal
            registrationModal?.showModal();

            // Reset form fields
            businessName = "";
            businessEmail = "";
            businessPhone = "";
            businessAddress = "";
            country = "";
            fullName = "";
            businessWebsite = "";
            businessAge = "";
            businessSocial = "";
            attachment = null;
        }
    }

    onMount(() => {
        const header = document.querySelector(".main-header") as HTMLElement | null;
        const heroSectionContainer = document.querySelector(".dealer-login-section-container") as HTMLElement | null;

        if (header && heroSectionContainer) {
            heroSectionContainer.style.paddingTop = header.getBoundingClientRect().height + "px";
        }
    });
</script>

<div class="relative">
    <section class="dealer-login-section-container">
        <div
            class="max-container px-4 py-8 sm:px-8 md:px-16.5 md:py-17.5 lg:px-[clamp(1rem,6.2vw+1rem,100px)]"
        >
            <div
                class="bg-pf-gohst-white/50 flex flex-col items-center justify-center gap-8.75 rounded-lg px-4 py-8 md:gap-17.5 md:px-10 md:py-15"
            >
                <div class="flex flex-col gap-4 md:gap-6">
                    <h1
                        class="font-pf-mera-pro text-center text-xl tracking-[10%] uppercase md:text-2xl"
                    >
                        Become a Partner
                    </h1>
                    <h6
                        class="font-pf-galano-grotesque text-center text-sm font-medium tracking-[1%] md:text-base"
                    >
                        Provide your business details below, our team will review your
                        application and contact you.
                    </h6>
                </div>

                <form
                    class="font-pf-galano-grotesque mx-auto mt-10 w-full max-w-252.5"
                    on:submit|preventDefault={handleSubmit}
                    novalidate
                >
                    <RadioGroup
                        options={roleOptions}
                        containerClass="w-full max-w-168.5 justify-start md:gap-25"
                        bind:value={role}
                    />

                    <div class="mt-10 mb-17.5 flex flex-col gap-6 lg:flex-row lg:gap-15">
                        <div class="flex flex-1 flex-col gap-6">
                            <Input
                                label="Business Name"
                                placeholder="Business Name"
                                id="business-name"
                                name="business-name"
                                bind:value={businessName}
                                error={errors.businessName}
                                on:input={() => delete errors.businessName}
                            />
                            <Input
                                label="Business Email"
                                placeholder="Business Email"
                                id="business-email"
                                name="business-email"
                                type="email"
                                bind:value={businessEmail}
                                error={errors.businessEmail}
                                on:input={() => delete errors.businessEmail}
                            />
                            <Input
                                label="Business Phone Number"
                                placeholder="Business Phone Number"
                                id="business-phone"
                                name="business-phone"
                                bind:value={businessPhone}
                                error={errors.businessPhone}
                                on:input={() => delete errors.businessPhone}
                            />
                            <Input
                                label="Business Address"
                                placeholder="Business Address"
                                id="business-address"
                                name="business-address"
                                bind:value={businessAddress}
                                error={errors.businessAddress}
                                on:input={() => delete errors.businessAddress}
                            />
                            <Select
                                label="Country"
                                placeholder="Select Country"
                                id="installer-country"
                                name="installer-country"
                                options={COUNTRY_OPTIONS}
                                bind:value={country}
                                error={errors.country}
                                on:change={() => delete errors.country}
                            />
                        </div>

                        <div class="flex flex-1 flex-col gap-6">
                            <Input
                                label="Your Name"
                                placeholder="Full Name"
                                id="fullname"
                                name="fullname"
                                bind:value={fullName}
                                error={errors.fullName}
                                on:input={() => delete errors.fullName}
                            />
                            <Input
                                label="Business Website"
                                placeholder="Website Link"
                                id="business-website"
                                name="business-website"
                                type="text"
                                bind:value={businessWebsite}
                            />
                            <Input
                                label="Years in Business"
                                placeholder="Number of Years"
                                id="business-age"
                                name="business-age"
                                type="text"
                                bind:value={businessAge}
                                error={errors.businessAge}
                                on:input={() => delete errors.businessAge}
                            />
                            <Input
                                label="Social Media"
                                placeholder="Social Media (link only)"
                                id="business-social"
                                name="business-social"
                                bind:value={businessSocial}
                            />
                            <FilePicker
                                id="business-attachment"
                                name="business-attachment"
                                label="Attach File"
                                placeholder="Upload File (Max 5MB)"
                                accept="image/*"
                                inputClass="bg-transparent"
                                bind:value={attachment}
                            />
                        </div>
                    </div>

                    <MainButton
                        label="Submit for Registration"
                        htmlType="submit" type="button"
                        className="bg-pf-navy hover:text-pf-navy border-pf-navy mx-auto flex max-w-95 justify-center px-5 py-3.5 text-xs font-semibold tracking-[1%] transition-colors duration-200 hover:bg-transparent sm:w-4/5 md:px-4 md:py-4 md:text-sm"
                    />
                </form>
            </div>
        </div>
    </section>
    <!-- Registration Success Modal -->
    <AlertMessageModal
        bind:this={registrationModal}
        id="registration-success-modal"
        type="success"
        title="Request Submitted"
        message="We have received your application. Our team will review your details and contact you via email."
    >
     <svelte:fragment slot="actions">
         <MainButton
        onclick={() => { registrationModal.closeModal(); }}
        label="Done"
        htmlType="button"
        type="button"
        className="bg-pf-navy hover:text-pf-navy border-pf-navy mx-auto flex max-w-95 justify-center px-5 py-3.5 text-xs font-semibold tracking-[1%] transition-colors duration-200 hover:bg-transparent sm:w-4/5 md:px-4 md:py-4 md:text-sm mt-21.5"
    />
    </svelte:fragment>
    </AlertMessageModal>
</div>