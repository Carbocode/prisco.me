import { useNavigate } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import { toast } from "sonner";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

import { EMPTY_CMS_DOCUMENT, parseCmsDocument, type CmsDocument } from "../domain/cms-document";
import { slugify } from "../domain/slug";
import {
  archiveServiceFn,
  createServiceFn,
  publishServiceFn,
  restoreServiceFn,
  restoreServiceRevisionFn,
  unpublishServiceFn,
  updateServiceFn,
} from "../server/service.functions";

const CmsEditor = lazy(() =>
  import("../editor/cms-editor").then((module) => ({ default: module.CmsEditor })),
);

type ExistingService = {
  id: string;
  name: string;
  slug: string;
  shortDescription: string | null;
  content: string;
  imageMediaId: string | null;
  icon: string | null;
  priceLabel: string | null;
  callToActionLabel: string | null;
  callToActionUrl: string | null;
  sortOrder: number;
  status: string;
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl: string | null;
  noIndex: boolean;
  version: number;
};

type Media = { id: string; filename: string; url: string; altText: string | null };
type Revision = { id: string; revision: number; createdAt: Date };
export function ServiceForm({
  service,
  media = [],
  revisions = [],
}: {
  service?: ExistingService;
  media?: Media[];
  revisions?: Revision[];
}) {
  const navigate = useNavigate();
  const [name, setName] = useState(service?.name ?? "");
  const [slug, setSlug] = useState(service?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(service));
  const [shortDescription, setShortDescription] = useState(service?.shortDescription ?? "");
  const [content, setContent] = useState<CmsDocument>(
    service ? parseCmsDocument(service.content) : EMPTY_CMS_DOCUMENT,
  );
  const [icon, setIcon] = useState(service?.icon ?? "");
  const [imageMediaId, setImageMediaId] = useState(service?.imageMediaId ?? "");
  const [priceLabel, setPriceLabel] = useState(service?.priceLabel ?? "");
  const [ctaLabel, setCtaLabel] = useState(service?.callToActionLabel ?? "");
  const [ctaUrl, setCtaUrl] = useState(service?.callToActionUrl ?? "");
  const [sortOrder, setSortOrder] = useState(service?.sortOrder ?? 0);
  const [seoTitle, setSeoTitle] = useState(service?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(service?.seoDescription ?? "");
  const [canonicalUrl, setCanonicalUrl] = useState(service?.canonicalUrl ?? "");
  const [noIndex, setNoIndex] = useState(service?.noIndex ?? false);
  const [pending, setPending] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [conflict, setConflict] = useState(false);

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(name));
  }, [name, slugTouched]);
  useEffect(() => {
    const guard = (event: BeforeUnloadEvent) => {
      if (dirty) event.preventDefault();
    };
    window.addEventListener("beforeunload", guard);
    return () => window.removeEventListener("beforeunload", guard);
  }, [dirty]);

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    try {
      const values = {
        name,
        slug,
        shortDescription: shortDescription || null,
        content,
        imageMediaId: imageMediaId || null,
        icon: icon || null,
        priceLabel: priceLabel || null,
        callToActionLabel: ctaLabel || null,
        callToActionUrl: ctaUrl || null,
        sortOrder,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        canonicalUrl: canonicalUrl || null,
        noIndex,
      };
      const saved = service
        ? await updateServiceFn({ data: { id: service.id, version: service.version, ...values } })
        : await createServiceFn({ data: values });
      setDirty(false);
      toast.success("Servizio salvato");
      void navigate({ to: "/dashboard/cms/services/$serviceId", params: { serviceId: saved.id } });
    } catch (error) {
      if (error instanceof Error && error.message.includes("modified elsewhere")) setConflict(true);
      toast.error(error instanceof Error ? error.message : "Salvataggio non riuscito");
    } finally {
      setPending(false);
    }
  }

  async function action(kind: "publish" | "unpublish" | "archive" | "restore") {
    if (!service) return;
    if (kind === "archive" && !confirm("Archiviare questo servizio?")) return;
    setPending(true);
    try {
      const data = { id: service.id, version: service.version };
      if (kind === "publish") await publishServiceFn({ data });
      else if (kind === "unpublish") await unpublishServiceFn({ data });
      else if (kind === "archive") await archiveServiceFn({ data });
      else await restoreServiceFn({ data });
      toast.success("Stato del servizio aggiornato");
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Operazione non riuscita");
    } finally {
      setPending(false);
    }
  }
  async function restoreRevision(revisionId: string) {
    if (!service || !confirm("Ripristinare questa revisione?")) return;
    try {
      await restoreServiceRevisionFn({
        data: { serviceId: service.id, revisionId, version: service.version },
      });
      toast.success("Revisione ripristinata");
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Ripristino non riuscito");
    }
  }

  return (
    <form
      className="grid gap-6"
      onSubmit={(event) => void save(event)}
      onChange={() => setDirty(true)}
    >
      {conflict ? (
        <Alert variant="destructive">
          <AlertTitle>Conflitto di versione</AlertTitle>
          <AlertDescription>
            Questo servizio è stato modificato altrove. Ricarica prima di continuare.
          </AlertDescription>
          <Button
            className="mt-3"
            type="button"
            variant="outline"
            onClick={() => window.location.reload()}
          >
            Ricarica contenuto
          </Button>
        </Alert>
      ) : null}
      <Card>
        <CardHeader>
          <CardTitle>Contenuto</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Field>
            <FieldLabel htmlFor="service-name">Nome</FieldLabel>
            <Input
              id="service-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="service-slug">Slug</FieldLabel>
            <Input
              id="service-slug"
              value={slug}
              onChange={(event) => {
                setSlugTouched(true);
                setSlug(event.target.value);
              }}
              required
            />
          </Field>
          {service?.status === "published" && slug !== service.slug ? (
            <p className="text-sm text-amber-600">
              Il salvataggio creerà un redirect permanente dal vecchio slug.
            </p>
          ) : null}
          <Field>
            <FieldLabel htmlFor="service-description">
              Descrizione breve ({shortDescription.length}/320)
            </FieldLabel>
            <Textarea
              id="service-description"
              maxLength={320}
              value={shortDescription}
              onChange={(event) => setShortDescription(event.target.value)}
            />
          </Field>
          <Suspense fallback={<p>Caricamento editor…</p>}>
            <CmsEditor
              value={content}
              media={media}
              onChange={(value) => {
                setContent(value);
                setDirty(true);
              }}
            />
          </Suspense>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Presentazione</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Field>
            <FieldLabel>Immagine</FieldLabel>
            <Select
              value={imageMediaId || "none"}
              onValueChange={(value) => setImageMediaId(value === "none" ? "" : (value ?? ""))}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nessuna immagine</SelectItem>
                {media.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.filename}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="service-icon">Icona</FieldLabel>
            <Input
              id="service-icon"
              value={icon}
              onChange={(event) => setIcon(event.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="service-price">Etichetta prezzo</FieldLabel>
            <Input
              id="service-price"
              value={priceLabel}
              onChange={(event) => setPriceLabel(event.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="service-cta-label">Testo CTA</FieldLabel>
            <Input
              id="service-cta-label"
              value={ctaLabel}
              onChange={(event) => setCtaLabel(event.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="service-cta-url">URL CTA</FieldLabel>
            <Input
              id="service-cta-url"
              value={ctaUrl}
              onChange={(event) => setCtaUrl(event.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="service-order">Ordine</FieldLabel>
            <Input
              id="service-order"
              type="number"
              min={-10000}
              max={10000}
              value={sortOrder}
              onChange={(event) => setSortOrder(event.target.valueAsNumber)}
            />
          </Field>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>SEO</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Field>
            <FieldLabel htmlFor="service-seo-title">Titolo SEO ({seoTitle.length}/70)</FieldLabel>
            <Input
              id="service-seo-title"
              maxLength={70}
              value={seoTitle}
              onChange={(event) => setSeoTitle(event.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="service-seo-description">
              Descrizione SEO ({seoDescription.length}/180)
            </FieldLabel>
            <Textarea
              id="service-seo-description"
              maxLength={180}
              value={seoDescription}
              onChange={(event) => setSeoDescription(event.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="service-canonical">Canonical URL</FieldLabel>
            <Input
              id="service-canonical"
              type="url"
              value={canonicalUrl}
              onChange={(event) => setCanonicalUrl(event.target.value)}
            />
          </Field>
          <Field orientation="horizontal">
            <Checkbox id="service-noindex" checked={noIndex} onCheckedChange={setNoIndex} />
            <FieldLabel htmlFor="service-noindex">Escludi dai motori di ricerca</FieldLabel>
          </Field>
        </CardContent>
      </Card>
      {service && revisions.length ? (
        <Card>
          <CardHeader>
            <CardTitle>Revisioni</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            {revisions.map((revision) => (
              <div key={revision.id} className="flex items-center justify-between gap-3">
                <p className="text-sm">
                  Revisione {revision.revision} · {revision.createdAt.toLocaleString("it-IT")}
                </p>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => void restoreRevision(revision.id)}
                >
                  Ripristina
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
      <div className="flex flex-wrap gap-3">
        <Button type="submit" disabled={pending}>
          {pending ? "Salvataggio…" : "Salva"}
        </Button>
        {service?.status === "published" ? (
          <Button
            type="button"
            variant="secondary"
            disabled={pending}
            onClick={() => void action("unpublish")}
          >
            Rimetti in bozza
          </Button>
        ) : service && service.status !== "archived" ? (
          <Button
            type="button"
            variant="secondary"
            disabled={pending}
            onClick={() => void action("publish")}
          >
            Pubblica
          </Button>
        ) : null}
        {service && service.status !== "archived" ? (
          <Button
            type="button"
            variant="destructive"
            disabled={pending}
            onClick={() => void action("archive")}
          >
            Archivia
          </Button>
        ) : null}
        {service?.status === "archived" ? (
          <Button
            type="button"
            variant="secondary"
            disabled={pending}
            onClick={() => void action("restore")}
          >
            Ripristina come bozza
          </Button>
        ) : null}
        {service ? (
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              window.open(
                `/dashboard/cms/services/${service.id}/preview`,
                "_blank",
                "noopener,noreferrer",
              )
            }
          >
            Anteprima
          </Button>
        ) : null}
      </div>
    </form>
  );
}
