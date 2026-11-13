/* oxlint-disable react/no-unstable-nested-components -- TanStack Table usa callback di rendering nelle definizioni di colonna. */
import { Link, useRouter } from "@tanstack/react-router";
import { getRouteApi } from "@tanstack/react-router";
import { ArrowRight, FilePlus2, FileText } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";

import {
  DashboardDataTable,
  type DashboardColumnDef,
} from "@/components/data-table/dashboard-data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Item, ItemGroup, ItemContent, ItemTitle, ItemActions } from "@/components/ui/item";
import { restoreTaxonomyFn } from "@/features/cms/server/trash.functions";

const routeApi = getRouteApi("/dashboard/cms/");

export function CmsDashboardContent() {
  const router = useRouter();
  const { articles, stats, trash } = routeApi.useLoaderData();
  const count = (status: string) => stats.find((item) => item.status === status)?.count ?? 0;
  const recent = [...articles]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 8);
  const columns = useMemo<DashboardColumnDef<(typeof recent)[number]>[]>(
    () => [
      {
        accessorKey: "title",
        header: "Contenuto",
        size: 320,
        minSize: 220,
        cell: ({ row }) => <span className="font-medium">{row.original.title}</span>,
      },
      {
        accessorKey: "status",
        header: "Stato",
        size: 150,
        cell: ({ row }) => <Badge variant="secondary">{statusLabel(row.original.status)}</Badge>,
      },
      {
        accessorKey: "updatedAt",
        header: "Ultima modifica",
        size: 190,
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {row.original.updatedAt.toLocaleString("it-IT", {
              dateStyle: "short",
              timeStyle: "short",
            })}
          </span>
        ),
      },
    ],
    [],
  );

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Centro contenuti</p>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">Coda editoriale</h1>
          <p className="text-sm text-muted-foreground">
            Stato del sito e contenuti su cui intervenire.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link className={buttonVariants({ size: "sm" })} to="/dashboard/cms/articles/new">
            <FilePlus2 data-icon="inline-start" />
            Nuovo articolo
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-2 gap-2 lg:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>Pubblicati</CardTitle>
            <CardDescription>articoli online</CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              className={buttonVariants({ variant: "outline" })}
              to="/dashboard/cms/articles"
              search={{ page: 1, status: "published" }}
            >
              {count("published")} · Visualizza
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Bozze</CardTitle>
            <CardDescription>da completare</CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              className={buttonVariants({ variant: "outline" })}
              to="/dashboard/cms/articles"
              search={{ page: 1, status: "draft" }}
            >
              {count("draft")} · Visualizza
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Programmati</CardTitle>
            <CardDescription>in calendario</CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              className={buttonVariants({ variant: "outline" })}
              to="/dashboard/cms/articles"
              search={{ page: 1, status: "scheduled" }}
            >
              {count("scheduled")} · Visualizza
            </Link>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Totale</CardTitle>
            <CardDescription>Contenuti editoriali</CardDescription>
          </CardHeader>
          <CardContent>
            <Link
              className={buttonVariants({ variant: "outline" })}
              to="/dashboard/cms/articles"
              search={{ page: 1 }}
            >
              {stats.reduce((sum, item) => sum + item.count, 0)} · Visualizza
            </Link>
          </CardContent>
        </Card>
      </div>

      <Card size="sm">
        <CardHeader>
          <CardTitle>Attività recente</CardTitle>
          <CardDescription>Gli ultimi contenuti modificati, ordinati per data.</CardDescription>
          <CardAction>
            <Link
              className={buttonVariants({ size: "sm", variant: "ghost" })}
              to="/dashboard/cms/articles"
              search={{ page: 1 }}
            >
              Tutti gli articoli
              <ArrowRight data-icon="inline-end" />
            </Link>
          </CardAction>
        </CardHeader>
        <CardContent>
          {recent.length ? (
            <DashboardDataTable
              columns={columns}
              data={recent}
              getRowId={(article) => article.id}
            />
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FileText />
                </EmptyMedia>
                <EmptyTitle>Nessun contenuto</EmptyTitle>
                <EmptyDescription>
                  Crea il primo articolo per avviare la coda editoriale.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </CardContent>
      </Card>
      {trash.length ? (
        <Card>
          <CardHeader>
            <CardTitle>Cestino tassonomie</CardTitle>
            <CardDescription>Ripristina categorie e tag archiviati.</CardDescription>
          </CardHeader>
          <CardContent>
            <ItemGroup>
              {trash.map((item) => (
                <Item key={item.id}>
                  <ItemContent>
                    <ItemTitle>
                      {item.name} · {item.kind}
                    </ItemTitle>
                  </ItemContent>
                  <ItemActions>
                    <Button
                      variant="outline"
                      onClick={() => {
                        void restoreTaxonomyFn({ data: { id: item.id, kind: item.kind } })
                          .then(() => router.invalidate())
                          .catch((error) =>
                            toast.error(
                              error instanceof Error ? error.message : "Ripristino non riuscito",
                            ),
                          );
                      }}
                    >
                      Ripristina
                    </Button>
                  </ItemActions>
                </Item>
              ))}
            </ItemGroup>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

function statusLabel(status: string) {
  return (
    {
      draft: "Bozza",
      scheduled: "Programmato",
      published: "Pubblicato",
      archived: "Archiviato",
    }[status] ?? status
  );
}
