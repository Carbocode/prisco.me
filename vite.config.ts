import faroUploader from "@grafana/faro-rollup-plugin";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { nitro } from "nitro/vite";
import { defineConfig } from "vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

const config = defineConfig({
  ssr: {
    external: ["cloudflare:workers"],
  },
  build: {
    rollupOptions: {
      external: ["cloudflare:workers"],
    },
  },
  plugins: [
    devtools(),
    nitro({ preset: "cloudflare-module" }),
    viteTsConfigPaths({
      projects: ["./tsconfig.json"],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
    faroUploader({
      appName: "prisco-website",
      endpoint: process.env.FARO_API_URL ?? "",
      appId: "161",
      stackId: "1489971",
      verbose: true,
      apiKey: process.env.FARO_SOURCEMAP_KEY ?? "",
      gzipContents: true,
    }),
  ],
});

export default config;
