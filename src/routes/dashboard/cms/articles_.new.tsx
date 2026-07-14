import { createFileRoute } from "@tanstack/react-router";

import { ArticleForm } from "@/features/cms/components/article-form";
import { listCategoriesFn } from "@/features/cms/server/category.functions";
import { listMediaFn } from "@/features/cms/server/media.functions";
export const Route = createFileRoute("/dashboard/cms/articles_/new")({
  loader: async () => {
    const [categories, media] = await Promise.all([listCategoriesFn(), listMediaFn()]);
    return { categories, media };
  },
  component: () => {
    const data = Route.useLoaderData();
    return <ArticleForm categories={data.categories} media={data.media} />;
  },
});
