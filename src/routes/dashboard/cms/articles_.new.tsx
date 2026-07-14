import { createFileRoute } from "@tanstack/react-router";

import { ArticleForm } from "@/features/cms/components/article-form";
export const Route = createFileRoute("/dashboard/cms/articles_/new")({
  component: () => <ArticleForm />,
});
