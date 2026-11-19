import { getRouteApi } from "@tanstack/react-router";
/* oxlint-disable react/no-unstable-nested-components -- TanStack Table usa callback di rendering nelle definizioni di colonna. */
import { Building2, Eye, Inbox, Mail, Phone } from "lucide-react";
import { useState } from "react";

import {
  DashboardDataTable,
  type DashboardColumnDef,
} from "@/components/data-table/dashboard-data-table";
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
import type { SiteLocale } from "@/config/site";
import type { ContactRequest } from "@/db/schema";
import { useSiteLocale } from "@/features/site/client/site-location";
import * as m from "@/paraglide/messages.js";

const routeApi = getRouteApi("/dashboard/admin/contacts");

function interestLabels(locale: SiteLocale): Record<string, string> {
  return {
    product: m.contacts_product({}, { locale }),
    technical: m.contacts_technical({}, { locale }),
    consulting: m.contacts_consulting({}, { locale }),
    opportunity: m.contacts_opportunity({}, { locale }),
    other: m.contacts_other({}, { locale }),
  };
}

export function ContactRequestsPage() {
  const locale = useSiteLocale();
  const requests = routeApi.useLoaderData();
  const [selectedRequest, setSelectedRequest] = useState<ContactRequest | null>(null);

  const columns: DashboardColumnDef<ContactRequest>[] = [
    {
      accessorKey: "name",
      header: m.contacts_contact({}, { locale }),
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
      header: m.contacts_interest({}, { locale }),
      size: 180,
      cell: ({ row }) => (
        <Badge variant="secondary">
          {interestLabels(locale)[row.original.interest ?? ""] ??
            m.contacts_unspecified({}, { locale })}
        </Badge>
      ),
    },
    {
      accessorKey: "company",
      header: m.contacts_company({}, { locale }),
      size: 200,
      cell: ({ row }) => (
        <span className="text-muted-foreground">{row.original.company || "—"}</span>
      ),
    },
    {
      accessorKey: "createdAt",
      header: m.contacts_received({}, { locale }),
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
      header: () => <span className="sr-only">{m.contacts_actions({}, { locale })}</span>,
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
          <CardTitle>{m.contacts_contact_requests({}, { locale })}</CardTitle>
          <CardDescription>
            {m.contacts_messages_sent_through_the_contact_form({}, { locale })}{" "}
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
                <EmptyTitle>{m.contacts_no_requests({}, { locale })}</EmptyTitle>
                <EmptyDescription>
                  {m.contacts_requests_from_the_contact_form_will({}, { locale })}{" "}
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
  const locale = useSiteLocale();
  return (
    <Dialog open={Boolean(request)} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-(--layout-max-h-dialog-viewport) overflow-y-auto sm:max-w-xl">
        {request ? (
          <>
            <DialogHeader>
              <DialogTitle>{request.name}</DialogTitle>
              <DialogDescription>
                {m.contacts_received_on({}, { locale })} {formatDate(request.createdAt)} ·{" "}
                {interestLabels(locale)[request.interest ?? ""] ??
                  m.contacts_interest_unspecified({}, { locale })}
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-4">
              <dl className="grid gap-3 sm:grid-cols-2">
                <ContactDetail label="Email" value={request.email} icon={Mail} />
                <ContactDetail
                  label={m.contacts_phone({}, { locale })}
                  value={request.phone || m.contacts_phone_unspecified({}, { locale })}
                  icon={Phone}
                />
                <ContactDetail
                  label={m.contacts_company({}, { locale })}
                  value={request.company || m.contacts_company_unspecified({}, { locale })}
                  icon={Building2}
                />
                <div className="flex flex-col gap-1">
                  <dt className="text-xs text-muted-foreground">
                    {m.contacts_consent_to_be_contacted({}, { locale })}
                  </dt>
                  <dd>
                    <Badge variant={request.consentToContact ? "outline" : "destructive"}>
                      {request.consentToContact
                        ? m.contacts_confirmed({}, { locale })
                        : m.contacts_not_confirmed({}, { locale })}
                    </Badge>
                  </dd>
                </div>
              </dl>
              <Separator />
              <div className="flex flex-col gap-2">
                <p className="text-xs text-muted-foreground">
                  {m.contacts_message({}, { locale })}
                </p>
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
                  {m.contacts_call({}, { locale })}{" "}
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
                {m.contacts_reply_by_email({}, { locale })}{" "}
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
