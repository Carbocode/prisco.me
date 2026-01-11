import { createFileRoute, Link } from "@tanstack/react-router";
import Header from "@/components/header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { getArticleBySlugQueryOptions } from "@/server/articles";

type ArticleDetail = {
  documentId?: string;
  title?: string;
  slug?: string;
  excerpt?: string;
  description?: string;
  content?: string;
  body?: string;
  publishedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown;
};

export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ context, params }) => {
    return context.queryClient.ensureQueryData(
      getArticleBySlugQueryOptions(params.slug),
    );
  },
  component: ArticleDetailPage,
});

function ArticleDetailPage() {
  const article = Route.useLoaderData() as ArticleDetail | null;

  if (!article) {
    return (
      <div className="bg-slate-950 text-white">
        <Header />
        <main className="mx-auto flex w-full max-w-4xl flex-col gap-8 px-6 pb-16 pt-28 lg:px-12">
          <Alert className="border border-white/10 bg-white/5 text-white">
            <AlertTitle>Articolo non trovato</AlertTitle>
            <AlertDescription className="text-white/70">
              L'articolo richiesto non esiste o non e disponibile.
            </AlertDescription>
          </Alert>
          <Button className="w-fit bg-white text-slate-900 hover:bg-white/90">
            <Link to="/blog">Torna al blog</Link>
          </Button>
        </main>
      </div>
    );
  }

  const title = article.title ?? article.slug ?? "Articolo";
  const description =
    article.excerpt ?? article.description ?? "Descrizione non disponibile.";
  const content = article.content ?? article.body ?? "";
  const date = article.publishedAt ?? article.createdAt;

  return (
    <div className="bg-slate-950 text-white">
      <Header />

      <main className="mx-auto flex w-full max-w-4xl flex-col gap-10 px-6 pb-16 pt-28 lg:px-12">
        <section className="flex flex-col gap-5">
          <Badge
            variant="secondary"
            className="w-fit border border-white/15 bg-white/10 text-white/70"
          >
            Diario dal laboratorio
          </Badge>
          <div className="flex flex-col gap-3">
            <p className="text-xs uppercase tracking-[0.4em] text-white/40">
              {date
                ? new Date(date).toLocaleDateString("it-IT", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })
                : "In bozza"}
            </p>
            <h1 className="display-font text-4xl font-semibold tracking-tight sm:text-5xl">
              {title}
            </h1>
            <p className="text-base text-white/70 sm:text-lg">{description}</p>
          </div>
          <div>
            <Button className="bg-white text-slate-900 hover:bg-white/90">
              <Link to="/blog">Torna al blog</Link>
            </Button>
          </div>
        </section>

        <Separator className="bg-white/10" />

        {content && (
          <section className="text-base text-white/80 leading-relaxed whitespace-pre-wrap">
            {content}
          </section>
        )}

        <Card className="border border-white/10 bg-white/5 text-white">
          <CardHeader>
            <CardTitle className="text-lg">Dettagli articolo</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap break-words text-xs text-white/70">
              {JSON.stringify(article, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
