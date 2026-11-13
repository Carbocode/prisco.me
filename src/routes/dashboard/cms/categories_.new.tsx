import { createFileRoute } from "@tanstack/react-router";

import type { MediaPickerItem } from "@/features/cms/components/media-picker";
import { CreateCategoryPage } from "@/features/cms/pages/categories-create-page";
export const Route = createFileRoute("/dashboard/cms/categories_/new")({
  loader: () => ({ media: [] as MediaPickerItem[] }),
  component: CreateCategoryPage,
});
