import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";

function normalizeSite(url) {
  if (!url) return undefined;
  return new URL(url.startsWith("http") ? url : `https://${url}`).origin;
}

const site = normalizeSite(
  process.env.SITE ??
    process.env.PUBLIC_SITE_URL ??
    process.env.URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL,
);

export default defineConfig({
  site,
  integrations: [mdx()],
});
