import { Clipboard, Pencil, Trash2 } from "lucide-react";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { DropdownMenuGroup, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/features/auth/client/auth-client";
import { roleHasPermission } from "@/features/auth/domain/permissions";
import {
  MediaCard as MediaLibraryCard,
  mediaDisplayName,
} from "@/features/cms/components/media-card";
import { emptyMediaUsage, type MediaUsage } from "@/features/cms/domain/media-associations";
import {
  deleteMediaFn,
  getMediaUsageFn,
  listMediaFn,
  updateMediaFn,
} from "@/features/cms/server/media.functions";

export function ManagedMediaCard({
  item,
  refresh,
}: {
  item: Omit<Awaited<ReturnType<typeof listMediaFn>>[number], "usage"> & { usage?: MediaUsage };
  refresh: () => Promise<unknown>;
}) {
  const { data: session } = authClient.useSession();
  const canEdit = roleHasPermission(session?.user.role, "cmsMedia", "update");
  const canDelete = roleHasPermission(session?.user.role, "cmsMedia", "delete");
  const [name, setName] = useState(mediaDisplayName(item));
  const [altText, setAltText] = useState(item.altText ?? "");
  const [caption, setCaption] = useState(item.caption ?? "");
  const [editing, setEditing] = useState(false);
  const [pending, setPending] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [usage, setUsage] = useState(item.usage ?? emptyMediaUsage());

  async function save() {
    setPending(true);
    try {
      await updateMediaFn({
        data: {
          id: item.id,
          name: name.trim(),
          altText: altText || null,
          caption: caption || null,
        },
      });
      toast.success("Media aggiornato");
      setEditing(false);
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Aggiornamento non riuscito");
    } finally {
      setPending(false);
    }
  }

  async function checkBeforeDelete() {
    setPending(true);
    try {
      setUsage(await getMediaUsageFn({ data: { id: item.id } }));
      setDeleteOpen(true);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Controllo associazioni non riuscito");
    } finally {
      setPending(false);
    }
  }

  async function deleteMedia() {
    setPending(true);
    try {
      await deleteMediaFn({ data: { id: item.id, confirmedUsage: usage.total } });
      setDeleteOpen(false);
      toast.success("Media spostato nel cestino");
      await refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Eliminazione non riuscita");
    } finally {
      setPending(false);
    }
  }

  const displayName = mediaDisplayName(item);
  function changeEditing(open: boolean) {
    if (open) {
      setName(mediaDisplayName(item));
      setAltText(item.altText ?? "");
      setCaption(item.caption ?? "");
    }
    setEditing(open);
  }

  return (
    <>
      <MediaLibraryCard
        item={item}
        pending={pending}
        menuItems={
          <DropdownMenuGroup>
            <DropdownMenuItem disabled={pending || !canEdit} onClick={() => changeEditing(true)}>
              <Pencil />
              Modifica
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                void navigator.clipboard
                  .writeText(item.url)
                  .then(() => toast.success("URL copiato"))
                  .catch(() => toast.error("Impossibile copiare l’URL"))
              }
            >
              <Clipboard />
              Copia URL
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              disabled={pending || !canDelete}
              onClick={() => void checkBeforeDelete()}
            >
              <Trash2 />
              Sposta nel cestino
            </DropdownMenuItem>
          </DropdownMenuGroup>
        }
      />
      <Dialog
        open={editing}
        onOpenChange={(open) => {
          if (!pending) changeEditing(open);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modifica media</DialogTitle>
            <DialogDescription>{item.filename}</DialogDescription>
          </DialogHeader>
          <form
            className="flex flex-col gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              void save();
            }}
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor={`name-${item.id}`}>Nome del media</FieldLabel>
                <Input
                  id={`name-${item.id}`}
                  value={name}
                  maxLength={120}
                  required
                  onChange={(event) => setName(event.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor={`alt-${item.id}`}>Testo alternativo</FieldLabel>
                <Input
                  id={`alt-${item.id}`}
                  value={altText}
                  maxLength={300}
                  onChange={(event) => setAltText(event.target.value)}
                />
              </Field>
              <Field>
                <FieldLabel htmlFor={`caption-${item.id}`}>Didascalia</FieldLabel>
                <Input
                  id={`caption-${item.id}`}
                  value={caption}
                  maxLength={500}
                  onChange={(event) => setCaption(event.target.value)}
                />
              </Field>
            </FieldGroup>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={pending}
                onClick={() => changeEditing(false)}
              >
                Annulla
              </Button>
              <Button type="submit" disabled={pending || !name.trim()}>
                {pending ? <Spinner data-icon="inline-start" /> : null}Salva modifiche
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminare “{displayName}”?</AlertDialogTitle>
            <AlertDialogDescription>
              {usage.total
                ? `Il media è utilizzato ${usage.total} volte. Rimuovi le associazioni prima di spostarlo nel cestino. Anche lo storico delle revisioni viene protetto.`
                : "Il media verrà nascosto dalla libreria. Il file e lo storico saranno conservati; potrai ripristinarlo dal cestino."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annulla</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={pending || usage.total > 0}
              onClick={() => void deleteMedia()}
            >
              {pending ? <Spinner data-icon="inline-start" /> : null}
              Sposta nel cestino
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
