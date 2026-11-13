/* oxlint-disable react/no-unstable-nested-components -- TanStack Table usa callback di rendering nelle definizioni di colonna. */
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
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
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Field, FieldLabel, FieldGroup, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/features/auth/client/auth-client";
import { roleHasPermission } from "@/features/auth/domain/permissions";
import {
  type CategoryItem,
  type CategoryMedia,
} from "@/features/cms/components/categories/category.types";
import { MediaPicker } from "@/features/cms/components/media-picker";
import { slugInputPattern } from "@/features/cms/domain/slug";
import { archiveCategoryFn, updateCategoryFn } from "@/features/cms/server/category.functions";
import {
  categoryArchiveSortLabel,
  categoryArchiveSorts,
  categoryArticleLayoutLabel,
  categoryArticleLayouts,
  categorySchemaTypeLabel,
  categorySchemaTypes,
  isCategoryArchiveSort,
  isCategoryArticleLayout,
  isCategorySchemaType,
} from "@/features/content/domain/content-category";

export function CategoryActions({
  category,
  media,
  refresh,
}: {
  category: CategoryItem;
  media: CategoryMedia[];
  refresh: () => Promise<unknown>;
}) {
  const { data: session } = authClient.useSession();
  const canManage = roleHasPermission(session?.user.role, "cmsCategory", "update");
  const [editing, setEditing] = useState(false);
  const [pending, setPending] = useState(false);
  const [name, setName] = useState(category.name);
  const [slug, setSlug] = useState(category.slug);
  const [description, setDescription] = useState(category.description ?? "");
  const [schemaType, setSchemaType] = useState(category.schemaType);
  const [archiveSort, setArchiveSort] = useState(category.archiveSort);
  const [articleLayout, setArticleLayout] = useState(category.articleLayout);
  const [heroMediaId, setHeroMediaId] = useState(category.heroMediaId ?? "");

  async function save() {
    setPending(true);
    try {
      await updateCategoryFn({
        data: {
          id: category.id,
          name,
          slug,
          description: description || null,
          schemaType,
          archiveSort,
          articleLayout,
          heroMediaId: heroMediaId || null,
        },
      });
      setEditing(false);
      toast.success("Categoria aggiornata");
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
      await archiveCategoryFn({ data: { id: category.id } });
      toast.success("Categoria archiviata");
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Archiviazione non riuscita");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <ButtonGroup>
        <Button
          size="icon-sm"
          variant="outline"
          aria-label={`Modifica ${category.name}`}
          disabled={!canManage}
          onClick={() => {
            setName(category.name);
            setSlug(category.slug);
            setDescription(category.description ?? "");
            setSchemaType(category.schemaType);
            setArchiveSort(category.archiveSort);
            setArticleLayout(category.articleLayout);
            setHeroMediaId(category.heroMediaId ?? "");
            setEditing(true);
          }}
        >
          <Pencil />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger
            disabled={!canManage || pending}
            render={
              <Button size="icon-sm" variant="outline" aria-label={`Archivia ${category.name}`} />
            }
          >
            <Trash2 />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Archiviare “{category.name}”?</AlertDialogTitle>
              <AlertDialogDescription>
                La categoria non sarà più disponibile per i nuovi articoli.
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
      </ButtonGroup>
      <Dialog
        open={editing}
        onOpenChange={(open) => {
          if (!pending) setEditing(open);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifica categoria</DialogTitle>
            <DialogDescription>
              Gestisci identità, archivio pubblico e immagine di {category.name}.
            </DialogDescription>
          </DialogHeader>
          <form
            className="flex min-h-0 flex-col gap-6"
            onSubmit={(event) => {
              event.preventDefault();
              void save();
            }}
          >
            <FieldSet disabled={pending}>
              <FieldGroup className="grid max-h-viewport-half overflow-y-auto sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor={`category-${category.id}-name`}>Nome</FieldLabel>
                  <Input
                    id={`category-${category.id}-name`}
                    value={name}
                    required
                    onChange={(event) => setName(event.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor={`category-${category.id}-slug`}>Slug</FieldLabel>
                  <Input
                    id={`category-${category.id}-slug`}
                    value={slug}
                    required
                    pattern={slugInputPattern}
                    onChange={(event) => setSlug(event.target.value)}
                  />
                </Field>
                <Field className="sm:col-span-2">
                  <FieldLabel htmlFor={`category-${category.id}-description`}>
                    Descrizione
                  </FieldLabel>
                  <Textarea
                    id={`category-${category.id}-description`}
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor={`category-${category.id}-schemaType`}>
                    Tipo di contenuto (GEO)
                  </FieldLabel>
                  <Select
                    value={schemaType}
                    onValueChange={(value) => {
                      if (isCategorySchemaType(value)) setSchemaType(value);
                    }}
                  >
                    <SelectTrigger id={`category-${category.id}-schemaType`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {categorySchemaTypes.map((value) => (
                          <SelectItem key={value} value={value}>
                            {categorySchemaTypeLabel[value]}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor={`category-${category.id}-archiveSort`}>
                    Ordinamento archivio
                  </FieldLabel>
                  <Select
                    value={archiveSort}
                    onValueChange={(value) => {
                      if (isCategoryArchiveSort(value)) setArchiveSort(value);
                    }}
                  >
                    <SelectTrigger id={`category-${category.id}-archiveSort`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {categoryArchiveSorts.map((value) => (
                          <SelectItem key={value} value={value}>
                            {categoryArchiveSortLabel[value]}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor={`category-${category.id}-articleLayout`}>
                    Visualizzazione articoli
                  </FieldLabel>
                  <Select
                    value={articleLayout}
                    onValueChange={(value) => {
                      if (isCategoryArticleLayout(value)) setArticleLayout(value);
                    }}
                  >
                    <SelectTrigger id={`category-${category.id}-articleLayout`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {categoryArticleLayouts.map((value) => (
                          <SelectItem key={value} value={value}>
                            {categoryArticleLayoutLabel[value]}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel>Immagine hero</FieldLabel>
                  <MediaPicker
                    remote
                    items={media}
                    value={heroMediaId}
                    label="Scegli l’immagine hero"
                    description={`Seleziona l’immagine hero per ${category.name}.`}
                    onValueChange={setHeroMediaId}
                  />
                </Field>
              </FieldGroup>
            </FieldSet>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={pending}
                onClick={() => setEditing(false)}
              >
                Annulla
              </Button>
              <Button type="submit" disabled={pending}>
                {pending ? "Salvataggio…" : "Salva modifiche"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
