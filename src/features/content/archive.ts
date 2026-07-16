import {
  CATEGORY_ARCHIVE_SORT,
  type CategoryArchiveSort,
  type CategorySchemaType,
} from "@/lib/content-category";

import type { PublicArticle } from "./content-components";

export type PublicCategory = {
  name: string;
  slug: string;
  description: string | null;
  schemaType: CategorySchemaType;
  archiveSort: CategoryArchiveSort;
  archiveEyebrow: string;
  hero: { url: string; altText: string | null } | null;
};

export type ContentArchive = {
  kind: "category" | "year" | "author" | "organization" | "tag";
  slug: string;
  title: string;
  description: string;
  eyebrow: string;
  hero?: { url: string; altText: string | null } | null;
  articles: PublicArticle[];
};

export function resolveArchive(
  slug: string,
  articles: PublicArticle[],
  categories: PublicCategory[],
): ContentArchive | null {
  if (/^\d+$/.test(slug)) {
    return resolveDateArchive(slug, articles);
  }

  const category = categories.find((item) => item.slug === slug);
  if (category) return categoryArchive(slug, category, articles);

  const byAuthor = articles.filter((article) => article.author.slug === slug);
  const author = byAuthor[0];
  if (author) {
    return {
      kind: "author",
      slug,
      title: author.author.name,
      description: `Contenuti pubblicati da ${author.author.name}.`,
      eyebrow: "Autore",
      articles: byAuthor,
    };
  }

  const byOrganization = articles.filter((article) => article.organization?.slug === slug);
  const organization = byOrganization[0]?.organization;
  if (organization) {
    return {
      kind: "organization",
      slug,
      title: organization.name,
      description: `Contenuti collegati a ${organization.name}.`,
      eyebrow: "Organizzazione",
      articles: byOrganization,
    };
  }

  const tag = articles.flatMap((article) => article.tags).find((item) => item.slug === slug);
  if (tag) {
    return {
      kind: "tag",
      slug,
      title: tag.name,
      description: `Contenuti associati al tag ${tag.name}.`,
      eyebrow: "Tag",
      articles: articles.filter((article) => article.tags.some((item) => item.slug === slug)),
    };
  }

  return null;
}

export function resolveDateArchive(
  yearSlug: string,
  articles: PublicArticle[],
  monthSlug?: string,
  daySlug?: string,
): ContentArchive | null {
  if (!/^\d+$/.test(yearSlug) || !/^\d{4}$/.test(yearSlug)) return null;
  if (monthSlug && !/^(0[1-9]|1[0-2])$/.test(monthSlug)) return null;
  if (daySlug && (!monthSlug || !/^(0[1-9]|[12]\d|3[01])$/.test(daySlug))) return null;

  const year = Number(yearSlug);
  const month = monthSlug ? Number(monthSlug) : undefined;
  const day = daySlug ? Number(daySlug) : undefined;
  const matching = articles.filter((article) =>
    articleMatchesDateArchive(article, year, month, day),
  );
  if (!matching.length) return null;

  const slug = [yearSlug, monthSlug, daySlug].filter(Boolean).join("/");
  const monthName = month
    ? new Intl.DateTimeFormat("it-IT", { month: "long", timeZone: "Europe/Rome" }).format(
        new Date(Date.UTC(year, month - 1, 1)),
      )
    : null;
  const period = day
    ? `${day} ${monthName} ${year}`
    : monthName
      ? `${monthName} ${year}`
      : String(year);

  return {
    kind: "year",
    slug,
    title: `Pubblicazioni del ${period}`,
    description: `Contenuti pubblicati ${day ? "il" : "nel"} ${period}.`,
    eyebrow: "Archivio",
    articles: matching,
  };
}

export function articleMatchesDateArchive(
  article: PublicArticle,
  year: number,
  month?: number,
  day?: number,
) {
  if (!article.publishedAt) return false;
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Europe/Rome",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date(article.publishedAt));
  const value = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return (
    Number(value.year) === year &&
    (month === undefined || Number(value.month) === month) &&
    (day === undefined || Number(value.day) === day)
  );
}

function categoryArchive(
  slug: string,
  category: PublicCategory | undefined,
  articles: PublicArticle[],
): ContentArchive | null {
  if (!category) return null;
  const matching = articles.filter((article) =>
    article.categories.some((item) => item.slug === category.slug),
  );
  if (category.archiveSort === CATEGORY_ARCHIVE_SORT.MANUAL) {
    matching.sort((left, right) => left.projectSortOrder - right.projectSortOrder);
  } else {
    matching.sort(
      (left, right) => (right.publishedAt?.getTime() ?? 0) - (left.publishedAt?.getTime() ?? 0),
    );
  }
  return {
    kind: "category",
    slug,
    title: category.name,
    description: category.description ?? `Contenuti nella categoria ${category.name}.`,
    eyebrow: category.archiveEyebrow,
    hero: category.hero,
    articles: matching,
  };
}
