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

export function LinkDialog({
  open,
  onOpenChange,
  text,
  href,
  onTextChange,
  onHrefChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  text: string;
  href: string;
  onTextChange: (value: string) => void;
  onHrefChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Inserisci collegamento</DialogTitle>
            <DialogDescription>Scrivi il testo visibile e l’indirizzo da aprire.</DialogDescription>
          </DialogHeader>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="plate-link-text">Testo</FieldLabel>
              <Input
                id="plate-link-text"
                value={text}
                onChange={(event) => onTextChange(event.target.value)}
                required
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="plate-link-href">Indirizzo</FieldLabel>
              <Input
                id="plate-link-href"
                value={href}
                placeholder="https://example.com"
                onChange={(event) => onHrefChange(event.target.value)}
                required
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>Annulla</DialogClose>
            <Button type="submit">Inserisci</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
