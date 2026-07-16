import { createFileRoute } from "@tanstack/react-router";
import { env } from "cloudflare:workers";
import { and, eq, isNull } from "drizzle-orm";

import { getDb } from "@/db";
import { cmsCategories, cmsMedia } from "@/db/schema";
import { mediaDeliveryBaseUrl, mediaUrl } from "@/features/cms/domain/media";
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
              heroStorageKey: cmsMedia.storageKey,
              heroAltText: cmsMedia.altText,
            })
            .from(cmsCategories)
            .leftJoin(
              cmsMedia,
              and(eq(cmsCategories.heroMediaId, cmsMedia.id), isNull(cmsMedia.deletedAt)),
            )
            .where(isNull(cmsCategories.deletedAt));
          const baseUrl = mediaDeliveryBaseUrl(import.meta.env.MODE, env.MEDIA_PUBLIC_URL);
          return json({
            data: items.map(({ heroStorageKey, heroAltText, ...category }) => ({
              ...category,
              hero: heroStorageKey
                ? { url: mediaUrl(baseUrl, heroStorageKey), altText: heroAltText }
                : null,
            })),
          });
        } catch (error) {
          return jsonError(error);
        }
      },
    },
  },
});
