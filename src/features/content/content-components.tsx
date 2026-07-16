import { Link } from "@tanstack/react-router";
import { ArrowLeft, Building2, CalendarDays, UserRound } from "lucide-react";
import type { ReactNode } from "react";

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

export function ContentBreadcrumb({ items }: { items: ContentCrumb[] }) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        {items.map((item, index) => (
          <span className="contents" key={item.url}>
            {index ? <BreadcrumbSeparator /> : null}
            <BreadcrumbItem>
              {index === items.length - 1 ? (
                <BreadcrumbPage>{item.name}</BreadcrumbPage>
              ) : (
                <BreadcrumbLink render={<a href={item.url} aria-label={item.name} />}>
                  {item.name}
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
          </span>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}

export function ContentArchivePage({
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
  onQueryChange,
  onTagChange,
  onOrganizationChange,
  onAuthorChange,
  onYearChange,
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
  onQueryChange: (value: string) => void;
  onTagChange: (value: string) => void;
  onOrganizationChange: (value: string) => void;
  onAuthorChange: (value: string) => void;
  onYearChange: (value: string) => void;
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

  return (
    <PageShell title={title} description={description} heroImage={hero}>
      <ContentBreadcrumb items={[{ name: title, url: `/${archiveSlug}` }]} />
      <Section className="pt-0">
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
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {filtered.map((article) => (
              <Card key={article.id} className="h-full pt-0">
                <ArticleCover article={article} variant="card" />
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

export function ArticlePageContent({
  article,
  crumbs,
}: {
  article: PublicArticle;
  crumbs: ContentCrumb[];
}) {
  const eyebrow = article.projectRole
    ? `${article.projectRole}${article.projectPeriod ? ` · ${article.projectPeriod}` : ""}`
    : formatDate(article.publishedAt);
  const archive = crumbs[0];
  const publishedYear = article.publishedAt
    ? String(new Date(article.publishedAt).getFullYear())
    : null;

  return (
    <PageShell hero={false} title={article.title}>
      <section className="relative isolate overflow-hidden border-b border-white/10 px-6 pb-14 pt-6 sm:pb-20 sm:pt-8">
        <div className="site-grid pointer-events-none absolute inset-0 opacity-40" />
        <div className="pointer-events-none absolute -right-32 top-16 size-96 rounded-full bg-sky-400/10 blur-3xl" />
        <div className="relative mx-auto w-full max-w-6xl">
          <div className="relative">
            <ArticleCover article={article} variant="hero" />
            <div
              className="pointer-events-none absolute inset-0 rounded-3xl bg-gradient-to-t from-slate-950 via-slate-950/65 to-transparent"
              aria-hidden="true"
            />
            <div className="absolute inset-x-0 bottom-0 flex max-w-5xl flex-col items-start gap-4 p-6 sm:gap-5 sm:p-10 lg:p-14">
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
              <p className="flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-sky-300 sm:text-xs">
                <span className="h-px w-8 bg-sky-300/70" aria-hidden="true" />
                {eyebrow}
              </p>
              <h1 className="display-font text-3xl font-semibold leading-[1.05] tracking-tight text-balance sm:text-5xl lg:text-7xl">
                {article.title}
              </h1>
              {article.excerpt ? (
                <p className="line-clamp-3 max-w-3xl text-sm leading-6 text-slate-200 sm:text-lg sm:leading-8">
                  {article.excerpt}
                </p>
              ) : null}
            </div>
          </div>

          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:items-start">
            <ContentBreadcrumb items={crumbs} />
            <dl className="grid gap-5 border-l border-white/10 pl-6 text-sm sm:grid-cols-3">
              <ArticleMeta icon={<CalendarDays aria-hidden="true" />} label="Pubblicato">
                {publishedYear ? (
                  <Link to="/$archiveSlug" params={{ archiveSlug: publishedYear }}>
                    {formatDate(article.publishedAt)}
                  </Link>
                ) : (
                  formatDate(article.publishedAt)
                )}
              </ArticleMeta>
              <ArticleMeta icon={<UserRound aria-hidden="true" />} label="Autore">
                <Link to="/$archiveSlug" params={{ archiveSlug: article.author.slug }}>
                  {article.author.name}
                </Link>
              </ArticleMeta>
              {article.organization ? (
                <ArticleMeta icon={<Building2 aria-hidden="true" />} label="Organizzazione">
                  <Link to="/$archiveSlug" params={{ archiveSlug: article.organization.slug }}>
                    {article.organization.name}
                  </Link>
                </ArticleMeta>
              ) : null}
            </dl>
          </div>
        </div>
      </section>

      <Section className="grid gap-12 lg:grid-cols-[minmax(0,46rem)_minmax(13rem,1fr)] lg:items-start lg:gap-20">
        <article className="cms-content min-w-0">
          {renderCmsDocument(
            parseCmsDocument(article.content),
            new Map(article.media.map((item) => [item.id, item])),
          )}
        </article>

        <aside className="flex flex-col gap-6 lg:sticky lg:top-24" aria-label="Dettagli articolo">
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

function ArticleMeta({
  icon,
  label,
  children,
}: {
  icon: ReactNode;
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="grid grid-cols-[1.25rem_1fr] gap-x-3">
      <span className="mt-0.5 text-sky-300">{icon}</span>
      <div>
        <dt className="text-xs uppercase tracking-[0.18em] text-slate-500">{label}</dt>
        <dd className="mt-1 font-medium text-slate-200 [&_a]:underline-offset-4 [&_a]:hover:underline">
          {children}
        </dd>
      </div>
    </div>
  );
}

function ArticleCover({ article, variant }: { article: PublicArticle; variant: "card" | "hero" }) {
  const primaryTag = article.tags[0];
  const frameClass = cn(
    "relative isolate w-full overflow-hidden bg-slate-900",
    variant === "card"
      ? "aspect-video border-b border-white/10"
      : "min-h-[32rem] rounded-3xl border border-white/10 shadow-2xl shadow-sky-950/30 sm:aspect-video sm:min-h-0 lg:aspect-[21/9]",
  );

  if (article.cover) {
    return (
      <div className={frameClass}>
        <img
          src={article.cover.url}
          alt={article.cover.altText ?? ""}
          className="h-full w-full object-cover"
          loading={variant === "card" ? "lazy" : "eager"}
          decoding="async"
          fetchPriority={variant === "hero" ? "high" : "auto"}
        />
        {primaryTag ? <CoverTag tag={primaryTag} variant={variant} /> : null}
      </div>
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

      {primaryTag ? <CoverTag tag={primaryTag} variant={variant} /> : null}
    </div>
  );
}

function CoverTag({
  tag,
  variant,
}: {
  tag: PublicArticle["tags"][number];
  variant: "card" | "hero";
}) {
  return (
    <Badge
      className={cn(
        tag.color,
        "absolute p-0 shadow-lg backdrop-blur-md",
        variant === "card"
          ? "bottom-4 left-4 size-10"
          : "right-5 top-5 size-14 sm:right-8 sm:top-8 sm:size-16",
      )}
      aria-label={tag.name}
      title={tag.name}
    >
      <SkillGlyph skill={tag} size={variant === "card" ? 22 : 34} />
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
