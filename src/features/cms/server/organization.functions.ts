import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";
import { and, asc, eq, isNull } from "drizzle-orm";
import { z } from "zod";

import { getDb } from "@/db";
import { cmsOrganizations } from "@/db/schema";

import { createOrganizationSchema, updateOrganizationSchema } from "../domain/validation";
import { requireCmsPermission } from "./cms-auth";

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
