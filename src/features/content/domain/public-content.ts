import type { CategorySchemaType } from "@/features/content/domain/content-category";

export type PublicArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  readingTimeMinutes: number;
  publishedAt: Date | null;
  updatedAt: Date;
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl: string | null;
  noIndex: boolean;
  projectRole: string | null;
  projectPeriod: string | null;
  projectFeatured: boolean;
  projectSortOrder: number;
  author: { name: string; slug: string };
  organization: { name: string; slug: string; type: string } | null;
  categories: Array<{ name: string; slug: string; schemaType: CategorySchemaType }>;
  tags: Array<{
    name: string;
    slug: string;
    icon: string | null;
    color: string;
    mark: string | null;
    fluentIcon: string | null;
  }>;
  cover: { url: string; altText: string | null } | null;
  media: Array<{ id: string; url: string; altText: string | null; caption: string | null }>;
};

export type ContentCrumb = { name: string; url: string };
