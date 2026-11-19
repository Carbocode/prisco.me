import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUp } from "lucide-react";

import { PageShell, Section } from "@/components/layout/page-shell";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { localizedPath } from "@/config/site";
import { ArticleCover } from "@/features/content/components/article-cover";
import { ContentBreadcrumb } from "@/features/content/components/content-breadcrumb";
import { parseCmsDocument } from "@/features/content/domain/document";
import { formatDate, formatReadingTime } from "@/features/content/domain/presentation";
import { type PublicArticle, type ContentCrumb } from "@/features/content/domain/public-content";
import { renderCmsDocument } from "@/features/content/rendering/render-document";
import { SkillGlyph } from "@/features/portfolio/components/tech-icon";
import { useSiteLocale } from "@/features/site/client/site-location";
import { cn } from "@/lib/utils";
import * as m from "@/paraglide/messages.js";

export function ArticlePageContent({
  article,
  crumbs,
}: {
  article: PublicArticle;
  crumbs: ContentCrumb[];
}) {
  const locale = useSiteLocale();
  const archive = crumbs[0];

  return (
    <PageShell hero={false} title={article.title}>
      <section
        id="article-top"
        className="relative isolate overflow-hidden bg-black px-6 pb-6 pt-24 sm:pb-8 sm:pt-28"
      >
        <div className="relative mx-auto w-full max-w-384">
          <div className="grid min-w-0 gap-8 lg:grid-cols-(--layout-grid-cols-feature-reverse) lg:items-center lg:gap-12 xl:gap-16">
            <div className="flex min-w-0 flex-col items-start justify-center gap-5 py-6 lg:py-12">
              <ContentBreadcrumb items={crumbs} />
              <div className="flex flex-wrap gap-2">
                {article.categories.map((category) => (
                  <Badge
                    key={category.slug}
                    variant="secondary"
                    render={<Link to="/$archiveSlug" params={{ archiveSlug: category.slug }} />}
                  >
                    {category.name}
                  </Badge>
                ))}
              </div>
              <h1 className="display-font max-w-full break-words text-4xl leading-compact font-semibold tracking-hero text-balance sm:text-5xl lg:text-6xl">
                {article.title}
              </h1>
              {article.excerpt ? (
                <p className="max-w-xl text-base leading-7 text-ink-body sm:text-lg sm:leading-8">
                  {article.excerpt}
                </p>
              ) : null}
              {article.projectRole || article.projectPeriod ? (
                <div className="flex flex-col gap-1 text-xs font-medium uppercase tracking-section text-ink-muted">
                  {article.projectRole ? <p>{article.projectRole}</p> : null}
                  {article.projectPeriod ? <p>{article.projectPeriod}</p> : null}
                </div>
              ) : null}
              <div className="flex max-w-full flex-wrap items-center gap-x-3 gap-y-2 text-sm text-ink-subtle">
                <span>
                  {m.article_by({}, { locale })}{" "}
                  <Link
                    className="font-medium text-ink-soft underline-offset-4 hover:underline"
                    to="/$archiveSlug"
                    params={{ archiveSlug: article.author.slug }}
                  >
                    {article.author.name}
                  </Link>
                </span>
                <Separator orientation="vertical" className="h-4" />
                <time dateTime={article.publishedAt?.toISOString()}>
                  {formatDate(article.publishedAt, locale)}
                </time>
                <Separator orientation="vertical" className="h-4" />
                <span>{formatReadingTime(article.readingTimeMinutes, locale)}</span>
              </div>
            </div>
            <ArticleCover article={article} variant="hero" />
          </div>
        </div>
      </section>

      <Separator className="mx-auto max-w-6xl" />

      <Section className="grid gap-8 lg:grid-cols-(--layout-grid-cols-article) lg:items-start lg:gap-x-20 lg:gap-y-10">
        <article lang="it" className="cms-content order-2 min-w-0 lg:order-none lg:col-start-1">
          {renderCmsDocument(
            parseCmsDocument(article.content),
            new Map(article.media.map((item) => [item.id, item])),
            locale,
          )}
        </article>

        <aside
          className="order-1 flex flex-col gap-6 lg:sticky lg:top-24 lg:order-none lg:col-start-2"
          aria-label={m.article_article_details({}, { locale })}
        >
          {archive ? (
            <a
              className={buttonVariants({ variant: "outline" })}
              href={localizedPath(archive.url, locale)}
              aria-label={m.article_back_to_archive({ name: archive.name }, { locale })}
            >
              <ArrowLeft data-icon="inline-start" />
              {m.article_back_to({}, { locale })} {archive.name}
            </a>
          ) : null}
          <Separator />
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-caption text-ink-muted">
              {m.article_topics({}, { locale })}{" "}
            </p>
            {article.tags.length ? (
              <div className="flex flex-wrap gap-2">
                {article.tags.map((item) => (
                  <Badge
                    key={item.slug}
                    render={<Link to="/$archiveSlug" params={{ archiveSlug: item.slug }} />}
                  >
                    <SkillGlyph skill={item} size={12} />
                    {item.name}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm leading-6 text-ink-subtle">
                {m.article_no_associated_tags({}, { locale })}
              </p>
            )}
          </div>
        </aside>
      </Section>

      <a
        className={cn(
          buttonVariants({ variant: "secondary", size: "icon-lg" }),
          "fixed right-4 bottom-(--layout-bottom-safe) z-40 min-h-11 min-w-11 shadow-lg sm:right-6 sm:bottom-6",
        )}
        href="#article-top"
        aria-label={m.article_back_to_the_start_of_the({}, { locale })}
        title={m.article_back_to_top({}, { locale })}
      >
        <ArrowUp />
      </a>
    </PageShell>
  );
}
