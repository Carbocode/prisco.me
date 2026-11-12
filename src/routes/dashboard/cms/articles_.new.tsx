import { createFileRoute } from "@tanstack/react-router";

import { ArticleForm } from "@/features/cms/components/article-form";
import { listArticleExperiencesFn } from "@/features/cms/server/article.functions";
import { listCategoriesFn } from "@/features/cms/server/category.functions";
import { listMediaFn } from "@/features/cms/server/media.functions";
import { listOrganizationsFn } from "@/features/cms/server/organization.functions";
import { listTagsFn } from "@/features/cms/server/tag.functions";
export const Route = createFileRoute("/dashboard/cms/articles_/new")({
  loader: async () => {
    const [categories, tags, organizations, media, experiences] = await Promise.all([
      listCategoriesFn(),
      listTagsFn(),
      listOrganizationsFn(),
      listMediaFn(),
      listArticleExperiencesFn(),
    ]);
    return { categories, tags, organizations, media, experiences };
  },
  component: () => {
    const data = Route.useLoaderData();
    return (
      <ArticleForm
        categories={data.categories}
        tags={data.tags}
        experiences={data.experiences}
        organizations={data.organizations}
        media={data.media}
      />
    );
  },
});
