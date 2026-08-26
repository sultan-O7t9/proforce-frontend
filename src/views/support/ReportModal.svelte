<script lang="ts">
    import AlertMessageModal from "@/components/AlertMessageModal.svelte";
    import MainButton from "@/components/buttons/MainButton.svelte";
    import CustomSelect from "@/components/forms/CustomSelect.svelte";
    import FilePicker from "@/components/forms/FilePicker.svelte";
    import Input from "@/components/forms/Input.svelte";
    import Select from "@/components/forms/Select.svelte";
    import Textarea from "@/components/forms/Textarea.svelte";
    import IconGift from "@/components/icons/IconGift.svelte";
    import ModalComponent from "@/components/ModalComponent.svelte";
    import { COUNTRY_OPTIONS } from "@/lib/site";

    // Form field states
    let fullName = "";
    let email = "";
    let installer = "";
    let installerName = "";
    let installerAddress = "";
    let product = "";
    let message = "";
    let attachment: FileList | null = null;

    // Error dictionary
    let errors: Record<string, string> = {};

    let reportModalAlert:AlertMessageModal;
    let modalComponent:ModalComponent;

    // Conditional visibility: show extra installer fields if "other" is selected
    $: showInstallerFields = installer.toLowerCase() === "other";

    function handleSubmit() {
        errors = {};

        if (!fullName) errors.fullName = "This field is required.";
        if (!email) {
            errors.email = "This field is required.";
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                errors.email = "Please enter a valid email address.";
            }
        }
        if (!installer) errors.installer = "Please select an installer.";
        if (showInstallerFields) {
            if (!installerName) errors.installerName = "This field is required.";
            if (!installerAddress) errors.installerAddress = "This field is required.";
        }
        if (!product) errors.product = "Please select a product.";
        if (!message) errors.message = "This field is required.";

        if (Object.keys(errors).length === 0) {
            const reportData = {
                fullName,
                email,
                installer,
                installerName: showInstallerFields ? installerName : undefined,
                installerAddress: showInstallerFields ? installerAddress : undefined,
                product,
                message,
                attachment: attachment?.[0] || null,
            };
            console.log("Report Form Submitted:", reportData);
            reportModalAlert.showModal();

            // Reset form
            fullName = "";
            email = "";
            installer = "";
            installerName = "";
            installerAddress = "";
            product = "";
            message = "";
            attachment = null;
        }
    }
</script>


  <ModalComponent bind:this={modalComponent} id="report-modal">
      <svelte:fragment slot="anchor">
         <MainButton
                                      label="Report" data-open-modal="report-modal"
                                      type="button" htmlType="button"
                                      className="bg-transparent text-pf-navy hover:text-white hover:bg-pf-navy border-pf-navy flex md:max-w-62.5 justify-center px-5 py-3.5 text-xs font-semibold tracking-[1%] transition-colors duration-200 sm:w-4/5 md:px-4 md:py-4 md:text-sm"
                                  />
      </svelte:fragment>

      <svelte:fragment slot="header">
          <h3
              class="font-pf-mera-pro text-pf-navy-dark mb-2.5 text-center text-base tracking-[10%] uppercase md:text-2xl"
          >
              Report
          </h3>
          <p
              class="font-pf-galano-grotesque text-pf-navy-dark/60 text-center text-sm font-medium tracking-[1%] md:text-base"
          >
              Report unverified or suspicious products to our support team.
          </p>
          <div class="bg-pf-yellow/30 rounded-xl px-6 py-6 flex items-center w-[clamp(280px,100%,480px)] mx-auto mt-8 gap-5">
          <IconGift/>
          <div class="flex flex-col items-start gap-1">
            <h6 class="font-pf-mera-pro text-[13px] tracking-[4%] text-pf-navy ">Get Rewarded</h6>
            <p class="text-pf-navy opacity-80 text-sm font-pf-galano-grotesque font-medium">Get a <b class="font-bold">$35</b> cash reward when you report a fake product.</p>
          </div>
        </div>
      </svelte:fragment>

      <svelte:fragment slot="content">
          <form on:submit|preventDefault={handleSubmit} class="w-full flex flex-col gap-4" novalidate>
              <!-- Name Field -->
              <Input
                  labelClass="md:mb-2.5"
                  name="fullname"
                  placeholder="Full Name"
                  id="fullname"
                  type="text"
                  label="Your Name"
                  inputClass="py-3 md:py-3.5"
                  bind:value={fullName}
                  error={errors.fullName}
                  on:input={() => delete errors.fullName}
              />

              <!-- Email Field -->
              <Input
                  labelClass="md:mb-2.5"
                  name="email"
                  placeholder="Your Email Address"
                  id="email"
                  type="email"
                  inputClass="py-3 md:py-3.5"
                  label="Email Address"
                  bind:value={email}
                  error={errors.email}
                  on:input={() => delete errors.email}
              />

              <!-- Authorized Installer Select -->
              <CustomSelect
                  options={COUNTRY_OPTIONS}
                  label="Authorized Installer"
                  labelClass="md:mb-2.5"
                  containerClass="py-3 md:py-3.5"
                  placeholder="Select Studio"
                  id="installer"
                  name="installer"
                  bind:value={installer}
                  error={errors.installer}
                  on:change={() => delete errors.installer}
              />
              <!-- <Select inModal
                  options={COUNTRY_OPTIONS}
                  label="Authorized Installer"
                  labelClass="md:mb-2.5"
                  containerClass="py-3 md:py-3.5"
                  placeholder="Select Studio"
                  id="installer"
                  name="installer"
                  bind:value={installer}
                  error={errors.installer}
                  on:change={() => delete errors.installer}
              /> -->

              <!-- Conditional Fields Container -->
              {#if showInstallerFields}
                  <div class="flex flex-col gap-4 transition-all duration-200">
                      <Input
                          labelClass="md:mb-2.5"
                          name="installer-name"
                          placeholder="Installer Name"
                          id="installer-name"
                          type="text"
                          label="Installer Name"
                          inputClass="py-3 md:py-3.5"
                          bind:value={installerName}
                          error={errors.installerName}
                          on:input={() => delete errors.installerName}
                      />
                      <Input
                          labelClass="md:mb-2.5"
                          name="installer-address"
                          placeholder="Installer's Address"
                          id="installer-address"
                          type="text"
                          label="Installer's Address"
                          inputClass="py-3 md:py-3.5"
                          bind:value={installerAddress}
                          error={errors.installerAddress}
                          on:input={() => delete errors.installerAddress}
                      />
                  </div>
              {/if}

              <!-- Product Select -->
              <CustomSelect
                  options={COUNTRY_OPTIONS}
                  label="Product"
                  labelClass="md:mb-2.5"
                  containerClass="py-3 md:py-3.5"
                  placeholder="Select Product"
                  id="report-product"
                  name="product"
                  bind:value={product}
                  error={errors.product}
                  on:change={() => delete errors.product}
              />

              <!-- Message TextArea -->
              <Textarea
                  labelClass="md:mb-2.5"
                  id="message"
                  name="message"
                  label="Additional Details"
                  placeholder="Please provide any extra information to help us investigate..."
                  textareaClass="min-h-27.25"
                  bind:value={message}
                  error={errors.message}
                  on:input={() => delete errors.message}
              />

              <!-- File Picker -->
              <FilePicker
                  labelClass="md:mb-2.5"
                  inputClass="py-3 md:py-3.5"
                  id="report-attachment"
                  name="report-attachment"
                  label="Attach File"
                  placeholder="Upload File (Max 5MB)"
                  accept="image/*"
                  bind:value={attachment}
              />

              <MainButton
                  label="Submit"
                  htmlType="submit"
                  type="button"
                  className="bg-pf-navy hover:text-pf-navy border-pf-navy mx-auto flex w-full max-w-95 justify-center self-end px-4 py-3.5 text-xs font-semibold tracking-[1%] transition-colors duration-200 hover:bg-transparent sm:w-4/5 md:px-14 md:py-4 md:text-sm mt-10 mb-20"
              />
          </form>
      </svelte:fragment>
  </ModalComponent>
 <AlertMessageModal
        bind:this={reportModalAlert}
        id="contact-success-modal"
        type="success"
        title="Report Request Submitted"
        message="We have received your request. Our team will review the details and contact you via email."
    >
     <svelte:fragment slot="actions">
         <MainButton
        onclick={() => { reportModalAlert.closeModal(); modalComponent.closeModal(); }}
        label="Done"
        htmlType="button"
        type="button"
        className="bg-pf-navy hover:text-pf-navy border-pf-navy mx-auto flex max-w-95 justify-center px-5 py-3.5 text-xs font-semibold tracking-[1%] transition-colors duration-200 hover:bg-transparent sm:w-4/5 md:px-4 md:py-4 md:text-sm mt-21.5"
    />
    </svelte:fragment>
    </AlertMessageModal>