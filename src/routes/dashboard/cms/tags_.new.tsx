import { createFileRoute } from "@tanstack/react-router";

import { CreateTagPage } from "@/features/cms/pages/tags-create-page";
import { listCategoryOptionsFn } from "@/features/cms/server/category.functions";
export const Route = createFileRoute("/dashboard/cms/tags_/new")({
  loader: async () => ({ categories: await listCategoryOptionsFn() }),
  component: CreateTagPage,
});
