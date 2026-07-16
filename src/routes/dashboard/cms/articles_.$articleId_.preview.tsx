import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard/cms/articles_/$articleId_/preview")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/preview/articles/$articleId",
      params: { articleId: params.articleId },
    });
  },
});
