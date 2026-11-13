import { createFileRoute } from "@tanstack/react-router";

const robotsTxt = `User-agent: *
Disallow: /api/
Allow: /api/content/v1/
Disallow: /dashboard/
Disallow: /login
Disallow: /oauth/
Disallow: /verify-2fa

Sitemap: https://prisco.me/sitemap.xml
Agentmap: https://prisco.me/.well-known/ard.json
`;

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async () =>
        new Response(robotsTxt, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
          },
        }),
    },
  },
});
