/* oxlint-disable react/no-unstable-nested-components -- TanStack Table usa callback di rendering nelle definizioni di colonna. */
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
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
import { type Tag, type Category } from "@/features/cms/components/tags/tag.types";
import { slugInputPattern } from "@/features/cms/domain/slug";
import { archiveTagFn, updateTagFn } from "@/features/cms/server/tag.functions";
import { SkillGlyph } from "@/features/portfolio/components/tech-icon";

export function TagActions({
  tag,
  categories,
  refresh,
}: {
  tag: Tag;
  categories: Category[];
  refresh: () => Promise<unknown>;
}) {
  const { data: session } = authClient.useSession();
  const canManage = roleHasPermission(session?.user.role, "cmsTag", "update");
  const [editing, setEditing] = useState(false);
  const [pending, setPending] = useState(false);
  const [name, setName] = useState(tag.name);
  const [slug, setSlug] = useState(tag.slug);
  const [icon, setIcon] = useState(tag.icon ?? "");
  const [marqueeRow, setMarqueeRow] = useState<number | null>(tag.marqueeRow);
  const [color, setColor] = useState(tag.color);
  const [categoryId, setCategoryId] = useState(tag.categoryId);

  async function save(event?: React.FormEvent) {
    event?.preventDefault();
    setPending(true);
    try {
      await updateTagFn({
        data: { id: tag.id, name, slug, categoryId, icon: icon || null, color, marqueeRow },
      });
      setEditing(false);
      toast.success("Tag aggiornato");
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Aggiornamento non riuscito");
    } finally {
      setPending(false);
    }
  }

  async function archive() {
    setPending(true);
    try {
      await archiveTagFn({ data: { id: tag.id } });
      toast.success("Tag archiviato");
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Archiviazione non riuscita");
    } finally {
      setPending(false);
    }
  }

  return (
    <>
      <Dialog
        open={editing}
        onOpenChange={(open) => {
          if (!pending) setEditing(open);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifica tag</DialogTitle>
            <DialogDescription>{tag.name}</DialogDescription>
          </DialogHeader>{" "}
          <form onSubmit={(event) => void save(event)}>
            <FieldGroup className="grid max-h-viewport-panel overflow-y-auto md:grid-cols-2">
              <Field>
                <FieldLabel htmlFor={`tag-${tag.id}-name`}>Nome</FieldLabel>
                <Input
                  id={`tag-${tag.id}-name`}
                  value={name}
                  required
                  onChange={(event) => setName(event.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor={`tag-${tag.id}-slug`}>Slug</FieldLabel>
                <Input
                  id={`tag-${tag.id}-slug`}
                  value={slug}
                  pattern={slugInputPattern}
                  title="Lo slug non puo contenere solo numeri"
                  required
                  onChange={(event) => setSlug(event.target.value)}
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
                  onValueChange={(value) => setCategoryId(value ?? categoryId)}
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
                <FieldLabel htmlFor={`tag-${tag.id}-icon`}>Icona</FieldLabel>
                <Input
                  id={`tag-${tag.id}-icon`}
                  value={icon}
                  maxLength={80}
                  placeholder="Es. simple-icons:react"
                  onChange={(event) => setIcon(event.target.value)}
                />
                <FieldDescription>
                  <Badge variant="outline">
                    <SkillGlyph skill={{ name, icon: icon || null, color }} size={12} />
                    {icon || "Fallback"}
                  </Badge>
                </FieldDescription>
              </Field>
              <Field>
                <FieldLabel htmlFor={`tag-${tag.id}-color`}>Colore</FieldLabel>
                <Input
                  id={`tag-${tag.id}-color`}
                  value={color}
                  required
                  onChange={(event) => setColor(event.target.value)}
                />
                <FieldDescription>
                  <Badge>
                    <SkillGlyph skill={{ name, icon: icon || null, color }} size={12} />
                    {name || "Anteprima tag"}
                  </Badge>
                </FieldDescription>
              </Field>
              <ButtonGroup>
                <Button size="sm" type="submit" disabled={pending}>
                  Salva
                </Button>
                <Button
                  size="sm"
                  type="button"
                  variant="outline"
                  disabled={pending}
                  onClick={() => setEditing(false)}
                >
                  Annulla
                </Button>
              </ButtonGroup>
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
        </DialogContent>
      </Dialog>{" "}
      <ButtonGroup>
        <Button
          size="icon-sm"
          variant="outline"
          aria-label={`Modifica ${tag.name}`}
          disabled={!canManage}
          onClick={() => setEditing(true)}
        >
          <Pencil />
        </Button>
        <AlertDialog>
          <AlertDialogTrigger
            disabled={!canManage}
            render={
              <Button size="icon-sm" variant="destructive" aria-label={`Archivia ${tag.name}`} />
            }
          >
            <Trash2 />
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Archiviare “{tag.name}”?</AlertDialogTitle>
              <AlertDialogDescription>
                Il tag non sarà più disponibile per i nuovi contenuti.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annulla</AlertDialogCancel>
              <AlertDialogAction variant="destructive" onClick={() => void archive()}>
                Archivia
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </ButtonGroup>
    </>
  );
}
