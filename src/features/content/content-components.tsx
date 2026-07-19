import { Link } from "@tanstack/react-router";
import { ArrowLeft, ChevronLeft, ChevronRight, House } from "lucide-react";
import { Fragment } from "react";

import { HoverAnimatedImage } from "@/components/hover-animated-image";
import { PageShell, Section } from "@/components/page-shell";
import { SkillGlyph } from "@/components/tech-icon";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { parseCmsDocument } from "@/features/cms/domain/cms-document";
import { renderCmsDocument } from "@/features/cms/editor/render-cms-document";
import type { CategorySchemaType } from "@/lib/content-category";
import { cn } from "@/lib/utils";

export type PublicArticle = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  publishedAt: Date | null;
  updatedAt: Date;
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl: string | null;
  noIndex: boolean;
  projectRole: string | null;
  projectPeriod: string | null;
  projectFeatured: boolean;
  projectSortOrder: number;
  author: { name: string; slug: string };
  organization: { name: string; slug: string; type: string } | null;
  categories: Array<{ name: string; slug: string; schemaType: CategorySchemaType }>;
  tags: Array<{
    name: string;
    slug: string;
    icon: string | null;
    color: string;
    mark: string | null;
    fluentIcon: string | null;
  }>;
  cover: { url: string; altText: string | null } | null;
  media: Array<{ id: string; url: string; altText: string | null; caption: string | null }>;
};

export type ContentCrumb = { name: string; url: string };

export function ContentBreadcrumb({
  items,
  className,
}: {
  items: ContentCrumb[];
  className?: string;
}) {
  return (
    <Breadcrumb className={className}>
      <BreadcrumbList className="flex-nowrap">
        <BreadcrumbItem>
          <BreadcrumbLink
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                aria-label="Torna alla home"
                render={<Link to="/" />}
              />
            }
          >
            <House />
          </BreadcrumbLink>
        </BreadcrumbItem>
        {items.map((item, index) => (
          <Fragment key={item.url}>
            <BreadcrumbSeparator />
            <BreadcrumbItem className="min-w-0">
              {index === items.length - 1 ? (
                <BreadcrumbPage className="truncate">{item.name}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink render={<a href={item.url} aria-label={item.name} />}>
                  {item.name}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </Fragment>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export function ContentArchivePage({
  eyebrow,
  title,
  description,
  hero,
  articles,
  archiveSlug,
  query,
  tag,
  organization,
  author,
  year,
  page,
  onQueryChange,
  onTagChange,
  onOrganizationChange,
  onAuthorChange,
  onYearChange,
  onPageChange,
  onReset,
}: {
  eyebrow: string;
  title: string;
  description: string;
  hero?: { url: string; altText: string | null } | null;
  articles: PublicArticle[];
  archiveSlug: string;
  query: string;
  tag: string;
  organization: string;
  author: string;
  year: string;
  page: number;
  onQueryChange: (value: string) => void;
  onTagChange: (value: string) => void;
  onOrganizationChange: (value: string) => void;
  onAuthorChange: (value: string) => void;
  onYearChange: (value: string) => void;
  onPageChange: (value: number) => void;
  onReset: () => void;
}) {
  const tags = uniqueTags(articles);
  const organizations = uniqueOrganizations(articles);
  const authors = uniqueAuthors(articles);
  const years = uniqueYears(articles);
  const filtered = articles.filter((article) => {
    const normalizedQuery = query.trim().toLocaleLowerCase("it");
    const matchesQuery =
      !normalizedQuery ||
      article.title.toLocaleLowerCase("it").includes(normalizedQuery) ||
      article.excerpt?.toLocaleLowerCase("it").includes(normalizedQuery);
    return (
      matchesQuery &&
      (tag === "all" || article.tags.some((item) => item.slug === tag)) &&
      (organization === "all" || article.organization?.slug === organization) &&
      (author === "all" || article.author.slug === author) &&
      (year === "all" ||
        (article.publishedAt && String(new Date(article.publishedAt).getFullYear()) === year))
    );
  });
  const hasFilters =
    Boolean(query.trim()) ||
    tag !== "all" ||
    organization !== "all" ||
    author !== "all" ||
    year !== "all";
  const pageSize = 9;
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pages);
  const visibleArticles = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  return (
    <PageShell title={title} description={description} hero={false}>
      <ArchiveHero eyebrow={eyebrow} title={title} description={description} hero={hero} />
      <ContentBreadcrumb
        className="mx-auto w-full max-w-6xl px-6 py-6 sm:py-8"
        items={[{ name: title, url: `/${archiveSlug}` }]}
      />
      <Section className="pt-4 sm:pt-6">
        <FieldSet>
          <FieldLegend variant="label">Filtra contenuti</FieldLegend>
          <FieldGroup className="grid items-end gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            <Field>
              <FieldLabel htmlFor="content-search">Cerca</FieldLabel>
              <Input
                id="content-search"
                value={query}
                onChange={(event) => onQueryChange(event.target.value)}
                placeholder="Titolo o descrizione"
              />
            </Field>
            <Field>
              <FieldLabel>Tag</FieldLabel>
              <Select value={tag} onValueChange={(value) => onTagChange(value ?? "all")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Tutti i tag" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">Tutti</SelectItem>
                    {tags.map((item) => (
                      <SelectItem key={item.slug} value={item.slug}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Organizzazione</FieldLabel>
              <Select
                value={organization}
                onValueChange={(value) => onOrganizationChange(value ?? "all")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Tutte" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">Tutte</SelectItem>
                    {organizations.map((item) => (
                      <SelectItem key={item.slug} value={item.slug}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Autore</FieldLabel>
              <Select value={author} onValueChange={(value) => onAuthorChange(value ?? "all")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Tutti" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">Tutti</SelectItem>
                    {authors.map((item) => (
                      <SelectItem key={item.slug} value={item.slug}>
                        {item.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Data</FieldLabel>
              <Select value={year} onValueChange={(value) => onYearChange(value ?? "all")}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Tutte le date" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">Tutte le date</SelectItem>
                    {years.map((item) => (
                      <SelectItem key={item} value={item}>
                        {item}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel className="sr-only">Azioni filtri</FieldLabel>
              <Button type="button" variant="outline" onClick={onReset} disabled={!hasFilters}>
                Azzera filtri
              </Button>
            </Field>
          </FieldGroup>
        </FieldSet>

        {filtered.length ? (
          <>
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {visibleArticles.map((article) => (
                <Card key={article.id} className="relative h-full min-w-0 pt-0">
                  <ArticleCover article={article} variant="card" />
                  {article.tags[0] ? <CardEdgeTag tag={article.tags[0]} /> : null}
                  <CardHeader>
                    <CardTitle>{article.title}</CardTitle>
                    <CardDescription>{articleMetadata(article)}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-4">
                    {article.tags.length ? (
                      <div className="flex flex-wrap gap-2">
                        {article.tags.slice(0, 5).map((item) => (
                          <Badge key={item.slug} className={item.color}>
                            <SkillGlyph skill={item} size={12} />
                            {item.name}
                          </Badge>
                        ))}
                      </div>
                    ) : null}
                    {article.excerpt ? <CardDescription>{article.excerpt}</CardDescription> : null}
                  </CardContent>
                  <CardFooter className="mt-auto">
                    <Button
                      variant="outline"
                      render={
                        <a
                          href={`/${archiveSlug}/${article.slug}`}
                          aria-label={`Scopri ${article.title}`}
                        />
                      }
                    >
                      Scopri il contenuto
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm tabular-nums text-muted-foreground">
                {(safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, filtered.length)} di{" "}
                {filtered.length}
              </p>
              <Pagination className="mx-0 w-auto">
                <PaginationContent>
                  <PaginationItem>
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="outline"
                      disabled={safePage === 1}
                      aria-label="Pagina precedente"
                      onClick={() => onPageChange(Math.max(1, safePage - 1))}
                    >
                      <ChevronLeft />
                    </Button>
                  </PaginationItem>
                  <PaginationItem>
                    <span className="px-2 text-sm tabular-nums" aria-live="polite">
                      Pagina {safePage} di {pages}
                    </span>
                  </PaginationItem>
                  <PaginationItem>
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="outline"
                      disabled={safePage === pages}
                      aria-label="Pagina successiva"
                      onClick={() => onPageChange(Math.min(pages, safePage + 1))}
                    >
                      <ChevronRight />
                    </Button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </>
        ) : (
          <Empty className="mt-8">
            <EmptyHeader>
              <EmptyTitle>Nessun contenuto trovato</EmptyTitle>
              <EmptyDescription>
                Modifica o azzera i filtri per vedere altri risultati.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </Section>
    </PageShell>
  );
}

function ArchiveHero({
  eyebrow,
  title,
  description,
  hero,
}: {
  eyebrow: string;
  title: string;
  description: string;
  hero?: { url: string; altText: string | null } | null;
}) {
  return (
    <>
      <section className="bg-black px-6 pb-6 pt-24 sm:pb-8 sm:pt-28">
        <div className="mx-auto grid w-full min-w-0 max-w-[96rem] gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center lg:gap-12 xl:gap-16">
          <div className="flex flex-col items-start justify-center gap-5 py-6 lg:py-12">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-sky-300">
              {eyebrow}
            </p>
            <h1 className="display-font text-4xl leading-[1.02] font-semibold tracking-[-0.04em] text-balance sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="max-w-xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
              {description}
            </p>
          </div>
          <div className="relative aspect-[4/3] min-h-[22rem] min-w-0 max-w-full overflow-hidden bg-slate-900 sm:aspect-video sm:min-h-0">
            {hero ? (
              <HoverAnimatedImage
                src={hero.url}
                alt={hero.altText ?? ""}
                containerClassName="size-full"
                className="size-full object-cover"
                decoding="async"
                fetchPriority="high"
              />
            ) : (
              <>
                <div
                  className="absolute inset-0 bg-[radial-gradient(circle_at_72%_25%,rgba(56,189,248,0.2),transparent_28%),radial-gradient(circle_at_18%_80%,rgba(167,139,250,0.18),transparent_32%),linear-gradient(135deg,#020617_0%,#0f172a_55%,#111827_100%)]"
                  aria-hidden="true"
                />
                <div className="site-grid absolute inset-0 opacity-55" aria-hidden="true" />
              </>
            )}
          </div>
        </div>
      </section>
      <Separator className="mx-auto max-w-6xl" />
    </>
  );
}

export function ArticlePageContent({
  article,
  crumbs,
}: {
  article: PublicArticle;
  crumbs: ContentCrumb[];
}) {
  const archive = crumbs[0];

  return (
    <PageShell hero={false} title={article.title}>
      <section className="relative isolate overflow-hidden bg-black px-6 pb-6 pt-24 sm:pb-8 sm:pt-28">
        <div className="relative mx-auto w-full max-w-[96rem]">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:items-center lg:gap-12 xl:gap-16">
            <div className="flex flex-col items-start justify-center gap-5 py-6 lg:py-12">
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
              <h1 className="display-font text-4xl leading-[1.02] font-semibold tracking-[-0.04em] text-balance sm:text-5xl lg:text-6xl">
                {article.title}
              </h1>
              {article.excerpt ? (
                <p className="max-w-xl text-base leading-7 text-slate-300 sm:text-lg sm:leading-8">
                  {article.excerpt}
                </p>
              ) : null}
              {article.projectRole || article.projectPeriod ? (
                <div className="flex flex-col gap-1 text-[10px] font-medium uppercase tracking-[0.2em] text-slate-500">
                  {article.projectRole ? <p>{article.projectRole}</p> : null}
                  {article.projectPeriod ? <p>{article.projectPeriod}</p> : null}
                </div>
              ) : null}
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <span>
                  By{" "}
                  <Link
                    className="font-medium text-slate-200 underline-offset-4 hover:underline"
                    to="/$archiveSlug"
                    params={{ archiveSlug: article.author.slug }}
                  >
                    {article.author.name}
                  </Link>
                </span>
                <Separator orientation="vertical" className="h-4" />
                <time dateTime={article.publishedAt?.toISOString()}>
                  {formatDate(article.publishedAt)}
                </time>
              </div>
            </div>
            <ArticleCover article={article} variant="hero" />
          </div>
        </div>
      </section>

      <Separator className="mx-auto max-w-6xl" />

      <Section className="grid gap-8 lg:grid-cols-[minmax(0,46rem)_minmax(13rem,1fr)] lg:items-start lg:gap-x-20 lg:gap-y-10">
        <ContentBreadcrumb items={crumbs} />
        <article className="cms-content min-w-0 lg:col-start-1">
          {renderCmsDocument(
            parseCmsDocument(article.content),
            new Map(article.media.map((item) => [item.id, item])),
          )}
        </article>

        <aside
          className="flex flex-col gap-6 lg:sticky lg:top-24 lg:col-start-2 lg:row-span-2 lg:row-start-1"
          aria-label="Dettagli articolo"
        >
          {archive ? (
            <Button
              variant="outline"
              render={<a href={archive.url} aria-label={`Torna a ${archive.name}`} />}
            >
              <ArrowLeft data-icon="inline-start" />
              Torna a {archive.name}
            </Button>
          ) : null}
          <Separator />
          <div className="flex flex-col gap-3">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">
              Argomenti
            </p>
            {article.tags.length ? (
              <div className="flex flex-wrap gap-2">
                {article.tags.map((item) => (
                  <Badge
                    key={item.slug}
                    className={item.color}
                    render={<Link to="/$archiveSlug" params={{ archiveSlug: item.slug }} />}
                  >
                    <SkillGlyph skill={item} size={12} />
                    {item.name}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm leading-6 text-slate-400">Nessun tag associato.</p>
            )}
          </div>
        </aside>
      </Section>
    </PageShell>
  );
}

function ArticleCover({ article, variant }: { article: PublicArticle; variant: "card" | "hero" }) {
  const frameClass = cn(
    "relative isolate w-full min-w-0 max-w-full overflow-hidden bg-slate-900",
    variant === "card"
      ? "aspect-video border-b border-white/10"
      : "aspect-[4/3] min-h-[22rem] sm:aspect-video sm:min-h-0",
  );

  if (article.cover) {
    if (variant === "hero") {
      return (
        <div className={frameClass}>
          <img
            src={article.cover.url}
            alt={article.cover.altText ?? ""}
            className="size-full object-cover"
            loading="eager"
            decoding="async"
            fetchPriority="high"
          />
        </div>
      );
    }

    return (
      <HoverAnimatedImage
        containerClassName={frameClass}
        src={article.cover.url}
        alt={article.cover.altText ?? ""}
        className="size-full object-cover"
        loading="lazy"
        decoding="async"
        fetchPriority="auto"
      />
    );
  }

  return (
    <div className={frameClass} aria-hidden="true">
      <div
        className="absolute inset-0 bg-[radial-gradient(circle_at_72%_25%,rgba(56,189,248,0.2),transparent_28%),radial-gradient(circle_at_18%_80%,rgba(167,139,250,0.18),transparent_32%),linear-gradient(135deg,#020617_0%,#0f172a_55%,#111827_100%)]"
        aria-hidden="true"
      />
      <div className="site-grid absolute inset-0 opacity-55" aria-hidden="true" />
      <div
        className="absolute -right-[8%] -top-[35%] aspect-square w-[68%] rounded-full border border-sky-300/20"
        aria-hidden="true"
      />
      <div
        className="absolute -right-[2%] -top-[21%] aspect-square w-[48%] rounded-full border border-dashed border-violet-300/25"
        aria-hidden="true"
      />
      <div
        className="absolute bottom-[18%] left-[10%] h-px w-[80%] -rotate-6 bg-gradient-to-r from-transparent via-sky-300/40 to-transparent"
        aria-hidden="true"
      />
    </div>
  );
}

function CardEdgeTag({ tag }: { tag: PublicArticle["tags"][number] }) {
  return (
    <Badge
      className="absolute top-3 right-3 size-10 shadow-lg"
      aria-label={tag.name}
      title={tag.name}
    >
      <SkillGlyph skill={tag} size={22} />
    </Badge>
  );
}

function formatDate(date: Date | null) {
  return date ? new Date(date).toLocaleDateString("it-IT") : "Pubblicazione";
}

function uniqueTags(articles: PublicArticle[]) {
  const tags = new Map<string, PublicArticle["tags"][number]>();
  for (const article of articles) {
    for (const tag of article.tags) tags.set(tag.slug, tag);
  }
  return [...tags.values()].sort((left, right) => left.name.localeCompare(right.name, "it"));
}

function uniqueOrganizations(articles: PublicArticle[]) {
  const organizations = new Map<string, NonNullable<PublicArticle["organization"]>>();
  for (const article of articles) {
    if (article.organization) organizations.set(article.organization.slug, article.organization);
  }
  return [...organizations.values()].sort((left, right) =>
    left.name.localeCompare(right.name, "it"),
  );
}

function uniqueAuthors(articles: PublicArticle[]) {
  const authors = new Map<string, PublicArticle["author"]>();
  for (const article of articles) authors.set(article.author.slug, article.author);
  return [...authors.values()].sort((left, right) => left.name.localeCompare(right.name, "it"));
}

function uniqueYears(articles: PublicArticle[]) {
  return [
    ...new Set(
      articles.flatMap((article) =>
        article.publishedAt ? [String(new Date(article.publishedAt).getFullYear())] : [],
      ),
    ),
  ].sort((left, right) => Number(right) - Number(left));
}

function articleMetadata(article: PublicArticle) {
  return [formatDate(article.publishedAt), article.author.name, article.organization?.name]
    .filter(Boolean)
    .join(" · ");
}
