/* oxlint-disable react/no-unstable-nested-components -- TanStack Table usa callback di rendering nelle definizioni di colonna. */
import { useRouter } from "@tanstack/react-router";
import { getRouteApi } from "@tanstack/react-router";
import { FolderTree, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import {
  DashboardDataTable,
  type DashboardColumnDef,
} from "@/components/data-table/dashboard-data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
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
import { CategoryRow } from "@/features/cms/components/categories/category-row";
import { MediaPicker } from "@/features/cms/components/media-picker";
import { slugify, slugInputPattern } from "@/features/cms/domain/slug";
import { createCategoryFn } from "@/features/cms/server/category.functions";
import {
  categoryArchiveSortLabel,
  categoryArchiveSorts,
  categoryArticleLayoutLabel,
  categoryArticleLayouts,
  categorySchemaTypeLabel,
  categorySchemaTypes,
  defaultCategoryConfig,
  isCategoryArchiveSort,
  isCategoryArticleLayout,
  isCategorySchemaType,
  type CategoryArchiveSort,
  type CategoryArticleLayout,
  type CategorySchemaType,
} from "@/features/content/domain/content-category";

const routeApi = getRouteApi("/dashboard/cms/categories");

export function CategoriesContent() {
  const { data: session } = authClient.useSession();
  const canManage = roleHasPermission(session?.user.role, "cmsCategory", "update");
  const { categories, media } = routeApi.useLoaderData();
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
  const [articleLayout, setArticleLayout] = useState<CategoryArticleLayout>(
    defaultCategoryConfig.articleLayout,
  );
  const [heroMediaId, setHeroMediaId] = useState("");
  const [pending, setPending] = useState(false);
  const imageMedia = useMemo(
    () => media.filter((item) => item.mimeType.startsWith("image/")),
    [media],
  );
  const columns = useMemo<DashboardColumnDef<(typeof categories)[number]>[]>(
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
      {
        accessorKey: "articleLayout",
        header: "Visualizzazione",
        size: 170,
        minSize: 150,
        cell: ({ row }) => categoryArticleLayoutLabel[row.original.articleLayout],
      },
      {
        accessorKey: "heroMediaId",
        header: "Immagine hero",
        size: 220,
        minSize: 180,
        cell: ({ row }) =>
          imageMedia.find((item) => item.id === row.original.heroMediaId)?.filename ?? "—",
      },
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
    [imageMedia],
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
          articleLayout,
          heroMediaId: heroMediaId || null,
        },
      });
      setName("");
      setSlug("");
      setDescription("");
      setSchemaType(defaultCategoryConfig.schemaType);
      setArchiveSort(defaultCategoryConfig.archiveSort);
      setArticleLayout(defaultCategoryConfig.articleLayout);
      setHeroMediaId("");
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
          <FieldSet disabled={!canManage}>
            <form onSubmit={(event) => void create(event)}>
              <FieldGroup className="grid items-end sm:grid-cols-2 xl:grid-cols-4">
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
                  <FieldLabel htmlFor="category-article-layout">
                    Visualizzazione articoli
                  </FieldLabel>
                  <Select
                    value={articleLayout}
                    onValueChange={(value) => {
                      if (isCategoryArticleLayout(value)) setArticleLayout(value);
                    }}
                  >
                    <SelectTrigger id="category-article-layout" className="w-full">
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
                  <FieldDescription>Card è la visualizzazione predefinita.</FieldDescription>
                </Field>
                <Field>
                  <FieldLabel>Immagine hero</FieldLabel>
                  <MediaPicker
                    items={imageMedia}
                    value={heroMediaId}
                    label="Scegli l’immagine hero"
                    description="Naviga la libreria immagini e seleziona lo sfondo dell’archivio."
                    onValueChange={setHeroMediaId}
                  />
                  <FieldDescription>
                    Viene mostrata dietro al titolo nell’archivio pubblico della categoria.
                  </FieldDescription>
                </Field>
                <Button size="sm" type="submit" disabled={pending}>
                  <Plus data-icon="inline-start" />
                  {pending ? "Creazione…" : "Crea"}
                </Button>
              </FieldGroup>
            </form>
          </FieldSet>
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
                  media={imageMedia}
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
