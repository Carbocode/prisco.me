import { createFileRoute } from "@tanstack/react-router";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { listCategoriesFn } from "@/features/cms/server/category.functions";

export const Route = createFileRoute("/dashboard/cms/categories")({
  loader: () => listCategoriesFn(),
  component: CategoriesContent,
});

function CategoriesContent() {
  const categories = Route.useLoaderData();
  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Categorie</h1>
        <p className="mt-1 text-sm text-muted-foreground">Classificazione degli articoli.</p>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Nome</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead>Descrizione</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell>{category.name}</TableCell>
              <TableCell>{category.slug}</TableCell>
              <TableCell>{category.description ?? "—"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
