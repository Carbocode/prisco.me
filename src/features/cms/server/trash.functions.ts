import { createServerFn } from "@tanstack/react-start";
import { env } from "cloudflare:workers";
import { eq, isNotNull } from "drizzle-orm";
import { z } from "zod";

import { getDb } from "@/db";
import { cmsCategories, cmsTags, cmsOrganizations } from "@/db/schema";
import { roleHasPermission } from "@/lib/cms-permissions";

import { requireCmsPermission, requireSession } from "./cms-auth";

const tables = { category: cmsCategories, tag: cmsTags, organization: cmsOrganizations };
const kindSchema = z.enum(["category", "tag", "organization"]);
export const listTaxonomyTrashFn = createServerFn({ method: "GET" }).handler(async () => {
  const session = await requireSession();
  if (!roleHasPermission(session.user.role, "cmsCategory", "delete")) return [];
  const database = getDb(env);
  const rows = await Promise.all(
    Object.entries(tables).map(async ([kind, table]) => {
      const items = await database
        .select({ id: table.id, name: table.name })
        .from(table)
        .where(isNotNull(table.deletedAt));
      return items.map((item) => ({ ...item, kind: kindSchema.parse(kind) }));
    }),
  );
  return rows.flat();
});
export const restoreTaxonomyFn = createServerFn({ method: "POST" })
  .validator(z.object({ id: z.string().uuid(), kind: kindSchema }))
  .handler(async ({ data }) => {
    await requireCmsPermission(data.kind === "tag" ? "cmsTag" : "cmsCategory", "update");
    const table = tables[data.kind];
    await getDb(env)
      .update(table)
      .set({ deletedAt: null, updatedAt: new Date() })
      .where(eq(table.id, data.id));
    return { ok: true };
  });
