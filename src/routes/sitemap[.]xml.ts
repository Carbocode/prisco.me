import { createFileRoute } from "@tanstack/react-router";

import { listPublishedArticlesByFilter } from "@/features/cms/server/article.service";

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
        const articles = await listPublishedArticlesByFilter({});
        const staticPaths = ["", "/about", "/career", "/contact"];
        const archivePaths = new Set<string>();
        for (const article of articles) {
          if (article.publishedAt) {
            const date = datePath(article.publishedAt);
            archivePaths.add(`/${date.slice(0, 4)}`);
            archivePaths.add(`/${date.slice(0, 7)}`);
            archivePaths.add(`/${date}`);
          }
          for (const category of article.categories) {
            archivePaths.add(`/${category.slug}`);
          }
          for (const tag of article.tags) archivePaths.add(`/${tag.slug}`);
          archivePaths.add(`/${article.author.slug}`);
          if (article.organization) archivePaths.add(`/${article.organization.slug}`);
        }
        const urls = [
          ...staticPaths.map((path) => ({ loc: `https://prisco.me${path}`, lastmod: undefined })),
          ...[...archivePaths].map((path) => ({
            loc: `https://prisco.me${path}`,
            lastmod: undefined,
          })),
          ...articles.map((item) => ({
            loc: `https://prisco.me/${canonicalArchiveSlug(item)}/${item.slug}`,
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

function canonicalArchiveSlug(article: { categories: Array<{ slug: string }> }) {
  const category = article.categories[0]?.slug;
  if (!category) throw new Error("Published articles must have a category");
  return category;
}

function datePath(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Rome",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${value.year}/${value.month}/${value.day}`;
}
