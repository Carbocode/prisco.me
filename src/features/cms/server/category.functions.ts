import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";
import { and, asc, count, eq, isNull, isNotNull } from "drizzle-orm";
import { z } from "zod";

import { getDb } from "@/db";
import { cmsCategories, cmsMedia } from "@/db/schema";

import { listSearchSchema } from "../domain/list-search";
import { createCategorySchema, updateCategorySchema } from "../domain/validation";
import { requireCmsPermission } from "./cms-auth";
import { listOrder, listTextFilter, listPage } from "./list-query";
async function assertHeroImage(heroMediaId: string | null | undefined) {
  if (!heroMediaId) return;
  const media = await getDb(env).query.cmsMedia.findFirst({
    columns: { mimeType: true },
    where: and(eq(cmsMedia.id, heroMediaId), isNull(cmsMedia.deletedAt)),
  });
  if (!media?.mimeType.startsWith("image/")) {
    throw new Error("Seleziona un’immagine valida dalla libreria media");
  }
}
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
    await assertHeroImage(data.heroMediaId);
    const [item] = await getDb(env).insert(cmsCategories).values(data).returning();
    return item;
  });
export const updateCategoryFn = createServerFn({ method: "POST" })
  .validator(updateCategorySchema)
  .handler(async ({ data }) => {
    await requireCmsPermission("cmsCategory", "update");
    await assertHeroImage(data.heroMediaId);
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

export const listCategoriesPageFn = createServerFn({ method: "GET" })
  .validator(listSearchSchema)
  .handler(async ({ data }) => {
    await requireCmsPermission("cmsCategory", data.scope === "trash" ? "delete" : "list");
    const database = getDb(env);
    const where = and(
      data.scope === "trash" ? isNotNull(cmsCategories.deletedAt) : isNull(cmsCategories.deletedAt),
      listTextFilter(data.query, cmsCategories.name, cmsCategories.slug),
    );
    const [totalRow] = await database.select({ value: count() }).from(cmsCategories).where(where);
    const total = totalRow?.value ?? 0;
    const page = listPage(data.page, data.pageSize, total);
    const items = await database
      .select()
      .from(cmsCategories)
      .where(where)
      .orderBy(
        listOrder(
          {
            name: cmsCategories.name,
            slug: cmsCategories.slug,
            schemaType: cmsCategories.schemaType,
            articleLayout: cmsCategories.articleLayout,
            updatedAt: cmsCategories.updatedAt,
          },
          data.sortBy,
          data.direction,
          cmsCategories.name,
        ),
        asc(cmsCategories.id),
      )
      .limit(data.pageSize)
      .offset((page - 1) * data.pageSize);
    return { items, total, page, pageSize: data.pageSize };
  });

export const listCategoryOptionsFn = createServerFn({ method: "GET" }).handler(async () => {
  await requireCmsPermission("cmsCategory", "list");
  return getDb(env)
    .select({ id: cmsCategories.id, name: cmsCategories.name })
    .from(cmsCategories)
    .where(isNull(cmsCategories.deletedAt))
    .orderBy(asc(cmsCategories.name));
});
