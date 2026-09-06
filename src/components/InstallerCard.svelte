<script lang="ts">
  import MainButton from "./buttons/MainButton.svelte";
  import IconLocation from "./icons/IconLocation.svelte";
  import IconWhatsApp from "./icons/IconWhatsApp.svelte";

  interface Props {
    name: string;
    location: string;
    phone: string;
    address: string;
  }

  let { name, location, phone, address }: Props = $props();

  const ph = $derived(phone.replaceAll(" ", "").replaceAll("+", ""));
</script>

<li
  class="font-pf-galano-grotesque hover:border-pf-navy cursor-pointer rounded-lg border border-white bg-white px-4 pt-6 pb-6 shadow-[0px_2px_40px_rgba(0,0,0,0.06)] transition-all duration-300 hover:-translate-y-2 hover:bg-[#fefeff] hover:shadow-[0_10px_20px_-10px_rgba(33,49,77,0.4)] md:px-5 md:pt-8"
>
  <div class="px-3">
    <h4
      class="text-pf-navy mb-2 text-lg font-bold tracking-[2%] uppercase md:mb-3 md:text-xl"
    >
      {name}
    </h4>
    <p
      class="text-pf-navy/70 mb-8 text-xs font-medium tracking-[1%] md:text-sm capitalize"
    >
      {location}
    </p>
    <address
      class="text-pf-navy mb-8 flex flex-col gap-4.5 text-sm font-medium tracking-[1%] not-italic"
    >
      <a
        class="flex items-center gap-1.25"
        target="_blank"
        href={"https://api.whatsapp.com/send?phone=" + ph}
      >
        <IconWhatsApp />
        <span>{phone}</span>
      </a>
      <a
        class="flex items-center gap-1.25"
        href="https://maps.app.goo.gl/VSsey3ahNmKRFswh6"
        target="_blank"
      >
        <IconLocation />
        <span class="line-clamp-1">{address}</span>
      </a>
    </address>
  </div>
  <div class="flex flex-col gap-4.25 sm:flex-row">
    <MainButton
      label="Directions" target="_blank"
      href="https://www.google.com/maps/search/?api=1&query={address}"
      className="text-pf-navy border-pf-navy hover:bg-pf-navy flex w-full justify-center rounded-xs bg-white px-5 py-3 text-sm font-medium tracking-[1%] transition-colors duration-200 hover:text-white sm:max-h-11 sm:w-4/5 sm:max-w-62.5 md:px-4 md:py-3 md:text-xs md:text-[13px]"
    />
    <MainButton
      label="Get Quote"
      href=""
      className="bg-pf-navy hover:text-pf-navy border-pf-navy hover:bg-pf-yellow hover:border-pf-yellow flex w-full justify-center rounded-xs px-5 py-3 text-sm font-semibold tracking-[1%] transition-colors duration-200 sm:max-h-11 sm:w-4/5 sm:max-w-62.5 md:px-4 md:py-3 md:text-xs md:text-[13px]"
    />
  </div>
</li>