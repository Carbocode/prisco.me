import { Link, useRouter } from "@tanstack/react-router";
import { createClientOnlyFn } from "@tanstack/react-start";
import { Upload } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress";
import { Spinner } from "@/components/ui/spinner";
import type { MediaProcessingUpdate } from "@/features/cms/client/media-processing";
import { listSearchSchema } from "@/features/cms/domain/list-search";

const processMediaForUpload = createClientOnlyFn(
  async (source: File, onUpdate: (update: MediaProcessingUpdate) => void) => {
    const mediaProcessing = await import("@/features/cms/client/media-processing");
    return mediaProcessing.processMediaForUpload(source, onUpdate);
  },
);

export function UploadMediaPage() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [processing, setProcessing] = useState<MediaProcessingUpdate | null>(null);
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
      await router.navigate({ to: "/dashboard/cms/media", search: listSearchSchema.parse({}) });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload non riuscito");
    } finally {
      setPending(false);
      setProcessing(null);
    }
  }

  return (
    <div className="mx-auto flex w-full min-w-0 max-w-3xl flex-col gap-6">
      <Link
        className={buttonVariants({ variant: "outline", size: "sm" })}
        to="/dashboard/cms/media"
        search={listSearchSchema.parse({})}
      >
        Torna all’elenco
      </Link>
      <Card size="sm">
        <CardHeader>
          <CardTitle>Carica media</CardTitle>
          <CardDescription>
            Immagini, video e audio fino a 100 MiB. Conversione automatica; animazioni preservate.
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
    </div>
  );
}
