import { AudioLines, Check, Eye, FileIcon, ImageIcon, Video } from "lucide-react";
import type { ReactNode } from "react";

import { HoverAnimatedImage } from "@/components/hover-animated-image";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

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
  details,
  actions,
}: {
  item: MediaCardItem;
  selected?: boolean;
  onSelect?: () => void;
  details?: ReactNode;
  actions?: ReactNode;
}) {
  const displayName = mediaDisplayName(item);
  const type = mediaType(item.mimeType);

  return (
    <Card size="sm">
      <MediaThumbnail item={item} />
      <CardHeader>
        <CardTitle className="truncate">{displayName}</CardTitle>
        <CardDescription className="truncate">{item.filename}</CardDescription>
        <CardAction>
          <Badge variant="outline">
            <type.icon />
            {type.label}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <p className="text-xs tabular-nums text-muted-foreground">
          {item.sizeBytes === undefined ? null : `${Math.round(item.sizeBytes / 1024)} KiB`}
          {item.sizeBytes !== undefined && item.width && item.height ? " · " : null}
          {item.width && item.height ? `${item.width}×${item.height}` : null}
        </p>
        {item.caption ? (
          <p className="line-clamp-2 text-sm text-muted-foreground">{item.caption}</p>
        ) : null}
        {details}
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <MediaPreview item={item} />
        {onSelect ? (
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
        ) : null}
        {item.usage ? (
          <Badge variant="secondary">
            {item.usage.total} {item.usage.total === 1 ? "utilizzo" : "utilizzi"}
          </Badge>
        ) : null}
        {actions}
      </CardFooter>
    </Card>
  );
}

function MediaPreview({ item }: { item: MediaCardItem }) {
  const displayName = mediaDisplayName(item);
  const type = mediaType(item.mimeType);

  return (
    <Dialog>
      <DialogTrigger render={<Button type="button" size="sm" variant="outline" />}>
        <Eye data-icon="inline-start" />
        Anteprima
      </DialogTrigger>
      <DialogContent className="max-h-[calc(100dvh-2rem)] overflow-y-auto sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{displayName}</DialogTitle>
          <DialogDescription>
            {type.label} · {item.filename}
            {item.width && item.height ? ` · ${item.width}×${item.height}` : ""}
          </DialogDescription>
        </DialogHeader>
        {type.kind === "image" ? (
          <HoverAnimatedImage
            src={item.url}
            alt={item.altText ?? displayName}
            width={item.width ?? 1280}
            height={item.height ?? 720}
            containerClassName="max-h-[70dvh] w-full rounded-lg"
            className="max-h-[70dvh] w-full object-contain"
          />
        ) : type.kind === "video" ? (
          // oxlint-disable-next-line jsx-a11y/media-has-caption -- preview CMS senza traccia VTT associata
          <video src={item.url} controls className="max-h-[70dvh] w-full rounded-lg" />
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
      containerClassName="aspect-video w-full"
      className="size-full object-cover"
    />
  ) : (
    <div className="flex aspect-video w-full items-center justify-center text-muted-foreground">
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
