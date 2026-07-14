import { createFileRoute, Link } from "@tanstack/react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { listArticlesFn } from "@/features/cms/server/article.functions";

export const Route = createFileRoute("/dashboard/cms/articles")({
  loader: () => listArticlesFn({ data: { page: 1, pageSize: 100 } }),
  component: ArticlesContent,
});

function ArticlesContent() {
  const data = Route.useLoaderData();
  return (
    <div className="grid gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Articoli</h1>
          <p className="mt-1 text-sm text-muted-foreground">Bozze e contenuti pubblicati.</p>
        </div>
        <Button render={<Link to="/dashboard/cms/articles/new" />}>Nuovo articolo</Button>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Titolo</TableHead>
            <TableHead>Stato</TableHead>
            <TableHead>Aggiornato</TableHead>
            <TableHead />
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.title}</TableCell>
              <TableCell>
                <Badge variant="secondary">{item.status}</Badge>
              </TableCell>
              <TableCell>{item.updatedAt.toLocaleString("it-IT")}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  render={
                    <Link to="/dashboard/cms/articles/$articleId" params={{ articleId: item.id }} />
                  }
                >
                  Modifica
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
