// @ts-check
import { defineConfig, envField } from "astro/config";
import sitemap from "@astrojs/sitemap";

const PUBLIC_PREVIEW = process.env.PUBLIC_PREVIEW === "true";
const SITE = "https://media.texasmovement.com";

export default defineConfig({
  site: SITE,
  output: "static",
  trailingSlash: "never",
  integrations: [
    // Sitemap is generated in all builds, but preview builds are filtered
    // down to zero indexable URLs inside src/pages/sitemap.xml.ts /
    // robots.txt — see the preview convention in docs/MIGRATION_INVENTORY.md.
    sitemap({
      filter: () => !PUBLIC_PREVIEW,
    }),
  ],
  env: {
    schema: {
      PUBLIC_PREVIEW: envField.boolean({ context: "client", access: "public", default: false }),
    },
  },
  vite: {
    resolve: {
      // Allow the vendored @tmi/constants package's explicit ".ts" import
      // specifiers (e.g. `from "./types.ts"`) to resolve under Vite.
      extensions: [".mjs", ".js", ".mts", ".ts", ".jsx", ".tsx", ".json"],
    },
  },
});
