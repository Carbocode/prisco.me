import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSiteLocale } from "@/features/site/client/site-location";
import * as m from "@/paraglide/messages.js";

import { toPreviewImageUrl, toPublicHttpUrl, type OpenGraphPreview } from "./embed-url";

export function EmbedPreview({ url, metadata }: { url?: string; metadata?: OpenGraphPreview }) {
  const locale = useSiteLocale();
  const href = toPublicHttpUrl(url);
  if (!href) return null;

  const host = new URL(href).hostname.replace(/^www\./, "");
  const image = toPreviewImageUrl(metadata?.image);

  return (
    <a href={href} target="_blank" rel="noreferrer" className="block no-underline">
      <Card size="sm">
        {image ? (
          <img src={image} alt="" className="max-h-80 w-full object-cover" loading="eager" />
        ) : null}
        <CardHeader>
          <CardTitle>{metadata?.title || host}</CardTitle>
          {metadata?.description ? <CardDescription>{metadata.description}</CardDescription> : null}
        </CardHeader>
        <CardContent className="sr-only" lang={locale}>
          {m.article_external_link({}, { locale })}
        </CardContent>
        <CardFooter>{metadata?.siteName || host}</CardFooter>
      </Card>
    </a>
  );
}
