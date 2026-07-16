import { useNavigate, useRouter } from "@tanstack/react-router";
import {
  Archive,
  ArchiveRestore,
  ArrowDown,
  ArrowUp,
  Eye,
  Plus,
  Save,
  Send,
  Undo2,
  X,
} from "lucide-react";
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
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useMediaQuery } from "@/hooks/use-media-query";

import { MediaPicker } from "./media-picker";

import { EMPTY_CMS_DOCUMENT, parseCmsDocument, type CmsDocument } from "../domain/cms-document";
import { slugify, slugInputPattern, slugPattern } from "../domain/slug";
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
  import("@/features/editor/cms-editor").then((module) => ({ default: module.CmsEditor })),
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
const articleStatusLabels: Record<string, string> = {
  archived: "Archiviato",
  draft: "Bozza",
  published: "Pubblicato",
  scheduled: "Programmato",
};
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
  const router = useRouter();
  const isDesktop = useMediaQuery("(min-width: 1280px)");
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
  const [projectFeatured, setProjectFeatured] = useState(article?.projectFeatured ?? false);
  const [projectSortOrder, setProjectSortOrder] = useState(article?.projectSortOrder ?? 0);
  const [publishedAt, setPublishedAt] = useState(
    article?.publishedAt ? localDateTime(article.publishedAt) : "",
  );
  const [version, setVersion] = useState(article?.version ?? 0);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [saveFeedback, setSaveFeedback] = useState<{
    type: "pending" | "success" | "error";
    title: string;
    description: string;
  } | null>(null);
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
  async function save() {
    if (pending) return;
    const validationError = validateArticleInput({
      title,
      slug,
      categoryIds,
      projectSortOrder,
    });
    if (validationError) {
      setSaveFeedback({
        type: "error",
        title: "Impossibile salvare",
        description: validationError,
      });
      toast.error(validationError, { id: "article-save" });
      return;
    }
    const toastId = toast.loading(article ? "Salvataggio modifiche…" : "Creazione bozza…", {
      id: "article-save",
    });
    setSaveFeedback({
      type: "pending",
      title: "Salvataggio in corso",
      description: "Invio delle modifiche al server…",
    });
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
        projectFeatured,
        projectSortOrder,
      };
      const saved = article
        ? await updateArticleFn({ data: { id: article.id, version, ...base } })
        : await createArticleFn({ data: base });
      setVersion(saved.version);
      setDirty(false);
      const savedAt = new Date();
      setLastSavedAt(savedAt);
      setSaveFeedback({
        type: "success",
        title: "Modifiche salvate",
        description: `Salvataggio completato alle ${savedAt.toLocaleTimeString("it-IT")}.`,
      });
      toast.success("Articolo salvato correttamente", { id: toastId });
      if (article) void router.invalidate();
      else
        void navigate({ to: "/dashboard/cms/articles/$articleId", params: { articleId: saved.id } });
    } catch (error) {
      const message = articleSaveError(error);
      if (message.type === "conflict") setConflict(true);
      setSaveFeedback({
        type: "error",
        title: "Salvataggio non riuscito",
        description: message.text,
      });
      toast.error(message.text, { id: toastId });
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
          version,
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
      const data = { id: article.id, version };
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
        data: { articleId: article.id, revisionId, version },
      });
      toast.success("Revisione ripristinata");
      window.location.reload();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Ripristino non riuscito");
    } finally {
      setPending(false);
    }
  }
  const statusLabel = article
    ? (articleStatusLabels[article.status] ?? article.status)
    : "Nuova bozza";
  return (
    <form
      className="flex flex-col xl:h-[calc(100svh-3.5rem)] xl:overflow-hidden"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        void save();
      }}
      onChange={() => setDirty(true)}
    >
      <header className="sticky top-0 z-20 grid gap-1 border-b bg-background px-4 py-2 xl:shrink-0">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <h1 className="truncate font-heading text-lg font-semibold">
              {title || (article ? "Articolo senza titolo" : "Nuovo articolo")}
            </h1>
            <Badge variant={article ? "secondary" : "outline"}>Stato: {statusLabel}</Badge>
            {dirty ? (
              <Badge variant="outline">Modifiche non salvate</Badge>
            ) : lastSavedAt ? (
              <Badge variant="secondary">
                Salvato alle {lastSavedAt.toLocaleTimeString("it-IT")}
              </Badge>
            ) : null}
          </div>
          <fieldset className="flex flex-wrap gap-2">
            <legend className="sr-only">Azioni articolo</legend>
            {article ? (
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  window.open(
                    `/preview/articles/${article.id}`,
                    "_blank",
                    "noopener,noreferrer",
                  )
                }
              >
                <Eye data-icon="inline-start" />
                Apri anteprima
              </Button>
            ) : null}
            <Button type="button" disabled={pending} onClick={() => void save()}>
              {pending ? <Spinner data-icon="inline-start" /> : <Save data-icon="inline-start" />}
              {pending ? "Salvataggio…" : article ? "Salva modifiche" : "Crea bozza"}
            </Button>
            {article && !["published", "scheduled", "archived"].includes(article.status) ? (
              <Button
                disabled={pending || dirty}
                type="button"
                variant="secondary"
                onClick={() => void publish()}
              >
                <Send data-icon="inline-start" />
                {dirty
                  ? "Salva prima di pubblicare"
                  : publishedAt && new Date(publishedAt) > new Date()
                    ? "Programma pubblicazione"
                    : "Pubblica ora"}
              </Button>
            ) : null}
            {article && ["published", "scheduled"].includes(article.status) ? (
              <Button
                disabled={pending}
                type="button"
                variant="secondary"
                onClick={() => void changeStatus("unpublish")}
              >
                <Undo2 data-icon="inline-start" />
                Ritira e torna in bozza
              </Button>
            ) : null}
            {article && article.status !== "archived" ? (
              <Button
                disabled={pending}
                type="button"
                variant="destructive"
                onClick={() => void changeStatus("archive")}
              >
                <Archive data-icon="inline-start" />
                Archivia articolo
              </Button>
            ) : null}
            {article?.status === "archived" ? (
              <Button
                disabled={pending}
                type="button"
                variant="secondary"
                onClick={() => void changeStatus("restore")}
              >
                <ArchiveRestore data-icon="inline-start" />
                Ripristina articolo
              </Button>
            ) : null}
          </fieldset>
        </div>
        <span className="text-sm text-muted-foreground">
          /{publicArchiveSlug}/{slug || "slug-articolo"}
        </span>
      </header>
      {saveFeedback ? (
        <Alert variant={saveFeedback.type === "error" ? "destructive" : "default"}>
          <AlertTitle>{saveFeedback.title}</AlertTitle>
          <AlertDescription>{saveFeedback.description}</AlertDescription>
        </Alert>
      ) : null}
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
      {(() => {
        const editorPane = (
          <div className="flex min-w-0 flex-col xl:h-full xl:min-h-0 xl:overflow-y-auto">
            <Suspense fallback={<Skeleton className="h-96 w-full" />}>
              <CmsEditor
                value={content}
                media={media}
                onChange={(value) => {
                  setContent(value);
                  setDirty(true);
                }}
              />
            </Suspense>
          </div>
        );
        const sidebarPane = (
          <aside className="flex flex-col gap-4 p-4 xl:h-full xl:min-h-0 xl:overflow-y-auto">
            <FieldGroup>
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
            </FieldGroup>
            <Separator />
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
                      <MediaPicker
                        items={imageMedia}
                        value={coverMediaId}
                        label="Scegli la cover"
                        description="Naviga la libreria immagini e seleziona la cover dell’articolo."
                        emptyLabel="Nessuna cover"
                        onValueChange={(value) => {
                          setCoverMediaId(value);
                          setDirty(true);
                        }}
                      />
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
                      <FieldDescription>
                        Facoltativo. Se resta vuoto, viene usato il titolo dell’articolo.
                      </FieldDescription>
                    </Field>
                    <Field>
                      <FieldLabel htmlFor="seo-description">
                        Descrizione personalizzata ({seoDescription.length}/180)
                      </FieldLabel>
                      <Textarea
                        id="seo-description"
                        value={seoDescription}
                        maxLength={180}
                        placeholder={
                          excerpt ? excerpt.slice(0, 180) : "Usa l’estratto dell’articolo"
                        }
                        onChange={(event) => setSeoDescription(event.target.value)}
                      />
                      <FieldDescription>
                        Facoltativa. Se resta vuota, viene usato l’estratto; se manca anche
                        l’estratto, la descrizione viene generata dal titolo e dall’autore.
                      </FieldDescription>
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
        );
        if (!isDesktop) {
          return (
            <div className="flex flex-col gap-4">
              {editorPane}
              {sidebarPane}
            </div>
          );
        }
        return (
          <ResizablePanelGroup
            orientation="horizontal"
            className="min-h-0 flex-1 items-stretch overflow-hidden"
          >
            <ResizablePanel defaultSize="55%" minSize="40%" className="h-full min-w-0">
              {editorPane}
            </ResizablePanel>
            <ResizableHandle withHandle />
            <ResizablePanel
              defaultSize="45%"
              minSize="32%"
              maxSize="55%"
              className="h-full min-w-0"
            >
              {sidebarPane}
            </ResizablePanel>
          </ResizablePanelGroup>
        );
      })()}
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

function validateArticleInput({
  title,
  slug,
  categoryIds,
  projectSortOrder,
}: {
  title: string;
  slug: string;
  categoryIds: string[];
  projectSortOrder: number;
}) {
  if (title.trim().length < 3) return "Il titolo deve contenere almeno 3 caratteri.";
  if (!slugPattern.test(slug) || /^\d+$/.test(slug))
    return "Lo slug deve contenere solo lettere minuscole, numeri e trattini.";
  if (["authors", "categories", "tags"].includes(slug)) return "Questo slug è riservato.";
  if (!categoryIds.length) return "Seleziona una categoria prima di salvare.";
  if (!Number.isInteger(projectSortOrder) || projectSortOrder < -10000 || projectSortOrder > 10000)
    return "L’ordine del progetto deve essere un numero intero tra -10000 e 10000.";
  return null;
}

function articleSaveError(error: unknown) {
  const detail = error instanceof Error ? error.message : String(error);
  if (detail.includes("modified elsewhere") || detail.includes("CONTENT_VERSION_CONFLICT")) {
    return {
      type: "conflict" as const,
      text: "L’articolo è stato modificato altrove. Ricarica la pagina prima di salvare.",
    };
  }
  if (detail.includes("Slug already in use") || detail.includes("SLUG_CONFLICT")) {
    return { type: "error" as const, text: "Lo slug è già utilizzato da un altro articolo." };
  }
  return {
    type: "error" as const,
    text: detail && detail !== "[object Object]" ? detail : "Salvataggio non riuscito.",
  };
}

function localDateTime(value: Date) {
  const date = new Date(value);
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}
