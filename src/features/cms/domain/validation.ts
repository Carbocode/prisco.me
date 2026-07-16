import { z } from "zod";

import {
  categoryArchiveSorts,
  categorySchemaTypes,
  defaultCategoryConfig,
} from "@/lib/content-category";

import { cmsDocumentSchema } from "./cms-document";
import { slugPattern } from "./slug";

const nullableText = (max: number) => z.string().trim().max(max).nullable().optional();
const slug = z
  .string()
  .trim()
  .min(3)
  .max(180)
  .regex(slugPattern, "Slug non valido")
  .refine((value) => !/^\d+$/.test(value), "Lo slug non puo essere composto solo da numeri");
const articleSlug = slug.refine(
  (value) => !["authors", "categories", "tags"].includes(value),
  "Slug riservato al routing pubblico",
);
const webUrl = z
  .string()
  .trim()
  .url()
  .refine((value) => ["http:", "https:"].includes(new URL(value).protocol));
const seoContent = {
  content: cmsDocumentSchema,
  seoTitle: nullableText(70),
  seoDescription: nullableText(180),
  noIndex: z.boolean().optional(),
};

export const createArticleSchema = z.object({
  title: z.string().trim().min(3).max(160),
  slug: articleSlug,
  excerpt: nullableText(320),
  ...seoContent,
  coverMediaId: z.string().uuid().nullable().optional(),
  organizationId: z.string().uuid().nullable().optional(),
  projectRole: nullableText(160),
  projectPeriod: nullableText(160),
  projectFeatured: z.boolean().optional(),
  projectSortOrder: z.int().min(-10000).max(10000).optional(),
  categoryIds: z.array(z.string().uuid()).length(1, "Seleziona una sola categoria"),
  tagIds: z.array(z.string().uuid()).max(50).default([]),
});
export const updateArticleSchema = createArticleSchema
  .partial()
  .extend({ id: z.string().uuid(), version: z.int().positive() });
export const publishArticleSchema = z.object({
  id: z.string().uuid(),
  version: z.int().positive(),
  publishedAt: z.coerce.date().optional(),
});
export const listArticlesSchema = z.object({
  page: z.int().positive().default(1),
  pageSize: z.int().min(1).max(100).default(20),
  query: z.string().trim().max(160).optional(),
  status: z.enum(["draft", "scheduled", "published", "archived"]).optional(),
  categoryId: z.string().uuid().optional(),
  authorId: z.string().uuid().optional(),
  dateFrom: z.coerce.date().optional(),
  dateTo: z.coerce.date().optional(),
});

export const createCategorySchema = z.object({
  name: z.string().trim().min(2).max(100),
  slug,
  description: nullableText(320),
  schemaType: z.enum(categorySchemaTypes).default(defaultCategoryConfig.schemaType),
  archiveSort: z.enum(categoryArchiveSorts).default(defaultCategoryConfig.archiveSort),
  archiveEyebrow: z.string().trim().min(2).max(80).default(defaultCategoryConfig.archiveEyebrow),
  heroMediaId: z.string().uuid().nullable().optional(),
});
export const updateCategorySchema = createCategorySchema
  .partial()
  .extend({ id: z.string().uuid() });
export const createTagSchema = z.object({
  name: z.string().trim().min(2).max(100),
  slug,
  categoryId: z.string().uuid(),
  icon: nullableText(80),
  color: z.string().trim().min(1).max(160),
  mark: nullableText(20),
  fluentIcon: nullableText(80),
});
export const updateTagSchema = createTagSchema.partial().extend({ id: z.string().uuid() });

export const createOrganizationSchema = z.object({
  name: z.string().trim().min(2).max(160),
  slug,
  type: z.enum(["company", "education"]),
  description: nullableText(320),
  websiteUrl: z.union([webUrl, z.null()]).optional(),
});
export const updateOrganizationSchema = createOrganizationSchema
  .partial()
  .extend({ id: z.string().uuid() });

export type CreateArticleInput = z.infer<typeof createArticleSchema>;
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;
