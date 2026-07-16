import { CATEGORY_SCHEMA_TYPE, type CategorySchemaType } from "@/lib/content-category";

import type { ContentArchive } from "./archive";
import type { ContentCrumb, PublicArticle } from "./content-components";

const origin = "https://prisco.me";
const personId = `${origin}/#person`;
const websiteId = `${origin}/#website`;

function absoluteUrl(pathOrUrl: string) {
  return pathOrUrl.startsWith("http://") || pathOrUrl.startsWith("https://")
    ? pathOrUrl
    : origin + pathOrUrl;
}

function articleUrl(article: PublicArticle) {
  const category = article.categories[0]?.slug;
  if (!category) throw new Error("Published articles must have a category");
  return article.canonicalUrl ?? `${origin}/${category}/${article.slug}`;
}

function structuredDataType(article: PublicArticle) {
  const schemaType = article.categories[0]?.schemaType;
  if (!schemaType) throw new Error("Published articles must have a category schema type");
  return schemaType;
}

function entityId(article: PublicArticle) {
  const fragmentByType: Record<CategorySchemaType, string> = {
    [CATEGORY_SCHEMA_TYPE.ARTICLE]: "article",
    [CATEGORY_SCHEMA_TYPE.CREATIVE_WORK]: "creative-work",
  };
  return `${articleUrl(article)}#${fragmentByType[structuredDataType(article)]}`;
}

function authorJsonLd(author: PublicArticle["author"]) {
  return {
    "@type": "Person",
    "@id": author.slug === "vincenzo-prisco" ? personId : `${origin}/${author.slug}#person`,
    name: author.name,
    url: `${origin}/${author.slug}`,
  };
}

function organizationJsonLd(organization: NonNullable<PublicArticle["organization"]>) {
  return {
    "@type": "Organization",
    "@id": `${origin}/${organization.slug}#organization`,
    name: organization.name,
    url: `${origin}/${organization.slug}`,
  };
}

function breadcrumbJsonLd(crumbs: ContentCrumb[], pageUrl: string) {
  const items = [{ name: "Home", url: "/" }, ...crumbs];
  return {
    "@type": "BreadcrumbList",
    "@id": `${pageUrl}#breadcrumb`,
    itemListElement: items.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: absoluteUrl(crumb.url),
    })),
  };
}

function archiveAbout(archive: ContentArchive) {
  const first = archive.articles[0];
  if (archive.kind === "author" && first) return authorJsonLd(first.author);
  if (archive.kind === "organization" && first?.organization)
    return organizationJsonLd(first.organization);
  if (archive.kind === "tag") {
    return {
      "@type": "DefinedTerm",
      name: archive.title,
      url: `${origin}/${archive.slug}`,
    };
  }
  if (archive.kind === "category") {
    return {
      "@type": "Thing",
      name: archive.title,
      url: `${origin}/${archive.slug}`,
    };
  }
  return undefined;
}

export function archiveHead(archive: ContentArchive) {
  const path = `/${archive.slug}`;
  const url = origin + path;
  const title = `${archive.title} | Vincenzo Prisco`;
  const image = archive.hero?.url;
  const crumbs = [{ name: archive.title, url: path }];
  const breadcrumb = breadcrumbJsonLd(crumbs, url);
  const itemListId = `${url}#item-list`;
  const about = archiveAbout(archive);
  return {
    meta: [
      { title },
      { name: "description", content: archive.description },
      { property: "og:title", content: title },
      { property: "og:description", content: archive.description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: url },
      { property: "og:site_name", content: "Prisco.me" },
      { property: "og:locale", content: "it_IT" },
      ...(image ? [{ property: "og:image", content: image }] : []),
      ...(image && archive.hero?.altText
        ? [{ property: "og:image:alt", content: archive.hero.altText }]
        : []),
      { name: "twitter:card", content: image ? "summary_large_image" : "summary" },
      { name: "twitter:url", content: url },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: archive.description },
      ...(image ? [{ name: "twitter:image", content: image }] : []),
      ...(image && archive.hero?.altText
        ? [{ name: "twitter:image:alt", content: archive.hero.altText }]
        : []),
      ...(archive.kind === "author" && archive.articles[0]
        ? [{ name: "author", content: archive.articles[0].author.name }]
        : []),
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "CollectionPage",
              "@id": `${url}#webpage`,
              url,
              name: archive.title,
              description: archive.description,
              inLanguage: "it-IT",
              isPartOf: { "@id": websiteId },
              publisher: { "@id": personId },
              breadcrumb: { "@id": breadcrumb["@id"] },
              mainEntity: { "@id": itemListId },
              about,
              ...(archive.kind === "year" ? { temporalCoverage: archive.slug } : {}),
            },
            {
              "@type": "ItemList",
              "@id": itemListId,
              name: archive.title,
              numberOfItems: archive.articles.length,
              itemListElement: archive.articles.map((article, index) => ({
                "@type": "ListItem",
                position: index + 1,
                item: {
                  "@type": structuredDataType(article),
                  "@id": entityId(article),
                  name: article.title,
                  url: articleUrl(article),
                },
              })),
            },
            breadcrumb,
          ],
        }),
      },
    ],
  };
}

export function articleHead(article: PublicArticle, path: string, crumbs: ContentCrumb[]) {
  const title = article.seoTitle ?? article.title;
  const description =
    article.seoDescription ??
    article.excerpt ??
    `${article.title}, un contenuto pubblicato da ${article.author.name} su Prisco.me.`;
  const url = article.canonicalUrl ?? origin + path;
  const image = article.cover?.url;
  const schemaType = structuredDataType(article);
  const editorialArticle = schemaType === CATEGORY_SCHEMA_TYPE.ARTICLE;
  const publishedAt = article.publishedAt?.toISOString();
  const modifiedAt = article.updatedAt.toISOString();
  const breadcrumb = breadcrumbJsonLd(crumbs, url);
  const workId = entityId(article);
  const webpageId = `${url}#webpage`;
  const imageId = image ? `${url}#primary-image` : undefined;
  const author = authorJsonLd(article.author);
  const organization = article.organization ? organizationJsonLd(article.organization) : undefined;
  const topics = article.tags.map((tag) => ({
    "@type": "DefinedTerm",
    name: tag.name,
    url: `${origin}/${tag.slug}`,
  }));

  return {
    meta: [
      { title: `${title} | Vincenzo Prisco` },
      { name: "description", content: description },
      { name: "author", content: article.author.name },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: editorialArticle ? "article" : "website" },
      { property: "og:url", content: url },
      { property: "og:site_name", content: "Prisco.me" },
      { property: "og:locale", content: "it_IT" },
      ...(image ? [{ property: "og:image", content: image }] : []),
      ...(image && article.cover?.altText
        ? [{ property: "og:image:alt", content: article.cover.altText }]
        : []),
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:url", content: url },
      { name: "twitter:title", content: title },
      { name: "twitter:description", content: description },
      ...(image ? [{ name: "twitter:image", content: image }] : []),
      ...(image && article.cover?.altText
        ? [{ name: "twitter:image:alt", content: article.cover.altText }]
        : []),
      ...(editorialArticle
        ? [
            { property: "article:author", content: author.url },
            ...(publishedAt ? [{ property: "article:published_time", content: publishedAt }] : []),
            { property: "article:modified_time", content: modifiedAt },
            ...article.categories.map((category) => ({
              property: "article:section",
              content: category.name,
            })),
            ...article.tags.map((tag) => ({
              property: "article:tag",
              content: tag.name,
            })),
          ]
        : []),
      ...(article.noIndex ? [{ name: "robots", content: "noindex,follow" }] : []),
    ],
    links: [{ rel: "canonical", href: url }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "WebPage",
              "@id": webpageId,
              url,
              name: title,
              description,
              inLanguage: "it-IT",
              isPartOf: { "@id": websiteId },
              breadcrumb: { "@id": breadcrumb["@id"] },
              mainEntity: { "@id": workId },
              ...(imageId ? { primaryImageOfPage: { "@id": imageId } } : {}),
              datePublished: publishedAt,
              dateModified: modifiedAt,
            },
            {
              "@type": schemaType,
              "@id": workId,
              url,
              name: article.title,
              ...(editorialArticle ? { headline: article.title } : {}),
              description,
              inLanguage: "it-IT",
              datePublished: publishedAt,
              dateModified: modifiedAt,
              mainEntityOfPage: { "@id": webpageId },
              isPartOf: { "@id": websiteId },
              author,
              creator: author,
              publisher: { "@id": personId },
              copyrightHolder: { "@id": personId },
              ...(imageId ? { image: { "@id": imageId }, thumbnailUrl: image } : {}),
              keywords: article.tags.map((tag) => tag.name),
              about: [...topics, ...(organization ? [organization] : [])],
              ...(organization ? { mentions: organization } : {}),
              ...(editorialArticle
                ? { articleSection: article.categories.map((category) => category.name) }
                : {
                    creditText: article.projectRole ?? undefined,
                    temporalCoverage: article.projectPeriod ?? undefined,
                  }),
            },
            ...(image && imageId
              ? [
                  {
                    "@type": "ImageObject",
                    "@id": imageId,
                    url: image,
                    contentUrl: image,
                    caption: article.cover?.altText ?? undefined,
                  },
                ]
              : []),
            breadcrumb,
          ],
        }),
      },
    ],
  };
}
