<script lang="ts">
    import AlertMessageModal from "@/components/AlertMessageModal.svelte";
    import MainButton from "@/components/buttons/MainButton.svelte";
    import Input from "@/components/forms/Input.svelte";
    import Textarea from "@/components/forms/Textarea.svelte";
    import ModalComponent from "@/components/ModalComponent.svelte";

    // Form field states
    let fullName = "";
    let email = "";
    let message = "";

      let contactModal: AlertMessageModal;
      let modalComponent:ModalComponent;

    // Error dictionary
    let errors: Record<string, string> = {};

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

        if (!message) {
            errors.message = "This field is required.";
        } else if (message.length < 10) {
            errors.message = "Please provide a bit more detail (at least 10 characters).";
        }

        if (Object.keys(errors).length === 0) {
            const contactData = { fullName, email, message };
            console.log("Contact Form Submitted:", contactData);

            contactModal?.showModal();

            // Clear form and reset
            fullName = "";
            email = "";
            message = "";
        }
    }
</script>

<div class="relative">
    <ModalComponent bind:this={modalComponent} id="contact-modal">
    <svelte:fragment slot="anchor">
        <p class="text-pf-black/70">
            Need any help? <button
                type="button"
                data-open-modal="contact-modal"
                class="text-pf-navy contact-btn hover:text-pf-yellow cursor-pointer font-bold"
            >Contact Us</button>
        </p>
    </svelte:fragment>

    <svelte:fragment slot="header">
        <h3
            class="font-pf-mera-pro text-pf-navy-dark mb-2.5 text-center text-base tracking-[10%] uppercase md:text-2xl"
        >
            Contact
        </h3>
        <p
            class="font-pf-galano-grotesque text-pf-navy-dark/60 text-center text-sm font-medium tracking-[1%] md:text-base"
        >
            Send us a message and our team will get back to you soon.
        </p>
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

            <!-- Message TextArea -->
            <Textarea
                labelClass="md:mb-2.5"
                id="message"
                name="message"
                label="How can we help?"
                placeholder="Please describe in detail so we can best assist you..."
                textareaClass="min-h-27.25"
                bind:value={message}
                error={errors.message}
                on:input={() => delete errors.message}
            />

            <MainButton
                label="Submit"
                htmlType="submit"
                type="button"
                className="bg-pf-navy hover:text-pf-navy border-pf-navy mx-auto flex w-full max-w-95 justify-center self-end px-4 py-3.5 text-xs font-semibold tracking-[1%] transition-colors duration-200 hover:bg-transparent sm:w-4/5 md:px-14 md:py-4 md:text-sm mt-2"
            />
        </form>
    </svelte:fragment>
</ModalComponent>
 <AlertMessageModal
        bind:this={contactModal}
        id="contact-success-modal"
        type="success"
        title="Message Sent Successfully"
        message="We have received your message. Our team will review your details and contact you via email."
    >
     <svelte:fragment slot="actions">
         <MainButton
        onclick={() => { contactModal.closeModal(); modalComponent.closeModal(); }}
        label="Done"
        htmlType="button"
        type="button"
        className="bg-pf-navy hover:text-pf-navy border-pf-navy mx-auto flex max-w-95 justify-center px-5 py-3.5 text-xs font-semibold tracking-[1%] transition-colors duration-200 hover:bg-transparent sm:w-4/5 md:px-4 md:py-4 md:text-sm mt-21.5"
    />
    </svelte:fragment>
    </AlertMessageModal>
</div>