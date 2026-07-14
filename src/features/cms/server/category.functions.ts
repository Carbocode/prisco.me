import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";
import { and, asc, eq, isNull } from "drizzle-orm";
import { z } from "zod";

import { getDb } from "@/db";
import { cmsCategories } from "@/db/schema";

import { createCategorySchema, updateCategorySchema } from "../domain/validation";
import { requireCmsPermission } from "./cms-auth";
export const listCategoriesFn = createServerFn({ method: "GET" }).handler(async () => {
  await requireCmsPermission("cmsCategory", "list");
  return getDb(env)
    .select()
    .from(cmsCategories)
    .where(isNull(cmsCategories.deletedAt))
    .orderBy(asc(cmsCategories.name));
});
export const createCategoryFn = createServerFn({ method: "POST" })
  .validator(createCategorySchema)
  .handler(async ({ data }) => {
    await requireCmsPermission("cmsCategory", "create");
    const [item] = await getDb(env).insert(cmsCategories).values(data).returning();
    return item;
  });
export const updateCategoryFn = createServerFn({ method: "POST" })
  .validator(updateCategorySchema)
  .handler(async ({ data }) => {
    await requireCmsPermission("cmsCategory", "update");
    const { id, ...changes } = data;
    const [item] = await getDb(env)
      .update(cmsCategories)
      .set({ ...changes, updatedAt: new Date() })
      .where(and(eq(cmsCategories.id, id), isNull(cmsCategories.deletedAt)))
      .returning();
    return item;
  });
export const archiveCategoryFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    await requireCmsPermission("cmsCategory", "delete");
    await getDb(env)
      .update(cmsCategories)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(eq(cmsCategories.id, data.id));
    return { ok: true };
  });
