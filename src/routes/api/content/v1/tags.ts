import { createFileRoute } from "@tanstack/react-router";
import { env } from "cloudflare:workers";
import { isNull } from "drizzle-orm";

import { getDb } from "@/db";
import { cmsTags } from "@/db/schema";

export const Route = createFileRoute("/api/content/v1/tags")({
  server: {
    handlers: {
      GET: async () =>
        Response.json(
          await getDb(env)
            .select({
              name: cmsTags.name,
              slug: cmsTags.slug,
              icon: cmsTags.icon,
              color: cmsTags.color,
            })
            .from(cmsTags)
            .where(isNull(cmsTags.deletedAt)),
        ),
    },
  },
});
