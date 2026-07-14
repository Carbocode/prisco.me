import { createFileRoute } from "@tanstack/react-router";

import { listPublishedArticles } from "@/features/cms/server/article.service";
const escapeXml = (value: string) =>
  value.replace(
    /[<>&'"]/g,
    (character) =>
      ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" })[character]!,
  );
export const Route = createFileRoute("/rss.xml")({
  server: {
    handlers: {
      GET: async () => {
        const articles = await listPublishedArticles(30);
        const body = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Prisco.me Blog</title><link>https://prisco.me/blog</link><description>Articoli di Vincenzo Prisco</description><language>it</language>${articles.map((item) => `<item><title>${escapeXml(item.title)}</title><link>https://prisco.me/blog/${escapeXml(item.slug)}</link><guid>https://prisco.me/blog/${escapeXml(item.slug)}</guid>${item.excerpt ? `<description>${escapeXml(item.excerpt)}</description>` : ""}${item.publishedAt ? `<pubDate>${item.publishedAt.toUTCString()}</pubDate>` : ""}</item>`).join("")}</channel></rss>`;
        return new Response(body, {
          headers: {
            "Content-Type": "application/rss+xml; charset=utf-8",
            "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
          },
        });
      },
    },
  },
});
