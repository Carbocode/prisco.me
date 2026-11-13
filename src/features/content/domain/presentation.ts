import { type PublicArticle } from "@/features/content/domain/public-content";
import { formatSiteDate, siteDateParts } from "@/lib/dates";

export function formatDate(date: Date | null) {
  return date ? formatSiteDate(new Date(date)) : "Pubblicazione";
}

export function formatReadingTime(minutes: number) {
  return `${minutes} min di lettura`;
}

export function uniqueTags(articles: PublicArticle[]) {
  const tags = new Map<string, PublicArticle["tags"][number]>();
  for (const article of articles) {
    for (const tag of article.tags) tags.set(tag.slug, tag);
  }
  return [...tags.values()].sort((left, right) => left.name.localeCompare(right.name, "it"));
}

export function uniqueOrganizations(articles: PublicArticle[]) {
  const organizations = new Map<string, NonNullable<PublicArticle["organization"]>>();
  for (const article of articles) {
    if (article.organization) organizations.set(article.organization.slug, article.organization);
  }
  return [...organizations.values()].sort((left, right) =>
    left.name.localeCompare(right.name, "it"),
  );
}

export function uniqueAuthors(articles: PublicArticle[]) {
  const authors = new Map<string, PublicArticle["author"]>();
  for (const article of articles) authors.set(article.author.slug, article.author);
  return [...authors.values()].sort((left, right) => left.name.localeCompare(right.name, "it"));
}

export function uniqueYears(articles: PublicArticle[]) {
  return [
    ...new Set(
      articles.flatMap((article) =>
        article.publishedAt ? [String(siteDateParts(new Date(article.publishedAt)).year)] : [],
      ),
    ),
  ].sort((left, right) => Number(right) - Number(left));
}
