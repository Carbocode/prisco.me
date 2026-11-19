import { SITE, type SiteLocale } from "@/config/site";
import type { PublicArticle } from "@/features/content/domain/public-content";
import * as m from "@/paraglide/messages.js";

import {
  CATEGORY_ARCHIVE_SORT,
  type CategoryArchiveSort,
  type CategoryArticleLayout,
  type CategorySchemaType,
} from "./content-category";

export type PublicCategory = {
  name: string;
  slug: string;
  description: string | null;
  schemaType: CategorySchemaType;
  archiveSort: CategoryArchiveSort;
  articleLayout: CategoryArticleLayout;
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
  articleLayout: CategoryArticleLayout;
};

export function resolveArchive(
  slug: string,
  articles: PublicArticle[],
  categories: PublicCategory[],
  locale: SiteLocale = "it",
): ContentArchive | null {
  if (/^\d+$/.test(slug)) {
    return resolveDateArchive(slug, articles, undefined, undefined, locale);
  }

  const category = categories.find((item) => item.slug === slug);
  if (category) return categoryArchive(slug, category, articles, locale);

  const byAuthor = articles.filter((article) => article.author.slug === slug);
  const author = byAuthor[0];
  if (author) {
    return {
      kind: "author",
      slug,
      title: author.author.name,
      description: m.archive_by_author({ name: author.author.name }, { locale }),
      eyebrow: m.archive_eyebrow_author({}, { locale }),
      articles: byAuthor,
      articleLayout: "card",
    };
  }

  const byOrganization = articles.filter((article) => article.organization?.slug === slug);
  const organization = byOrganization[0]?.organization;
  if (organization) {
    return {
      kind: "organization",
      slug,
      title: organization.name,
      description: m.archive_for_organization({ name: organization.name }, { locale }),
      eyebrow: m.archive_eyebrow_organization({}, { locale }),
      articles: byOrganization,
      articleLayout: "card",
    };
  }

  const tag = articles.flatMap((article) => article.tags).find((item) => item.slug === slug);
  if (tag) {
    return {
      kind: "tag",
      slug,
      title: tag.name,
      description: m.archive_with_tag({ name: tag.name }, { locale }),
      eyebrow: "Tag",
      articles: articles.filter((article) => article.tags.some((item) => item.slug === slug)),
      articleLayout: "card",
    };
  }

  return null;
}

export function resolveDateArchive(
  yearSlug: string,
  articles: PublicArticle[],
  monthSlug?: string,
  daySlug?: string,
  locale: SiteLocale = "it",
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
    ? new Intl.DateTimeFormat(locale, { month: "long", timeZone: SITE.timeZone }).format(
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
    title: m.archive_publications_period({ period }, { locale }),
    description: day
      ? m.archive_on_date({ period }, { locale })
      : m.archive_in_period({ period }, { locale }),
    eyebrow: m.archive_eyebrow_heading({}, { locale }),
    articles: matching,
    articleLayout: "card",
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
  locale: SiteLocale,
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
    description: category.description ?? m.archive_in_category({ name: category.name }, { locale }),
    eyebrow: category.archiveEyebrow,
    hero: category.hero,
    articles: matching,
    articleLayout: category.articleLayout,
  };
}
