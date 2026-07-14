import { createFileRoute } from "@tanstack/react-router";

import { listPublishedArticles } from "@/features/cms/server/article.service";
import { listPublishedServices } from "@/features/cms/server/service.service";
const escapeXml = (value: string) =>
  value.replace(
    /[<>&'"]/g,
    (character) =>
      ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[character]!,
  );
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async () => {
        const [articles, services] = await Promise.all([
          listPublishedArticles(50),
          listPublishedServices(),
        ]);
        const staticPaths = ["", "/about", "/career", "/projects", "/contact", "/blog", "/servizi"];
        const urls = [
          ...staticPaths.map((path) => ({ loc: `https://prisco.me${path}`, lastmod: undefined })),
          ...articles.map((item) => ({
            loc: `https://prisco.me/blog/${item.slug}`,
            lastmod: item.publishedAt?.toISOString(),
          })),
          ...services.map((item) => ({
            loc: `https://prisco.me/servizi/${item.slug}`,
            lastmod: item.updatedAt.toISOString(),
          })),
        ];
        const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((item) => `<url><loc>${escapeXml(item.loc)}</loc>${item.lastmod ? `<lastmod>${item.lastmod}</lastmod>` : ""}</url>`).join("")}</urlset>`;
        return new Response(body, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
          },
        });
      },
    },
  },
});
