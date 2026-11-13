import { AudioLines, Check, Eye, FileIcon, ImageIcon, MoreHorizontal, Video } from "lucide-react";
import { useState, type ReactNode } from "react";

import { HoverAnimatedImage } from "@/components/media/hover-animated-image";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardAction, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export type MediaCardItem = {
  id: string;
  name?: string | null;
  filename: string;
  url: string;
  mimeType?: string;
  altText?: string | null;
  caption?: string | null;
  width?: number | null;
  height?: number | null;
  sizeBytes?: number;
  usage?: { total: number };
};

export function mediaDisplayName(item: MediaCardItem) {
  return item.name?.trim() || item.filename;
}

export function MediaCard({
  item,
  selected = false,
  onSelect,
  menuItems,
  pending = false,
}: {
  item: MediaCardItem;
  selected?: boolean;
  onSelect?: () => void;
  menuItems?: ReactNode;
  pending?: boolean;
}) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const displayName = mediaDisplayName(item);
  return (
    <>
      <Card size="sm" className="min-w-0">
        <MediaThumbnail item={item} />
        <CardHeader className="min-w-0">
          <CardTitle className="min-w-0">
            <span className="block min-w-0 truncate" title={displayName}>
              {displayName}
            </span>
          </CardTitle>
          <CardAction>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    type="button"
                    size="icon-sm"
                    variant="ghost"
                    disabled={pending}
                    aria-label={`Azioni per ${displayName}`}
                  />
                }
              >
                <MoreHorizontal />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setPreviewOpen(true)}>
                    <Eye />
                    Anteprima e dettagli
                  </DropdownMenuItem>
                </DropdownMenuGroup>
                {menuItems ? (
                  <>
                    <DropdownMenuSeparator />
                    {menuItems}
                  </>
                ) : null}
              </DropdownMenuContent>
            </DropdownMenu>
          </CardAction>
        </CardHeader>
        {onSelect ? (
          <CardFooter>
            <Button
              type="button"
              size="sm"
              variant={selected ? "secondary" : "outline"}
              aria-pressed={selected}
              onClick={onSelect}
            >
              {selected ? <Check data-icon="inline-start" /> : null}
              {selected ? "Selezionato" : "Seleziona"}
            </Button>
          </CardFooter>
        ) : null}
      </Card>
      <MediaPreview item={item} open={previewOpen} onOpenChange={setPreviewOpen} />
    </>
  );
}

function MediaPreview({
  item,
  open,
  onOpenChange,
}: {
  item: MediaCardItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const displayName = mediaDisplayName(item);
  const type = mediaType(item.mimeType);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-(--layout-max-h-dialog-viewport) overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>
            <span className="block min-w-0 break-words">{displayName}</span>
          </DialogTitle>
          <DialogDescription>
            {type.label} · <span className="break-all">{item.filename}</span>
            {item.width && item.height ? ` · ${item.width}×${item.height}` : ""}
          </DialogDescription>
        </DialogHeader>
        {item.sizeBytes !== undefined ? (
          <p className="text-sm text-muted-foreground">{Math.round(item.sizeBytes / 1024)} KiB</p>
        ) : null}
        {item.caption ? <p className="text-sm">{item.caption}</p> : null}
        {type.kind === "image" ? (
          <HoverAnimatedImage
            src={item.url}
            alt={item.altText ?? displayName}
            width={item.width ?? 1280}
            height={item.height ?? 720}
            containerClassName="max-h-(--layout-max-h-viewport-panel) w-full rounded-lg"
            className="max-h-(--layout-max-h-viewport-panel) w-full object-contain"
          />
        ) : type.kind === "video" ? (
          // oxlint-disable-next-line jsx-a11y/media-has-caption -- preview CMS senza traccia VTT associata
          <video
            src={item.url}
            controls
            className="max-h-(--layout-max-h-viewport-panel) w-full rounded-lg"
          />
        ) : type.kind === "audio" ? (
          // oxlint-disable-next-line jsx-a11y/media-has-caption -- anteprima audio CMS senza trascrizione associata
          <audio src={item.url} controls className="w-full" />
        ) : (
          <a
            className={buttonVariants()}
            href={item.url}
            target="_blank"
            rel="noreferrer"
            aria-label={`Apri ${displayName}`}
          >
            Apri il file
          </a>
        )}
      </DialogContent>
    </Dialog>
  );
}

function MediaThumbnail({ item }: { item: MediaCardItem }) {
  const type = mediaType(item.mimeType);
  const Icon = type.icon;

  return type.kind === "image" ? (
    <HoverAnimatedImage
      src={item.url}
      alt={item.altText ?? ""}
      width={item.width ?? 640}
      height={item.height ?? 360}
      loading="lazy"
      containerClassName="aspect-square w-full"
      className="size-full object-contain"
    />
  ) : (
    <div className="flex aspect-square w-full items-center justify-center text-muted-foreground">
      <Icon className="size-10" />
    </div>
  );
}

function mediaType(mimeType?: string) {
  if (!mimeType || mimeType.startsWith("image/"))
    return { kind: "image", label: "Immagine", icon: ImageIcon } as const;
  if (mimeType.startsWith("video/")) return { kind: "video", label: "Video", icon: Video } as const;
  if (mimeType.startsWith("audio/"))
    return { kind: "audio", label: "Audio", icon: AudioLines } as const;
  return { kind: "file", label: "File", icon: FileIcon } as const;
}
