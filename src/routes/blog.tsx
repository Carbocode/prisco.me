import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { FileText } from "lucide-react";
import { useState } from "react";

import { ArticleCard } from "@/components/article-card";
import { PageShell, Section } from "@/components/page-shell";
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
          <div className="mb-8 flex flex-wrap gap-2" aria-label="Filtra articoli per categoria">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                aria-pressed={category === item}
                onClick={() => setCategory(item)}
                className={`rounded-full border px-4 py-2 text-sm transition ${category === item ? "border-sky-300 bg-sky-300/15 text-sky-200" : "border-white/15 text-slate-400 hover:border-white/30 hover:text-white"}`}
              >
                {item}
              </button>
            ))}
          </div>
        )}
        {query.isLoading && <p className="text-slate-400">Caricamento degli articoli...</p>}
        {query.isError && (
          <div className="rounded-2xl border border-red-300/20 bg-red-300/10 p-6 text-red-100">
            <p>Non riesco a recuperare gli articoli in questo momento.</p>
            <button
              type="button"
              className="mt-4 text-sm font-semibold underline"
              onClick={() => void query.refetch()}
            >
              Riprova
            </button>
          </div>
        )}
        {!query.isLoading && !query.isError && articles.length === 0 && (
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-violet-400/10 via-sky-400/[0.05] to-transparent p-8 text-slate-300">
            <div className="site-grid absolute inset-0 opacity-35" />
            <FileText
              className="relative text-sky-200/80"
              size={34}
              strokeWidth={1.4}
              aria-hidden="true"
            />
            <div className="relative mt-6">
              <h2 className="display-font text-2xl font-semibold">
                Sto preparando i primi articoli.
              </h2>
              <p className="mt-3 max-w-xl leading-7 text-slate-400">
                Torna presto per leggere note su sviluppo, architettura e prodotti digitali.
              </p>
            </div>
          </div>
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
