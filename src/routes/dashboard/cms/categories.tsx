/* oxlint-disable react/no-unstable-nested-components -- TanStack Table usa callback di rendering nelle definizioni di colonna. */
import { createFileRoute, useRouter } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { FolderTree, Pencil, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { DashboardDataTable } from "@/components/dashboard-data-table";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
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
import { Textarea } from "@/components/ui/textarea";
import { slugify, slugInputPattern } from "@/features/cms/domain/slug";
import {
  archiveCategoryFn,
  createCategoryFn,
  listCategoriesFn,
  updateCategoryFn,
} from "@/features/cms/server/category.functions";
import {
  categoryArchiveSortLabel,
  categoryArchiveSorts,
  categorySchemaTypeLabel,
  categorySchemaTypes,
  defaultCategoryConfig,
  isCategoryArchiveSort,
  isCategorySchemaType,
  type CategoryArchiveSort,
  type CategorySchemaType,
} from "@/lib/content-category";

type CategoryItem = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  schemaType: CategorySchemaType;
  archiveSort: CategoryArchiveSort;
  archiveEyebrow: string;
};

export const Route = createFileRoute("/dashboard/cms/categories")({
  loader: () => listCategoriesFn(),
  component: CategoriesContent,
});

function CategoriesContent() {
  const categories = Route.useLoaderData();
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [schemaType, setSchemaType] = useState<CategorySchemaType>(
    defaultCategoryConfig.schemaType,
  );
  const [archiveSort, setArchiveSort] = useState<CategoryArchiveSort>(
    defaultCategoryConfig.archiveSort,
  );
  const [archiveEyebrow, setArchiveEyebrow] = useState<string>(
    defaultCategoryConfig.archiveEyebrow,
  );
  const [pending, setPending] = useState(false);
  const columns = useMemo<ColumnDef<(typeof categories)[number]>[]>(
    () => [
      { accessorKey: "name", header: "Nome", size: 220, minSize: 160 },
      {
        accessorKey: "schemaType",
        header: "Schema GEO",
        size: 180,
        minSize: 160,
        cell: ({ row }) => categorySchemaTypeLabel[row.original.schemaType],
      },
      {
        accessorKey: "archiveSort",
        header: "Ordinamento",
        size: 220,
        minSize: 180,
        cell: ({ row }) => categoryArchiveSortLabel[row.original.archiveSort],
      },
      { accessorKey: "archiveEyebrow", header: "Eyebrow", size: 160, minSize: 140 },
      { accessorKey: "slug", header: "Slug", size: 220, minSize: 140 },
      { accessorKey: "description", header: "Descrizione", size: 360, minSize: 220 },
      {
        id: "actions",
        header: () => <span className="sr-only">Azioni</span>,
        size: 130,
        minSize: 130,
        maxSize: 180,
        enableResizing: false,
      },
    ],
    [],
  );

  async function create(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    try {
      await createCategoryFn({
        data: {
          name,
          slug: slug || slugify(name),
          description: description || null,
          schemaType,
          archiveSort,
          archiveEyebrow,
        },
      });
      setName("");
      setSlug("");
      setDescription("");
      setSchemaType(defaultCategoryConfig.schemaType);
      setArchiveSort(defaultCategoryConfig.archiveSort);
      setArchiveEyebrow(defaultCategoryConfig.archiveEyebrow);
      toast.success("Categoria creata");
      await router.invalidate();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Creazione non riuscita");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <header>
        <p className="text-sm font-medium text-muted-foreground">{categories.length} categorie</p>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Categorie</h1>
        <p className="text-sm text-muted-foreground">
          Raggruppamenti editoriali principali per gli articoli.
        </p>
      </header>

      <Card size="sm">
        <CardHeader>
          <CardTitle>Nuova categoria</CardTitle>
          <CardDescription>
            Nome e slug sono obbligatori; lo slug viene proposto automaticamente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(event) => void create(event)}>
            <FieldGroup className="grid items-end gap-2 sm:grid-cols-2 xl:grid-cols-4">
              <Field>
                <FieldLabel htmlFor="category-name">Nome</FieldLabel>
                <Input
                  id="category-name"
                  value={name}
                  onChange={(event) => {
                    setName(event.target.value);
                    if (!slug) setSlug(slugify(event.target.value));
                  }}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="category-slug">Slug</FieldLabel>
                <Input
                  id="category-slug"
                  value={slug}
                  pattern={slugInputPattern}
                  title="Lo slug non puo contenere solo numeri"
                  onChange={(event) => setSlug(event.target.value)}
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="category-description">Descrizione</FieldLabel>
                <Textarea
                  id="category-description"
                  rows={1}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="category-schema-type">Schema GEO</FieldLabel>
                <Select
                  value={schemaType}
                  onValueChange={(value) => {
                    if (isCategorySchemaType(value)) setSchemaType(value);
                  }}
                >
                  <SelectTrigger id="category-schema-type" className="w-full">
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
                <FieldLabel htmlFor="category-archive-sort">Ordinamento archivio</FieldLabel>
                <Select
                  value={archiveSort}
                  onValueChange={(value) => {
                    if (isCategoryArchiveSort(value)) setArchiveSort(value);
                  }}
                >
                  <SelectTrigger id="category-archive-sort" className="w-full">
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
                <FieldLabel htmlFor="category-archive-eyebrow">Eyebrow archivio</FieldLabel>
                <Input
                  id="category-archive-eyebrow"
                  value={archiveEyebrow}
                  onChange={(event) => setArchiveEyebrow(event.target.value)}
                  required
                />
              </Field>
              <Button size="sm" type="submit" disabled={pending}>
                <Plus data-icon="inline-start" />
                {pending ? "Creazione…" : "Crea"}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      {categories.length ? (
        <Card size="sm">
          <CardContent>
            <DashboardDataTable
              columns={columns}
              data={categories}
              getRowId={(category) => category.id}
              renderRow={(row) => (
                <CategoryRow
                  key={row.id}
                  category={row.original}
                  refresh={() => router.invalidate()}
                />
              )}
            />
          </CardContent>
        </Card>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderTree />
            </EmptyMedia>
            <EmptyTitle>Nessuna categoria</EmptyTitle>
            <EmptyDescription>
              Usa il modulo qui sopra per creare la prima categoria.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </div>
  );
}

function CategoryRow({
  category,
  refresh,
}: {
  category: CategoryItem;
  refresh: () => Promise<unknown>;
}) {
  const [editing, setEditing] = useState(false);
  const [pending, setPending] = useState(false);
  const [name, setName] = useState(category.name);
  const [slug, setSlug] = useState(category.slug);
  const [description, setDescription] = useState(category.description ?? "");
  const [schemaType, setSchemaType] = useState(category.schemaType);
  const [archiveSort, setArchiveSort] = useState(category.archiveSort);
  const [archiveEyebrow, setArchiveEyebrow] = useState(category.archiveEyebrow);

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
          archiveEyebrow,
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
          <Input
            aria-label="Eyebrow archivio categoria"
            value={archiveEyebrow}
            onChange={(event) => setArchiveEyebrow(event.target.value)}
          />
        ) : (
          category.archiveEyebrow
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
              onClick={() => setEditing(true)}
            >
              <Pencil />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger
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
