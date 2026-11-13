/* oxlint-disable react/no-unstable-nested-components -- TanStack Table usa callback di rendering nelle definizioni di colonna. */
import { Pencil } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
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
import { authClient } from "@/features/auth/client/auth-client";
import { roleHasPermission } from "@/features/auth/domain/permissions";
import {
  type Organization,
  organizationTypeOptions,
} from "@/features/cms/components/organizations/organization-model";
import { slugInputPattern } from "@/features/cms/domain/slug";
import {
  archiveOrganizationFn,
  updateOrganizationFn,
} from "@/features/cms/server/organization.functions";

export function OrganizationRow({
  organization,
  refresh,
}: {
  organization: Organization;
  refresh: () => Promise<unknown>;
}) {
  const { data: session } = authClient.useSession();
  const canManage = roleHasPermission(session?.user.role, "cmsCategory", "update");
  const [editing, setEditing] = useState(false);
  const [description, setDescription] = useState(organization.description ?? "");
  const [websiteUrl, setWebsiteUrl] = useState(organization.websiteUrl ?? "");
  const [name, setName] = useState(organization.name);
  const [slug, setSlug] = useState(organization.slug);
  const [type, setType] = useState<"company" | "education">(
    organization.type === "education" ? "education" : "company",
  );

  async function save() {
    try {
      await updateOrganizationFn({
        data: {
          id: organization.id,
          name,
          slug,
          type,
          description: description || null,
          websiteUrl: websiteUrl || null,
        },
      });
      setEditing(false);
      toast.success("Organizzazione aggiornata");
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Aggiornamento non riuscito");
    }
  }

  async function archive() {
    try {
      await archiveOrganizationFn({ data: { id: organization.id } });
      await refresh();
      toast.success("Organizzazione archiviata");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Archiviazione non riuscita");
    }
  }
  return (
    <TableRow>
      <TableCell>
        {editing ? (
          <FieldGroup>
            <Field>
              <FieldLabel>Nome</FieldLabel>
              <Input value={name} onChange={(event) => setName(event.target.value)} />
            </Field>
            <Field>
              <FieldLabel>Descrizione</FieldLabel>
              <Input
                maxLength={320}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel>Sito web</FieldLabel>
              <Input
                type="url"
                value={websiteUrl}
                onChange={(event) => setWebsiteUrl(event.target.value)}
              />
            </Field>
          </FieldGroup>
        ) : (
          <span className="font-medium">{organization.name}</span>
        )}
      </TableCell>
      <TableCell>
        {editing ? (
          <Select
            items={organizationTypeOptions}
            value={type}
            onValueChange={(value) => setType(value === "education" ? "education" : "company")}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="company">Azienda</SelectItem>
                <SelectItem value="education">Istruzione</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        ) : (
          <Badge variant="secondary">
            {organization.type === "education" ? "Istruzione" : "Azienda"}
          </Badge>
        )}
      </TableCell>
      <TableCell>
        {editing ? (
          <Input
            aria-label="Slug"
            value={slug}
            pattern={slugInputPattern}
            title="Lo slug non puo contenere solo numeri"
            onChange={(event) => setSlug(event.target.value)}
          />
        ) : (
          <span className="text-muted-foreground">/{organization.slug}</span>
        )}
      </TableCell>
      <TableCell className="text-right">
        {editing ? (
          <ButtonGroup>
            <Button size="sm" onClick={() => void save()}>
              Salva
            </Button>
            <Button size="sm" variant="outline" onClick={() => setEditing(false)}>
              Annulla
            </Button>
          </ButtonGroup>
        ) : (
          <>
            <Button
              size="icon-sm"
              variant="outline"
              aria-label={`Modifica ${organization.name}`}
              disabled={!canManage}
              onClick={() => setEditing(true)}
            >
              <Pencil />
            </Button>
            <AlertDialog>
              <AlertDialogTrigger
                disabled={!canManage}
                render={<Button variant="destructive" size="sm" />}
              >
                Archivia
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Archiviare {organization.name}?</AlertDialogTitle>
                  <AlertDialogDescription>
                    L'organizzazione verrà nascosta dai progetti pubblici. Le associazioni verranno
                    conservate e potrai ripristinarla dal cestino CMS.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annulla</AlertDialogCancel>
                  <AlertDialogAction onClick={() => void archive()}>Archivia</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </>
        )}
      </TableCell>
    </TableRow>
  );
}
