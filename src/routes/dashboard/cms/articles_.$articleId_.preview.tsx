import { createFileRoute } from "@tanstack/react-router";

import { Badge } from "@/components/ui/badge";
import { parseCmsDocument } from "@/features/cms/domain/cms-document";
import { renderCmsDocument } from "@/features/cms/editor/render-cms-document";
import { getArticleFn } from "@/features/cms/server/article.functions";
export const Route = createFileRoute("/dashboard/cms/articles_/$articleId_/preview")({
  loader: ({ params }) => getArticleFn({ data: { id: params.articleId } }),
  headers: () => ({ "Cache-Control": "private, no-store" }),
  head: () => ({
    meta: [
      { title: "Anteprima articolo | Prisco.me" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: PreviewPage,
});
function PreviewPage() {
  const article = Route.useLoaderData();
  return (
    <div className="grid gap-6">
      <div>
        <Badge variant="secondary">Anteprima · {article.status}</Badge>
        <h1 className="mt-4 text-3xl font-semibold">{article.title}</h1>
        {article.excerpt ? <p className="mt-2 text-muted-foreground">{article.excerpt}</p> : null}
      </div>
      <article className="prose max-w-3xl space-y-5 dark:prose-invert">
        {renderCmsDocument(parseCmsDocument(article.content))}
      </article>
    </div>
  );
}
