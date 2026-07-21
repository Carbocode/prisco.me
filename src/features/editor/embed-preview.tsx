import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { toPublicHttpUrl, type OpenGraphPreview } from "./embed-url";

export function EmbedPreview({ url, metadata }: { url?: string; metadata?: OpenGraphPreview }) {
  const href = toPublicHttpUrl(url);
  if (!href) return null;

  const host = new URL(href).hostname.replace(/^www\./, "");
  const image = toPublicHttpUrl(metadata?.image);

  return (
    <a href={href} target="_blank" rel="noreferrer" className="block no-underline">
      <Card size="sm">
        {image ? (
          <img
            src={image}
            alt=""
            className="max-h-80 w-full object-cover"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
        ) : null}
        <CardHeader>
          <CardTitle>{metadata?.title || host}</CardTitle>
          {metadata?.description ? <CardDescription>{metadata.description}</CardDescription> : null}
        </CardHeader>
        <CardContent className="sr-only">Apri il collegamento esterno</CardContent>
        <CardFooter>{metadata?.siteName || host}</CardFooter>
      </Card>
    </a>
  );
}
