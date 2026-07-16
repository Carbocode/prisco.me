import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createClientOnlyFn } from "@tanstack/react-start";
import { Clipboard, ImageIcon, Trash2, Upload } from "lucide-react";
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
import { archiveMediaFn, listMediaFn, updateMediaFn } from "@/features/cms/server/media.functions";

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
  const filtered = useMemo(
    () => media.filter((item) => item.filename.toLowerCase().includes(query.toLowerCase())),
    [media, query],
  );

  async function upload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const sourceData = new FormData(form);
    const source = sourceData.get("file");
    if (!(source instanceof File) || !source.size) {
      toast.error("Seleziona un file");
      return;
    }
    setPending(true);
    try {
      const processed = await processMediaForUpload(source, setProcessing);
      const data = new FormData();
      data.set("file", processed.file);
      const altText = sourceData.get("altText");
      if (typeof altText === "string") data.set("altText", altText);
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
          Converti e comprimi immagini, video e audio nel browser. Ogni file viene salvato con un nome UUID.
        </p>
      </header>

      <Card size="sm">
        <CardContent>
          <form onSubmit={(event) => void upload(event)}>
            <FieldGroup className="grid items-end gap-2 lg:grid-cols-[1fr_1fr_auto]">
              <Field>
                <FieldLabel htmlFor="media-file">
                  Media · conversione automatica WebP/WebM · originale max 100 MiB
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
                <FieldLabel htmlFor="media-alt">Testo alternativo (immagini)</FieldLabel>
                <Input
                  id="media-alt"
                  name="altText"
                  maxLength={300}
                  placeholder="Descrivi il contenuto dell’immagine"
                  disabled={pending}
                />
              </Field>
              <Button size="sm" type="submit" disabled={pending}>
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
        <FieldLabel htmlFor="media-search">Cerca per nome salvato</FieldLabel>
        <Input
          id="media-search"
          type="search"
          value={query}
          placeholder="UUID o estensione"
          onChange={(event) => setQuery(event.target.value)}
        />
      </Field>

      {filtered.length ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
          {filtered.map((item) => (
            <MediaCard key={item.id} item={item} refresh={() => router.invalidate()} />
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

function MediaCard({
  item,
  refresh,
}: {
  item: Awaited<ReturnType<typeof listMediaFn>>[number];
  refresh: () => Promise<unknown>;
}) {
  const [altText, setAltText] = useState(item.altText ?? "");
  const [caption, setCaption] = useState(item.caption ?? "");
  const [pending, setPending] = useState(false);

  async function save() {
    setPending(true);
    try {
      await updateMediaFn({
        data: { id: item.id, altText: altText || null, caption: caption || null },
      });
      toast.success("Media aggiornato");
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Aggiornamento non riuscito");
    } finally {
      setPending(false);
    }
  }

  async function archive() {
    setPending(true);
    try {
      await archiveMediaFn({ data: { id: item.id } });
      toast.success("Media archiviato");
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Operazione non riuscita");
    } finally {
      setPending(false);
    }
  }

  return (
    <Card size="sm">
      {item.mimeType === "image/webp" ? (
        <img
          src={item.url}
          alt={item.altText ?? ""}
          width={item.width ?? 640}
          height={item.height ?? 360}
          loading="lazy"
          className="aspect-video w-full object-cover"
        />
      ) : item.mimeType === "video/webm" ? (
        // oxlint-disable-next-line jsx-a11y/media-has-caption -- preview CMS senza traccia VTT associata
        <video
          src={item.url}
          controls
          preload="metadata"
          className="aspect-video w-full object-cover"
        />
      ) : (
        // oxlint-disable-next-line jsx-a11y/media-has-caption -- anteprima audio CMS senza trascrizione associata
        <audio src={item.url} controls preload="metadata" className="w-full" />
      )}
      <CardHeader>
        <CardTitle className="truncate">{item.filename}</CardTitle>
        <p className="text-xs tabular-nums text-muted-foreground">
          {Math.round(item.sizeBytes / 1024)} KiB
          {item.width && item.height ? ` · ${item.width}×${item.height}` : ""}
        </p>
      </CardHeader>
      <CardContent>
        <FieldGroup className="gap-2">
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
        </FieldGroup>
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <Button size="sm" disabled={pending} onClick={() => void save()}>
          {pending ? <Spinner data-icon="inline-start" /> : null}
          Salva
        </Button>
        <Button
          size="icon-sm"
          variant="outline"
          aria-label={`Copia URL di ${item.filename}`}
          onClick={() =>
            void navigator.clipboard.writeText(item.url).then(() => toast.success("URL copiato"))
          }
        >
          <Clipboard />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button
                size="icon-sm"
                variant="destructive"
                aria-label={`Archivia ${item.filename}`}
              />
            }
          >
            <Trash2 />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Archiviare “{item.filename}”?</AlertDialogTitle>
              <AlertDialogDescription>
                Il media non sarà più selezionabile. Il file originale su R2 non verrà eliminato.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annulla</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={() => void archive()}>
                Archivia
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
