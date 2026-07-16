import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import {
  createArticleSchema,
  listArticlesSchema,
  publishArticleSchema,
  updateArticleSchema,
} from "../domain/validation";
import {
  archiveArticle,
  createArticle,
  getAdminArticle,
  getPreviewArticle,
  listAdminArticles,
  listArticleRevisions,
  publishArticle,
  restoreArticle,
  restoreArticleRevision,
  unpublishArticle,
  updateArticle,
} from "./article.service";

export const listArticlesFn = createServerFn({ method: "GET" })
  .validator(listArticlesSchema)
  .handler(({ data }) => listAdminArticles(data));
export const getArticleFn = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.string().uuid() }))
  .handler(({ data }) => getAdminArticle(data.id));
export const getPreviewArticleFn = createServerFn({ method: "GET" })
  .validator(z.object({ id: z.string().uuid() }))
  .handler(({ data }) => getPreviewArticle(data.id));
export const createArticleFn = createServerFn({ method: "POST" })
  .validator(createArticleSchema)
  .handler(({ data }) => createArticle(data));
export const updateArticleFn = createServerFn({ method: "POST" })
  .validator(updateArticleSchema)
  .handler(({ data }) => updateArticle(data));
export const publishArticleFn = createServerFn({ method: "POST" })
  .validator(publishArticleSchema)
  .handler(({ data }) => publishArticle(data));
export const archiveArticleFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().uuid(), version: z.int().positive() }))
  .handler(({ data }) => archiveArticle(data));
export const unpublishArticleFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().uuid(), version: z.int().positive() }))
  .handler(({ data }) => unpublishArticle(data));
export const restoreArticleFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().uuid(), version: z.int().positive() }))
  .handler(({ data }) => restoreArticle(data));
export const listArticleRevisionsFn = createServerFn({ method: "GET" })
  .validator(z.object({ articleId: z.string().uuid() }))
  .handler(({ data }) => listArticleRevisions(data.articleId));
export const restoreArticleRevisionFn = createServerFn({ method: "POST" })
  .validator(
    z.object({
      articleId: z.string().uuid(),
      revisionId: z.string().uuid(),
      version: z.int().positive(),
    }),
  )
  .handler(({ data }) => restoreArticleRevision(data));
