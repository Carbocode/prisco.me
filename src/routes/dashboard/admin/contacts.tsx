/* oxlint-disable react/no-unstable-nested-components -- TanStack Table usa callback di rendering nelle definizioni di colonna. */
import { createFileRoute } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import { Building2, Eye, Inbox, Mail, Phone } from "lucide-react";
import { useState } from "react";

import { DashboardDataTable } from "@/components/dashboard-data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import type { ContactRequest } from "@/db/schema";
import { listContactRequests } from "@/server/contact-requests";

const interestLabels: Record<string, string> = {
  product: "Prodotto",
  technical: "Supporto tecnico",
  consulting: "Consulenza",
  opportunity: "Opportunità",
  other: "Altro",
};

export const Route = createFileRoute("/dashboard/admin/contacts")({
  head: () => ({
    meta: [{ title: "Richieste di contatto | Prisco.me" }, { name: "robots", content: "noindex" }],
  }),
  loader: () => listContactRequests(),
  component: ContactRequestsPage,
});

function ContactRequestsPage() {
  const requests = Route.useLoaderData();
  const [selectedRequest, setSelectedRequest] = useState<ContactRequest | null>(null);

  const columns: ColumnDef<ContactRequest>[] = [
    {
      accessorKey: "name",
      header: "Contatto",
      size: 280,
      minSize: 220,
      cell: ({ row }) => (
        <div className="min-w-0">
          <p className="truncate font-medium">{row.original.name}</p>
          <p className="truncate text-xs text-muted-foreground">{row.original.email}</p>
        </div>
      ),
    },
    {
      accessorKey: "interest",
      header: "Interesse",
      size: 180,
      cell: ({ row }) => (
        <Badge variant="secondary">
          {interestLabels[row.original.interest ?? ""] ?? "Non specificato"}
        </Badge>
      ),
    },
    {
      accessorKey: "company",
      header: "Azienda",
      size: 200,
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.company || "—"}</span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Ricevuta",
      size: 180,
      cell: ({ row }) => (
        <time
          className="text-muted-foreground"
          dateTime={new Date(row.original.createdAt).toISOString()}
        >
          {formatDate(row.original.createdAt)}
        </time>
      ),
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Azioni</span>,
      size: 80,
      minSize: 80,
      maxSize: 80,
      enableResizing: false,
      cell: ({ row }) => (
        <Button
          size="icon-sm"
          variant="outline"
          aria-label={`Apri la richiesta di ${row.original.name}`}
          onClick={() => setSelectedRequest(row.original)}
        >
          <Eye />
        </Button>
      ),
    },
  ];

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Richieste di contatto</CardTitle>
          <CardDescription>
            Messaggi inviati dal modulo di contatto, dal più recente al meno recente.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {requests.length ? (
            <DashboardDataTable
              columns={columns}
              data={requests}
              getRowId={(request) => request.id}
            />
          ) : (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Inbox />
                </EmptyMedia>
                <EmptyTitle>Nessuna richiesta</EmptyTitle>
                <EmptyDescription>
                  Le richieste inviate dal modulo di contatto compariranno qui.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </CardContent>
      </Card>

      <ContactRequestDialog
        request={selectedRequest}
        onOpenChange={(open) => {
          if (!open) setSelectedRequest(null);
        }}
      />
    </>
  );
}

function ContactRequestDialog({
  request,
  onOpenChange,
}: {
  request: ContactRequest | null;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={Boolean(request)} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-xl">
        {request ? (
          <>
            <DialogHeader>
              <DialogTitle>{request.name}</DialogTitle>
              <DialogDescription>
                Ricevuta il {formatDate(request.createdAt)} ·{" "}
                {interestLabels[request.interest ?? ""] ?? "Interesse non specificato"}
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4">
              <dl className="grid gap-3 sm:grid-cols-2">
                <ContactDetail label="Email" value={request.email} icon={Mail} />
                <ContactDetail
                  label="Telefono"
                  value={request.phone || "Non indicato"}
                  icon={Phone}
                />
                <ContactDetail
                  label="Azienda"
                  value={request.company || "Non indicata"}
                  icon={Building2}
                />
                <div className="flex flex-col gap-1">
                  <dt className="text-xs text-muted-foreground">Consenso al contatto</dt>
                  <dd>
                    <Badge variant={request.consentToContact ? "outline" : "destructive"}>
                      {request.consentToContact ? "Confermato" : "Non confermato"}
                    </Badge>
                  </dd>
                </div>
              </dl>
              <Separator />
              <div className="flex flex-col gap-2">
                <p className="text-xs text-muted-foreground">Messaggio</p>
                <p className="whitespace-pre-wrap leading-relaxed">{request.message}</p>
              </div>
            </div>

            <DialogFooter>
              {request.phone ? (
                <Button
                  variant="outline"
                  render={<a href={`tel:${request.phone}`} aria-label={`Chiama ${request.name}`} />}
                >
                  <Phone data-icon="inline-start" />
                  Chiama
                </Button>
              ) : null}
              <Button
                render={
                  <a
                    href={`mailto:${request.email}`}
                    aria-label={`Rispondi via email a ${request.name}`}
                  />
                }
              >
                <Mail data-icon="inline-start" />
                Rispondi via email
              </Button>
            </DialogFooter>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function ContactDetail({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: typeof Mail;
}) {
  return (
    <div className="flex min-w-0 gap-2">
      <Icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
      <div className="min-w-0">
        <dt className="text-xs text-muted-foreground">{label}</dt>
        <dd className="truncate">{value}</dd>
      </div>
    </div>
  );
}

function formatDate(value: Date | string | number) {
  return new Intl.DateTimeFormat("it-IT", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}
