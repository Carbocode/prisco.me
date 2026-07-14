import { createFileRoute } from "@tanstack/react-router";

import { json, jsonError } from "@/features/cms/server/http";
import { listPublishedServices } from "@/features/cms/server/service.service";
export const Route = createFileRoute("/api/content/v1/services/")({
  server: {
    handlers: {
      GET: async () => {
        try {
          const items = await listPublishedServices();
          return json({
            data: items.map(
              ({
                createdById: _creator,
                lastEditedById: _editor,
                deletedAt: _deleted,
                version: _version,
                ...item
              }) => item,
            ),
          });
        } catch (error) {
          return jsonError(error);
        }
      },
    },
  },
});
