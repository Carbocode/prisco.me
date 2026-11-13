import { z } from "zod";

export const listSearchSchema = z.object({
  scope: z.enum(["active", "trash"]).default("active").catch("active"),
  page: z.coerce.number().int().min(1).max(100000).default(1).catch(1),
  pageSize: z.coerce
    .number()
    .pipe(z.union([z.literal(10), z.literal(20), z.literal(50)]))
    .default(20)
    .catch(20),
  query: z.string().trim().max(160).optional().catch(undefined),
  sortBy: z.string().max(40).default("name").catch("name"),
  direction: z.enum(["asc", "desc"]).default("asc").catch("asc"),
  categoryId: z.string().uuid().optional().catch(undefined),
  kind: z
    .enum(["image", "video", "audio", "file", "company", "education"])
    .optional()
    .catch(undefined),
});
export type ListSearch = z.infer<typeof listSearchSchema>;
