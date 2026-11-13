import { useRouter } from "@tanstack/react-router";
import { getRouteApi } from "@tanstack/react-router";
import { createClientOnlyFn } from "@tanstack/react-start";
import { ImageIcon, Upload } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Item, ItemGroup, ItemContent, ItemTitle, ItemActions } from "@/components/ui/item";
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { MediaProcessingUpdate } from "@/features/cms/client/media-processing";
import { ManagedMediaCard } from "@/features/cms/components/managed-media-card";
import { mediaDisplayName } from "@/features/cms/components/media-card";
import { restoreMediaFn } from "@/features/cms/server/media.functions";

const routeApi = getRouteApi("/dashboard/cms/media");

const processMediaForUpload = createClientOnlyFn(
  async (source: File, onUpdate: (update: MediaProcessingUpdate) => void) => {
    const mediaProcessing = await import("@/features/cms/client/media-processing");
    return mediaProcessing.processMediaForUpload(source, onUpdate);
  },
);

export function MediaContent() {
  const { media, trash } = routeApi.useLoaderData();
  const router = useRouter();
  const [view, setView] = useState("list");
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
      setView("list");
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
    <div className="flex flex-col gap-6">
      <header>
        <p className="text-sm font-medium text-muted-foreground">{media.length} file</p>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Media</h1>
        <p className="text-sm text-muted-foreground">
          Trova, carica e gestisci immagini, video e audio da usare nei tuoi contenuti.
        </p>
      </header>

      <Tabs value={view} onValueChange={(value) => setView(String(value))}>
        <TabsList aria-label="Sezioni libreria">
          <TabsTrigger value="list">Libreria</TabsTrigger>
          <TabsTrigger value="create">Carica media</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <div className="flex flex-col gap-6">
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
                      : "Apri “Carica media” per aggiungere il primo file."}
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
            {trash.length ? (
              <Card>
                <CardHeader>
                  <CardTitle>Cestino media</CardTitle>
                  <CardDescription>
                    I file archiviati possono essere ripristinati nella libreria.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ItemGroup>
                    {trash.map((item) => (
                      <Item key={item.id}>
                        <ItemContent>
                          <ItemTitle>{item.name || item.filename}</ItemTitle>
                        </ItemContent>
                        <ItemActions>
                          <Button
                            variant="outline"
                            onClick={() => {
                              void restoreMediaFn({ data: { id: item.id } })
                                .then(() => router.invalidate())
                                .catch((error) =>
                                  toast.error(
                                    error instanceof Error
                                      ? error.message
                                      : "Ripristino non riuscito",
                                  ),
                                );
                            }}
                          >
                            Ripristina
                          </Button>
                        </ItemActions>
                      </Item>
                    ))}
                  </ItemGroup>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </TabsContent>
        <TabsContent value="create">
          <Card size="sm">
            <CardHeader>
              <CardTitle>Carica media</CardTitle>
              <CardDescription>
                Immagini, video e audio fino a 100 MiB. Conversione automatica; animazioni
                preservate.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={(event) => void upload(event)}>
                <FieldGroup className="grid items-end lg:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="media-file">File</FieldLabel>
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
        </TabsContent>
      </Tabs>
    </div>
  );
}
