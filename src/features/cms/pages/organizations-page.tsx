/* oxlint-disable react/no-unstable-nested-components -- TanStack Table usa callback di rendering nelle definizioni di colonna. */
import { useRouter } from "@tanstack/react-router";
import { getRouteApi } from "@tanstack/react-router";
import { Building2, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import {
  DashboardDataTable,
  type DashboardColumnDef,
} from "@/components/data-table/dashboard-data-table";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Field, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { authClient } from "@/features/auth/client/auth-client";
import { roleHasPermission } from "@/features/auth/domain/permissions";
import {
  type Organization,
  organizationTypeOptions,
} from "@/features/cms/components/organizations/organization-model";
import { OrganizationRow } from "@/features/cms/components/organizations/organization-row";
import { slugify, slugInputPattern } from "@/features/cms/domain/slug";
import { createOrganizationFn } from "@/features/cms/server/organization.functions";

const routeApi = getRouteApi("/dashboard/cms/organizations");

export function OrganizationsPage() {
  const { data: session } = authClient.useSession();
  const canManage = roleHasPermission(session?.user.role, "cmsCategory", "update");
  const organizations = routeApi.useLoaderData();
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [type, setType] = useState<"company" | "education">("company");
  const [pending, setPending] = useState(false);
  const columns = useMemo<DashboardColumnDef<Organization>[]>(
    () => [
      { accessorKey: "name", header: "Nome", size: 300, minSize: 200 },
      { accessorKey: "type", header: "Tipo", size: 160, minSize: 130 },
      { accessorKey: "slug", header: "Slug", size: 260, minSize: 180 },
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
      await createOrganizationFn({
        data: {
          name,
          slug: slug || slugify(name),
          type,
          description: description || null,
          websiteUrl: websiteUrl || null,
        },
      });
      setDescription("");
      setWebsiteUrl("");
      setName("");
      setSlug("");
      toast.success("Organizzazione creata");
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
        <p className="text-sm font-medium text-muted-foreground">
          {organizations.length} organizzazioni
        </p>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Organizzazioni</h1>
        <p className="text-sm text-muted-foreground">
          Aziende ed enti di istruzione collegabili ai progetti insieme all’autore.
        </p>
      </header>

      <Card size="sm">
        <CardHeader>
          <CardTitle>Nuova organizzazione</CardTitle>
          <CardDescription>
            Crea un’azienda o un ente di istruzione riutilizzabile nei progetti.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldSet disabled={!canManage}>
            <form onSubmit={(event) => void create(event)}>
              <FieldGroup className="grid items-end lg:grid-cols-(--layout-grid-cols-cms-filters)">
                <Field>
                  <FieldLabel htmlFor="organization-name">Nome</FieldLabel>
                  <Input
                    id="organization-name"
                    value={name}
                    required
                    onChange={(event) => {
                      setName(event.target.value);
                      if (!slug) setSlug(slugify(event.target.value));
                    }}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="organization-slug">Slug</FieldLabel>
                  <Input
                    id="organization-slug"
                    value={slug}
                    pattern={slugInputPattern}
                    title="Lo slug non puo contenere solo numeri"
                    required
                    onChange={(event) => setSlug(event.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel>Tipo</FieldLabel>
                  <Select
                    items={organizationTypeOptions}
                    value={type}
                    onValueChange={(value) =>
                      setType(value === "education" ? "education" : "company")
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="company">Azienda</SelectItem>
                        <SelectItem value="education">Istruzione</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="org-description">Descrizione</FieldLabel>
                  <Input
                    id="org-description"
                    maxLength={320}
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="org-website">Sito web</FieldLabel>
                  <Input
                    id="org-website"
                    type="url"
                    value={websiteUrl}
                    onChange={(event) => setWebsiteUrl(event.target.value)}
                  />
                </Field>
                <Button size="sm" type="submit" disabled={pending}>
                  <Plus data-icon="inline-start" />
                  {pending ? "Creazione…" : "Crea"}
                </Button>
              </FieldGroup>
            </form>
          </FieldSet>
        </CardContent>
      </Card>

      {organizations.length ? (
        <Card size="sm">
          <CardContent>
            <DashboardDataTable
              columns={columns}
              data={organizations}
              getRowId={(organization) => organization.id}
              renderRow={(row) => (
                <OrganizationRow
                  key={row.id}
                  organization={row.original}
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
              <Building2 />
            </EmptyMedia>
            <EmptyTitle>Nessuna organizzazione</EmptyTitle>
            <EmptyDescription>
              Crea la prima organizzazione con il modulo qui sopra.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </div>
  );
}
