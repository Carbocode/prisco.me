import { createFileRoute, Link } from "@tanstack/react-router";

import { PageShell, Section } from "@/components/page-shell";
import { listPublishedArticlesFn } from "@/features/cms/server/public.functions";
export const Route = createFileRoute("/blog/")({
  loader: () => listPublishedArticlesFn({ data: { limit: 20 } }),
  head: () => ({
    meta: [
      { title: "Blog | Vincenzo Prisco" },
      {
        name: "description",
        content: "Articoli e appunti di Vincenzo Prisco su software e tecnologia.",
      },
    ],
    links: [{ rel: "canonical", href: "https://prisco.me/blog" }],
  }),
  component: BlogPage,
});
function BlogPage() {
  const articles = Route.useLoaderData();
  return (
    <PageShell eyebrow="Blog" title="Articoli e appunti.">
      <Section>
        {articles.length ? (
          <div className="grid gap-6 md:grid-cols-2">
            {articles.map((article) => (
              <article key={article.id} className="rounded-2xl border border-white/10 p-6">
                <p className="text-xs text-slate-400">
                  {article.publishedAt
                    ? new Date(article.publishedAt).toLocaleDateString("it-IT")
                    : ""}
                </p>
                <h2 className="mt-2 text-2xl font-semibold">
                  <Link to="/blog/$slug" params={{ slug: article.slug }}>
                    {article.title}
                  </Link>
                </h2>
                {article.excerpt ? <p className="mt-3 text-slate-300">{article.excerpt}</p> : null}
              </article>
            ))}
          </div>
        ) : (
          <p className="text-slate-400">Nessun articolo pubblicato.</p>
        )}
      </Section>
    </PageShell>
  );
}
