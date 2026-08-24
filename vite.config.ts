import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig({
  // GitHub Pages: https://USUARIO.github.io/fluffys-2/
  base: process.env.GITHUB_PAGES === "true" ? "/fluffys-2/" : "/",
  plugins: [
    react(),
    tailwindcss(),
    tsconfigPaths(),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "apple-touch-icon.png"],
      manifest: {
        name: "Fluffys",
        short_name: "Fluffys",
        description: "Estudia Harry Potter con trivia y repaso inteligente.",
        theme_color: "#641e1e",
        background_color: "#efeee9",
        display: "standalone",
        orientation: "portrait",
        start_url: "./",
        scope: "./",
        lang: "es",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
    }),
  ],
});
