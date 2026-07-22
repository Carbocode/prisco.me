/* oxlint-disable react/no-unstable-nested-components -- TanStack Table usa callback di rendering nelle definizioni di colonna. */
import { createFileRoute, Link } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { ArrowRight, FilePlus2, FileText } from "lucide-react";
import { useMemo } from "react";

import { DashboardDataTable } from "@/components/dashboard-data-table";
import { Badge } from "@/components/ui/badge";
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
import { listArticlesFn } from "@/features/cms/server/article.functions";

export const Route = createFileRoute("/dashboard/cms/")({
  loader: async () => {
    const articles = await listArticlesFn({ data: { page: 1, pageSize: 100 } });
    return { articles: articles.items };
  },
  component: CmsDashboardContent,
});

function CmsDashboardContent() {
  const { articles } = Route.useLoaderData();
  const count = (status: string) => articles.filter((article) => article.status === status).length;
  const recent = [...articles]
    .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
    .slice(0, 8);
  const columns = useMemo<ColumnDef<(typeof recent)[number]>[]>(
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
    <div className="flex flex-col gap-4">
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
        <StatCard title="Pubblicati" value={count("published")} hint="articoli online" />
        <StatCard title="Bozze" value={count("draft")} hint="da completare" />
        <StatCard title="Programmati" value={count("scheduled")} hint="in calendario" />
        <StatCard title="Totale" value={articles.length} hint="contenuti editoriali" />
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
            <Empty className="p-8">
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
    </div>
  );
}

function StatCard({ title, value, hint }: { title: string; value: number; hint: string }) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardDescription>{title}</CardDescription>
        <CardAction className="font-heading text-2xl font-semibold tabular-nums">
          {value}
        </CardAction>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">{hint}</CardContent>
    </Card>
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
