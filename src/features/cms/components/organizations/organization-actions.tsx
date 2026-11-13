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
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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

export function OrganizationActions({
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
    <>
      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifica organizzazione</DialogTitle>
            <DialogDescription>{organization.name}</DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              void save();
            }}
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor={`org-name-${organization.id}`}>Nome</FieldLabel>
                <Input
                  id={`org-name-${organization.id}`}
                  value={name}
                  required
                  onChange={(event) => setName(event.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor={`org-slug-${organization.id}`}>Slug</FieldLabel>
                <Input
                  id={`org-slug-${organization.id}`}
                  value={slug}
                  required
                  pattern={slugInputPattern}
                  onChange={(event) => setSlug(event.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor={`org-type-${organization.id}`}>Tipo</FieldLabel>
                <Select
                  items={organizationTypeOptions}
                  value={type}
                  onValueChange={(value) =>
                    setType(value === "education" ? "education" : "company")
                  }
                >
                  <SelectTrigger id={`org-type-${organization.id}`}>
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
                <FieldLabel htmlFor={`org-desc-${organization.id}`}>Descrizione</FieldLabel>
                <Input
                  id={`org-desc-${organization.id}`}
                  value={description}
                  maxLength={320}
                  onChange={(event) => setDescription(event.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor={`org-url-${organization.id}`}>Sito web</FieldLabel>
                <Input
                  id={`org-url-${organization.id}`}
                  type="url"
                  value={websiteUrl}
                  onChange={(event) => setWebsiteUrl(event.target.value)}
                />
              </Field>
              <ButtonGroup>
                <Button type="submit">Salva</Button>
                <Button type="button" variant="outline" onClick={() => setEditing(false)}>
                  Annulla
                </Button>
              </ButtonGroup>
            </FieldGroup>
          </form>
        </DialogContent>
      </Dialog>
      <ButtonGroup>
        <Button
          size="sm"
          variant="outline"
          disabled={!canManage}
          aria-label={`Modifica ${organization.name}`}
          onClick={() => setEditing(true)}
        >
          <Pencil />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger disabled={!canManage} render={<Button size="sm" variant="outline" />}>
            Archivia
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Archiviare {organization.name}?</AlertDialogTitle>
              <AlertDialogDescription>Potrai ripristinarla dal cestino.</AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annulla</AlertDialogCancel>
              <AlertDialogAction onClick={() => void archive()}>Archivia</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </ButtonGroup>
    </>
  );
}
