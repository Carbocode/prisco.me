import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { archiveMediaFn, listMediaFn, updateMediaFn } from "@/features/cms/server/media.functions";

export const Route = createFileRoute("/dashboard/cms/media")({
  loader: () => listMediaFn(),
  component: MediaContent,
});

function MediaContent() {
  const media = Route.useLoaderData();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [pending, setPending] = useState(false);
  const filtered = useMemo(
    () => media.filter((item) => item.filename.toLowerCase().includes(query.toLowerCase())),
    [media, query],
  );

  async function upload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    try {
      const response = await fetch("/api/cms/media/upload", {
        method: "POST",
        body: new FormData(event.currentTarget),
      });
      const result = (await response.json()) as { error?: { message?: string } }; // oxlint-disable-line typescript/no-unsafe-type-assertion
      if (!response.ok) throw new Error(result.error?.message ?? "Upload non riuscito");
      event.currentTarget.reset();
      toast.success("Immagine caricata");
      await router.invalidate();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload non riuscito");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Media</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Carica e gestisci le immagini usate da articoli e servizi.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Carica immagine</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-4 md:grid-cols-[1fr_1fr_auto]"
            onSubmit={(event) => void upload(event)}
          >
            <Field>
              <FieldLabel htmlFor="media-file">File (JPEG, PNG, WebP o AVIF; max 5 MiB)</FieldLabel>
              <Input
                id="media-file"
                name="file"
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="media-alt">Testo alternativo</FieldLabel>
              <Input id="media-alt" name="altText" maxLength={300} />
            </Field>
            <Button className="self-end" type="submit" disabled={pending}>
              {pending ? "Caricamento…" : "Carica"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Field>
        <FieldLabel htmlFor="media-search">Cerca per nome file</FieldLabel>
        <Input
          id="media-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <MediaCard key={item.id} item={item} refresh={() => router.invalidate()} />
        ))}
      </div>
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
  async function save() {
    try {
      await updateMediaFn({
        data: { id: item.id, altText: altText || null, caption: caption || null },
      });
      toast.success("Media aggiornato");
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Aggiornamento non riuscito");
    }
  }
  async function archive() {
    if (!confirm("Archiviare questa immagine? Il file su R2 non verrà eliminato.")) return;
    try {
      await archiveMediaFn({ data: { id: item.id } });
      toast.success("Media archiviato");
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Operazione non riuscita");
    }
  }
  return (
    <Card>
      <CardHeader>
        <img
          src={item.url}
          alt={item.altText ?? ""}
          className="aspect-video w-full rounded-md object-cover"
        />
        <CardTitle className="truncate text-base">{item.filename}</CardTitle>
        <p className="text-xs text-muted-foreground">
          {Math.round(item.sizeBytes / 1024)} KiB
          {item.width && item.height ? ` · ${item.width}×${item.height}` : ""}
        </p>
      </CardHeader>
      <CardContent className="grid gap-3">
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
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <Button size="sm" onClick={() => void save()}>
          Salva
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            void navigator.clipboard.writeText(item.url).then(() => toast.success("URL copiato"))
          }
        >
          Copia URL
        </Button>
        <Button size="sm" variant="destructive" onClick={() => void archive()}>
          Archivia
        </Button>
      </CardFooter>
    </Card>
  );
}
