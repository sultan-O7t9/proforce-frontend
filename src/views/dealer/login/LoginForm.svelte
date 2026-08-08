<script lang="ts">
  import Input from "@/components/forms/Input.svelte";
  import MainButton from "@/components/buttons/MainButton.svelte";
    import { ROUTES } from "@/lib/site";

</script>

<form
  class="font-pf-galano-grotesque flex w-[clamp(280px,100%,480px)] flex-col items-center gap-4.5"
>
  <!-- Email Field -->
  <Input
    autofocus
    name="email"
    placeholder="Your Email"
    id="email"
    type="email"
    label="Email"
  />
  <!-- Password Field 1 -->
  <Input
    name="password"
    placeholder="Your Password"
    id="password"
    type="password"
    label="Password"
  />
  <!-- Password Field 2 -->
  <Input
    name="confirm-password"
    placeholder="Your Password"
    id="confirm-password"
    type="password"
    label="Confirm Password"
  />

  <!-- Forgot Password Link -->
  <div class="flex justify-end self-end">
    <a
      href={ROUTES.DEALER_FORGOT_PASSWORD.href}
      aria-label={ROUTES.DEALER_FORGOT_PASSWORD.name}
      class="text-pf-navy hover:text-pf-yellow text-xs font-medium transition-colors sm:text-sm"
    >
      Forgot Password?
    </a>
  </div>

  <!-- Submit Button -->
  <MainButton
    label="Login"
    href=""
    className="bg-pf-navy hover:text-pf-navy border-pf-navy flex min-w-3xs justify-center px-5 py-3.5 text-xs font-semibold tracking-[1%] transition-colors duration-200 hover:bg-transparent sm:w-4/5 md:px-14 md:py-4 md:text-sm"
  />
</form>