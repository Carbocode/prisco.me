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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TableCell, TableRow } from "@/components/ui/table";
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

export function CategoryRow({
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
    <TableRow>
      <TableCell>
        {editing ? (
          <Input
            aria-label="Nome categoria"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        ) : (
          <span className="font-medium">{category.name}</span>
        )}
      </TableCell>
      <TableCell>
        {editing ? (
          <Select
            value={schemaType}
            onValueChange={(value) => {
              if (isCategorySchemaType(value)) setSchemaType(value);
            }}
          >
            <SelectTrigger aria-label="Schema GEO categoria" className="w-full">
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
        ) : (
          categorySchemaTypeLabel[category.schemaType]
        )}
      </TableCell>
      <TableCell>
        {editing ? (
          <Select
            value={archiveSort}
            onValueChange={(value) => {
              if (isCategoryArchiveSort(value)) setArchiveSort(value);
            }}
          >
            <SelectTrigger aria-label="Ordinamento archivio categoria" className="w-full">
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
        ) : (
          categoryArchiveSortLabel[category.archiveSort]
        )}
      </TableCell>
      <TableCell>
        {editing ? (
          <Select
            value={articleLayout}
            onValueChange={(value) => {
              if (isCategoryArticleLayout(value)) setArticleLayout(value);
            }}
          >
            <SelectTrigger aria-label="Visualizzazione articoli categoria" className="w-full">
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
        ) : (
          categoryArticleLayoutLabel[category.articleLayout]
        )}
      </TableCell>
      <TableCell>
        {editing ? (
          <MediaPicker
            items={media}
            value={heroMediaId}
            label="Scegli l’immagine hero"
            description={`Seleziona l’immagine hero per ${category.name}.`}
            compact
            onValueChange={setHeroMediaId}
          />
        ) : (
          (media.find((item) => item.id === category.heroMediaId)?.filename ?? "—")
        )}
      </TableCell>
      <TableCell>
        {editing ? (
          <Input
            aria-label="Slug categoria"
            value={slug}
            pattern={slugInputPattern}
            title="Lo slug non puo contenere solo numeri"
            onChange={(event) => setSlug(event.target.value)}
          />
        ) : (
          <span className="text-muted-foreground">/{category.slug}</span>
        )}
      </TableCell>
      <TableCell>
        {editing ? (
          <Input
            aria-label="Descrizione categoria"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        ) : (
          (category.description ?? "—")
        )}
      </TableCell>
      <TableCell className="text-right">
        {editing ? (
          <ButtonGroup>
            <Button size="sm" disabled={pending} onClick={() => void save()}>
              Salva
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={pending}
              onClick={() => setEditing(false)}
            >
              Annulla
            </Button>
          </ButtonGroup>
        ) : (
          <ButtonGroup>
            <Button
              size="icon-sm"
              variant="outline"
              aria-label={`Modifica ${category.name}`}
              disabled={!canManage}
              onClick={() => setEditing(true)}
            >
              <Pencil />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger
                disabled={!canManage}
                render={
                  <Button
                    size="icon-sm"
                    variant="destructive"
                    aria-label={`Archivia ${category.name}`}
                  />
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
        )}
      </TableCell>
    </TableRow>
  );
}
