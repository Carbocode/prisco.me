import { createFileRoute } from "@tanstack/react-router";
import { env } from "cloudflare:workers";
import { isNull } from "drizzle-orm";

import { getDb } from "@/db";
import { cmsCategories } from "@/db/schema";
import { json, jsonError } from "@/features/cms/server/http";
export const Route = createFileRoute("/api/content/v1/categories")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const items = await getDb(env)
            .select({
              name: cmsCategories.name,
              slug: cmsCategories.slug,
              description: cmsCategories.description,
            })
            .from(cmsCategories)
            .where(isNull(cmsCategories.deletedAt));
          return json({ data: items });
        } catch (error) {
          return jsonError(error);
        }
      },
    },
  },
});
