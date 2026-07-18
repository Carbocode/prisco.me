import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createClientOnlyFn } from "@tanstack/react-start";
import { Clipboard, ImageIcon, Pencil, Trash2, Upload } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import type { MediaProcessingUpdate } from "@/features/cms/client/media-processing";
import {
  MediaCard as MediaLibraryCard,
  mediaDisplayName,
} from "@/features/cms/components/media-card";
import {
  deleteMediaFn,
  getMediaUsageFn,
  listMediaFn,
  updateMediaFn,
} from "@/features/cms/server/media.functions";

export const Route = createFileRoute("/dashboard/cms/media")({
  loader: () => listMediaFn(),
  component: MediaContent,
});

const processMediaForUpload = createClientOnlyFn(
  async (source: File, onUpdate: (update: MediaProcessingUpdate) => void) => {
    const mediaProcessing = await import("@/features/cms/client/media-processing");
    return mediaProcessing.processMediaForUpload(source, onUpdate);
  },
);

function MediaContent() {
  const media = Route.useLoaderData();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [pending, setPending] = useState(false);
  const [processing, setProcessing] = useState<MediaProcessingUpdate | null>(null);
  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return media.filter(
      (item) =>
        mediaDisplayName(item).toLowerCase().includes(normalizedQuery) ||
        item.filename.toLowerCase().includes(normalizedQuery),
    );
  }, [media, query]);

  async function upload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const sourceData = new FormData(form);
    const source = sourceData.get("file");
    if (!(source instanceof File) || !source.size) {
      toast.error("Seleziona un file");
      return;
    }
    const name = sourceData.get("name");
    if (typeof name !== "string" || !name.trim()) {
      toast.error("Inserisci un nome per il media");
      return;
    }
    setPending(true);
    try {
      const processed = await processMediaForUpload(source, setProcessing);
      const data = new FormData();
      data.set("file", processed.file);
      data.set("name", name.trim());
      const altText = sourceData.get("altText");
      if (typeof altText === "string") data.set("altText", altText);
      const caption = sourceData.get("caption");
      if (typeof caption === "string") data.set("caption", caption);
      if (processed.width) data.set("width", String(processed.width));
      if (processed.height) data.set("height", String(processed.height));
      setProcessing({ phase: "uploading", progress: 100 });
      const response = await fetch("/api/cms/media/upload", {
        method: "POST",
        body: data,
      });
      const result = (await response.json()) as { error?: { message?: string } }; // oxlint-disable-line typescript/no-unsafe-type-assertion
      if (!response.ok) throw new Error(result.error?.message ?? "Upload non riuscito");
      form.reset();
      toast.success("Media caricato");
      await router.invalidate();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload non riuscito");
    } finally {
      setPending(false);
      setProcessing(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <header>
        <p className="text-sm font-medium text-muted-foreground">{media.length} file</p>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Media</h1>
        <p className="text-sm text-muted-foreground">
          Converti e comprimi immagini, video e audio nel browser. I WebP animati mantengono
          l’animazione. Ogni file viene salvato con un nome UUID.
        </p>
      </header>

      <Card size="sm">
        <CardContent>
          <form onSubmit={(event) => void upload(event)}>
            <FieldGroup className="grid items-end gap-2 lg:grid-cols-2">
              <Field>
                <FieldLabel htmlFor="media-file">
                  Media · conversione automatica WebP/WebM · animazioni WebP preservate · originale
                  max 100 MiB
                </FieldLabel>
                <Input
                  id="media-file"
                  name="file"
                  type="file"
                  accept="image/*,video/*,audio/*"
                  disabled={pending}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="media-name">Nome del media</FieldLabel>
                <Input
                  id="media-name"
                  name="name"
                  maxLength={120}
                  placeholder="Es. Ritratto professionale"
                  disabled={pending}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="media-alt">Testo alternativo (immagini)</FieldLabel>
                <Input
                  id="media-alt"
                  name="altText"
                  maxLength={300}
                  placeholder="Descrivi il contenuto dell’immagine"
                  disabled={pending}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="media-caption">Didascalia</FieldLabel>
                <Input
                  id="media-caption"
                  name="caption"
                  maxLength={500}
                  placeholder="Testo mostrato con il media"
                  disabled={pending}
                />
              </Field>
              <Button className="justify-self-start" size="sm" type="submit" disabled={pending}>
                {pending ? (
                  <Spinner data-icon="inline-start" />
                ) : (
                  <Upload data-icon="inline-start" />
                )}
                {processing?.phase === "preparing"
                  ? "Preparazione…"
                  : processing?.phase === "converting"
                    ? "Conversione…"
                    : processing?.phase === "uploading"
                      ? "Caricamento…"
                      : "Carica"}
              </Button>
            </FieldGroup>
          </form>
          {processing ? (
            <Progress value={processing.progress}>
              <ProgressLabel>
                {processing.phase === "preparing"
                  ? "Caricamento encoder"
                  : processing.phase === "converting"
                    ? "Conversione e compressione"
                    : "Invio all’object storage"}
              </ProgressLabel>
              <ProgressValue />
            </Progress>
          ) : null}
        </CardContent>
      </Card>

      <Field className="max-w-md">
        <FieldLabel htmlFor="media-search">Cerca per nome</FieldLabel>
        <Input
          id="media-search"
          type="search"
          value={query}
          placeholder="Nome visuale, UUID o estensione"
          onChange={(event) => setQuery(event.target.value)}
        />
      </Field>

      {filtered.length ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((item) => (
            <ManagedMediaCard key={item.id} item={item} refresh={() => router.invalidate()} />
          ))}
        </div>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <ImageIcon />
            </EmptyMedia>
            <EmptyTitle>{query ? "Nessun file trovato" : "Libreria vuota"}</EmptyTitle>
            <EmptyDescription>
              {query
                ? "Prova con un nome diverso."
                : "Carica il primo media usando il modulo qui sopra."}
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </div>
  );
}

function ManagedMediaCard({
  item,
  refresh,
}: {
  item: Awaited<ReturnType<typeof listMediaFn>>[number];
  refresh: () => Promise<unknown>;
}) {
  const [name, setName] = useState(mediaDisplayName(item));
  const [altText, setAltText] = useState(item.altText ?? "");
  const [caption, setCaption] = useState(item.caption ?? "");
  const [editing, setEditing] = useState(false);
  const [pending, setPending] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [usage, setUsage] = useState(item.usage);

  async function save() {
    setPending(true);
    try {
      await updateMediaFn({
        data: {
          id: item.id,
          name: name.trim(),
          altText: altText || null,
          caption: caption || null,
        },
      });
      toast.success("Media aggiornato");
      setEditing(false);
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Aggiornamento non riuscito");
    } finally {
      setPending(false);
    }
  }

  async function checkBeforeDelete() {
    setPending(true);
    try {
      setUsage(await getMediaUsageFn({ data: { id: item.id } }));
      setDeleteOpen(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Controllo associazioni non riuscito");
    } finally {
      setPending(false);
    }
  }

  async function deleteMedia() {
    setPending(true);
    try {
      await deleteMediaFn({ data: { id: item.id, confirmedUsage: usage.total } });
      setDeleteOpen(false);
      toast.success(
        usage.total ? `Media eliminato e dissociato da ${usage.total} utilizzi` : "Media eliminato",
      );
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Eliminazione non riuscita");
    } finally {
      setPending(false);
    }
  }

  const displayName = mediaDisplayName({ ...item, name });

  return (
    <Collapsible open={editing} onOpenChange={setEditing}>
      <MediaLibraryCard
        item={{ ...item, name, altText, caption }}
        details={
          <CollapsibleContent>
            <FieldGroup className="gap-2">
              <Field>
                <FieldLabel htmlFor={`name-${item.id}`}>Nome del media</FieldLabel>
                <Input
                  id={`name-${item.id}`}
                  value={name}
                  maxLength={120}
                  required
                  onChange={(event) => setName(event.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor={`alt-${item.id}`}>Testo alternativo</FieldLabel>
                <Input
                  id={`alt-${item.id}`}
                  value={altText}
                  maxLength={300}
                  onChange={(event) => setAltText(event.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor={`caption-${item.id}`}>Didascalia</FieldLabel>
                <Input
                  id={`caption-${item.id}`}
                  value={caption}
                  maxLength={500}
                  onChange={(event) => setCaption(event.target.value)}
                />
              </Field>
              <Button size="sm" disabled={pending || !name.trim()} onClick={() => void save()}>
                {pending ? <Spinner data-icon="inline-start" /> : null}
                Salva modifiche
              </Button>
            </FieldGroup>
          </CollapsibleContent>
        }
        actions={
          <>
            <CollapsibleTrigger render={<Button type="button" size="sm" variant="outline" />}>
              <Pencil data-icon="inline-start" />
              {editing ? "Chiudi" : "Modifica"}
            </CollapsibleTrigger>
            <Button
              size="icon-sm"
              variant="outline"
              aria-label={`Copia URL di ${displayName}`}
              onClick={() =>
                void navigator.clipboard
                  .writeText(item.url)
                  .then(() => toast.success("URL copiato"))
              }
            >
              <Clipboard />
            </Button>
            <Button
              size="icon-sm"
              variant="destructive"
              disabled={pending}
              aria-label={`Elimina ${displayName}`}
              onClick={() => void checkBeforeDelete()}
            >
              {pending ? <Spinner /> : <Trash2 />}
            </Button>
          </>
        }
      />
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminare “{displayName}”?</AlertDialogTitle>
            <AlertDialogDescription>
              {usage.total
                ? `Il media è associato ${usage.total} ${usage.total === 1 ? "volta" : "volte"}: ${usage.articleCovers} cover, ${usage.articleContent} contenuti e ${usage.categoryHeroes} hero di categoria. Verrà dissociato da tutti questi punti e rimosso definitivamente da R2.`
                : "Il media non risulta associato. Verrà rimosso definitivamente dalla libreria e da R2."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={pending}
              onClick={() => void deleteMedia()}
            >
              {pending ? <Spinner data-icon="inline-start" /> : null}
              Elimina definitivamente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Collapsible>
  );
}
