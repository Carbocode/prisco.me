import { createFileRoute } from "@tanstack/react-router";

import { ArticleForm } from "@/features/cms/components/article-form";
import { getArticleFn, listArticleRevisionsFn } from "@/features/cms/server/article.functions";
import { listCategoriesFn } from "@/features/cms/server/category.functions";
import { listMediaFn } from "@/features/cms/server/media.functions";
import { listOrganizationsFn } from "@/features/cms/server/organization.functions";
import { listTagsFn } from "@/features/cms/server/tag.functions";
export const Route = createFileRoute("/dashboard/cms/articles_/$articleId")({
  loader: async ({ params }) => {
    const [article, categories, tags, organizations, media, revisions] = await Promise.all([
      getArticleFn({ data: { id: params.articleId } }),
      listCategoriesFn(),
      listTagsFn(),
      listOrganizationsFn(),
      listMediaFn(),
      listArticleRevisionsFn({ data: { articleId: params.articleId } }),
    ]);
    return { article, categories, tags, organizations, media, revisions };
  },
  component: () => {
    const data = Route.useLoaderData();
    return (
      <ArticleForm
        article={data.article}
        categories={data.categories}
        tags={data.tags}
        organizations={data.organizations}
        media={data.media}
        revisions={data.revisions}
      />
    );
  },
});
