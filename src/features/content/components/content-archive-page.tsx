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
import type { ContentCrumb, PublicArticle } from "@/features/content/domain/public-content";
import { useSiteLocale } from "@/features/site/client/site-location";
import { siteDateParts } from "@/lib/dates";
import { cn } from "@/lib/utils";
import * as m from "@/paraglide/messages.js";

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
  const locale = useSiteLocale();
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
        <FieldLabel htmlFor={`content-search-${idSuffix}`}>
          {m.archive_search({}, { locale })}
        </FieldLabel>
        <Input
          id={`content-search-${idSuffix}`}
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={m.archive_title_or_description({}, { locale })}
        />
      </Field>
      <Field>
        <FieldLabel htmlFor={`content-tag-${idSuffix}`}>Tag</FieldLabel>
        <Select value={tag} onValueChange={(value) => onTagChange(value ?? "all")}>
          <SelectTrigger id={`content-tag-${idSuffix}`} className="w-full">
            <SelectValue placeholder={m.archive_all_tags({}, { locale })} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">{m.archive_all({}, { locale })}</SelectItem>
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
        <FieldLabel htmlFor={`content-organization-${idSuffix}`}>
          {m.archive_organization({}, { locale })}
        </FieldLabel>
        <Select
          value={organization}
          onValueChange={(value) => onOrganizationChange(value ?? "all")}
        >
          <SelectTrigger id={`content-organization-${idSuffix}`} className="w-full">
            <SelectValue placeholder={m.archive_all_6({}, { locale })} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">{m.archive_all_7({}, { locale })}</SelectItem>
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
        <FieldLabel htmlFor={`content-author-${idSuffix}`}>
          {m.archive_author({}, { locale })}
        </FieldLabel>
        <Select value={author} onValueChange={(value) => onAuthorChange(value ?? "all")}>
          <SelectTrigger id={`content-author-${idSuffix}`} className="w-full">
            <SelectValue placeholder={m.archive_all({}, { locale })} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">{m.archive_all({}, { locale })}</SelectItem>
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
        <FieldLabel htmlFor={`content-year-${idSuffix}`}>
          {m.archive_date({}, { locale })}
        </FieldLabel>
        <Select value={year} onValueChange={(value) => onYearChange(value ?? "all")}>
          <SelectTrigger id={`content-year-${idSuffix}`} className="w-full">
            <SelectValue placeholder={m.archive_all_dates({}, { locale })} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectItem value="all">{m.archive_all_dates({}, { locale })}</SelectItem>
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
          <FieldLabel className="sr-only">{m.archive_filter_actions({}, { locale })}</FieldLabel>
          <Button type="button" variant="outline" onClick={onReset} disabled={!hasFilters}>
            {m.archive_reset_filters({}, { locale })}{" "}
          </Button>
        </Field>
      ) : null}
    </FieldGroup>
  );

  return (
    <PageShell title={title} description={description} hero={false}>
      <ArchiveHero
        breadcrumb={{ name: title, url: `/${archiveSlug}` }}
        eyebrow={eyebrow}
        title={title}
        description={description}
        hero={hero}
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
              {m.archive_filters({}, { locale })}{" "}
              {activeFilterCount ? (
                <Badge variant="secondary" aria-label={`${activeFilterCount} filtri attivi`}>
                  {activeFilterCount}
                </Badge>
              ) : null}
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>{m.archive_filter_content({}, { locale })}</DrawerTitle>
                <DrawerDescription>
                  {m.archive_choose_one_or_more_filters_results({}, { locale })}{" "}
                </DrawerDescription>
              </DrawerHeader>
              <div className="flex-1 overflow-y-auto p-4">
                <FieldSet>
                  <FieldLegend className="sr-only">
                    {m.archive_filter_content({}, { locale })}
                  </FieldLegend>
                  {renderFilterFields("mobile", false)}
                </FieldSet>
              </div>
              <DrawerFooter>
                <Button type="button" variant="outline" onClick={onReset} disabled={!hasFilters}>
                  {m.archive_reset_filters({}, { locale })}{" "}
                </Button>
                <DrawerClose render={<Button type="button" size="lg" />}>
                  {m.archive_show({}, { locale })} {filtered.length}{" "}
                  {filtered.length === 1 ? "risultato" : "risultati"}
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>

        <FieldSet className="hidden sm:block">
          <FieldLegend variant="label">{m.archive_filter_content({}, { locale })}</FieldLegend>
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
                {(safePage - 1) * pageSize + 1}–{Math.min(safePage * pageSize, filtered.length)}{" "}
                {m.archive_of({}, { locale })} {filtered.length}
              </p>
              <Pagination className="mx-0 w-auto">
                <PaginationContent>
                  <PaginationItem>
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="outline"
                      disabled={safePage === 1}
                      aria-label={m.archive_previous_page({}, { locale })}
                      onClick={() => onPageChange(Math.max(1, safePage - 1))}
                    >
                      <ChevronLeft />
                    </Button>
                  </PaginationItem>
                  <PaginationItem>
                    <span className="px-2 text-sm tabular-nums" aria-live="polite">
                      {m.archive_page({}, { locale })} {safePage} {m.archive_of({}, { locale })}{" "}
                      {pages}
                    </span>
                  </PaginationItem>
                  <PaginationItem>
                    <Button
                      type="button"
                      size="icon-sm"
                      variant="outline"
                      disabled={safePage === pages}
                      aria-label={m.archive_next_page({}, { locale })}
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
              <EmptyTitle>{m.archive_no_content_found({}, { locale })}</EmptyTitle>
              <EmptyDescription>
                {m.archive_change_or_reset_your_filters_to({}, { locale })}{" "}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </Section>
    </PageShell>
  );
}

function ArchiveHero({
  breadcrumb,
  eyebrow,
  title,
  description,
  hero,
}: {
  breadcrumb: ContentCrumb;
  eyebrow: string;
  title: string;
  description: string;
  hero?: { url: string; altText: string | null } | null;
}) {
  return (
    <>
      <section className="bg-black px-6 pb-6 pt-24 sm:pb-8 sm:pt-28">
        <div className="mx-auto grid w-full min-w-0 max-w-384 gap-8 lg:grid-cols-(--layout-grid-cols-feature-reverse) lg:items-center lg:gap-12 xl:gap-16">
          <div className="flex min-w-0 flex-col items-start justify-center gap-5 py-6 lg:py-12">
            <ContentBreadcrumb items={[breadcrumb]} />
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
