import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import { ArticleCard } from "@/components/article-card";
import { ArticleContent } from "@/components/article-content";
import { ActionLink, PageShell, Section } from "@/components/page-shell";
import { getArticleBySlugQueryOptions, getArticlesQueryOptions } from "@/server/articles";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => ({
    meta: [
      { title: `${params.slug} | Blog | Vincenzo Prisco` },
      {
        name: "description",
        content:
          "Articolo dal blog di Vincenzo Prisco su software, prodotti e apprendimento continuo.",
      },
      { property: "og:title", content: `${params.slug} | Blog | Vincenzo Prisco` },
      {
        property: "og:description",
        content: "Un articolo dal percorso di un software engineer orientato al prodotto.",
      },
      { property: "og:type", content: "article" },
    ],
    links: [{ rel: "canonical", href: `https://prisco.me/blog/${params.slug}` }],
  }),
  component: ArticlePage,
});

function ArticlePage() {
  const { slug } = Route.useParams();
  const query = useQuery(getArticleBySlugQueryOptions(slug));
  const relatedQuery = useQuery(getArticlesQueryOptions());
  const article = query.data;

  if (query.isLoading) {
    return (
      <PageShell eyebrow="Blog" title="Caricamento articolo...">
        <Section>
          <p className="text-slate-400">Sto preparando il contenuto.</p>
        </Section>
      </PageShell>
    );
  }

  if (query.isError || !article) {
    return (
      <PageShell eyebrow="Blog" title="Articolo non trovato">
        <Section>
          <p className="text-slate-400">
            Il contenuto richiesto non esiste o non e ancora pubblicato.
          </p>
          <Link to="/blog" className="mt-5 inline-block text-sky-300 hover:text-sky-200">
            Torna al blog →
          </Link>
        </Section>
      </PageShell>
    );
  }

  const date = article.publishedAt ?? article.createdAt;
  const relatedArticles = (relatedQuery.data?.data ?? [])
    .filter((item) => item.slug && item.slug !== slug)
    .slice(0, 3);
  return (
    <PageShell
      eyebrow={article.category ?? "Articolo"}
      title={article.title ?? slug}
      description={date ? formatDate(date) : undefined}
      actions={<ActionLink href="/contatti">Parliamo</ActionLink>}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title ?? slug,
            description: article.excerpt ?? article.description,
            datePublished: article.publishedAt,
            dateCreated: article.createdAt,
            url: `https://prisco.me/blog/${slug}`,
            author: { "@type": "Person", name: "Vincenzo Prisco" },
          }),
        }}
      />
      <Section>
        <article className="mx-auto max-w-3xl">
          <ArticleContent content={article.content} />
          <div className="mt-16 border-t border-white/10 pt-8">
            <p className="text-slate-300">
              Ti interessa questo tema o stai affrontando un problema simile?
            </p>
            <Link
              to="/contatti"
              className="mt-4 inline-block font-semibold text-sky-300 hover:text-sky-200"
            >
              Scrivimi →
            </Link>
          </div>
        </article>
      </Section>
      {relatedArticles.length > 0 && (
        <Section className="border-t border-white/10 pt-16 sm:pt-20">
          <h2 className="display-font text-3xl font-semibold">Articoli correlati</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-3">
            {relatedArticles.map((relatedArticle) => (
              <ArticleCard
                key={relatedArticle.documentId ?? relatedArticle.slug}
                article={relatedArticle}
              />
            ))}
          </div>
        </Section>
      )}
    </PageShell>
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
