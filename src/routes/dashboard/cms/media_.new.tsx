import { createFileRoute } from "@tanstack/react-router";

import { UploadMediaPage } from "@/features/cms/pages/media-create-page";
export const Route = createFileRoute("/dashboard/cms/media_/new")({ component: UploadMediaPage });
