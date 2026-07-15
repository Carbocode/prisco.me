import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { listPublishedArticlesByFilter } from "@/features/cms/server/article.service";

const filterSchema = z.object({
  year: z.number().int().min(1970).max(9999).optional(),
  month: z.number().int().min(1).max(12).optional(),
  day: z.number().int().min(1).max(31).optional(),
  categorySlug: z.string().min(1).max(180).optional(),
  authorSlug: z.string().min(1).max(180).optional(),
  tagSlug: z.string().min(1).max(180).optional(),
});

export const listPublishedArticlesByFilterFn = createServerFn({ method: "GET" })
  .validator(filterSchema)
  .handler(({ data }) => listPublishedArticlesByFilter(data));
