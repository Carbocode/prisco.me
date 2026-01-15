import { fileURLToPath, URL } from "node:url";
import { cloudflare } from "@cloudflare/vite-plugin";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";
import viteTsConfigPaths from "vite-tsconfig-paths";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    environments: {
      ssr: {
        build: {
          rollupOptions: {
            external: ["cloudflare:workers", "cloudflare:sockets"],
          },
        },
      },
      nitro: {
        build: {
          rollupOptions: {
            external: ["cloudflare:workers", "cloudflare:sockets"],
          },
        },
      },
    },
    build: {
      sourcemap: "hidden",
    },
    resolve: {
      alias: {
        "@": fileURLToPath(new URL("./src", import.meta.url)),
      },
    },
    plugins: [
      cloudflare({ viteEnvironment: { name: "ssr" } }),
      viteTsConfigPaths({
        projects: ["./tsconfig.json"],
      }),
      tailwindcss(),
      tanstackStart(),
      viteReact(),
      sentryVitePlugin({
        org: "prisco",
        project: "javascript-tanstackstart-react",
        authToken: env.SENTRY_AUTH_TOKEN,
      }),
    ],
  };
});
