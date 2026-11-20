/* oxlint-disable react/no-unstable-nested-components -- TanStack Table usa callback di rendering nelle definizioni di colonna. */
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { getRouteApi } from "@tanstack/react-router";
import { Eye, FilePlus2, Pencil, Star } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";

import {
  DashboardDataTable,
  type DashboardColumnDef,
} from "@/components/data-table/dashboard-data-table";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useListSearch } from "@/features/cms/client/use-list-search";
import { HOME_FEATURED_CATEGORIES } from "@/features/cms/domain/home-featured";
import { setHomeFeaturedFn } from "@/features/cms/server/home-featured.functions";
import { formatSiteDate } from "@/lib/dates";

const featuredLabels = { blog: "Articoli", progetti: "Progetti" };

const routeApi = getRouteApi("/dashboard/cms/articles");

export function ArticlesContent() {
  const { articles, categories, featured } = routeApi.useLoaderData();
  const search = routeApi.useSearch();
  const router = useRouter();
  const navigate = useNavigate({ from: "/dashboard/cms/articles" });
  const pageSize = search.pageSize ?? 20;
  const pages = Math.max(1, Math.ceil(articles.total / pageSize));
  const updateSearch = (changes: Partial<typeof search>) =>
    void navigate({ search: { ...search, ...changes } });
  const query = useListSearch(search.query, (nextQuery) =>
    updateSearch({ query: nextQuery || undefined, page: 1 }),
  );
  const { mutate: setFeatured, isPending: updatingFeatured } = useMutation({
    mutationFn: setHomeFeaturedFn,
    onSuccess: async (saved) => {
      await router.invalidate({ sync: true });
      if (!saved)
        toast.error("Selezione non aggiornata. Verifica la pubblicazione e i posti disponibili.");
    },
    onError: () => toast.error("Impossibile aggiornare i contenuti in evidenza"),
  });
  const columns = useMemo<DashboardColumnDef<(typeof articles.items)[number]>[]>(
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
        enableSorting: false,
        size: 220,
        cell: ({ row }) => row.original.categories.join(", ") || "—",
      },
      {
        accessorKey: "updatedAt",
        header: "Modificato",
        size: 180,
        cell: ({ row }) => formatSiteDate(row.original.updatedAt),
      },
      {
        accessorKey: "publishedAt",
        header: "Pubblicazione",
        size: 180,
        cell: ({ row }) =>
          row.original.publishedAt ? formatSiteDate(row.original.publishedAt) : "—",
      },
      {
        id: "actions",
        header: "Azioni",
        enableSorting: false,
        size: featured ? 125 : 90,
        minSize: featured ? 125 : 90,
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
            {featured &&
            row.original.isPublic &&
            HOME_FEATURED_CATEGORIES.some((category) =>
              row.original.categorySlugs.includes(category),
            ) ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={<Button size="icon-sm" variant="outline" />}
                  aria-label={`Metti in evidenza ${row.original.title}`}
                  disabled={updatingFeatured}
                >
                  <Star />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {HOME_FEATURED_CATEGORIES.filter((category) =>
                    row.original.categorySlugs.includes(category),
                  ).map((category) => {
                    const selections = featured.filter((item) => item.category === category);
                    const selected = selections.some((item) => item.articleId === row.original.id);
                    return (
                      <DropdownMenuItem
                        key={category}
                        disabled={!selected && selections.length >= 2}
                        onClick={() =>
                          setFeatured({
                            data: { category, articleId: row.original.id, featured: !selected },
                          })
                        }
                      >
                        {featuredLabels[category]} in home ·{" "}
                        {selected
                          ? "Rimuovi"
                          : selections.length >= 2
                            ? "2 posti occupati"
                            : "Aggiungi"}
                      </DropdownMenuItem>
                    );
                  })}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </ButtonGroup>
        ),
      },
    ],
    [featured, setFeatured, updatingFeatured],
  );

  const statuses = ["draft", "scheduled", "published", "archived"] as const;
  const sortKeys = ["title", "status", "authorName", "updatedAt", "publishedAt"] as const;
  return (
    <div className="flex min-w-0 max-w-full flex-col gap-4">
      <h1 className="sr-only">Articoli</h1>
      <div className="flex justify-end">
        <Link className={buttonVariants({ size: "sm" })} to="/dashboard/cms/articles/new">
          <FilePlus2 data-icon="inline-start" />
          Nuovo articolo
        </Link>
      </div>
      {featured ? (
        <section aria-labelledby="home-featured-title" className="flex flex-col gap-2">
          <h2 id="home-featured-title">In evidenza in home</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {HOME_FEATURED_CATEGORIES.map((category) => {
              const selections = featured.filter((item) => item.category === category);
              return (
                <div key={category} className="flex min-w-0 flex-col gap-2">
                  <h3>
                    {featuredLabels[category]} · {selections.length}/2
                  </h3>
                  {selections.length === 0 && <p>Sezione nascosta</p>}
                  {selections.map((item) => (
                    <div key={item.articleId} className="flex flex-wrap items-center gap-2">
                      <span className="wrap-anywhere">{item.title}</span>
                      {!item.visible && <Badge variant="secondary">Non visibile in home</Badge>}
                      <Button
                        size="sm"
                        variant="outline"
                        disabled={updatingFeatured}
                        aria-label={`Rimuovi ${item.title} da ${featuredLabels[category].toLowerCase()} in home`}
                        onClick={() =>
                          setFeatured({
                            data: { category, articleId: item.articleId, featured: false },
                          })
                        }
                      >
                        Rimuovi
                      </Button>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </section>
      ) : null}
      <DashboardDataTable
        columns={columns}
        data={articles.items}
        getRowId={(article) => article.id}
        search={query}
        onRefresh={() => router.invalidate({ sync: true })}
        sorting={{
          value: [{ id: search.sortBy, desc: search.direction === "desc" }],
          onChange: (value) =>
            updateSearch({
              sortBy: sortKeys.find((key) => key === value[0]?.id) ?? "updatedAt",
              direction: value[0]?.desc ? "desc" : "asc",
              page: 1,
            }),
        }}
        pagination={{
          pageIndex: articles.page - 1,
          pageSize,
          pageCount: pages,
          total: articles.total,
          onChange: ({ pageIndex, pageSize: nextPageSize }) =>
            updateSearch({
              page: pageIndex + 1,
              pageSize: nextPageSize === 10 || nextPageSize === 50 ? nextPageSize : 20,
            }),
        }}
        toolbarLeft={
          <>
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button size="sm" variant="outline" />}>
                Categoria
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuRadioGroup
                  value={search.categoryId ?? "all"}
                  onValueChange={(value) =>
                    updateSearch({ categoryId: value === "all" ? undefined : value, page: 1 })
                  }
                >
                  <DropdownMenuRadioItem value="all">Tutte le categorie</DropdownMenuRadioItem>
                  {categories.map((category) => (
                    <DropdownMenuRadioItem key={category.id} value={category.id}>
                      {category.name}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        }
        toolbarCenter={
          <ToggleGroup
            value={[search.status ?? "all"]}
            onValueChange={(value) =>
              updateSearch({ status: statuses.find((status) => status === value[0]), page: 1 })
            }
            variant="outline"
            size="sm"
            spacing={0}
            aria-label="Stato articolo"
          >
            <ToggleGroupItem value="all">Tutti</ToggleGroupItem>
            {statuses.map((status) => (
              <ToggleGroupItem key={status} value={status}>
                {statusLabel(status)}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
        }
      />
    </div>
  );
}
function statusLabel(status: string) {
  return (
    { draft: "Bozze", scheduled: "Programmati", published: "Pubblicati", archived: "Archiviati" }[
      status
    ] ?? status
  );
}
