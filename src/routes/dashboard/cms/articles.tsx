import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { listArticlesFn } from "@/features/cms/server/article.functions";
import { listCategoriesFn } from "@/features/cms/server/category.functions";

const searchSchema = z.object({
  page: z.coerce.number().int().positive().catch(1),
  query: z.string().optional().catch(undefined),
  status: z.enum(["draft", "scheduled", "published", "archived"]).optional().catch(undefined),
  categoryId: z.string().uuid().optional().catch(undefined),
});

export const Route = createFileRoute("/dashboard/cms/articles")({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => search,
  loader: async ({ deps }) => {
    const [articles, categories] = await Promise.all([
      listArticlesFn({ data: { ...deps, pageSize: 20 } }),
      listCategoriesFn(),
    ]);
    return { articles, categories };
  },
  component: ArticlesContent,
});

function ArticlesContent() {
  const { articles, categories } = Route.useLoaderData();
  const search = Route.useSearch();
  const navigate = useNavigate({ from: Route.fullPath });
  const [query, setQuery] = useState(search.query ?? "");
  const pages = Math.max(1, Math.ceil(articles.total / 20));
  const updateSearch = (changes: Partial<typeof search>) =>
    void navigate({ search: { ...search, ...changes } });
  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Articoli</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Bozze, programmazione e contenuti pubblicati.
          </p>
        </div>
        <Button render={<Link to="/dashboard/cms/articles/new" />}>Nuovo articolo</Button>
      </div>
      <form
        className="grid gap-4 md:grid-cols-[1fr_220px_220px_auto]"
        onSubmit={(event) => {
          event.preventDefault();
          updateSearch({ query: query || undefined, page: 1 });
        }}
      >
        <Field>
          <FieldLabel htmlFor="article-search">Cerca titolo o slug</FieldLabel>
          <Input
            id="article-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel>Stato</FieldLabel>
          <Select
            value={search.status ?? "all"}
            onValueChange={(value) =>
              updateSearch({
                status: value === "all" ? undefined : (value as typeof search.status), // oxlint-disable-line typescript/no-unsafe-type-assertion
                page: 1,
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutti</SelectItem>
              <SelectItem value="draft">Bozze</SelectItem>
              <SelectItem value="scheduled">Programmati</SelectItem>
              <SelectItem value="published">Pubblicati</SelectItem>
              <SelectItem value="archived">Archiviati</SelectItem>
            </SelectContent>
          </Select>
        </Field>
        <Field>
          <FieldLabel>Categoria</FieldLabel>
          <Select
            value={search.categoryId ?? "all"}
            onValueChange={(value) =>
              updateSearch({
                categoryId: value === "all" ? undefined : (value ?? undefined),
                page: 1,
              })
            }
          >
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutte</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Field>
        <Button className="self-end" type="submit">
          Cerca
        </Button>
      </form>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Titolo</TableHead>
            <TableHead>Stato</TableHead>
            <TableHead>Autore</TableHead>
            <TableHead>Categorie</TableHead>
            <TableHead>Pubblicazione</TableHead>
            <TableHead>Aggiornato</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {articles.items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div className="font-medium">{item.title}</div>
                <div className="text-sm text-muted-foreground">/{item.slug}</div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary">{item.status}</Badge>
              </TableCell>
              <TableCell>{item.authorName ?? "—"}</TableCell>
              <TableCell>{item.categories.join(", ") || "—"}</TableCell>
              <TableCell>{item.publishedAt?.toLocaleString("it-IT") ?? "—"}</TableCell>
              <TableCell>{item.updatedAt.toLocaleString("it-IT")}</TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    render={
                      <Link
                        to="/dashboard/cms/articles/$articleId"
                        params={{ articleId: item.id }}
                      />
                    }
                  >
                    Modifica
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    render={
                      <Link
                        to="/dashboard/cms/articles/$articleId/preview"
                        params={{ articleId: item.id }}
                        target="_blank"
                      />
                    }
                  >
                    Anteprima
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {articles.total} articoli · pagina {search.page} di {pages}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            disabled={search.page <= 1}
            onClick={() => updateSearch({ page: search.page - 1 })}
          >
            Precedente
          </Button>
          <Button
            variant="outline"
            disabled={search.page >= pages}
            onClick={() => updateSearch({ page: search.page + 1 })}
          >
            Successiva
          </Button>
        </div>
      </div>
    </div>
  );
}
