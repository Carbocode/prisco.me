import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { useState } from "react";

import { ArticleCard } from "@/components/article-card";
import { PageShell, Section } from "@/components/page-shell";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { getArticlesQueryOptions } from "@/server/articles";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog | Vincenzo Prisco" },
      {
        name: "description",
        content:
          "Note di Vincenzo Prisco su architettura software, sviluppo web, mobile e product engineering.",
      },
      { property: "og:title", content: "Blog | Vincenzo Prisco" },
      {
        property: "og:description",
        content: "Appunti tecnici e personali dal percorso di un software engineer.",
      },
    ],
    links: [{ rel: "canonical", href: "https://prisco.me/blog" }],
  }),
  component: BlogPage,
});

function BlogPage() {
  const query = useQuery(getArticlesQueryOptions());
  const articles = query.data?.data ?? [];
  const [category, setCategory] = useState("Tutte");
  const categories = [
    "Tutte",
    ...new Set(articles.map((article) => article.category).filter(Boolean)),
  ];
  const filteredArticles =
    category === "Tutte" ? articles : articles.filter((article) => article.category === category);

  return (
    <PageShell
      eyebrow="Dal blog"
      title="Appunti dal percorso."
      description="Scrivo di architettura, sviluppo e delle lezioni che arrivano dal costruire prodotti reali."
    >
      <Section>
        {!query.isLoading && !query.isError && articles.length > 0 && (
          <ToggleGroup
            value={[category]}
            onValueChange={(value) => value[0] && setCategory(value[0])}
            aria-label="Filtra articoli per categoria"
          >
            {categories.map((item) => (
              <ToggleGroupItem key={item} value={item}>
                {item}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        )}
        {query.isLoading && <p className="text-slate-400">Caricamento degli articoli...</p>}
        {query.isError && (
          <Alert variant="destructive">
            <AlertDescription>
              Non riesco a recuperare gli articoli in questo momento.
            </AlertDescription>
            <Button variant="outline" onClick={() => void query.refetch()}>
              Riprova
            </Button>
          </Alert>
        )}
        {!query.isLoading && !query.isError && articles.length === 0 && (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <FileText />
              </EmptyMedia>
              <EmptyTitle>Sto preparando i primi articoli.</EmptyTitle>
              <EmptyDescription>
                Torna presto per leggere note su sviluppo, architettura e prodotti digitali.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredArticles.map((article) => (
            <ArticleCard key={article.documentId ?? article.slug} article={article} />
          ))}
        </div>
      </Section>
    </PageShell>
  );
}
