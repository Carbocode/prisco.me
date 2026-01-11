import { createFileRoute, Link } from "@tanstack/react-router";
import { ArticleCard, type ArticleItem } from "@/components/article-card";
import Header from "@/components/header";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { getArticlesQueryOptions } from "@/server/articles";

export const Route = createFileRoute("/blog")({
  loader: async ({ context }) => {
    return context.queryClient.ensureQueryData(getArticlesQueryOptions());
  },
  component: BlogPage,
});

function BlogPage() {
  const data = Route.useLoaderData();

  const items = (data?.data ?? []) as ArticleItem[];

  return (
    <>
      <Header />

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-6 pb-16 pt-28 lg:px-12">
        <section className="flex flex-col gap-5">
          <Badge
            variant="secondary"
            className="w-fit border border-white/15 bg-white/10 text-white/70"
          >
            Diario dal laboratorio
          </Badge>
          <div className="flex flex-col gap-3">
            <span className="display-font text-4xl font-semibold tracking-tight sm:text-5xl">
              Penso, quindi sono
            </span>
            <span className="max-w-2xl text-base text-white/70 sm:text-lg">
              Riflessioni, approfondimenti e storie che vorrei condividere
            </span>
          </div>
          <div>
            <Button className="bg-white text-slate-900 hover:bg-white/90">
              <Link to="/">Torna alla home</Link>
            </Button>
          </div>
        </section>

        <Separator className="bg-white/10" />

        <section className="grid gap-6 md:grid-cols-2">
          {items.length === 0 && (
            <Alert className="col-span-full border border-white/10 bg-white/5 text-white">
              <AlertTitle>Nessun articolo disponibile</AlertTitle>
              <AlertDescription className="text-white/70">
                Nessun articolo disponibile al momento.
              </AlertDescription>
            </Alert>
          )}
          {items.map((article) => (
            <ArticleCard
              key={article.documentId ?? article.title ?? article.slug}
              article={article}
            />
          ))}
        </section>
      </div>
    </>
  );
}
