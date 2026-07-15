import { describe, expect, it } from "vitest";

import { CATEGORY_ARCHIVE_SORT, CATEGORY_SCHEMA_TYPE } from "@/lib/content-category";

import { resolveArchive, resolveDateArchive, type PublicCategory } from "./archive";
import type { PublicArticle } from "./content-components";

const categories: PublicCategory[] = [
  {
    name: "Progetti",
    slug: "progetti",
    description: "Portfolio",
    schemaType: CATEGORY_SCHEMA_TYPE.CREATIVE_WORK,
    archiveSort: CATEGORY_ARCHIVE_SORT.MANUAL,
    archiveEyebrow: "Portfolio",
  },
  {
    name: "Engineering",
    slug: "engineering",
    description: null,
    schemaType: CATEGORY_SCHEMA_TYPE.ARTICLE,
    archiveSort: CATEGORY_ARCHIVE_SORT.PUBLISHED_DESC,
    archiveEyebrow: "Categoria",
  },
];

const articles = [
  article({
    slug: "prodotto",
    categories: [
      {
        name: "Progetti",
        slug: "progetti",
        schemaType: CATEGORY_SCHEMA_TYPE.CREATIVE_WORK,
      },
    ],
    tags: [
      {
        name: "React",
        slug: "react",
        icon: null,
        color: "",
        mark: null,
        fluentIcon: null,
      },
    ],
    projectSortOrder: 2,
  }),
  article({
    slug: "appunto",
    categories: [
      {
        name: "Engineering",
        slug: "engineering",
        schemaType: CATEGORY_SCHEMA_TYPE.ARTICLE,
      },
    ],
    publishedAt: new Date("2026-02-10T10:00:00Z"),
    organization: { name: "Egaf", slug: "egaf", type: "company" },
  }),
];

describe("content archive resolver", () => {
  it("espone i contenuti esclusivamente tramite lo slug reale della categoria", () => {
    expect(
      resolveArchive("progetti", articles, categories)?.articles.map((item) => item.slug),
    ).toEqual(["prodotto"]);
    expect(resolveArchive("projects", articles, categories)).toBeNull();
    expect(resolveArchive("blog", articles, categories)).toBeNull();
  });

  it("risolve categoria, anno, autore e tag direttamente dalla root", () => {
    expect(resolveArchive("engineering", articles, categories)?.kind).toBe("category");
    expect(resolveArchive("2026", articles, categories)?.kind).toBe("year");
    expect(resolveArchive("vincenzo-prisco", articles, categories)?.kind).toBe("author");
    expect(resolveArchive("egaf", articles, categories)?.kind).toBe("organization");
    expect(resolveArchive("react", articles, categories)?.kind).toBe("tag");
  });

  it("rifiuta gli archivi root inesistenti", () => {
    expect(resolveArchive("inesistente", articles, categories)).toBeNull();
  });

  it("risolve gli archivi per mese e giorno e riserva ogni root numerica alle date", () => {
    expect(resolveDateArchive("2026", articles, "02")?.articles.map((item) => item.slug)).toEqual([
      "appunto",
    ]);
    expect(resolveDateArchive("2026", articles, "02", "10")?.slug).toBe("2026/02/10");
    expect(resolveDateArchive("2026", articles, "13")).toBeNull();
    expect(
      resolveArchive("123", articles, [
        { ...categories[0], name: "Numerica", slug: "123", description: null },
      ]),
    ).toBeNull();
  });
});

function article(overrides: Partial<PublicArticle>): PublicArticle {
  return {
    id: overrides.slug ?? "article",
    title: "Titolo",
    slug: "article",
    excerpt: null,
    content: '{"type":"doc","content":[]}',
    publishedAt: new Date("2025-01-01T10:00:00Z"),
    updatedAt: new Date("2025-01-02T10:00:00Z"),
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
    categories: [],
    tags: [],
    cover: null,
    media: [],
    ...overrides,
  };
}
