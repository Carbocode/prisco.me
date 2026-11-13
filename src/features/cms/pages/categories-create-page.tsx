/* oxlint-disable react/no-unstable-nested-components -- TanStack Table usa callback di rendering nelle definizioni di colonna. */
import { Link, useRouter } from "@tanstack/react-router";
import { getRouteApi } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { MediaPicker } from "@/features/cms/components/media-picker";
import { listSearchSchema } from "@/features/cms/domain/list-search";
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

const routeApi = getRouteApi("/dashboard/cms/categories_/new");

export function CreateCategoryPage() {
  const { data: session } = authClient.useSession();
  const canManage = roleHasPermission(session?.user.role, "cmsCategory", "update");
  const { media } = routeApi.useLoaderData();
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
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
    () => media.filter((item) => item.mimeType?.startsWith("image/")),
    [media],
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
      setSlugTouched(false);
      setDescription("");
      setSchemaType(defaultCategoryConfig.schemaType);
      setArchiveSort(defaultCategoryConfig.archiveSort);
      setArticleLayout(defaultCategoryConfig.articleLayout);
      setHeroMediaId("");
      toast.success("Categoria creata");
      await router.invalidate();
      await router.navigate({
        to: "/dashboard/cms/categories",
        search: listSearchSchema.parse({}),
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Creazione non riuscita");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto flex w-full min-w-0 max-w-3xl flex-col gap-6">
      <Link
        className={buttonVariants({ variant: "outline", size: "sm" })}
        to="/dashboard/cms/categories"
        search={listSearchSchema.parse({})}
      >
        Torna all’elenco
      </Link>
      <Card size="sm">
        <CardHeader>
          <CardTitle>Nuova categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldSet disabled={!canManage || pending}>
            <form onSubmit={(event) => void create(event)}>
              <FieldGroup className="grid items-start sm:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="category-name">Nome</FieldLabel>
                  <Input
                    id="category-name"
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value);
                      if (!slugTouched) setSlug(slugify(event.target.value));
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
                    onChange={(event) => {
                      setSlugTouched(true);
                      setSlug(event.target.value);
                    }}
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
                    remote
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
    </div>
  );
}
