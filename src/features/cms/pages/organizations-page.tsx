/* oxlint-disable react/no-unstable-nested-components -- TanStack columns compose row actions. */
import { Link, getRouteApi, useNavigate, useRouter } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";

import {
  DashboardDataTable,
  type DashboardColumnDef,
} from "@/components/data-table/dashboard-data-table";
import { buttonVariants } from "@/components/ui/button";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/features/auth/client/auth-client";
import { roleHasPermission } from "@/features/auth/domain/permissions";
import { useListSearch } from "@/features/cms/client/use-list-search";
import { OrganizationActions } from "@/features/cms/components/organizations/organization-actions";
import { listSearchSchema } from "@/features/cms/domain/list-search";
import { restoreTaxonomyFn } from "@/features/cms/server/trash.functions";
const routeApi = getRouteApi("/dashboard/cms/organizations");
export function OrganizationsPage() {
  const { result } = routeApi.useLoaderData();
  const search = routeApi.useSearch();
  const navigate = useNavigate({ from: "/dashboard/cms/organizations" });
  const { data: session } = authClient.useSession();
  const canTrash = roleHasPermission(session?.user.role, "cmsCategory", "delete");
  const router = useRouter();
  const updateSearch = (changes: Partial<typeof search>) =>
    void navigate({ search: { ...search, ...changes } });
  const query = useListSearch(search.query, (nextQuery) =>
    updateSearch({ query: nextQuery || undefined, page: 1 }),
  );
  const columns = useMemo<DashboardColumnDef<(typeof result.items)[number]>[]>(
    () => [
      { accessorKey: "name", header: "Organizzazione", size: 300 },
      { accessorKey: "slug", header: "Slug", size: 220 },
      {
        accessorKey: "type",
        header: "Tipo",
        size: 160,
        cell: ({ row }) => (row.original.type === "education" ? "Istruzione" : "Azienda"),
      },
      {
        id: "actions",
        header: "Azioni",
        size: 180,
        enableSorting: false,
        cell: ({ row }) =>
          search.scope === "trash" ? (
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                void restoreTaxonomyFn({ data: { id: row.original.id, kind: "organization" } })
                  .then(() => router.invalidate())
                  .catch((error) =>
                    toast.error(error instanceof Error ? error.message : "Ripristino non riuscito"),
                  )
              }
            >
              Ripristina
            </Button>
          ) : (
            <OrganizationActions organization={row.original} refresh={() => router.invalidate()} />
          ),
      },
    ],
    [router, search.scope],
  );
  return (
    <div className="flex min-w-0 max-w-full flex-col gap-4">
      <h1 className="sr-only">Organizzazioni</h1>
      <div className="flex justify-end">
        <Link className={buttonVariants({ size: "sm" })} to="/dashboard/cms/organizations/new">
          <Plus data-icon="inline-start" />
          Nuova organizzazione
        </Link>
      </div>
      <DashboardDataTable
        columns={columns}
        data={result.items}
        getRowId={(row) => row.id}
        search={query}
        onRefresh={() => router.invalidate({ sync: true })}
        sorting={{
          value: [{ id: search.sortBy, desc: search.direction === "desc" }],
          onChange: (value) =>
            updateSearch({
              sortBy: value[0]?.id ?? "name",
              direction: value[0]?.desc ? "desc" : "asc",
              page: 1,
            }),
        }}
        pagination={{
          pageIndex: result.page - 1,
          pageSize: result.pageSize,
          pageCount: Math.max(1, Math.ceil(result.total / result.pageSize)),
          total: result.total,
          onChange: ({ pageIndex, pageSize }) =>
            updateSearch({
              page: pageIndex + 1,
              pageSize: pageSize === 10 || pageSize === 50 ? pageSize : 20,
            }),
        }}
        toolbarLeft={
          <>
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button size="sm" variant="outline" />}>
                Tipo
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuRadioGroup
                  value={search.kind ?? "all"}
                  onValueChange={(value) =>
                    updateSearch({ kind: listSearchSchema.parse({ kind: value }).kind, page: 1 })
                  }
                >
                  <DropdownMenuLabel>Tipo</DropdownMenuLabel>
                  <DropdownMenuRadioItem value="all">Tutti</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="company">Azienda</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="education">Istruzione</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button size="sm" variant="outline" />}>
                Archivio
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuRadioGroup
                  value={search.scope}
                  onValueChange={(scope) =>
                    updateSearch({ scope: scope === "trash" ? "trash" : "active", page: 1 })
                  }
                >
                  <DropdownMenuRadioItem value="active">Attivi</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="trash" disabled={!canTrash}>
                    Cestino
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        }
      />
    </div>
  );
}
