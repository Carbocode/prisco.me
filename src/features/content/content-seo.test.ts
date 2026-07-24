import { describe, expect, it } from "vitest";

import { CATEGORY_SCHEMA_TYPE } from "@/lib/content-category";

import type { ContentArchive } from "./archive";
import type { PublicArticle } from "./content-components";
import { archiveHead, articleHead } from "./content-seo";

describe("content GEO metadata", () => {
  it("espone CollectionPage, ItemList e breadcrumb per gli archivi", () => {
    const archive: ContentArchive = {
      kind: "category",
      slug: "engineering",
      title: "Engineering",
      description: "Articoli di software engineering.",
      eyebrow: "Categoria",
      articles: [article()],
    };

    const graph = jsonLdGraph(archiveHead(archive));
    expect(graph.map((item) => item["@type"])).toEqual([
      "CollectionPage",
      "ItemList",
      "BreadcrumbList",
    ]);
    expect(graph[1]?.numberOfItems).toBe(1);
    expect(graph[2]?.itemListElement).toHaveLength(2);
  });

  it("usa Article per i contenuti editoriali", () => {
    const item = article();
    const graph = jsonLdGraph(
      articleHead(item, "/engineering/architettura", [
        { name: "Engineering", url: "/engineering" },
        { name: item.title, url: "/engineering/architettura" },
      ]),
    );

    const entity = graph.find((entry) => entry["@type"] === "Article");
    expect(entity).toMatchObject({
      headline: item.title,
      datePublished: item.publishedAt?.toISOString(),
      dateModified: item.updatedAt.toISOString(),
      inLanguage: "it-IT",
    });
  });

  it("usa CreativeWork in base alla configurazione DB, indipendentemente dallo slug", () => {
    const item = article({
      categories: [
        {
          name: "Case study",
          slug: "case-study",
          schemaType: CATEGORY_SCHEMA_TYPE.CREATIVE_WORK,
        },
      ],
      projectRole: "Software engineer",
      projectPeriod: "2024–2025",
    });
    const graph = jsonLdGraph(
      articleHead(item, "/case-study/architettura", [
        { name: "Case study", url: "/case-study" },
        { name: item.title, url: "/case-study/architettura" },
      ]),
    );

    expect(graph.find((entry) => entry["@type"] === "CreativeWork")).toMatchObject({
      creditText: "Software engineer",
      temporalCoverage: "2024–2025",
    });
  });
});

function jsonLdGraph(head: ReturnType<typeof archiveHead> | ReturnType<typeof articleHead>) {
  const source = head.scripts[0]?.children;
  if (!source) throw new Error("Missing JSON-LD");
  const document: unknown = JSON.parse(source);
  if (!isRecord(document) || !Array.isArray(document["@graph"]))
    throw new Error("Invalid JSON-LD graph");
  return document["@graph"].filter(isRecord);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function article(overrides: Partial<PublicArticle> = {}): PublicArticle {
  return {
    id: "article-id",
    title: "Architettura applicativa",
    slug: "architettura",
    excerpt: "Una guida pratica.",
    content: '{"type":"doc","content":[]}',
    readingTimeMinutes: 1,
    publishedAt: new Date("2026-02-10T10:00:00Z"),
    updatedAt: new Date("2026-02-12T10:00:00Z"),
    seoTitle: null,
    seoDescription: null,
    canonicalUrl: null,
    noIndex: false,
    projectRole: null,
    projectPeriod: null,
    projectFeatured: false,
    projectSortOrder: 0,
    author: { name: "Vincenzo Prisco", slug: "vincenzo-prisco" },
    organization: null,
    categories: [
      {
        name: "Engineering",
        slug: "engineering",
        schemaType: CATEGORY_SCHEMA_TYPE.ARTICLE,
      },
    ],
    tags: [
      {
        name: "React",
        slug: "react",
        icon: null,
        color: "bg-sky-300/15 text-sky-200",
        mark: null,
        fluentIcon: null,
      },
    ],
    cover: null,
    media: [],
    ...overrides,
  };
}
