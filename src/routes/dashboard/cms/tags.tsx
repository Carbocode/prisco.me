/* oxlint-disable react/no-unstable-nested-components -- TanStack Table usa callback di rendering nelle definizioni di colonna. */
import { createFileRoute, useRouter } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { Hash, Pencil, Plus, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { DashboardDataTable } from "@/components/dashboard-data-table";
import { SkillGlyph } from "@/components/tech-icon";
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
import { Badge } from "@/components/ui/badge";
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
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
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
import { slugify, slugInputPattern } from "@/features/cms/domain/slug";
import { listCategoriesFn } from "@/features/cms/server/category.functions";
import {
  archiveTagFn,
  createTagFn,
  listTagsFn,
  updateTagFn,
} from "@/features/cms/server/tag.functions";

type Tag = {
  id: string;
  name: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  icon: string | null;
  color: string;
};
type Category = { id: string; name: string };

export const Route = createFileRoute("/dashboard/cms/tags")({
  loader: async () => {
    const [tags, categories] = await Promise.all([listTagsFn(), listCategoriesFn()]);
    return { tags, categories };
  },
  component: TagsPage,
});

function TagsPage() {
  const { tags, categories } = Route.useLoaderData();
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [icon, setIcon] = useState("");
  const [color, setColor] = useState("text-slate-200 bg-white/10 border-white/15");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [pending, setPending] = useState(false);
  const columns = useMemo<ColumnDef<Tag>[]>(
    () => [
      { accessorKey: "name", header: "Tag", size: 200, minSize: 150 },
      { accessorKey: "slug", header: "Slug", size: 210, minSize: 150 },
      { accessorKey: "categoryName", header: "Categoria", size: 200, minSize: 150 },
      { accessorKey: "icon", header: "Icona", size: 180, minSize: 140 },
      { accessorKey: "color", header: "Colore", size: 220, minSize: 160 },
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
      await createTagFn({
        data: {
          name,
          slug: slug || slugify(name),
          categoryId,
          icon: icon || null,
          color,
          mark: null,
          fluentIcon: null,
        },
      });
      setName("");
      setSlug("");
      setIcon("");
      setColor("text-slate-200 bg-white/10 border-white/15");
      toast.success("Tag creato");
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
        <p className="text-sm font-medium text-muted-foreground">{tags.length} tag</p>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Tag</h1>
        <p className="text-sm text-muted-foreground">
          Etichette trasversali per rendere i contenuti più facili da trovare.
        </p>
      </header>

      <Card size="sm">
        <CardHeader>
          <CardTitle>Nuovo tag</CardTitle>
          <CardDescription>
            Lo slug viene proposto dal nome; icona Iconify e colore sono opzionali.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(event) => void create(event)}>
            <FieldGroup className="grid items-end gap-3 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1fr_1.5fr_auto]">
              <Field>
                <FieldLabel htmlFor="tag-name">Nome</FieldLabel>
                <Input
                  id="tag-name"
                  value={name}
                  required
                  onChange={(event) => {
                    setName(event.target.value);
                    if (!slug) setSlug(slugify(event.target.value));
                  }}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="tag-slug">Slug</FieldLabel>
                <Input
                  id="tag-slug"
                  value={slug}
                  pattern={slugInputPattern}
                  title="Lo slug non puo contenere solo numeri"
                  required
                  onChange={(event) => setSlug(event.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel>Categoria</FieldLabel>
                <Select
                  items={categories.map((category) => ({
                    value: category.id,
                    label: category.name,
                  }))}
                  value={categoryId}
                  onValueChange={(value) => setCategoryId(value ?? "")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="tag-icon">Icona</FieldLabel>
                <Input
                  id="tag-icon"
                  value={icon}
                  maxLength={80}
                  placeholder="Es. simple-icons:react"
                  onChange={(event) => setIcon(event.target.value)}
                />
                <FieldDescription>
                  <Badge variant="outline">
                    <SkillGlyph
                      skill={{ name: name || "Anteprima", icon: icon || null, color }}
                      size={12}
                    />
                    {icon || "Fallback"}
                  </Badge>
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor="tag-color">Colore</FieldLabel>
                <Input
                  id="tag-color"
                  value={color}
                  onChange={(event) => setColor(event.target.value)}
                />
                <FieldDescription>
                  <Badge className={color}>
                    <SkillGlyph
                      skill={{ name: name || "Anteprima", icon: icon || null, color }}
                      size={12}
                    />
                    {name || "Anteprima tag"}
                  </Badge>
                </FieldDescription>
              </Field>
              <Button size="sm" type="submit" disabled={pending}>
                <Plus data-icon="inline-start" />
                {pending ? "Creazione…" : "Crea"}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      {tags.length ? (
        <Card size="sm">
          <CardContent>
            <DashboardDataTable
              columns={columns}
              data={tags}
              getRowId={(tag) => tag.id}
              renderRow={(row) => (
                <TagRow
                  key={row.id}
                  tag={row.original}
                  categories={categories}
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
              <Hash />
            </EmptyMedia>
            <EmptyTitle>Nessun tag</EmptyTitle>
            <EmptyDescription>Usa il modulo qui sopra per creare il primo tag.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </div>
  );
}

function TagRow({
  tag,
  categories,
  refresh,
}: {
  tag: Tag;
  categories: Category[];
  refresh: () => Promise<unknown>;
}) {
  const [editing, setEditing] = useState(false);
  const [pending, setPending] = useState(false);
  const [name, setName] = useState(tag.name);
  const [slug, setSlug] = useState(tag.slug);
  const [icon, setIcon] = useState(tag.icon ?? "");
  const [color, setColor] = useState(tag.color);
  const [categoryId, setCategoryId] = useState(tag.categoryId);

  async function save(event?: React.FormEvent) {
    event?.preventDefault();
    setPending(true);
    try {
      await updateTagFn({
        data: { id: tag.id, name, slug, categoryId, icon: icon || null, color },
      });
      setEditing(false);
      toast.success("Tag aggiornato");
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
      await archiveTagFn({ data: { id: tag.id } });
      toast.success("Tag archiviato");
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Archiviazione non riuscita");
    } finally {
      setPending(false);
    }
  }

  if (editing) {
    return (
      <TableRow>
        <TableCell colSpan={6}>
          <form onSubmit={(event) => void save(event)}>
            <FieldGroup className="grid items-end gap-3 md:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1fr_1.5fr_auto]">
              <Field>
                <FieldLabel htmlFor={`tag-${tag.id}-name`}>Nome</FieldLabel>
                <Input
                  id={`tag-${tag.id}-name`}
                  value={name}
                  required
                  onChange={(event) => setName(event.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor={`tag-${tag.id}-slug`}>Slug</FieldLabel>
                <Input
                  id={`tag-${tag.id}-slug`}
                  value={slug}
                  pattern={slugInputPattern}
                  title="Lo slug non puo contenere solo numeri"
                  required
                  onChange={(event) => setSlug(event.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel>Categoria</FieldLabel>
                <Select
                  items={categories.map((category) => ({
                    value: category.id,
                    label: category.name,
                  }))}
                  value={categoryId}
                  onValueChange={(value) => setCategoryId(value ?? categoryId)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor={`tag-${tag.id}-icon`}>Icona</FieldLabel>
                <Input
                  id={`tag-${tag.id}-icon`}
                  value={icon}
                  maxLength={80}
                  placeholder="Es. simple-icons:react"
                  onChange={(event) => setIcon(event.target.value)}
                />
                <FieldDescription>
                  <Badge variant="outline">
                    <SkillGlyph skill={{ name, icon: icon || null, color }} size={12} />
                    {icon || "Fallback"}
                  </Badge>
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor={`tag-${tag.id}-color`}>Colore</FieldLabel>
                <Input
                  id={`tag-${tag.id}-color`}
                  value={color}
                  required
                  onChange={(event) => setColor(event.target.value)}
                />
                <FieldDescription>
                  <Badge className={color}>
                    <SkillGlyph skill={{ name, icon: icon || null, color }} size={12} />
                    {name || "Anteprima tag"}
                  </Badge>
                </FieldDescription>
              </Field>
              <ButtonGroup>
                <Button size="sm" type="submit" disabled={pending}>
                  Salva
                </Button>
                <Button
                  size="sm"
                  type="button"
                  variant="outline"
                  disabled={pending}
                  onClick={() => setEditing(false)}
                >
                  Annulla
                </Button>
              </ButtonGroup>
            </FieldGroup>
          </form>
        </TableCell>
      </TableRow>
    );
  }

  return (
    <TableRow>
      <TableCell>
        <span className="font-medium">{tag.name}</span>
      </TableCell>
      <TableCell>
        <span className="text-muted-foreground">/{tag.slug}</span>
      </TableCell>
      <TableCell>{tag.categoryName}</TableCell>
      <TableCell>
        <Badge variant="outline">
          <SkillGlyph skill={tag} size={12} />
          {tag.icon || "Fallback"}
        </Badge>
      </TableCell>
      <TableCell>
        <Badge className={tag.color}>
          <SkillGlyph skill={tag} size={12} />
          {tag.name}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <ButtonGroup>
          <Button
            size="icon-sm"
            variant="outline"
            aria-label={`Modifica ${tag.name}`}
            onClick={() => setEditing(true)}
          >
            <Pencil />
          </Button>
          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button size="icon-sm" variant="destructive" aria-label={`Archivia ${tag.name}`} />
              }
            >
              <Trash2 />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Archiviare “{tag.name}”?</AlertDialogTitle>
                <AlertDialogDescription>
                  Il tag non sarà più disponibile per i nuovi contenuti.
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
      </TableCell>
    </TableRow>
  );
}
