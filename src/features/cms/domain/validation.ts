import { z } from "zod";

import { cmsDocumentSchema } from "./cms-document";
import { slugPattern } from "./slug";

const nullableText = (max: number) => z.string().trim().max(max).nullable().optional();
const slug = z.string().trim().min(3).max(180).regex(slugPattern, "Slug non valido");
const webUrl = z
  .string()
  .trim()
  .url()
  .refine((value) => ["http:", "https:"].includes(new URL(value).protocol));
const canonicalUrl = z.union([webUrl, z.null()]).optional();
const baseContent = {
  content: cmsDocumentSchema,
  seoTitle: nullableText(70),
  seoDescription: nullableText(180),
  canonicalUrl,
  noIndex: z.boolean().optional(),
};

export const createArticleSchema = z.object({
  title: z.string().trim().min(3).max(160),
  slug,
  excerpt: nullableText(320),
  ...baseContent,
  coverMediaId: z.string().uuid().nullable().optional(),
  categoryIds: z.array(z.string().uuid()).max(20).default([]),
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
});

const ctaUrl = z
  .string()
  .trim()
  .refine((value) => {
    if (value.startsWith("/")) return !value.startsWith("//");
    try {
      return ["http:", "https:"].includes(new URL(value).protocol);
    } catch {
      return false;
    }
  }, "URL CTA non valido");
export const createServiceSchema = z.object({
  name: z.string().trim().min(3).max(160),
  slug,
  shortDescription: nullableText(320),
  ...baseContent,
  imageMediaId: z.string().uuid().nullable().optional(),
  icon: nullableText(80),
  priceLabel: nullableText(80),
  callToActionLabel: nullableText(100),
  callToActionUrl: z.union([ctaUrl, z.null()]).optional(),
  sortOrder: z.int().min(-10000).max(10000).default(0),
});
export const updateServiceSchema = createServiceSchema
  .partial()
  .extend({ id: z.string().uuid(), version: z.int().positive() });
export const createCategorySchema = z.object({
  name: z.string().trim().min(2).max(100),
  slug,
  description: nullableText(320),
});
export const updateCategorySchema = createCategorySchema
  .partial()
  .extend({ id: z.string().uuid() });

export type CreateArticleInput = z.infer<typeof createArticleSchema>;
export type UpdateArticleInput = z.infer<typeof updateArticleSchema>;
export type CreateServiceInput = z.infer<typeof createServiceSchema>;
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>;
