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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/features/auth/client/auth-client";
import { roleHasPermission } from "@/features/auth/domain/permissions";
import {
  MediaCard as MediaLibraryCard,
  mediaDisplayName,
} from "@/features/cms/components/media-card";
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
  item: Awaited<ReturnType<typeof listMediaFn>>[number];
  refresh: () => Promise<unknown>;
}) {
  const { data: session } = authClient.useSession();
  const canManage = roleHasPermission(session?.user.role, "cmsMedia", "delete");
  const [name, setName] = useState(mediaDisplayName(item));
  const [altText, setAltText] = useState(item.altText ?? "");
  const [caption, setCaption] = useState(item.caption ?? "");
  const [editing, setEditing] = useState(false);
  const [pending, setPending] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [usage, setUsage] = useState(item.usage);

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

  const displayName = mediaDisplayName({ ...item, name });

  return (
    <Collapsible open={editing} onOpenChange={setEditing}>
      <MediaLibraryCard
        item={{ ...item, name, altText, caption }}
        details={
          <CollapsibleContent>
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
              <Button size="sm" disabled={pending || !name.trim()} onClick={() => void save()}>
                {pending ? <Spinner data-icon="inline-start" /> : null}
                Salva modifiche
              </Button>
            </FieldGroup>
          </CollapsibleContent>
        }
        actions={
          <>
            <CollapsibleTrigger
              disabled={!canManage}
              render={<Button type="button" size="sm" variant="outline" />}
            >
              <Pencil data-icon="inline-start" />
              {editing ? "Chiudi" : "Modifica"}
            </CollapsibleTrigger>
            <Button
              size="icon-sm"
              variant="outline"
              aria-label={`Copia URL di ${displayName}`}
              onClick={() =>
                void navigator.clipboard
                  .writeText(item.url)
                  .then(() => toast.success("URL copiato"))
              }
            >
              <Clipboard />
            </Button>
            <Button
              size="icon-sm"
              variant="destructive"
              disabled={pending || !canManage}
              aria-label={`Sposta nel cestino ${displayName}`}
              onClick={() => void checkBeforeDelete()}
            >
              {pending ? <Spinner /> : <Trash2 />}
            </Button>
          </>
        }
      />
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
    </Collapsible>
  );
}
