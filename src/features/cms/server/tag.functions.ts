import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";
import { and, asc, count, eq, isNull, isNotNull } from "drizzle-orm";
import { z } from "zod";

import { getDb } from "@/db";
import { cmsCategories, cmsTags } from "@/db/schema";

import { listSearchSchema } from "../domain/list-search";
import { createTagSchema, updateTagSchema } from "../domain/validation";
import { requireCmsPermission } from "./cms-auth";
import { listOrder, listTextFilter, listPage } from "./list-query";

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
      marqueeRow: cmsTags.marqueeRow,
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

export const listTagsPageFn = createServerFn({ method: "GET" })
  .validator(listSearchSchema)
  .handler(async ({ data }) => {
    await requireCmsPermission("cmsTag", data.scope === "trash" ? "delete" : "list");
    const database = getDb(env);
    const where = and(
      data.scope === "trash" ? isNotNull(cmsTags.deletedAt) : isNull(cmsTags.deletedAt),
      data.scope === "trash" ? undefined : isNull(cmsCategories.deletedAt),
      data.categoryId ? eq(cmsTags.categoryId, data.categoryId) : undefined,
      listTextFilter(data.query, cmsTags.name, cmsTags.slug, cmsTags.icon),
    );
    const [totalRow] = await database
      .select({ value: count() })
      .from(cmsTags)
      .innerJoin(cmsCategories, eq(cmsTags.categoryId, cmsCategories.id))
      .where(where);
    const total = totalRow?.value ?? 0;
    const page = listPage(data.page, data.pageSize, total);
    const items = await database
      .select({
        id: cmsTags.id,
        name: cmsTags.name,
        slug: cmsTags.slug,
        categoryId: cmsTags.categoryId,
        categoryName: cmsCategories.name,
        icon: cmsTags.icon,
        color: cmsTags.color,
        marqueeRow: cmsTags.marqueeRow,
      })
      .from(cmsTags)
      .innerJoin(cmsCategories, eq(cmsTags.categoryId, cmsCategories.id))
      .where(where)
      .orderBy(
        listOrder(
          {
            name: cmsTags.name,
            slug: cmsTags.slug,
            categoryName: cmsCategories.name,
            icon: cmsTags.icon,
          },
          data.sortBy,
          data.direction,
          cmsTags.name,
        ),
        asc(cmsTags.id),
      )
      .limit(data.pageSize)
      .offset((page - 1) * data.pageSize);
    return { items, total, page, pageSize: data.pageSize };
  });
