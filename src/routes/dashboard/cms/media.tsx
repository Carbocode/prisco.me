import { createFileRoute } from "@tanstack/react-router";

import { listSearchSchema } from "@/features/cms/domain/list-search";
import { MediaContent } from "@/features/cms/pages/media-page";
import { listMediaPageFn } from "@/features/cms/server/media.functions";
export const Route = createFileRoute("/dashboard/cms/media")({
  validateSearch: listSearchSchema.extend({
    sortBy: listSearchSchema.shape.sortBy.default("createdAt"),
    direction: listSearchSchema.shape.direction.default("desc"),
  }),
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => ({ result: await listMediaPageFn({ data: deps }) }),
  component: MediaContent,
});
