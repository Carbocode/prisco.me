import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";
import { and, asc, eq, isNull } from "drizzle-orm";
import { z } from "zod";

import { getDb } from "@/db";
import { cmsCategories, cmsTags } from "@/db/schema";

import { createTagSchema, updateTagSchema } from "../domain/validation";
import { requireCmsPermission } from "./cms-auth";

export const listTagsFn = createServerFn({ method: "GET" }).handler(async () => {
  await requireCmsPermission("cmsTag", "list");
  return getDb(env)
    .select({
      id: cmsTags.id,
      name: cmsTags.name,
      slug: cmsTags.slug,
      categoryId: cmsTags.categoryId,
      categoryName: cmsCategories.name,
      icon: cmsTags.icon,
      color: cmsTags.color,
      mark: cmsTags.mark,
      fluentIcon: cmsTags.fluentIcon,
      createdAt: cmsTags.createdAt,
      updatedAt: cmsTags.updatedAt,
    })
    .from(cmsTags)
    .innerJoin(cmsCategories, eq(cmsTags.categoryId, cmsCategories.id))
    .where(isNull(cmsTags.deletedAt))
    .orderBy(asc(cmsCategories.name), asc(cmsTags.name));
});
export const createTagFn = createServerFn({ method: "POST" })
  .validator(createTagSchema)
  .handler(async ({ data }) => {
    await requireCmsPermission("cmsTag", "create");
    return (await getDb(env).insert(cmsTags).values(data).returning())[0];
  });
export const updateTagFn = createServerFn({ method: "POST" })
  .validator(updateTagSchema)
  .handler(async ({ data }) => {
    await requireCmsPermission("cmsTag", "update");
    const { id, ...changes } = data;
    return (
      await getDb(env)
        .update(cmsTags)
        .set({ ...changes, updatedAt: new Date() })
        .where(and(eq(cmsTags.id, id), isNull(cmsTags.deletedAt)))
        .returning()
    )[0];
  });
export const archiveTagFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    await requireCmsPermission("cmsTag", "delete");
    await getDb(env)
      .update(cmsTags)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(eq(cmsTags.id, data.id));
    return { ok: true };
  });
