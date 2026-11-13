/* oxlint-disable react/no-unstable-nested-components -- TanStack Table usa callback di rendering nelle definizioni di colonna. */
import { useRouter } from "@tanstack/react-router";
import { getRouteApi } from "@tanstack/react-router";
import { Hash, Plus, Search, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import {
  DashboardDataTable,
  type DashboardColumnDef,
} from "@/components/data-table/dashboard-data-table";
import { Badge } from "@/components/ui/badge";
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
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { authClient } from "@/features/auth/client/auth-client";
import { roleHasPermission } from "@/features/auth/domain/permissions";
import { TagRow } from "@/features/cms/components/tags/tag-row";
import { type Tag } from "@/features/cms/components/tags/tag.types";
import { slugify, slugInputPattern } from "@/features/cms/domain/slug";
import { createTagFn } from "@/features/cms/server/tag.functions";
import { SkillGlyph } from "@/features/portfolio/components/tech-icon";

const routeApi = getRouteApi("/dashboard/cms/tags");

export function TagsPage() {
  const { data: session } = authClient.useSession();
  const canManage = roleHasPermission(session?.user.role, "cmsTag", "update");
  const { tags, categories } = routeApi.useLoaderData();
  const router = useRouter();
  const [view, setView] = useState("list");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [icon, setIcon] = useState("");
  const [marqueeRow, setMarqueeRow] = useState<number | null>(null);
  const [color, setColor] = useState("text-ink-soft bg-white/10 border-white/15");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [pending, setPending] = useState(false);
  const normalizedQuery = query.trim().toLocaleLowerCase("it-IT");
  const filteredTags = useMemo(
    () =>
      tags.filter(
        (tag) =>
          (categoryFilter === "all" || tag.categoryId === categoryFilter) &&
          (!normalizedQuery ||
            tag.name.toLocaleLowerCase("it-IT").includes(normalizedQuery) ||
            tag.slug.toLocaleLowerCase("it-IT").includes(normalizedQuery) ||
            tag.icon?.toLocaleLowerCase("it-IT").includes(normalizedQuery)),
      ),
    [categoryFilter, normalizedQuery, tags],
  );
  const hasFilters = Boolean(normalizedQuery) || categoryFilter !== "all";
  const columns = useMemo<DashboardColumnDef<Tag>[]>(
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
          marqueeRow,
          mark: null,
          fluentIcon: null,
        },
      });
      setName("");
      setSlug("");
      setSlugTouched(false);
      setIcon("");
      setColor("text-ink-soft bg-white/10 border-white/15");
      setView("list");
      toast.success("Tag creato");
      await router.invalidate();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Creazione non riuscita");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <header>
        <p className="text-sm font-medium text-muted-foreground">{tags.length} tag</p>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Tag</h1>
        <p className="text-sm text-muted-foreground">
          Etichette trasversali per rendere i contenuti più facili da trovare.
        </p>
      </header>

      <Tabs value={view} onValueChange={(value) => setView(String(value))}>
        <TabsList aria-label="Sezioni tag">
          <TabsTrigger value="list">Tag</TabsTrigger>
          <TabsTrigger value="create">Nuovo tag</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          <div className="flex flex-col gap-6">
            {tags.length ? (
              <>
                <Card size="sm">
                  <CardContent>
                    <form
                      onSubmit={(event) => event.preventDefault()}
                      onReset={() => {
                        setQuery("");
                        setCategoryFilter("all");
                      }}
                    >
                      <FieldGroup className="grid items-end md:grid-cols-(--layout-grid-cols-media-toolbar)">
                        <Field>
                          <FieldLabel htmlFor="tag-search">Cerca</FieldLabel>
                          <InputGroup>
                            <InputGroupAddon>
                              <Search />
                            </InputGroupAddon>
                            <InputGroupInput
                              id="tag-search"
                              type="search"
                              value={query}
                              placeholder="Nome, slug o icona"
                              onChange={(event) => setQuery(event.target.value)}
                            />
                          </InputGroup>
                        </Field>
                        <Field>
                          <FieldLabel htmlFor="tag-category-filter">Categoria</FieldLabel>
                          <Select
                            items={[
                              { value: "all", label: "Tutte le categorie" },
                              ...categories.map((category) => ({
                                value: category.id,
                                label: category.name,
                              })),
                            ]}
                            value={categoryFilter}
                            onValueChange={(value) => setCategoryFilter(value ?? "all")}
                          >
                            <SelectTrigger id="tag-category-filter" className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                <SelectItem value="all">Tutte le categorie</SelectItem>
                                {categories.map((category) => (
                                  <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        </Field>
                        <Button size="sm" type="reset" variant="outline" disabled={!hasFilters}>
                          <X data-icon="inline-start" />
                          Azzera
                        </Button>
                      </FieldGroup>
                    </form>
                  </CardContent>
                </Card>

                <Card size="sm">
                  <CardContent>
                    {filteredTags.length ? (
                      <DashboardDataTable
                        columns={columns}
                        data={filteredTags}
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
                    ) : (
                      <Empty>
                        <EmptyHeader>
                          <EmptyMedia variant="icon">
                            <Search />
                          </EmptyMedia>
                          <EmptyTitle>Nessun tag trovato</EmptyTitle>
                          <EmptyDescription>
                            Modifica la ricerca o azzera i filtri per vedere tutti i tag.
                          </EmptyDescription>
                        </EmptyHeader>
                      </Empty>
                    )}
                  </CardContent>
                </Card>
              </>
            ) : (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Hash />
                  </EmptyMedia>
                  <EmptyTitle>Nessun tag</EmptyTitle>
                  <EmptyDescription>Apri “Nuovo tag” per creare il primo tag.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            )}
          </div>
        </TabsContent>
        <TabsContent value="create">
          <Card size="sm">
            <CardHeader>
              <CardTitle>Nuovo tag</CardTitle>
              <CardDescription>
                Lo slug viene proposto dal nome; icona Iconify e colore sono opzionali.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FieldSet disabled={!canManage || pending}>
                <form onSubmit={(event) => void create(event)}>
                  <FieldGroup className="grid items-start md:grid-cols-2">
                    <Field>
                      <FieldLabel htmlFor="tag-name">Nome</FieldLabel>
                      <Input
                        id="tag-name"
                        value={name}
                        required
                        onChange={(event) => {
                          setName(event.target.value);
                          if (!slugTouched) setSlug(slugify(event.target.value));
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
                        onChange={(event) => {
                          setSlugTouched(true);
                          setSlug(event.target.value);
                        }}
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
                        <Badge>
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
                    <Field>
                      <FieldLabel>Riga marquee home (1–4, vuoto per nascondere)</FieldLabel>
                      <Input
                        type="number"
                        min={1}
                        max={4}
                        value={marqueeRow ?? ""}
                        onChange={(event) =>
                          setMarqueeRow(event.target.value ? event.target.valueAsNumber : null)
                        }
                      />
                    </Field>
                  </FieldGroup>
                </form>
              </FieldSet>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
