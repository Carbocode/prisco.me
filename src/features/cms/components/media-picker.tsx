import { AudioLines, Check, FileIcon, ImageIcon, Search, Video } from "lucide-react";
import { useId, useMemo, useState } from "react";

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
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

export type MediaPickerItem = {
  id: string;
  filename: string;
  url: string;
  mimeType?: string;
  altText?: string | null;
  width?: number | null;
  height?: number | null;
};

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
          <img
            src={selected.url}
            alt=""
            width={48}
            height={48}
            className="size-12 shrink-0 rounded-md object-cover"
          />
        ) : (
          <ImageIcon data-icon="inline-start" />
        )}
        <span className="truncate">{selected?.filename ?? emptyLabel}</span>
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
  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return items;
    return items.filter((item) => item.filename.toLowerCase().includes(normalizedQuery));
  }, [items, query]);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
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
            placeholder="Cerca per nome salvato"
            onChange={(event) => setQuery(event.target.value)}
          />
        </InputGroup>
      </Field>
      <ScrollArea className="h-[min(55dvh,36rem)] min-h-48 rounded-lg border">
        {filtered.length ? (
          <div className="grid gap-3 p-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((item) => {
              const selected = item.id === value;
              return (
                <Button
                  key={item.id}
                  type="button"
                  variant={selected ? "secondary" : "outline"}
                  className="h-auto min-w-0 flex-col items-stretch gap-0 overflow-hidden p-0 whitespace-normal"
                  aria-pressed={selected}
                  onClick={() => onValueChange(item.id)}
                >
                  <span className="relative block aspect-video w-full overflow-hidden">
                    {!item.mimeType || item.mimeType.startsWith("image/") ? (
                      <img
                        src={item.url}
                        alt={item.altText ?? ""}
                        width={item.width ?? 640}
                        height={item.height ?? 360}
                        loading="lazy"
                        className="size-full object-cover"
                      />
                    ) : (
                      <span className="flex size-full items-center justify-center text-muted-foreground">
                        {item.mimeType.startsWith("video/") ? (
                          <Video className="size-10" />
                        ) : item.mimeType.startsWith("audio/") ? (
                          <AudioLines className="size-10" />
                        ) : (
                          <FileIcon className="size-10" />
                        )}
                      </span>
                    )}
                    {selected ? (
                      <span className="absolute top-2 right-2 rounded-full bg-primary p-1 text-primary-foreground">
                        <Check />
                        <span className="sr-only">Selezionata</span>
                      </span>
                    ) : null}
                  </span>
                  <span className="truncate p-3 text-left">{item.filename}</span>
                </Button>
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
    </div>
  );
}