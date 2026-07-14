import { createFileRoute } from "@tanstack/react-router";

import { ArticleForm } from "@/features/cms/components/article-form";
import { getArticleFn } from "@/features/cms/server/article.functions";
export const Route = createFileRoute("/dashboard/cms/articles_/$articleId")({
  loader: ({ params }) => getArticleFn({ data: { id: params.articleId } }),
  component: () => <ArticleForm article={Route.useLoaderData()} />,
});
