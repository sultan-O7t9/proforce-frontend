<script lang="ts">
    import SuccessIcon from "@/assets/img/success-icon.svg";
    import ErrorIcon from "@/assets/img/error-icon.svg";
    import { twMerge } from "tailwind-merge";

    export let type: "success" | "error" = "success";
    export let title: string = "";
    export let message: string | undefined = undefined;
    export let messageClass: string = "";

    const icons = {
        success: SuccessIcon.src,
        error: ErrorIcon.src,
    };
</script>

<div class="flex flex-col items-center gap-7">
    <img src={icons[type]} alt="{type} icon" />
    <h4
        class="font-pf-mera-pro text-pf-navy mt-2 text-center text-xl tracking-[10%] uppercase"
    >
        {title}
    </h4>
    <h6 class={twMerge("font-pf-galano-grotesque text-pf-black/70 text-center font-medium",messageClass)}>
        {message}
    </h6>
    <slot name="action" />
</div>