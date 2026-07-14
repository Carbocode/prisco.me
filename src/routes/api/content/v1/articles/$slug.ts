import { createFileRoute } from "@tanstack/react-router";

import { getPublishedArticleBySlug } from "@/features/cms/server/article.service";
import { json, jsonError } from "@/features/cms/server/http";
export const Route = createFileRoute("/api/content/v1/articles/$slug")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        try {
          const item = await getPublishedArticleBySlug(params.slug);
          if (!item)
            return Response.json(
              { error: { code: "ARTICLE_NOT_FOUND", message: "Article not found" } },
              { status: 404 },
            );
          const {
            authorId: _authorId,
            lastEditedById: _editorId,
            deletedAt: _deletedAt,
            version: _version,
            ...publicItem
          } = item;
          return json({ data: publicItem });
        } catch (error) {
          return jsonError(error);
        }
      },
    },
  },
});
