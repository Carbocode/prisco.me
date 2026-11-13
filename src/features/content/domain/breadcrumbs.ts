/* oxlint-disable no-underscore-dangle -- TanStack Router espone il parametro splat come `_splat`. */
import { type ContentArchive } from "@/features/content/domain/archive";
import { type PublicArticle } from "@/features/content/domain/public-content";

export function makeCrumbs(archive: ContentArchive, article: PublicArticle) {
  const base = `/${archive.slug}`;
  return [
    { name: archive.title, url: base },
    { name: article.title, url: `${base}/${article.slug}` },
  ];
}
