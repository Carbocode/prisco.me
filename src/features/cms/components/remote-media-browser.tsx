import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useListSearch } from "@/features/cms/client/use-list-search";
import { listMediaPageFn } from "@/features/cms/server/media.functions";

import { MediaCard } from "./media-card";

export function RemoteMediaBrowser({
  value,
  onValueChange,
}: {
  value: string;
  onValueChange: (value: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const search = useListSearch(query, (nextQuery) => {
    setQuery(nextQuery);
    setPage(1);
  });
  const result = useQuery({
    queryKey: ["cms", "media-options", query, page],
    queryFn: () =>
      listMediaPageFn({
        data: { page, pageSize: 20, query, kind: "image", sortBy: "createdAt", direction: "desc" },
      }),
    staleTime: 30_000,
  });
  return (
    <div className="flex min-h-0 flex-col gap-3">
      <Input
        type="search"
        maxLength={160}
        aria-label="Cerca immagini"
        placeholder="Cerca immagini…"
        value={search.value}
        onChange={(event) => search.onChange(event.target.value)}
      />
      <div className="min-h-0 max-h-viewport-panel overflow-y-auto">
        {result.isPending ? (
          <Spinner />
        ) : result.isError ? (
          <p role="alert">Impossibile caricare le immagini.</p>
        ) : result.data.items.length ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {result.data.items.map((item) => (
              <MediaCard
                key={item.id}
                item={item}
                selected={item.id === value}
                onSelect={() => onValueChange(item.id)}
              />
            ))}
          </div>
        ) : (
          <p>Nessuna immagine.</p>
        )}
      </div>
      <div className="flex items-center justify-between gap-2">
        <Button
          type="button"
          variant="outline"
          disabled={page <= 1 || result.isFetching}
          onClick={() => setPage(page - 1)}
        >
          Precedente
        </Button>
        <span>
          {result.data?.page ?? page} / {Math.max(1, Math.ceil((result.data?.total ?? 0) / 20))}
        </span>
        <Button
          type="button"
          variant="outline"
          disabled={!result.data || page * 20 >= result.data.total || result.isFetching}
          onClick={() => setPage(page + 1)}
        >
          Successiva
        </Button>
      </div>
    </div>
  );
}
