import { type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { toPublicHttpUrl } from "@/features/content/embeds/embed-url";

export function EmbedDialog({
  open,
  onOpenChange,
  url,
  onUrlChange,
  onSubmit,
  loading,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string;
  onUrlChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  loading: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Inserisci un embed</DialogTitle>
            <DialogDescription>
              Video e post compatibili (YouTube, Vimeo, Instagram, X, LinkedIn, TikTok, Spotify e
              Facebook) saranno incorporati direttamente; gli altri link useranno la preview Open
              Graph.
            </DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="plate-embed-url">Indirizzo</FieldLabel>
              <Input
                id="plate-embed-url"
                value={url}
                placeholder="https://esempio.it/pagina"
                onChange={(event) => onUrlChange(event.target.value)}
                required
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>Annulla</DialogClose>
            <Button type="submit" disabled={!toPublicHttpUrl(url) || loading}>
              {loading ? <Spinner data-icon="inline-start" /> : null}
              Inserisci
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
