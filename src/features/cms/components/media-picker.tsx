import { ArrowDownUp, ChevronLeft, ChevronRight, ImageIcon, Search } from "lucide-react";
import { useEffect, useId, useMemo, useState } from "react";

import { HoverAnimatedImage } from "@/components/hover-animated-image";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Field, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  MediaCard as MediaLibraryCard,
  mediaDisplayName,
} from "@/features/cms/components/media-card";
import { cn } from "@/lib/utils";

export type MediaPickerItem = {
  id: string;
  name?: string | null;
  filename: string;
  url: string;
  mimeType?: string;
  altText?: string | null;
  caption?: string | null;
  width?: number | null;
  height?: number | null;
  sizeBytes?: number;
  createdAt?: Date;
  usage?: {
    total: number;
  };
};

const pageSize = 12;
const mediaSorts = [
  { value: "newest", label: "Più recenti" },
  { value: "oldest", label: "Meno recenti" },
  { value: "usage-desc", label: "Più utilizzati" },
  { value: "name-asc", label: "Nome A–Z" },
  { value: "name-desc", label: "Nome Z–A" },
] as const;
type MediaSort = (typeof mediaSorts)[number]["value"];

export function MediaPicker({
  items,
  value,
  onValueChange,
  label,
  description,
  emptyLabel = "Nessuna immagine",
  compact = false,
}: {
  items: MediaPickerItem[];
  value: string;
  onValueChange: (value: string) => void;
  label: string;
  description: string;
  emptyLabel?: string;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [draftValue, setDraftValue] = useState(value);
  const selected = items.find((item) => item.id === value);

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (nextOpen) setDraftValue(value);
      }}
    >
      <DialogTrigger
        render={
          <Button
            type="button"
            variant="outline"
            className={cn("w-full min-w-0 justify-start", !compact && "h-auto py-2")}
          />
        }
      >
        {selected && !compact ? (
          <HoverAnimatedImage
            src={selected.url}
            alt=""
            width={48}
            height={48}
            containerClassName="size-12 shrink-0 rounded-md"
            className="size-full object-cover"
          />
        ) : (
          <ImageIcon data-icon="inline-start" />
        )}
        <span className="truncate">{selected ? mediaDisplayName(selected) : emptyLabel}</span>
      </DialogTrigger>
      <DialogContent className="flex max-h-[min(90dvh,56rem)] w-[calc(100%-2rem)] max-w-6xl flex-col sm:max-w-6xl">
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <MediaBrowser items={items} value={draftValue} onValueChange={setDraftValue} />
        <DialogFooter>
          {draftValue ? (
            <Button type="button" variant="outline" onClick={() => setDraftValue("")}>
              Rimuovi selezione
            </Button>
          ) : null}
          <DialogClose render={<Button type="button" variant="outline" />}>Annulla</DialogClose>
          <Button
            type="button"
            onClick={() => {
              onValueChange(draftValue);
              setOpen(false);
            }}
          >
            Conferma
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export function MediaBrowser({
  items,
  value,
  onValueChange,
}: {
  items: MediaPickerItem[];
  value: string;
  onValueChange: (value: string) => void;
}) {
  const searchId = useId();
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<MediaSort>("newest");
  const [page, setPage] = useState(1);
  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    const matching = normalizedQuery
      ? items.filter(
          (item) =>
            mediaDisplayName(item).toLowerCase().includes(normalizedQuery) ||
            item.filename.toLowerCase().includes(normalizedQuery),
        )
      : items;
    return [...matching].sort((left, right) => compareMedia(left, right, sort));
  }, [items, query, sort]);
  const pages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pages);
  const visible = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  useEffect(() => setPage(1), [query, sort]);
  useEffect(() => {
    if (page > pages) setPage(pages);
  }, [page, pages]);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="grid items-end gap-3 sm:grid-cols-[minmax(0,1fr)_14rem]">
        <Field>
          <FieldLabel htmlFor={searchId}>Cerca nella libreria</FieldLabel>
          <InputGroup>
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupInput
              id={searchId}
              type="search"
              value={query}
              placeholder="Nome visuale o filename"
              onChange={(event) => setQuery(event.target.value)}
            />
          </InputGroup>
        </Field>
        <Field>
          <FieldLabel>Ordina tutto il dataset</FieldLabel>
          <Select
            items={mediaSorts}
            value={sort}
            onValueChange={(nextValue) => {
              if (mediaSorts.some((item) => item.value === nextValue))
                setSort(nextValue as MediaSort); // oxlint-disable-line typescript/no-unsafe-type-assertion
            }}
          >
            <SelectTrigger className="w-full">
              <ArrowDownUp />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {mediaSorts.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </Field>
      </div>
      <ScrollArea className="h-[min(55dvh,36rem)] min-h-48 rounded-lg border">
        {filtered.length ? (
          <div className="grid gap-3 p-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {visible.map((item) => {
              const selected = item.id === value;
              return (
                <MediaLibraryCard
                  key={item.id}
                  item={item}
                  selected={selected}
                  onSelect={() => onValueChange(item.id)}
                />
              );
            })}
          </div>
        ) : (
          <Empty className="min-h-64">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <ImageIcon />
              </EmptyMedia>
              <EmptyTitle>{query ? "Nessuna immagine trovata" : "Libreria vuota"}</EmptyTitle>
              <EmptyDescription>
                {query
                  ? "Prova con un nome diverso."
                  : "Carica un’immagine dalla sezione Media della dashboard."}
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}
      </ScrollArea>
      {filtered.length ? (
        <div className="flex flex-wrap items-center justify-between gap-3">
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
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
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
                  onClick={() => setPage((current) => Math.min(pages, current + 1))}
                >
                  <ChevronRight />
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      ) : null}
    </div>
  );
}

function compareMedia(left: MediaPickerItem, right: MediaPickerItem, sort: MediaSort) {
  if (sort === "usage-desc") {
    const difference = (right.usage?.total ?? 0) - (left.usage?.total ?? 0);
    if (difference) return difference;
  }
  if (sort === "name-asc" || sort === "name-desc") {
    const difference = mediaDisplayName(left).localeCompare(mediaDisplayName(right), "it");
    return sort === "name-asc" ? difference : -difference;
  }
  const difference = (right.createdAt?.getTime() ?? 0) - (left.createdAt?.getTime() ?? 0);
  return sort === "oldest" ? -difference : difference;
}
