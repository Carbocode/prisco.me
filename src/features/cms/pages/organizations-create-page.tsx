/* oxlint-disable react/no-unstable-nested-components -- TanStack Table usa callback di rendering nelle definizioni di colonna. */
import { Link, useRouter } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { organizationTypeOptions } from "@/features/cms/components/organizations/organization-model";
import { listSearchSchema } from "@/features/cms/domain/list-search";
import { slugify, slugInputPattern } from "@/features/cms/domain/slug";
import { createOrganizationFn } from "@/features/cms/server/organization.functions";

export function CreateOrganizationPage() {
  const { data: session } = authClient.useSession();
  const canManage = roleHasPermission(session?.user.role, "cmsCategory", "update");
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [type, setType] = useState<"company" | "education">("company");
  const [pending, setPending] = useState(false);
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
      setSlugTouched(false);
      toast.success("Organizzazione creata");
      await router.invalidate();
      await router.navigate({
        to: "/dashboard/cms/organizations",
        search: listSearchSchema.parse({}),
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Creazione non riuscita");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto flex w-full min-w-0 max-w-3xl flex-col gap-6">
      <Link
        className={buttonVariants({ variant: "outline", size: "sm" })}
        to="/dashboard/cms/organizations"
        search={listSearchSchema.parse({})}
      >
        Torna all’elenco
      </Link>
      <Card size="sm">
        <CardHeader>
          <CardTitle>Nuova organizzazione</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldSet disabled={!canManage || pending}>
            <form onSubmit={(event) => void create(event)}>
              <FieldGroup className="grid items-start md:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="organization-name">Nome</FieldLabel>
                  <Input
                    id="organization-name"
                    value={name}
                    required
                    onChange={(event) => {
                      setName(event.target.value);
                      if (!slugTouched) setSlug(slugify(event.target.value));
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
                    onChange={(event) => {
                      setSlugTouched(true);
                      setSlug(event.target.value);
                    }}
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
    </div>
  );
}
