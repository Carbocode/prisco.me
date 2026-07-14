import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";

import { PageShell, Section } from "@/components/page-shell";
import { parseCmsDocument } from "@/features/cms/domain/cms-document";
import { renderCmsDocument } from "@/features/cms/editor/render-cms-document";
import { getCmsRedirectFn, getPublishedArticleFn } from "@/features/cms/server/public.functions";
export const Route = createFileRoute("/blog/$slug")({
  loader: async ({ params }) => {
    const article = await getPublishedArticleFn({ data: { slug: params.slug } });
    if (!article) {
      const moved = await getCmsRedirectFn({ data: { path: `/blog/${params.slug}` } });
      if (moved)
        throw redirect({
          href: moved.destinationPath,
          statusCode: redirectStatus(moved.statusCode),
        });
      throw notFound();
    }
    return { article };
  },
  head: ({ params, loaderData }) => {
    const article = loaderData?.article;
    const title = article?.seoTitle ?? article?.title ?? "Articolo non trovato";
    const description = article?.seoDescription ?? article?.excerpt ?? "";
    const canonical = article?.canonicalUrl ?? `https://prisco.me/blog/${params.slug}`;
    return {
      meta: [
        { title: `${title} | Vincenzo Prisco` },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
        ...(article?.noIndex ? [{ name: "robots", content: "noindex" }] : []),
      ],
      links: [{ rel: "canonical", href: canonical }],
      scripts: article
        ? [
            {
              type: "application/ld+json",
              children: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "Article",
                headline: article.title,
                description,
                datePublished: article.publishedAt?.toISOString(),
                author: { "@id": "https://prisco.me/#person" },
                isPartOf: { "@id": "https://prisco.me/#website" },
                mainEntityOfPage: canonical,
              }),
            },
          ]
        : [],
    };
  },
  component: ArticlePage,
});
function ArticlePage() {
  const { article } = Route.useLoaderData();
  if (!article)
    return (
      <PageShell eyebrow="404" title="Articolo non trovato.">
        <Section>
          <Link to="/blog">Torna al blog</Link>
        </Section>
      </PageShell>
    );
  return (
    <PageShell
      eyebrow={
        article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("it-IT") : "Blog"
      }
      title={article.title}
      description={article.excerpt ?? undefined}
    >
      <Section>
        {article.cover ? (
          <img
            src={article.cover.url}
            alt={article.cover.altText ?? ""}
            className="mb-8 aspect-video w-full rounded-2xl object-cover"
          />
        ) : null}
        {article.categories.length ? (
          <p className="mb-4 text-sm text-slate-400">
            {article.categories.map((category) => category.name).join(" · ")}
          </p>
        ) : null}
        <article className="prose prose-invert max-w-3xl space-y-5">
          {renderCmsDocument(
            parseCmsDocument(article.content),
            new Map(article.media.map((item) => [item.id, item])),
          )}
        </article>
      </Section>
    </PageShell>
  );
}

function redirectStatus(value: number): 301 | 302 | 307 | 308 {
  return value === 302 || value === 307 || value === 308 ? value : 301;
}
