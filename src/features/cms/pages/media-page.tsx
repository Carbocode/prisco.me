import { Link, getRouteApi, useNavigate, useRouter } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Plus, RefreshCw, Search } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuGroup,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Empty, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/features/auth/client/auth-client";
import { roleHasPermission } from "@/features/auth/domain/permissions";
import { useListSearch } from "@/features/cms/client/use-list-search";
import { ManagedMediaCard } from "@/features/cms/components/managed-media-card";
import { MediaCard } from "@/features/cms/components/media-card";
import { listSearchSchema } from "@/features/cms/domain/list-search";
import { restoreMediaFn } from "@/features/cms/server/media.functions";

const routeApi = getRouteApi("/dashboard/cms/media");
const sorts = [
  { value: "createdAt:desc", label: "Più recenti", sortBy: "createdAt", direction: "desc" },
  { value: "createdAt:asc", label: "Meno recenti", sortBy: "createdAt", direction: "asc" },
  { value: "name:asc", label: "Nome A–Z", sortBy: "name", direction: "asc" },
  { value: "name:desc", label: "Nome Z–A", sortBy: "name", direction: "desc" },
  { value: "sizeBytes:desc", label: "Dimensione", sortBy: "sizeBytes", direction: "desc" },
] as const;
export function MediaContent() {
  const { result } = routeApi.useLoaderData();
  const search = routeApi.useSearch();
  const navigate = useNavigate({ from: "/dashboard/cms/media" });
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const canTrash = roleHasPermission(session?.user.role, "cmsMedia", "delete");
  const [refreshing, setRefreshing] = useState(false);
  const updateSearch = (changes: Partial<typeof search>) =>
    void navigate({ search: { ...search, ...changes } });
  const query = useListSearch(search.query, (nextQuery) =>
    updateSearch({ query: nextQuery || undefined, page: 1 }),
  );
  const pages = Math.max(1, Math.ceil(result.total / result.pageSize));
  async function refresh() {
    setRefreshing(true);
    try {
      await router.invalidate({ sync: true });
    } catch {
      toast.error("Aggiornamento non riuscito");
    } finally {
      setRefreshing(false);
    }
  }
  return (
    <div className="flex min-w-0 max-w-full flex-col gap-4">
      <h1 className="sr-only">Media</h1>
      <div className="flex justify-end">
        <Link className={buttonVariants({ size: "sm" })} to="/dashboard/cms/media/new">
          <Plus data-icon="inline-start" />
          Carica media
        </Link>
      </div>
      <div className="flex min-w-0 flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
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
                <DropdownMenuRadioItem value="image">Immagini</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="video">Video</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="audio">Audio</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="file">File</DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger render={<Button size="sm" variant="outline" />}>
              Libreria
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup
                value={search.scope}
                onValueChange={(scope) =>
                  updateSearch({ scope: scope === "trash" ? "trash" : "active", page: 1 })
                }
              >
                <DropdownMenuRadioItem value="active">File attivi</DropdownMenuRadioItem>
                <DropdownMenuRadioItem value="trash" disabled={!canTrash}>
                  Cestino
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger render={<Button size="sm" variant="outline" />}>
              Ordina
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup
                value={`${search.sortBy}:${search.direction}`}
                onValueChange={(value) => {
                  const sort = sorts.find((item) => item.value === value);
                  if (sort)
                    updateSearch({ sortBy: sort.sortBy, direction: sort.direction, page: 1 });
                }}
              >
                {sorts.map((sort) => (
                  <DropdownMenuRadioItem key={sort.value} value={sort.value}>
                    {sort.label}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex min-w-0 w-full items-center gap-2 sm:w-80">
          <InputGroup>
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupInput
              type="search"
              maxLength={160}
              aria-label="Cerca media"
              placeholder="Cerca media…"
              value={query.value}
              onChange={(event) => query.onChange(event.target.value)}
            />
          </InputGroup>
          <Button
            type="button"
            size="icon"
            variant="outline"
            aria-label="Aggiorna media"
            disabled={refreshing}
            aria-busy={refreshing}
            onClick={() => void refresh()}
          >
            {refreshing ? <Spinner /> : <RefreshCw />}
          </Button>
        </div>
      </div>
      {result.items.length ? (
        <div className="grid min-w-0 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {result.items.map((item) =>
            search.scope === "trash" ? (
              <MediaCard
                key={item.id}
                item={item}
                menuItems={
                  <DropdownMenuGroup>
                    <DropdownMenuItem
                      onClick={() =>
                        void restoreMediaFn({ data: { id: item.id } })
                          .then(() => router.invalidate())
                          .catch((error) =>
                            toast.error(
                              error instanceof Error ? error.message : "Ripristino non riuscito",
                            ),
                          )
                      }
                    >
                      Ripristina
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                }
              />
            ) : (
              <ManagedMediaCard key={item.id} item={item} refresh={() => router.invalidate()} />
            ),
          )}
        </div>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyTitle>{search.query ? "Nessun media trovato" : "Libreria vuota"}</EmptyTitle>
          </EmptyHeader>
        </Empty>
      )}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm tabular-nums">
            {result.total ? (result.page - 1) * result.pageSize + 1 : 0}–
            {Math.min(result.page * result.pageSize, result.total)} di {result.total}
          </span>
          <Select
            value={String(result.pageSize)}
            onValueChange={(value) =>
              updateSearch({ pageSize: value === "10" ? 10 : value === "50" ? 50 : 20, page: 1 })
            }
          >
            <SelectTrigger size="sm" aria-label="Media per pagina">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {[10, 20, 50].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size} media
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <Button
                size="icon-sm"
                variant="outline"
                aria-label="Pagina precedente"
                disabled={result.page <= 1}
                onClick={() => updateSearch({ page: result.page - 1 })}
              >
                <ChevronLeft />
              </Button>
            </PaginationItem>
            <PaginationItem>
              <span className="px-2 text-sm tabular-nums" aria-live="polite">
                Pagina {result.page} di {pages}
              </span>
            </PaginationItem>
            <PaginationItem>
              <Button
                size="icon-sm"
                variant="outline"
                aria-label="Pagina successiva"
                disabled={result.page >= pages}
                onClick={() => updateSearch({ page: result.page + 1 })}
              >
                <ChevronRight />
              </Button>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
