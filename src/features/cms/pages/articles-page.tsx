/* oxlint-disable react/no-unstable-nested-components -- TanStack Table usa callback di rendering nelle definizioni di colonna. */
import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import { getRouteApi } from "@tanstack/react-router";
import { Eye, FilePlus2, Pencil } from "lucide-react";
import { useMemo } from "react";

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
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useListSearch } from "@/features/cms/client/use-list-search";
import { formatSiteDate } from "@/lib/dates";

const routeApi = getRouteApi("/dashboard/cms/articles");

export function ArticlesContent() {
  const { articles, categories } = routeApi.useLoaderData();
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
