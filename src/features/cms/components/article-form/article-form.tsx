import {
  Archive,
  ArchiveRestore,
  ArrowDown,
  ArrowUp,
  Eye,
  MoreHorizontal,
  PanelRight,
  Plus,
  Save,
  Send,
  Undo2,
  X,
} from "lucide-react";
import { lazy, Suspense, useState } from "react";

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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription } from "@/components/ui/empty";
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
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useArticleSiteTools } from "@/features/cms/client/use-article-site-tools";
import { RevisionComparison } from "@/features/cms/components/article-form/revision-comparison";
import { MediaPicker } from "@/features/cms/components/media-picker";
import { slugInputPattern } from "@/features/cms/domain/slug";
import { SkillGlyph } from "@/features/portfolio/components/tech-icon";

import type { ArticleFormProps } from "./article-form.types";
import { useArticleForm } from "./use-article-form";

const CmsEditor = lazy(() =>
  import("@/features/editor/cms-editor").then((module) => ({ default: module.CmsEditor })),
);
export function ArticleForm(props: ArticleFormProps) {
  const state = useArticleForm(props);
  const [propertiesOpen, setPropertiesOpen] = useState(false);
  useArticleSiteTools(state);
  const {
    article,
    categories,
    tags,
    organizations,
    experiences,
    media,
    revisions,
    canPublish,
    canRestore,
    canArchive,
    readOnly,
    isDesktop,
    title,
    setTitle,
    setSlug,
    setSlugTouched,
    excerpt,
    setExcerpt,
    content,
    setContent,
    seoTitle,
    setSeoTitle,
    seoDescription,
    setSeoDescription,
    noIndex,
    setNoIndex,
    categoryIds,
    experienceIds,
    setExperienceIds,
    tagIds,
    setTagIds,
    confirmAction,
    setConfirmAction,
    previewRevision,
    setPreviewRevision,
    pendingCategoryId,
    setPendingCategoryId,
    coverMediaId,
    setCoverMediaId,
    organizationId,
    setOrganizationId,
    projectRole,
    setProjectRole,
    projectPeriod,
    setProjectPeriod,
    canonicalUrl,
    setCanonicalUrl,
    projectFeatured,
    setProjectFeatured,
    projectSortOrder,
    setProjectSortOrder,
    publishedAt,
    setPublishedAt,
    renderTime,
    setRenderTime,
    lastSavedAt,
    pending,
    dirty,
    setDirty,
    blocker,
    conflict,
    effectiveSlug,
    activeCategoryId,
    imageMedia,
    publicArchiveSlug,
    selectedTags,
    availableTags,
    applyCategory,
    requestCategoryChange,
    moveTag,
    save,
    publish,
    changeStatus,
    restoreRevision,
    statusLabel,
  } = state;
  return (
    <form
      className="flex h-(--layout-h-hero-viewport) min-h-0 flex-col overflow-hidden"
      noValidate
      onSubmit={(event) => {
        event.preventDefault();
        void save();
      }}
      onChange={() => setDirty(true)}
    >
      <header className="grid shrink-0 gap-2 border-b bg-background px-4 py-3">
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
            <Button
              type="button"
              variant="outline"
              aria-expanded={propertiesOpen}
              aria-controls="article-properties"
              onClick={() => setPropertiesOpen((open) => !open)}
            >
              <PanelRight data-icon="inline-start" />
              Proprietà
            </Button>
            {article ? (
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  window.open(`/preview/articles/${article.id}`, "_blank", "noopener,noreferrer")
                }
              >
                <Eye data-icon="inline-start" />
                Apri anteprima
              </Button>
            ) : null}
            <Button type="button" disabled={pending || readOnly} onClick={() => void save()}>
              {pending ? <Spinner data-icon="inline-start" /> : <Save data-icon="inline-start" />}
              {pending ? "Salvataggio…" : article ? "Salva modifiche" : "Crea bozza"}
            </Button>
            {article && canPublish && article.status !== "archived" ? (
              <Button
                disabled={pending || dirty}
                type="button"
                variant="secondary"
                onClick={() => void publish()}
              >
                <Send data-icon="inline-start" />
                {dirty
                  ? "Salva prima di pubblicare"
                  : publishedAt && new Date(publishedAt).getTime() > renderTime
                    ? "Programma pubblicazione"
                    : "Pubblica ora"}
              </Button>
            ) : null}
            {article && (canPublish || canArchive || canRestore) ? (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      aria-label="Altre azioni articolo"
                      disabled={pending}
                    />
                  }
                >
                  <MoreHorizontal />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel>Gestisci articolo</DropdownMenuLabel>
                    {canPublish && ["published", "scheduled"].includes(article.status) ? (
                      <DropdownMenuItem onClick={() => void changeStatus("unpublish")}>
                        <Undo2 />
                        Ritira e torna in bozza
                      </DropdownMenuItem>
                    ) : null}
                    {canArchive && article.status !== "archived" ? (
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={() => setConfirmAction({ kind: "archive" })}
                      >
                        <Archive />
                        Archivia articolo
                      </DropdownMenuItem>
                    ) : null}
                    {canRestore && article.status === "archived" ? (
                      <DropdownMenuItem onClick={() => void changeStatus("restore")}>
                        <ArchiveRestore />
                        Ripristina articolo
                      </DropdownMenuItem>
                    ) : null}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </fieldset>
        </div>
        <span className="truncate text-sm text-muted-foreground">
          /{publicArchiveSlug}/{effectiveSlug || "slug-articolo"}
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
      {(() => {
        const editorPane = (
          <section
            aria-label="Scrittura articolo"
            className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto"
          >
            <div className="mx-auto w-full max-w-4xl pt-8 pr-8 pb-6 pl-24">
              <FieldSet disabled={readOnly || pending}>
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
              </FieldSet>
            </div>
            <Separator />
            <Suspense fallback={<Skeleton className="h-96 w-full" />}>
              <CmsEditor
                readOnly={readOnly || pending}
                value={content}
                media={media}
                onChange={(value) => {
                  setContent(value);
                  setDirty(true);
                }}
              />
            </Suspense>
          </section>
        );
        const sidebarPane = (
          <aside
            id="article-properties"
            aria-label="Proprietà e pubblicazione"
            className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4"
          >
            <FieldSet disabled={readOnly || pending}>
              <Tabs defaultValue="properties">
                <TabsList aria-label="Impostazioni articolo">
                  <TabsTrigger value="properties">Articolo</TabsTrigger>
                  <TabsTrigger value="visibility">Visibilità</TabsTrigger>
                  <TabsTrigger value="history">Revisioni</TabsTrigger>
                </TabsList>
                <TabsContent value="properties">
                  <Accordion multiple defaultValue={["taxonomy", "article"]}>
                    <AccordionItem value="taxonomy">
                      <AccordionTrigger>Tassonomie</AccordionTrigger>
                      <AccordionContent>
                        <FieldGroup>
                          <FieldSet>
                            <FieldLegend variant="label">Categoria (obbligatoria)</FieldLegend>
                            <RadioGroup
                              value={activeCategoryId}
                              onValueChange={requestCategoryChange}
                            >
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
                                        <Badge>
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
                                            setTagIds((current) =>
                                              current.filter((id) => id !== tag.id),
                                            );
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
                    <AccordionItem value="article">
                      <AccordionTrigger>Articolo</AccordionTrigger>
                      <AccordionContent>
                        <FieldGroup>
                          <Field>
                            <FieldLabel htmlFor="article-slug">Slug</FieldLabel>
                            <Input
                              id="article-slug"
                              value={effectiveSlug}
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
                          effectiveSlug !== article.slug &&
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
                              <FieldSet>
                                <FieldLegend>Esperienze collegate</FieldLegend>
                                {experiences.map((experience) => (
                                  <Field key={experience.id} orientation="horizontal">
                                    <Checkbox
                                      id={`experience-${experience.id}`}
                                      checked={experienceIds.includes(experience.id)}
                                      onCheckedChange={(checked) => {
                                        setExperienceIds((current) =>
                                          checked
                                            ? [...current, experience.id]
                                            : current.filter((id) => id !== experience.id),
                                        );
                                        setDirty(true);
                                      }}
                                    />
                                    <FieldLabel htmlFor={`experience-${experience.id}`}>
                                      {experience.title} · {experience.org}
                                    </FieldLabel>
                                  </Field>
                                ))}
                              </FieldSet>
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
                                  onValueChange={(value) => {
                                    setOrganizationId(value === "none" ? "" : (value ?? ""));
                                    setDirty(true);
                                  }}
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
                                          {organization.type === "education"
                                            ? "Istruzione"
                                            : "Azienda"}
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
                                  maxLength={160}
                                  onChange={(event) => setProjectRole(event.target.value)}
                                />
                              </Field>
                              <Field>
                                <FieldLabel htmlFor="project-period">Periodo</FieldLabel>
                                <Input
                                  id="project-period"
                                  value={projectPeriod}
                                  maxLength={160}
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
                                  onChange={(event) =>
                                    setProjectSortOrder(event.target.valueAsNumber)
                                  }
                                />
                              </Field>
                              <Field orientation="horizontal">
                                <Checkbox
                                  id="project-featured"
                                  checked={projectFeatured}
                                  onCheckedChange={(checked) => {
                                    setProjectFeatured(checked);
                                    setDirty(true);
                                  }}
                                />
                                <FieldLabel htmlFor="project-featured">
                                  Progetto in evidenza
                                </FieldLabel>
                              </Field>
                            </>
                          ) : null}
                        </FieldGroup>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </TabsContent>
                <TabsContent value="visibility">
                  <Accordion multiple defaultValue={["publishing", "seo"]}>
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
                              onChange={(event) => {
                                setPublishedAt(event.target.value);
                                setRenderTime(Date.now());
                              }}
                            />
                          </Field>
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
                              placeholder={
                                title ? title.slice(0, 70) : "Usa il titolo dell’articolo"
                              }
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
                          <Field>
                            <FieldLabel htmlFor="canonical-url">URL canonico</FieldLabel>
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
                              onCheckedChange={(checked) => {
                                setNoIndex(checked);
                                setDirty(true);
                              }}
                            />
                            <FieldLabel htmlFor="no-index">
                              Escludi dai motori di ricerca
                            </FieldLabel>
                          </Field>
                        </FieldGroup>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </TabsContent>
                <TabsContent value="history">
                  <Accordion multiple defaultValue={["revisions"]}>
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
                                    variant="outline"
                                    onClick={() => setPreviewRevision(revision)}
                                  >
                                    Confronta
                                  </Button>
                                  <Button
                                    type="button"
                                    size="sm"
                                    variant="outline"
                                    disabled={pending || !canRestore}
                                    onClick={() =>
                                      setConfirmAction({ kind: "revision", id: revision.id })
                                    }
                                  >
                                    Ripristina
                                  </Button>
                                </ItemActions>
                              </Item>
                            ))}
                          </ItemGroup>
                        ) : (
                          <Empty>
                            <EmptyHeader>
                              <EmptyTitle>Nessuna revisione</EmptyTitle>
                              <EmptyDescription>
                                La cronologia sarà disponibile dopo il salvataggio dell’articolo.
                              </EmptyDescription>
                            </EmptyHeader>
                          </Empty>
                        )}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </TabsContent>
              </Tabs>
            </FieldSet>
          </aside>
        );
        return (
          <div className="flex min-h-0 flex-1 overflow-hidden">
            {editorPane}
            {isDesktop ? (
              propertiesOpen ? (
                <div className="flex w-96 shrink-0 flex-col border-l">
                  <div className="p-4">
                    <h2 className="font-heading font-semibold">Proprietà articolo</h2>
                    <p className="text-sm text-muted-foreground">
                      Organizzazione, visibilità e cronologia.
                    </p>
                  </div>
                  <Separator />
                  {sidebarPane}
                </div>
              ) : null
            ) : (
              <Sheet open={propertiesOpen} onOpenChange={setPropertiesOpen}>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Proprietà articolo</SheetTitle>
                    <SheetDescription>Organizzazione, visibilità e cronologia.</SheetDescription>
                  </SheetHeader>
                  {sidebarPane}
                </SheetContent>
              </Sheet>
            )}
          </div>
        );
      })()}
      <AlertDialog
        open={confirmAction !== null}
        onOpenChange={(open) => {
          if (!open) setConfirmAction(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {confirmAction?.kind === "archive"
                ? "Archiviare l'articolo?"
                : "Ripristinare la revisione?"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {confirmAction?.kind === "archive"
                ? "L'articolo non sarà più visibile online. Potrai ripristinarlo dal CMS."
                : "Il contenuto salvato verrà sostituito e l'articolo tornerà in bozza. Verrà conservata una revisione dello stato attuale."}{" "}
              Le modifiche non salvate andranno perse.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                const action = confirmAction;
                setConfirmAction(null);
                if (action?.kind === "archive") void changeStatus("archive");
                else if (action) void restoreRevision(action.id);
              }}
            >
              Conferma
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <Dialog
        open={previewRevision !== null}
        onOpenChange={(open) => {
          if (!open) setPreviewRevision(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confronto revisione {previewRevision?.revision}</DialogTitle>
            <DialogDescription>
              Il ripristino riporta l'articolo in bozza. Le revisioni precedenti a questo
              aggiornamento potrebbero non includere le tassonomie.
            </DialogDescription>
          </DialogHeader>
          {previewRevision ? (
            <RevisionComparison
              revision={previewRevision}
              current={{ title, slug: effectiveSlug, content, categoryIds, tagIds }}
              categories={categories}
              tags={tags}
              media={media}
            />
          ) : null}
        </DialogContent>
      </Dialog>
      <AlertDialog open={blocker.status === "blocked"}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Modifiche non salvate</AlertDialogTitle>
            <AlertDialogDescription>
              Uscendo perderai le modifiche non salvate.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => blocker.reset?.()}>Resta</AlertDialogCancel>
            <AlertDialogAction onClick={() => blocker.proceed?.()}>Esci</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
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
