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
  archiveArticleFn,
  createArticleFn,
  publishArticleFn,
  restoreArticleFn,
  restoreArticleRevisionFn,
  unpublishArticleFn,
  updateArticleFn,
} from "../server/article.functions";
const CmsEditor = lazy(() =>
  import("../editor/cms-editor").then((module) => ({ default: module.CmsEditor })),
);
type Existing = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  seoTitle: string | null;
  seoDescription: string | null;
  canonicalUrl: string | null;
  noIndex: boolean;
  version: number;
  status: string;
  publishedAt: Date | null;
  coverMediaId: string | null;
  categoryIds: string[];
};
type Category = { id: string; name: string };
type Media = { id: string; filename: string; url: string; altText: string | null };
type Revision = { id: string; revision: number; createdAt: Date };
export function ArticleForm({
  article,
  categories = [],
  media = [],
  revisions = [],
}: {
  article?: Existing;
  categories?: Category[];
  media?: Media[];
  revisions?: Revision[];
}) {
  const navigate = useNavigate();
  const [title, setTitle] = useState(article?.title ?? "");
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [slugTouched, setSlugTouched] = useState(Boolean(article));
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? "");
  const [content, setContent] = useState<CmsDocument>(
    article ? parseCmsDocument(article.content) : EMPTY_CMS_DOCUMENT,
  );
  const [seoTitle, setSeoTitle] = useState(article?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(article?.seoDescription ?? "");
  const [canonicalUrl, setCanonicalUrl] = useState(article?.canonicalUrl ?? "");
  const [noIndex, setNoIndex] = useState(article?.noIndex ?? false);
  const [categoryIds, setCategoryIds] = useState(article?.categoryIds ?? []);
  const [coverMediaId, setCoverMediaId] = useState(article?.coverMediaId ?? "");
  const [publishedAt, setPublishedAt] = useState(
    article?.publishedAt ? localDateTime(article.publishedAt) : "",
  );
  const [pending, setPending] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [conflict, setConflict] = useState(false);
  useEffect(() => {
    if (!slugTouched) setSlug(slugify(title));
  }, [slugTouched, title]);
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
      const base = {
        title,
        slug,
        excerpt: excerpt || null,
        content,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        canonicalUrl: canonicalUrl || null,
        noIndex,
        categoryIds,
        coverMediaId: coverMediaId || null,
      };
      const saved = article
        ? await updateArticleFn({ data: { id: article.id, version: article.version, ...base } })
        : await createArticleFn({ data: base });
      setDirty(false);
      toast.success("Articolo salvato");
      void navigate({ to: "/dashboard/cms/articles/$articleId", params: { articleId: saved.id } });
    } catch (error) {
      if (error instanceof Error && error.message.includes("modified elsewhere")) setConflict(true);
      toast.error(error instanceof Error ? error.message : "Salvataggio non riuscito");
    } finally {
      setPending(false);
    }
  }
  async function publish() {
    if (!article) return;
    setPending(true);
    try {
      await publishArticleFn({
        data: {
          id: article.id,
          version: article.version,
          publishedAt: publishedAt ? new Date(publishedAt) : undefined,
        },
      });
      toast.success("Articolo pubblicato");
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Pubblicazione non riuscita");
    } finally {
      setPending(false);
    }
  }
  async function changeStatus(action: "unpublish" | "archive" | "restore") {
    if (!article) return;
    if (action === "archive" && !confirm("Archiviare questo articolo?")) return;
    setPending(true);
    try {
      const data = { id: article.id, version: article.version };
      if (action === "archive") await archiveArticleFn({ data });
      else if (action === "restore") await restoreArticleFn({ data });
      else await unpublishArticleFn({ data });
      toast.success("Stato aggiornato");
      void navigate({ to: "/dashboard/cms/articles", search: { page: 1 } });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Operazione non riuscita");
    } finally {
      setPending(false);
    }
  }
  async function restoreRevision(revisionId: string) {
    if (!article || !confirm("Ripristinare questa revisione? Lo stato tornerà a bozza.")) return;
    setPending(true);
    try {
      await restoreArticleRevisionFn({
        data: { articleId: article.id, revisionId, version: article.version },
      });
      toast.success("Revisione ripristinata");
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Ripristino non riuscito");
    } finally {
      setPending(false);
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
            Questo articolo è stato modificato altrove. Ricarica prima di continuare.
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
            <FieldLabel htmlFor="article-title">Titolo</FieldLabel>
            <Input
              id="article-title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              minLength={3}
              maxLength={160}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="article-slug">Slug</FieldLabel>
            <Input
              id="article-slug"
              value={slug}
              onChange={(event) => {
                setSlugTouched(true);
                setSlug(event.target.value);
              }}
              required
            />
          </Field>
          {article &&
          slug !== article.slug &&
          ["published", "scheduled"].includes(article.status) ? (
            <p className="text-sm text-amber-300">
              Il salvataggio creerà un redirect permanente dal vecchio slug.
            </p>
          ) : null}
          <Field>
            <FieldLabel htmlFor="article-excerpt">Estratto ({excerpt.length}/320)</FieldLabel>
            <Textarea
              id="article-excerpt"
              value={excerpt}
              maxLength={320}
              onChange={(event) => setExcerpt(event.target.value)}
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
      {article && revisions.length ? (
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
                  disabled={pending}
                  onClick={() => void restoreRevision(revision.id)}
                >
                  Ripristina
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
      <Card>
        <CardHeader>
          <CardTitle>Organizzazione</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Field>
            <FieldLabel>Cover</FieldLabel>
            <Select
              value={coverMediaId || "none"}
              onValueChange={(value) => setCoverMediaId(value === "none" ? "" : (value ?? ""))}
            >
              <SelectTrigger className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Nessuna cover</SelectItem>
                {media.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.filename}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <div className="grid gap-3">
            <FieldLabel>Categorie</FieldLabel>
            {categories.length ? (
              categories.map((category) => (
                <Field key={category.id} orientation="horizontal">
                  <Checkbox
                    id={`category-${category.id}`}
                    checked={categoryIds.includes(category.id)}
                    onCheckedChange={(checked) =>
                      setCategoryIds((current) =>
                        checked
                          ? [...current, category.id]
                          : current.filter((id) => id !== category.id),
                      )
                    }
                  />
                  <FieldLabel htmlFor={`category-${category.id}`}>{category.name}</FieldLabel>
                </Field>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">
                Crea prima una categoria dalla sezione Categorie.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Pubblicazione</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Field>
            <FieldLabel htmlFor="published-at">
              Data e ora (lascia vuoto per pubblicare subito)
            </FieldLabel>
            <Input
              id="published-at"
              type="datetime-local"
              value={publishedAt}
              onChange={(event) => setPublishedAt(event.target.value)}
            />
          </Field>
          {article ? (
            <p className="text-sm text-muted-foreground">Stato attuale: {article.status}</p>
          ) : null}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>SEO</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Field>
            <FieldLabel htmlFor="seo-title">Titolo SEO ({seoTitle.length}/70)</FieldLabel>
            <Input
              id="seo-title"
              value={seoTitle}
              maxLength={70}
              onChange={(event) => setSeoTitle(event.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="seo-description">
              Descrizione SEO ({seoDescription.length}/180)
            </FieldLabel>
            <Textarea
              id="seo-description"
              value={seoDescription}
              maxLength={180}
              onChange={(event) => setSeoDescription(event.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="canonical-url">Canonical URL</FieldLabel>
            <Input
              id="canonical-url"
              type="url"
              value={canonicalUrl}
              onChange={(event) => setCanonicalUrl(event.target.value)}
            />
          </Field>
          <Field orientation="horizontal">
            <Checkbox
              id="no-index"
              checked={noIndex}
              onCheckedChange={(checked) => setNoIndex(checked)}
            />
            <FieldLabel htmlFor="no-index">Escludi dai motori di ricerca</FieldLabel>
          </Field>
        </CardContent>
      </Card>
      <div className="flex gap-3">
        <Button disabled={pending} type="submit">
          {pending ? "Salvataggio…" : "Salva bozza"}
        </Button>
        {article && !["published", "scheduled", "archived"].includes(article.status) ? (
          <Button
            disabled={pending}
            type="button"
            variant="secondary"
            onClick={() => void publish()}
          >
            {publishedAt && new Date(publishedAt) > new Date() ? "Programma" : "Pubblica"}
          </Button>
        ) : null}
        {article && ["published", "scheduled"].includes(article.status) ? (
          <Button
            disabled={pending}
            type="button"
            variant="secondary"
            onClick={() => void changeStatus("unpublish")}
          >
            Rimetti in bozza
          </Button>
        ) : null}
        {article && article.status !== "archived" ? (
          <Button
            disabled={pending}
            type="button"
            variant="destructive"
            onClick={() => void changeStatus("archive")}
          >
            Archivia
          </Button>
        ) : null}
        {article?.status === "archived" ? (
          <Button
            disabled={pending}
            type="button"
            variant="secondary"
            onClick={() => void changeStatus("restore")}
          >
            Ripristina come bozza
          </Button>
        ) : null}
        {article ? (
          <Button
            type="button"
            variant="outline"
            onClick={() =>
              window.open(
                `/dashboard/cms/articles/${article.id}/preview`,
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

function localDateTime(value: Date) {
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}
