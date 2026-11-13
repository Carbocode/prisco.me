import { createFileRoute } from "@tanstack/react-router";

import { MediaContent } from "@/features/cms/pages/media-page";
import { listMediaFn, listTrashedMediaFn } from "@/features/cms/server/media.functions";

export const Route = createFileRoute("/dashboard/cms/media")({
  loader: async () => ({ media: await listMediaFn(), trash: await listTrashedMediaFn() }),
  component: MediaContent,
});
