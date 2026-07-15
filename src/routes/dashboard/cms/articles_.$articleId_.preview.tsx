import { createFileRoute } from "@tanstack/react-router";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { parseCmsDocument } from "@/features/cms/domain/cms-document";
import { renderCmsDocument } from "@/features/cms/editor/render-cms-document";
import { getArticleFn } from "@/features/cms/server/article.functions";
import { listMediaFn } from "@/features/cms/server/media.functions";
export const Route = createFileRoute("/dashboard/cms/articles_/$articleId_/preview")({
  loader: async ({ params }) => {
    const [article, media] = await Promise.all([
      getArticleFn({ data: { id: params.articleId } }),
      listMediaFn(),
    ]);
    return { article, media };
  },
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
  const { article, media } = Route.useLoaderData();
  return (
    <div className="flex flex-col gap-4">
      <Alert>
        <AlertTitle>Anteprima privata · {article.status}</AlertTitle>
        <AlertDescription>
          Questa pagina mostra il contenuto salvato e non è indicizzata.
        </AlertDescription>
      </Alert>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">{article.title}</CardTitle>
          {article.excerpt ? <p className="text-muted-foreground">{article.excerpt}</p> : null}
        </CardHeader>
        <CardContent>
          <article className="prose max-w-3xl dark:prose-invert">
            {renderCmsDocument(
              parseCmsDocument(article.content),
              new Map(media.map((item) => [item.id, item])),
            )}
          </article>
        </CardContent>
      </Card>
    </div>
  );
}
