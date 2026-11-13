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
import { MediaBrowser } from "@/features/cms/components/media-picker";
import { mediaTypeLabel, mediaKind } from "@/features/editor/editor-model";
import { type MediaItem } from "@/features/editor/media-context";

export function ImageDialog({
  open,
  onOpenChange,
  media,
  selectedMediaId,
  alt,
  caption,
  mediaType,
  onMediaChange,
  onAltChange,
  onCaptionChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  media: MediaItem[];
  selectedMediaId: string;
  alt: string;
  caption: string;
  mediaType: "audio" | "file" | "image" | "video";
  onMediaChange: (value: string) => void;
  onAltChange: (value: string) => void;
  onCaptionChange: (value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-(--layout-max-h-diagram-dialog) w-(--layout-w-dialog-inset) max-w-6xl flex-col sm:max-w-6xl">
        <form className="flex min-h-0 flex-1 flex-col gap-4" onSubmit={onSubmit}>
          <DialogHeader>
            <DialogTitle>Inserisci {mediaTypeLabel(mediaType)}</DialogTitle>
            <DialogDescription>Scegli un file dalla libreria media.</DialogDescription>
          </DialogHeader>
          <MediaBrowser
            items={media.filter((item) => mediaKind(item.mimeType) === mediaType)}
            value={selectedMediaId}
            onValueChange={onMediaChange}
          />
          <FieldGroup className="grid sm:grid-cols-2">
            <Field>
              <FieldLabel htmlFor="plate-image-alt">Testo alternativo</FieldLabel>
              <Input
                id="plate-image-alt"
                value={alt}
                onChange={(event) => onAltChange(event.target.value)}
              />
            </Field>
            <Field>
              <FieldLabel htmlFor="plate-image-caption">Didascalia</FieldLabel>
              <Input
                id="plate-image-caption"
                value={caption}
                onChange={(event) => onCaptionChange(event.target.value)}
              />
            </Field>
          </FieldGroup>
          <DialogFooter>
            <DialogClose render={<Button type="button" variant="outline" />}>Annulla</DialogClose>
            <Button type="submit" disabled={!selectedMediaId}>
              Inserisci
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
