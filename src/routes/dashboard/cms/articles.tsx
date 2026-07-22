/* oxlint-disable react/no-unstable-nested-components -- TanStack Table usa callback di rendering nelle definizioni di colonna. */
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { Eye, FilePlus2, FileText, Pencil, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { z } from "zod";

import { DashboardDataTable } from "@/components/dashboard-data-table";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Card, CardContent } from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { listArticlesFn } from "@/features/cms/server/article.functions";
import { listCategoriesFn } from "@/features/cms/server/category.functions";
import { CATEGORY_ARCHIVE_SORT } from "@/lib/content-category";

const searchSchema = z.object({
  page: z.coerce.number().int().positive().catch(1),
  pageSize: z.coerce
    .number()
    .pipe(z.union([z.literal(10), z.literal(20), z.literal(50)]))
    .optional()
    .catch(20),
  query: z.string().optional().catch(undefined),
  status: z.enum(["draft", "scheduled", "published", "archived"]).optional().catch(undefined),
  categoryId: z.string().uuid().optional().catch(undefined),
});

export const Route = createFileRoute("/dashboard/cms/articles")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    const [articles, categories] = await Promise.all([
      listArticlesFn({ data: { ...deps, pageSize: deps.pageSize ?? 20 } }),
      listCategoriesFn(),
    ]);
    return { articles, categories };
  },
  component: ArticlesContent,
});

function ArticlesContent() {
  const { articles, categories } = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const [query, setQuery] = useState(search.query ?? "");
  const pageSize = search.pageSize ?? 20;
  const pages = Math.max(1, Math.ceil(articles.total / pageSize));
  const hasFilters = Boolean(search.query || search.status || search.categoryId);
  const updateSearch = (changes: Partial<typeof search>) =>
    void navigate({ search: { ...search, ...changes } });
  const columns = useMemo<ColumnDef<(typeof articles.items)[number]>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Articolo",
        size: 320,
        minSize: 220,
        cell: ({ row }) => (
          <div>
            <div className="truncate font-medium">{row.original.title}</div>
            <div className="truncate text-xs text-muted-foreground">/{row.original.slug}</div>
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Stato",
        size: 140,
        cell: ({ row }) => <Badge variant="secondary">{statusLabel(row.original.status)}</Badge>,
      },
      {
        accessorKey: "authorName",
        header: "Autore",
        size: 180,
        cell: ({ row }) => row.original.authorName ?? "—",
      },
      {
        id: "categories",
        header: "Categoria",
        size: 220,
        cell: ({ row }) => row.original.categories.join(", ") || "—",
      },
      {
        id: "archiveOrder",
        header: "Ordinamento",
        size: 170,
        cell: ({ row }) => {
          const article = row.original;
          return (
            <span className="tabular-nums text-muted-foreground">
              {article.archiveSort === CATEGORY_ARCHIVE_SORT.MANUAL
                ? article.projectSortOrder
                : article.publishedAt?.toLocaleDateString("it-IT") || "—"}
            </span>
          );
        },
      },
      {
        id: "actions",
        header: () => <span className="sr-only">Azioni</span>,
        size: 90,
        minSize: 90,
        maxSize: 120,
        enableResizing: false,
        cell: ({ row }) => (
          <ButtonGroup>
            <Link
              className={buttonVariants({ size: "icon-sm", variant: "outline" })}
              aria-label={`Modifica ${row.original.title}`}
              to="/dashboard/cms/articles/$articleId"
              params={{ articleId: row.original.id }}
            >
              <Pencil />
            </Link>
            <Link
              className={buttonVariants({ size: "icon-sm", variant: "outline" })}
              aria-label={`Anteprima ${row.original.title}`}
              to="/dashboard/cms/articles/$articleId/preview"
              params={{ articleId: row.original.id }}
              target="_blank"
            >
              <Eye />
            </Link>
          </ButtonGroup>
        ),
      },
    ],
    [],
  );

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{articles.total} contenuti</p>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">Articoli</h1>
          <p className="text-sm text-muted-foreground">
            Cerca, filtra e apri un contenuto senza cambiare contesto.
          </p>
        </div>
        <Link className={buttonVariants({ size: "sm" })} to="/dashboard/cms/articles/new">
          <FilePlus2 data-icon="inline-start" />
          Nuovo articolo
        </Link>
      </header>

      <Card size="sm">
        <CardContent>
          <form
            className="grid items-end gap-2 lg:grid-cols-[minmax(16rem,1fr)_12rem_14rem_auto]"
            onSubmit={(event) => {
              event.preventDefault();
              updateSearch({ query: query || undefined, page: 1 });
            }}
          >
            <Field>
              <FieldLabel htmlFor="article-search">Titolo o slug</FieldLabel>
              <Input
                id="article-search"
                type="search"
                value={query}
                placeholder="Cerca negli articoli"
                onChange={(event) => setQuery(event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel>Stato</FieldLabel>
              <Select
                items={[
                  { value: "all", label: "Tutti gli stati" },
                  { value: "draft", label: "Bozza" },
                  { value: "scheduled", label: "Programmato" },
                  { value: "published", label: "Pubblicato" },
                  { value: "archived", label: "Archiviato" },
                ]}
                value={search.status ?? "all"}
                onValueChange={(value) =>
                  updateSearch({
                    status: value === "all" ? undefined : (value as typeof search.status), // oxlint-disable-line typescript/no-unsafe-type-assertion
                    page: 1,
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">Tutti gli stati</SelectItem>
                    <SelectItem value="draft">Bozza</SelectItem>
                    <SelectItem value="scheduled">Programmato</SelectItem>
                    <SelectItem value="published">Pubblicato</SelectItem>
                    <SelectItem value="archived">Archiviato</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <Field>
              <FieldLabel>Categoria</FieldLabel>
              <Select
                items={[
                  { value: "all", label: "Tutte le categorie" },
                  ...categories.map((category) => ({
                    value: category.id,
                    label: category.name,
                  })),
                ]}
                value={search.categoryId ?? "all"}
                onValueChange={(value) =>
                  updateSearch({
                    categoryId: value === "all" ? undefined : (value ?? undefined),
                    page: 1,
                  })
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">Tutte le categorie</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
            <ButtonGroup>
              <Button size="sm" type="submit">
                <Search data-icon="inline-start" />
                Cerca
              </Button>
              {hasFilters ? (
                <Button
                  size="sm"
                  type="button"
                  variant="outline"
                  aria-label="Azzera filtri"
                  onClick={() => {
                    setQuery("");
                    void navigate({ search: { page: 1 } });
                  }}
                >
                  <X />
                </Button>
              ) : null}
            </ButtonGroup>
          </form>
        </CardContent>
      </Card>

      {articles.items.length ? (
        <Card size="sm">
          <CardContent>
            <DashboardDataTable
              columns={columns}
              data={articles.items}
              getRowId={(article) => article.id}
              pagination={{
                pageIndex: search.page - 1,
                pageSize,
                pageCount: pages,
                total: articles.total,
                onChange: ({ pageIndex, pageSize: nextPageSize }) =>
                  updateSearch({
                    page: pageIndex + 1,
                    pageSize: nextPageSize === 10 || nextPageSize === 50 ? nextPageSize : 20,
                  }),
              }}
            />
          </CardContent>
        </Card>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FileText />
            </EmptyMedia>
            <EmptyTitle>{hasFilters ? "Nessun risultato" : "Nessun articolo"}</EmptyTitle>
            <EmptyDescription>
              {hasFilters
                ? "Modifica o azzera i filtri per ampliare la ricerca."
                : "Crea il primo articolo per iniziare a pubblicare."}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            {hasFilters ? (
              <Button variant="outline" onClick={() => void navigate({ search: { page: 1 } })}>
                Azzera filtri
              </Button>
            ) : (
              <Link className={buttonVariants()} to="/dashboard/cms/articles/new">
                Nuovo articolo
              </Link>
            )}
          </EmptyContent>
        </Empty>
      )}
    </div>
  );
}

function statusLabel(status: string) {
  return (
    {
      draft: "Bozza",
      scheduled: "Programmato",
      published: "Pubblicato",
      archived: "Archiviato",
    }[status] ?? status
  );
}
