import { createFileRoute } from "@tanstack/react-router";

import { json, jsonError } from "@/features/cms/server/http";
import { getPublishedServiceBySlug } from "@/features/cms/server/service.service";
export const Route = createFileRoute("/api/content/v1/services/$slug")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        try {
          const item = await getPublishedServiceBySlug(params.slug);
          if (!item)
            return Response.json(
              { error: { code: "SERVICE_NOT_FOUND", message: "Service not found" } },
              { status: 404 },
            );
          const {
            createdById: _creator,
            lastEditedById: _editor,
            deletedAt: _deleted,
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
