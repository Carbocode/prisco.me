/* oxlint-disable react/no-unstable-nested-components -- TanStack Table usa callback di rendering nelle definizioni di colonna. */
import { Link, useRouter } from "@tanstack/react-router";
import { getRouteApi } from "@tanstack/react-router";
import { Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
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
import { listSearchSchema } from "@/features/cms/domain/list-search";
import { slugify, slugInputPattern } from "@/features/cms/domain/slug";
import { createTagFn } from "@/features/cms/server/tag.functions";
import { SkillGlyph } from "@/features/portfolio/components/tech-icon";

const routeApi = getRouteApi("/dashboard/cms/tags_/new");

export function CreateTagPage() {
  const { data: session } = authClient.useSession();
  const canManage = roleHasPermission(session?.user.role, "cmsTag", "update");
  const { categories } = routeApi.useLoaderData();
  const router = useRouter();
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [icon, setIcon] = useState("");
  const [marqueeRow, setMarqueeRow] = useState<number | null>(null);
  const [color, setColor] = useState("text-ink-soft bg-white/10 border-white/15");
  const [categoryId, setCategoryId] = useState(categories[0]?.id ?? "");
  const [pending, setPending] = useState(false);
  async function create(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    try {
      await createTagFn({
        data: {
          name,
          slug: slug || slugify(name),
          categoryId,
          icon: icon || null,
          color,
          marqueeRow,
          mark: null,
          fluentIcon: null,
        },
      });
      setName("");
      setSlug("");
      setSlugTouched(false);
      setIcon("");
      setColor("text-ink-soft bg-white/10 border-white/15");
      toast.success("Tag creato");
      await router.invalidate();
      await router.navigate({ to: "/dashboard/cms/tags", search: listSearchSchema.parse({}) });
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
        to="/dashboard/cms/tags"
        search={listSearchSchema.parse({})}
      >
        Torna all’elenco
      </Link>
      <Card size="sm">
        <CardHeader>
          <CardTitle>Nuovo tag</CardTitle>
        </CardHeader>
        <CardContent>
          <FieldSet disabled={!canManage || pending}>
            <form onSubmit={(event) => void create(event)}>
              <FieldGroup className="grid items-start md:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="tag-name">Nome</FieldLabel>
                  <Input
                    id="tag-name"
                    value={name}
                    required
                    onChange={(event) => {
                      setName(event.target.value);
                      if (!slugTouched) setSlug(slugify(event.target.value));
                    }}
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="tag-slug">Slug</FieldLabel>
                  <Input
                    id="tag-slug"
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
                  <FieldLabel>Categoria</FieldLabel>
                  <Select
                    items={categories.map((category) => ({
                      value: category.id,
                      label: category.name,
                    }))}
                    value={categoryId}
                    onValueChange={(value) => setCategoryId(value ?? "")}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
                <Field>
                  <FieldLabel htmlFor="tag-icon">Icona</FieldLabel>
                  <Input
                    id="tag-icon"
                    value={icon}
                    maxLength={80}
                    placeholder="Es. simple-icons:react"
                    onChange={(event) => setIcon(event.target.value)}
                  />
                  <FieldDescription>
                    <Badge variant="outline">
                      <SkillGlyph
                        skill={{ name: name || "Anteprima", icon: icon || null, color }}
                        size={12}
                      />
                      {icon || "Fallback"}
                    </Badge>
                  </FieldDescription>
                </Field>
                <Field>
                  <FieldLabel htmlFor="tag-color">Colore</FieldLabel>
                  <Input
                    id="tag-color"
                    value={color}
                    onChange={(event) => setColor(event.target.value)}
                  />
                  <FieldDescription>
                    <Badge>
                      <SkillGlyph
                        skill={{ name: name || "Anteprima", icon: icon || null, color }}
                        size={12}
                      />
                      {name || "Anteprima tag"}
                    </Badge>
                  </FieldDescription>
                </Field>
                <Button size="sm" type="submit" disabled={pending}>
                  <Plus data-icon="inline-start" />
                  {pending ? "Creazione…" : "Crea"}
                </Button>
                <Field>
                  <FieldLabel>Riga marquee home (1–4, vuoto per nascondere)</FieldLabel>
                  <Input
                    type="number"
                    min={1}
                    max={4}
                    value={marqueeRow ?? ""}
                    onChange={(event) =>
                      setMarqueeRow(event.target.value ? event.target.valueAsNumber : null)
                    }
                  />
                </Field>
              </FieldGroup>
            </form>
          </FieldSet>
        </CardContent>
      </Card>
    </div>
  );
}
