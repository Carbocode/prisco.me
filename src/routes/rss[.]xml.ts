import { createFileRoute } from "@tanstack/react-router";

import { listPublishedArticlesByFilter } from "@/features/cms/server/article.service";
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
        const articles = await listPublishedArticlesByFilter({});
        const body = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Prisco.me</title><link>https://prisco.me/</link><description>Contenuti di Vincenzo Prisco</description><language>it</language>${articles
          .slice(0, 30)
          .map((item) => {
            const category = item.categories[0]?.slug;
            if (!category) throw new Error("Published articles must have a category");
            const path = `https://prisco.me/${escapeXml(category)}/${escapeXml(item.slug)}`;
            return `<item><title>${escapeXml(item.title)}</title><link>${path}</link><guid>${path}</guid>${item.excerpt ? `<description>${escapeXml(item.excerpt)}</description>` : ""}${item.publishedAt ? `<pubDate>${item.publishedAt.toUTCString()}</pubDate>` : ""}</item>`;
          })
          .join("")}</channel></rss>`;
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
