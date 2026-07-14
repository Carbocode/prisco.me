import { createFileRoute } from "@tanstack/react-router";

import { listPublishedArticlesPage } from "@/features/cms/server/article.service";
import { json, jsonError } from "@/features/cms/server/http";
export const Route = createFileRoute("/api/content/v1/articles/")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        try {
          const url = new URL(request.url);
          const limit = Math.min(Math.max(Number(url.searchParams.get("limit")) || 20, 1), 50);
          const page = await listPublishedArticlesPage(
            limit,
            url.searchParams.get("cursor") ?? undefined,
          );
          return json({
            data: page.items.map(({ id: _id, ...item }) => item),
            pagination: { nextCursor: page.nextCursor },
          });
        } catch (error) {
          return jsonError(error);
        }
      },
    },
  },
});
