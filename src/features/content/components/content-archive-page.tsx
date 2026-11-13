import { ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";

import { PageShell, Section } from "@/components/layout/page-shell";
import { HoverAnimatedImage } from "@/components/media/hover-animated-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
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
import { ArticleCard } from "@/features/content/components/article-card";
import { ContentBreadcrumb } from "@/features/content/components/content-breadcrumb";
import type { CategoryArticleLayout } from "@/features/content/domain/content-category";
import {
  uniqueTags,
  uniqueOrganizations,
  uniqueAuthors,
  uniqueYears,
} from "@/features/content/domain/presentation";
import { type PublicArticle } from "@/features/content/domain/public-content";
import { siteDateParts } from "@/lib/dates";
import { cn } from "@/lib/utils";

export function ContentArchivePage({
  eyebrow,
  title,
  description,
  hero,
  articles,
  archiveSlug,
  articleLayout,
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
  articleLayout: CategoryArticleLayout;
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
        (article.publishedAt && String(siteDateParts(new Date(article.publishedAt)).year) === year))
    );
  });
  const hasFilters =
    Boolean(query.trim()) ||
    tag !== "all" ||
    organization !== "all" ||
    author !== "all" ||
    year !== "all";
  const activeFilterCount = [
    Boolean(query.trim()),
    tag !== "all",
    organization !== "all",
    author !== "all",
    year !== "all",
  ].filter(Boolean).length;
  const pageSize = 9;
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pages);
  const visibleArticles = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  const renderFilterFields = (idSuffix: "mobile" | "desktop", includeReset: boolean) => (
    <FieldGroup className="grid items-end sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      <Field>
        <FieldLabel htmlFor={`content-search-${idSuffix}`}>Cerca</FieldLabel>
        <Input
          id={`content-search-${idSuffix}`}
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="Titolo o descrizione"
        />
      </Field>
      <Field>
        <FieldLabel htmlFor={`content-tag-${idSuffix}`}>Tag</FieldLabel>
        <Select value={tag} onValueChange={(value) => onTagChange(value ?? "all")}>
          <SelectTrigger id={`content-tag-${idSuffix}`} className="w-full">
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
        <FieldLabel htmlFor={`content-organization-${idSuffix}`}>Organizzazione</FieldLabel>
        <Select
          value={organization}
          onValueChange={(value) => onOrganizationChange(value ?? "all")}
        >
          <SelectTrigger id={`content-organization-${idSuffix}`} className="w-full">
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
        <FieldLabel htmlFor={`content-author-${idSuffix}`}>Autore</FieldLabel>
        <Select value={author} onValueChange={(value) => onAuthorChange(value ?? "all")}>
          <SelectTrigger id={`content-author-${idSuffix}`} className="w-full">
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
        <FieldLabel htmlFor={`content-year-${idSuffix}`}>Data</FieldLabel>
        <Select value={year} onValueChange={(value) => onYearChange(value ?? "all")}>
          <SelectTrigger id={`content-year-${idSuffix}`} className="w-full">
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
      {includeReset ? (
        <Field>
          <FieldLabel className="sr-only">Azioni filtri</FieldLabel>
          <Button type="button" variant="outline" onClick={onReset} disabled={!hasFilters}>
            Azzera filtri
          </Button>
        </Field>
      ) : null}
    </FieldGroup>
  );

  return (
    <PageShell title={title} description={description} hero={false}>
      <ArchiveHero eyebrow={eyebrow} title={title} description={description} hero={hero} />
      <ContentBreadcrumb
        className="mx-auto w-full max-w-6xl"
        items={[{ name: title, url: `/${archiveSlug}` }]}
      />
      <Section className="pt-4 sm:pt-6">
        <div className="sm:hidden">
          <Drawer showSwipeHandle>
            <DrawerTrigger
              render={
                <Button type="button" variant="outline" size="lg" className="min-h-11 w-full" />
              }
            >
              <SlidersHorizontal data-icon="inline-start" />
              Filtri
              {activeFilterCount ? (
                <Badge variant="secondary" aria-label={`${activeFilterCount} filtri attivi`}>
                  {activeFilterCount}
                </Badge>
              ) : null}
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Filtra contenuti</DrawerTitle>
                <DrawerDescription>
                  Scegli uno o più criteri. I risultati si aggiornano subito.
                </DrawerDescription>
              </DrawerHeader>
              <div className="flex-1 overflow-y-auto p-4">
                <FieldSet>
                  <FieldLegend className="sr-only">Filtra contenuti</FieldLegend>
                  {renderFilterFields("mobile", false)}
                </FieldSet>
              </div>
              <DrawerFooter>
                <Button type="button" variant="outline" onClick={onReset} disabled={!hasFilters}>
                  Azzera filtri
                </Button>
                <DrawerClose render={<Button type="button" size="lg" />}>
                  Mostra {filtered.length} {filtered.length === 1 ? "risultato" : "risultati"}
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>

        <FieldSet className="hidden sm:block">
          <FieldLegend variant="label">Filtra contenuti</FieldLegend>
          {renderFilterFields("desktop", true)}
        </FieldSet>

        {filtered.length ? (
          <>
            <div
              className={cn(
                "mt-8",
                articleLayout === "horizontal"
                  ? "divide-y divide-white/10"
                  : "grid gap-6 sm:grid-cols-2 lg:grid-cols-3",
              )}
            >
              {visibleArticles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  archiveSlug={archiveSlug}
                  variant={articleLayout === "horizontal" ? "list" : "card"}
                />
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
        <div className="mx-auto grid w-full min-w-0 max-w-384 gap-8 lg:grid-cols-(--layout-grid-cols-feature-reverse) lg:items-center lg:gap-12 xl:gap-16">
          <div className="flex flex-col items-start justify-center gap-5 py-6 lg:py-12">
            <p className="text-xs font-semibold uppercase tracking-caption text-link">{eyebrow}</p>
            <h1 className="display-font text-4xl leading-compact font-semibold tracking-hero text-balance sm:text-5xl lg:text-6xl">
              {title}
            </h1>
            <p className="max-w-xl text-base leading-7 text-ink-body sm:text-lg sm:leading-8">
              {description}
            </p>
          </div>
          <div className="relative aspect-4/3 min-h-88 min-w-0 max-w-full overflow-hidden bg-black sm:aspect-video sm:min-h-0">
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
                <div className="absolute inset-0 bg-about-aura" aria-hidden="true" />
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
