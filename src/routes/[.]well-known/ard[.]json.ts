import { createFileRoute } from "@tanstack/react-router";

import { ardManifest } from "@/features/site/domain/ard";

export const Route = createFileRoute("/.well-known/ard.json")({
  server: {
    handlers: {
      GET: () =>
        Response.json(ardManifest, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "public, max-age=3600",
          },
        }),
    },
  },
});
