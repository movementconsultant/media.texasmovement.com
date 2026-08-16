import type { APIRoute } from "astro";

const SITE = "https://media.texasmovement.com";

export const GET: APIRoute = () => {
  const preview = process.env.PUBLIC_PREVIEW === "true";

  const body = preview
    ? `User-agent: *\nDisallow: /\n`
    : `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap-index.xml\n`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
