import { defineConfig, fontProviders } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath } from "node:url";
import svelte from "@astrojs/svelte";

// https://astro.build/config
export default defineConfig({
  output: "static",
  integrations: [svelte()],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
  },
  fonts: [
    {
      provider: fontProviders.local(),
      name: "Mera Pro",
      cssVariable: "--font-mera-pro",
      fallbacks: ["sans-serif"],
      options: {
        variants: [
          {
            src: ["./src/assets/fonts/mera-pro/MeraPro.woff2"],
            weight: "700", // ⚠️ confirm this matches the actual file — placeholder for now
            style: "normal",
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "Galano Grotesque",
      cssVariable: "--font-galano-grotesque",
      fallbacks: ["sans-serif"],
      options: {
        variants: [
          {
            src: [
              "./src/assets/fonts/galano-grotesque/GalanoGrotesque-Regular.woff2",
            ],
            weight: "400",
            style: "normal",
          },
          {
            src: [
              "./src/assets/fonts/galano-grotesque/GalanoGrotesque-Medium.woff2",
            ],
            weight: "500",
            style: "normal",
          },
          {
            src: [
              "./src/assets/fonts/galano-grotesque/GalanoGrotesque-SemiBold.woff2",
            ],
            weight: "600",
            style: "normal",
          },
          {
            src: [
              "./src/assets/fonts/galano-grotesque/GalanoGrotesque-Bold.woff2",
            ],
            weight: "700",
            style: "normal",
          },
          {
            src: [
              "./src/assets/fonts/galano-grotesque/GalanoGrotesque-ExtraBold.woff2",
            ],
            weight: "800",
            style: "normal",
          },
          {
            src: [
              "./src/assets/fonts/galano-grotesque/GalanoGrotesque-Heavy.woff2",
            ],
            weight: "900",
            style: "normal",
          },
          {
            src: [
              "./src/assets/fonts/galano-grotesque/GalanoGrotesque-Black.woff2",
            ],
            weight: "950",
            style: "normal",
          },
        ],
      },
    },
  ],
});
