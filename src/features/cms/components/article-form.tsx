import { useNavigate } from "@tanstack/react-router";
import { ArrowDown, ArrowUp, Plus, X } from "lucide-react";
import { lazy, Suspense, useEffect, useState } from "react";
import { toast } from "sonner";

import { SkillGlyph } from "@/components/tech-icon";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemTitle,
} from "@/components/ui/item";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";

import { EMPTY_CMS_DOCUMENT, parseCmsDocument, type CmsDocument } from "../domain/cms-document";
import { slugify, slugInputPattern } from "../domain/slug";
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
  noIndex: boolean;
  version: number;
  status: string;
  publishedAt: Date | null;
  coverMediaId: string | null;
  organizationId: string | null;
  projectRole: string | null;
  projectPeriod: string | null;
  projectFeatured: boolean;
  projectSortOrder: number;
  categoryIds: string[];
  tagIds: string[];
};
type Category = { id: string; name: string; slug: string };
type Tag = {
  id: string;
  name: string;
  categoryId: string;
  icon: string | null;
  color: string;
  mark: string | null;
  fluentIcon: string | null;
};
type Organization = { id: string; name: string; type: string };
type Media = {
  id: string;
  filename: string;
  url: string;
  altText: string | null;
  mimeType: string;
};
type Revision = { id: string; revision: number; createdAt: Date };
export function ArticleForm({
  article,
  categories = [],
  tags = [],
  organizations = [],
  media = [],
  revisions = [],
}: {
  article?: Existing;
  categories?: Category[];
  tags?: Tag[];
  organizations?: Organization[];
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
  const [noIndex, setNoIndex] = useState(article?.noIndex ?? false);
  const [categoryIds, setCategoryIds] = useState(article?.categoryIds.slice(0, 1) ?? []);
  const [tagIds, setTagIds] = useState(article?.tagIds ?? []);
  const [pendingCategoryId, setPendingCategoryId] = useState<string | null>(null);
  const [coverMediaId, setCoverMediaId] = useState(article?.coverMediaId ?? "");
  const [organizationId, setOrganizationId] = useState(article?.organizationId ?? "");
  const [projectRole, setProjectRole] = useState(article?.projectRole ?? "");
  const [projectPeriod, setProjectPeriod] = useState(article?.projectPeriod ?? "");
  const [projectFeatured, setProjectFeatured] = useState(article?.projectFeatured ?? false);
  const [projectSortOrder, setProjectSortOrder] = useState(article?.projectSortOrder ?? 0);
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
  const activeCategoryId = categoryIds[0] ?? "";
  const imageMedia = media.filter((item) => item.mimeType.startsWith("image/"));
  const activeCategorySlug = categories.find((item) => item.id === activeCategoryId)?.slug;
  const publicArchiveSlug = activeCategorySlug ?? "categoria";
  const selectedTags = tagIds.flatMap((id) => {
    const tag = tags.find((item) => item.id === id);
    return tag ? [tag] : [];
  });
  const availableTags = tags.filter(
    (tag) => tag.categoryId === activeCategoryId && !tagIds.includes(tag.id),
  );
  function applyCategory(categoryId: string) {
    setCategoryIds([categoryId]);
    setTagIds([]);
    setDirty(true);
    setPendingCategoryId(null);
  }
  function requestCategoryChange(categoryId: string) {
    if (categoryId === activeCategoryId) return;
    if (tagIds.length) {
      setPendingCategoryId(categoryId);
      return;
    }
    applyCategory(categoryId);
  }
  function moveTag(index: number, offset: -1 | 1) {
    const destination = index + offset;
    if (destination < 0 || destination >= tagIds.length) return;
    setTagIds((current) => {
      const next = [...current];
      [next[index], next[destination]] = [next[destination], next[index]];
      return next;
    });
    setDirty(true);
  }
  async function save(event: React.FormEvent) {
    event.preventDefault();
    if (!categoryIds.length) {
      toast.error("Seleziona almeno una categoria");
      return;
    }
    setPending(true);
    try {
      const base = {
        title,
        slug,
        excerpt: excerpt || null,
        content,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        noIndex,
        categoryIds,
        tagIds,
        coverMediaId: coverMediaId || null,
        organizationId: organizationId || null,
        projectRole: projectRole || null,
        projectPeriod: projectPeriod || null,
        projectFeatured,
        projectSortOrder,
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
      className="flex flex-col gap-4"
      onSubmit={(event) => void save(event)}
      onChange={() => setDirty(true)}
    >
      <header className="sticky top-0 z-20 grid gap-1 border-b bg-background py-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <h1 className="truncate font-heading text-lg font-semibold">
              {title || (article ? "Articolo senza titolo" : "Nuovo articolo")}
            </h1>
            <Badge variant={article ? "secondary" : "outline"}>
              {article ? article.status : "bozza"}
            </Badge>
            {dirty ? <Badge variant="outline">Modifiche non salvate</Badge> : null}
          </div>
          <ButtonGroup>
            {article ? (
              <Button
                type="button"
                size="sm"
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
            <Button type="submit" size="sm" disabled={pending}>
              {pending ? <Spinner data-icon="inline-start" /> : null}
              {pending ? "Salvataggio…" : "Salva bozza"}
            </Button>
            {article && !["published", "scheduled", "archived"].includes(article.status) ? (
              <Button
                disabled={pending}
                type="button"
                size="sm"
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
                size="sm"
                variant="secondary"
                onClick={() => void changeStatus("unpublish")}
              >
                Bozza
              </Button>
            ) : null}
            {article && article.status !== "archived" ? (
              <Button
                disabled={pending}
                type="button"
                size="sm"
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
                size="sm"
                variant="secondary"
                onClick={() => void changeStatus("restore")}
              >
                Ripristina
              </Button>
            ) : null}
          </ButtonGroup>
        </div>
        <span className="text-sm text-muted-foreground">
          /{publicArchiveSlug}/{slug || "slug-articolo"}
        </span>
      </header>
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
      <div className="grid items-start gap-4 xl:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="grid min-w-0 gap-3">
          <Field>
            <FieldLabel htmlFor="article-title">Titolo dell’articolo</FieldLabel>
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
            <FieldLabel htmlFor="article-excerpt">
              Estratto per anteprime ({excerpt.length}/320)
            </FieldLabel>
            <Textarea
              id="article-excerpt"
              value={excerpt}
              maxLength={320}
              onChange={(event) => setExcerpt(event.target.value)}
            />
          </Field>
          <Suspense fallback={<Skeleton className="h-96 w-full" />}>
            <CmsEditor
              value={content}
              media={imageMedia}
              onChange={(value) => {
                setContent(value);
                setDirty(true);
              }}
            />
          </Suspense>
        </div>
        <aside>
          <Accordion multiple defaultValue={["article", "taxonomy"]}>
            <AccordionItem value="article">
              <AccordionTrigger>Articolo</AccordionTrigger>
              <AccordionContent>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="article-slug">Slug</FieldLabel>
                    <Input
                      id="article-slug"
                      value={slug}
                      pattern={slugInputPattern}
                      title="Usa lettere, numeri e trattini; lo slug non puo contenere solo numeri"
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
                    <Alert>
                      <AlertTitle>Redirect automatico</AlertTitle>
                      <AlertDescription>
                        Il salvataggio manterrà raggiungibile il vecchio indirizzo.
                      </AlertDescription>
                    </Alert>
                  ) : null}
                  <Field>
                    <FieldLabel>Cover</FieldLabel>
                    <Select
                      items={[
                        { value: "none", label: "Nessuna cover" },
                        ...imageMedia.map((item) => ({ value: item.id, label: item.filename })),
                      ]}
                      value={coverMediaId || "none"}
                      onValueChange={(value) =>
                        setCoverMediaId(value === "none" ? "" : (value ?? ""))
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="none">Nessuna cover</SelectItem>
                          {imageMedia.map((item) => (
                            <SelectItem key={item.id} value={item.id}>
                              {item.filename}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </Field>
                  {categoryIds.includes(
                    categories.find((item) => item.slug === "progetti")?.id ?? "",
                  ) ? (
                    <>
                      <Field>
                        <FieldLabel>Organizzazione</FieldLabel>
                        <Select
                          items={[
                            { value: "none", label: "Nessuna organizzazione" },
                            ...organizations.map((organization) => ({
                              value: organization.id,
                              label: `${organization.name} · ${organization.type === "education" ? "Istruzione" : "Azienda"}`,
                            })),
                          ]}
                          value={organizationId || "none"}
                          onValueChange={(value) =>
                            setOrganizationId(value === "none" ? "" : (value ?? ""))
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              <SelectItem value="none">Nessuna organizzazione</SelectItem>
                              {organizations.map((organization) => (
                                <SelectItem key={organization.id} value={organization.id}>
                                  {organization.name} ·{" "}
                                  {organization.type === "education" ? "Istruzione" : "Azienda"}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="project-role">Ruolo</FieldLabel>
                        <Input
                          id="project-role"
                          value={projectRole}
                          onChange={(event) => setProjectRole(event.target.value)}
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="project-period">Periodo</FieldLabel>
                        <Input
                          id="project-period"
                          value={projectPeriod}
                          onChange={(event) => setProjectPeriod(event.target.value)}
                        />
                      </Field>
                      <Field>
                        <FieldLabel htmlFor="project-sort-order">Ordine</FieldLabel>
                        <Input
                          id="project-sort-order"
                          type="number"
                          min={-10000}
                          max={10000}
                          value={projectSortOrder}
                          onChange={(event) => setProjectSortOrder(event.target.valueAsNumber)}
                        />
                      </Field>
                      <Field orientation="horizontal">
                        <Checkbox
                          id="project-featured"
                          checked={projectFeatured}
                          onCheckedChange={setProjectFeatured}
                        />
                        <FieldLabel htmlFor="project-featured">Progetto in evidenza</FieldLabel>
                      </Field>
                    </>
                  ) : null}
                </FieldGroup>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="publishing">
              <AccordionTrigger>Pubblicazione</AccordionTrigger>
              <AccordionContent>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="published-at">Data e ora</FieldLabel>
                    <Input
                      id="published-at"
                      type="datetime-local"
                      value={publishedAt}
                      onChange={(event) => setPublishedAt(event.target.value)}
                    />
                  </Field>
                </FieldGroup>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="taxonomy">
              <AccordionTrigger>Tassonomie</AccordionTrigger>
              <AccordionContent>
                <FieldGroup>
                  <FieldSet>
                    <FieldLegend variant="label">Categoria (obbligatoria)</FieldLegend>
                    <RadioGroup value={activeCategoryId} onValueChange={requestCategoryChange}>
                      {categories.map((category) => (
                        <Field key={category.id} orientation="horizontal">
                          <RadioGroupItem
                            id={`category-${category.id}`}
                            value={category.id}
                            required
                          />
                          <FieldLabel htmlFor={`category-${category.id}`}>
                            {category.name}
                          </FieldLabel>
                        </Field>
                      ))}
                    </RadioGroup>
                    {!categories.length ? (
                      <FieldDescription>Nessuna categoria disponibile.</FieldDescription>
                    ) : null}
                  </FieldSet>
                  <FieldSet>
                    <FieldLegend variant="label">Tag</FieldLegend>
                    <FieldDescription>
                      L'ordine mostrato qui verrà salvato e usato nella pubblicazione.
                    </FieldDescription>
                    {selectedTags.length ? (
                      <ItemGroup>
                        {selectedTags.map((tag, index) => (
                          <Item key={tag.id} variant="outline" size="xs">
                            <ItemContent>
                              <ItemTitle>
                                <Badge className={tag.color}>
                                  <SkillGlyph skill={tag} size={14} />
                                  {tag.name}
                                </Badge>
                              </ItemTitle>
                            </ItemContent>
                            <ItemActions>
                              <ButtonGroup>
                                <Button
                                  type="button"
                                  size="icon-sm"
                                  variant="outline"
                                  disabled={index === 0}
                                  aria-label={`Sposta ${tag.name} in alto`}
                                  onClick={() => moveTag(index, -1)}
                                >
                                  <ArrowUp />
                                </Button>
                                <Button
                                  type="button"
                                  size="icon-sm"
                                  variant="outline"
                                  disabled={index === selectedTags.length - 1}
                                  aria-label={`Sposta ${tag.name} in basso`}
                                  onClick={() => moveTag(index, 1)}
                                >
                                  <ArrowDown />
                                </Button>
                                <Button
                                  type="button"
                                  size="icon-sm"
                                  variant="outline"
                                  aria-label={`Rimuovi ${tag.name}`}
                                  onClick={() => {
                                    setTagIds((current) => current.filter((id) => id !== tag.id));
                                    setDirty(true);
                                  }}
                                >
                                  <X />
                                </Button>
                              </ButtonGroup>
                            </ItemActions>
                          </Item>
                        ))}
                      </ItemGroup>
                    ) : (
                      <FieldDescription>Nessun tag selezionato.</FieldDescription>
                    )}
                    <DropdownMenu>
                      <DropdownMenuTrigger
                        render={
                          <Button
                            type="button"
                            size="icon-sm"
                            variant="outline"
                            disabled={!activeCategoryId || !availableTags.length}
                            aria-label="Aggiungi tag"
                          />
                        }
                      >
                        <Plus />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="min-w-56">
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Tag disponibili</DropdownMenuLabel>
                          {availableTags.map((tag) => (
                            <DropdownMenuItem
                              key={tag.id}
                              onClick={() => {
                                setTagIds((current) => [...current, tag.id]);
                                setDirty(true);
                              }}
                            >
                              <SkillGlyph skill={tag} size={14} />
                              {tag.name}
                            </DropdownMenuItem>
                          ))}
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </FieldSet>
                </FieldGroup>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="seo">
              <AccordionTrigger>SEO</AccordionTrigger>
              <AccordionContent>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="seo-title">
                      Titolo personalizzato ({seoTitle.length}/70)
                    </FieldLabel>
                    <Input
                      id="seo-title"
                      value={seoTitle}
                      maxLength={70}
                      placeholder={title ? title.slice(0, 70) : "Usa il titolo dell’articolo"}
                      onChange={(event) => setSeoTitle(event.target.value)}
                    />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="seo-description">
                      Descrizione personalizzata ({seoDescription.length}/180)
                    </FieldLabel>
                    <Textarea
                      id="seo-description"
                      value={seoDescription}
                      maxLength={180}
                      placeholder={excerpt ? excerpt.slice(0, 180) : "Usa l’estratto dell’articolo"}
                      onChange={(event) => setSeoDescription(event.target.value)}
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
                </FieldGroup>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="revisions">
              <AccordionTrigger>Revisioni</AccordionTrigger>
              <AccordionContent>
                {article && revisions.length ? (
                  <ItemGroup>
                    {revisions.map((revision) => (
                      <Item key={revision.id} variant="outline">
                        <ItemContent>
                          <ItemTitle>Revisione {revision.revision}</ItemTitle>
                          <ItemDescription>
                            {revision.createdAt.toLocaleString("it-IT")}
                          </ItemDescription>
                        </ItemContent>
                        <ItemActions>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            disabled={pending}
                            onClick={() => void restoreRevision(revision.id)}
                          >
                            Ripristina
                          </Button>
                        </ItemActions>
                      </Item>
                    ))}
                  </ItemGroup>
                ) : (
                  <p>Nessuna revisione.</p>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </aside>
      </div>
      <AlertDialog
        open={pendingCategoryId !== null}
        onOpenChange={(open) => {
          if (!open) setPendingCategoryId(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cambiare categoria?</AlertDialogTitle>
            <AlertDialogDescription>
              I {tagIds.length} tag già selezionati verranno rimossi. Questa operazione evita di
              associare all'articolo tag appartenenti alla categoria precedente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (pendingCategoryId) applyCategory(pendingCategoryId);
              }}
            >
              Cambia categoria
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  );
}

function localDateTime(value: Date) {
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}
