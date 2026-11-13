import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";
import { and, asc, count, eq, isNull, isNotNull } from "drizzle-orm";
import { z } from "zod";

import { getDb } from "@/db";
import { cmsOrganizations } from "@/db/schema";

import { listSearchSchema } from "../domain/list-search";
import { createOrganizationSchema, updateOrganizationSchema } from "../domain/validation";
import { requireCmsPermission } from "./cms-auth";
import { listOrder, listTextFilter, listPage } from "./list-query";

export const listOrganizationsFn = createServerFn({ method: "GET" }).handler(async () => {
  await requireCmsPermission("cmsCategory", "list");
  return getDb(env)
    .select()
    .from(cmsOrganizations)
    .where(isNull(cmsOrganizations.deletedAt))
    .orderBy(asc(cmsOrganizations.type), asc(cmsOrganizations.name));
});

export const createOrganizationFn = createServerFn({ method: "POST" })
  .validator(createOrganizationSchema)
  .handler(async ({ data }) => {
    await requireCmsPermission("cmsCategory", "create");
    return (await getDb(env).insert(cmsOrganizations).values(data).returning())[0];
  });

export const updateOrganizationFn = createServerFn({ method: "POST" })
  .validator(updateOrganizationSchema)
  .handler(async ({ data }) => {
    await requireCmsPermission("cmsCategory", "update");
    const { id, ...changes } = data;
    return (
      await getDb(env)
        .update(cmsOrganizations)
        .set({ ...changes, updatedAt: new Date() })
        .where(and(eq(cmsOrganizations.id, id), isNull(cmsOrganizations.deletedAt)))
        .returning()
    )[0];
  });

export const archiveOrganizationFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().uuid() }))
  .handler(async ({ data }) => {
    await requireCmsPermission("cmsCategory", "delete");
    await getDb(env)
      .update(cmsOrganizations)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(eq(cmsOrganizations.id, data.id));
    return { ok: true };
  });

export const listOrganizationsPageFn = createServerFn({ method: "GET" })
  .validator(listSearchSchema)
  .handler(async ({ data }) => {
    await requireCmsPermission("cmsCategory", data.scope === "trash" ? "delete" : "list");
    const database = getDb(env);
    const where = and(
      data.scope === "trash"
        ? isNotNull(cmsOrganizations.deletedAt)
        : isNull(cmsOrganizations.deletedAt),
      listTextFilter(data.query, cmsOrganizations.name, cmsOrganizations.slug),
      data.kind && ["company", "education"].includes(data.kind)
        ? eq(cmsOrganizations.type, data.kind)
        : undefined,
    );
    const [totalRow] = await database
      .select({ value: count() })
      .from(cmsOrganizations)
      .where(where);
    const total = totalRow?.value ?? 0;
    const page = listPage(data.page, data.pageSize, total);
    const items = await database
      .select()
      .from(cmsOrganizations)
      .where(where)
      .orderBy(
        listOrder(
          {
            name: cmsOrganizations.name,
            slug: cmsOrganizations.slug,
            type: cmsOrganizations.type,
            updatedAt: cmsOrganizations.updatedAt,
          },
          data.sortBy,
          data.direction,
          cmsOrganizations.name,
        ),
        asc(cmsOrganizations.id),
      )
      .limit(data.pageSize)
      .offset((page - 1) * data.pageSize);
    return { items, total, page, pageSize: data.pageSize };
  });
