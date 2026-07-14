import { createFileRoute, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { slugify } from "@/features/cms/domain/slug";
import {
  archiveCategoryFn,
  createCategoryFn,
  listCategoriesFn,
  updateCategoryFn,
} from "@/features/cms/server/category.functions";

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
  async function create(event: React.FormEvent) {
    event.preventDefault();
    try {
      await createCategoryFn({
        data: { name, slug: slug || slugify(name), description: description || null },
      });
      setName("");
      setSlug("");
      setDescription("");
      toast.success("Categoria creata");
      await router.invalidate();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Creazione non riuscita");
    }
  }
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Categorie</h1>
        <p className="mt-1 text-sm text-muted-foreground">Classificazione degli articoli.</p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Nuova categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-3" onSubmit={(event) => void create(event)}>
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
                onChange={(event) => setSlug(event.target.value)}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="category-description">Descrizione</FieldLabel>
              <Textarea
                id="category-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </Field>
            <Button type="submit">Crea categoria</Button>
          </form>
        </CardContent>
      </Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Descrizione</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <CategoryRow
              key={category.id}
              category={category}
              refresh={() => router.invalidate()}
            />
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function CategoryRow({
  category,
  refresh,
}: {
  category: { id: string; name: string; slug: string; description: string | null };
  refresh: () => Promise<unknown>;
}) {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(category.name);
  const [slug, setSlug] = useState(category.slug);
  const [description, setDescription] = useState(category.description ?? "");
  async function save() {
    try {
      await updateCategoryFn({
        data: { id: category.id, name, slug, description: description || null },
      });
      setEditing(false);
      toast.success("Categoria aggiornata");
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Aggiornamento non riuscito");
    }
  }
  async function archive() {
    if (!confirm("Archiviare questa categoria?")) return;
    await archiveCategoryFn({ data: { id: category.id } });
    toast.success("Categoria archiviata");
    await refresh();
  }
  if (editing)
    return (
      <TableRow>
        <TableCell>
          <Input value={name} onChange={(event) => setName(event.target.value)} />
        </TableCell>
        <TableCell>
          <Input value={slug} onChange={(event) => setSlug(event.target.value)} />
        </TableCell>
        <TableCell>
          <Input value={description} onChange={(event) => setDescription(event.target.value)} />
        </TableCell>
        <TableCell>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => void save()}>
              Salva
            </Button>
            <Button size="sm" variant="outline" onClick={() => setEditing(false)}>
              Annulla
            </Button>
          </div>
        </TableCell>
      </TableRow>
    );
  return (
    <TableRow>
      <TableCell>{category.name}</TableCell>
      <TableCell>{category.slug}</TableCell>
      <TableCell>{category.description ?? "—"}</TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
            Modifica
          </Button>
          <Button size="sm" variant="destructive" onClick={() => void archive()}>
            Archivia
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
