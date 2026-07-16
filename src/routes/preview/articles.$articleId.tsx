import { createFileRoute, notFound } from "@tanstack/react-router";

import { getPreviewArticleFn } from "@/features/cms/server/article.functions";
import { ArticlePageContent } from "@/features/content/content-components";

export const Route = createFileRoute("/preview/articles/$articleId")({
  loader: async ({ params }) => {
    const article = await getPreviewArticleFn({ data: { id: params.articleId } });
    if (!article) throw notFound();
    return article;
  },
  headers: () => ({ "Cache-Control": "private, no-store" }),
  head: ({ loaderData }) => ({
    meta: [
      { title: `${loaderData?.title ?? "Articolo"} · Anteprima privata | Prisco.me` },
      { name: "robots", content: "noindex, nofollow, noarchive" },
    ],
  }),
  component: PreviewArticlePage,
});

function PreviewArticlePage() {
  const article = Route.useLoaderData();
  const category = article.categories[0];
  const archiveUrl = category ? `/${category.slug}` : "/";

  return (
    <ArticlePageContent
      article={article}
      crumbs={[
        { name: category?.name ?? "Contenuti", url: archiveUrl },
        { name: article.title, url: `${archiveUrl}/${article.slug}` },
      ]}
    />
  );
}
