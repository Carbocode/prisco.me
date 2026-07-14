import { useNavigate } from "@tanstack/react-router";
import { lazy, Suspense, useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { EMPTY_CMS_DOCUMENT, parseCmsDocument, type CmsDocument } from "../domain/cms-document";
import { slugify } from "../domain/slug";
import { createArticleFn, publishArticleFn, updateArticleFn } from "../server/article.functions";
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
};
export function ArticleForm({ article }: { article?: Existing }) {
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
  const [pending, setPending] = useState(false);
  const [dirty, setDirty] = useState(false);
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
        categoryIds: [],
      };
      const saved = article
        ? await updateArticleFn({ data: { id: article.id, version: article.version, ...base } })
        : await createArticleFn({ data: base });
      setDirty(false);
      toast.success("Articolo salvato");
      void navigate({ to: "/dashboard/cms/articles/$articleId", params: { articleId: saved.id } });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Salvataggio non riuscito");
    } finally {
      setPending(false);
    }
  }
  async function publish() {
    if (!article) return;
    setPending(true);
    try {
      await publishArticleFn({ data: { id: article.id, version: article.version } });
      toast.success("Articolo pubblicato");
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Pubblicazione non riuscita");
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
        {article && !["published", "scheduled"].includes(article.status) ? (
          <Button
            disabled={pending}
            type="button"
            variant="secondary"
            onClick={() => void publish()}
          >
            Pubblica
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
