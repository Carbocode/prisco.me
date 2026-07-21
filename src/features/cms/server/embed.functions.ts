import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { toEmbedUrl, type OpenGraphPreview } from "@/features/editor/embed-url";

import { requireCmsPermission } from "./cms-auth";

const MAX_HTML_BYTES = 1_000_000;
const MAX_REDIRECTS = 3;

export const getEmbedPreviewFn = createServerFn({ method: "POST" })
  .validator(z.object({ url: z.url().max(2_048) }))
  .handler(async ({ data }) => {
    await requireCmsPermission("cmsArticle", "update");
    if (toEmbedUrl(data.url)) return { url: data.url };

    const { response, finalUrl } = await fetchPage(data.url);
    const contentType = response.headers.get("content-type")?.toLowerCase() ?? "";
    const length = Number(response.headers.get("content-length") ?? 0);
    if (!response.ok || !contentType.includes("text/html") || length > MAX_HTML_BYTES) {
      throw new Error("La pagina non espone metadati HTML leggibili");
    }

    const html = (await response.text()).slice(0, MAX_HTML_BYTES);
    const metadata = parseOpenGraph(html, finalUrl);
    return { url: data.url, metadata };
  });

async function fetchPage(input: string) {
  let current = safeRemoteUrl(input);
  for (let redirects = 0; redirects <= MAX_REDIRECTS; redirects += 1) {
    const response = await fetch(current, {
      redirect: "manual",
      headers: {
        Accept: "text/html,application/xhtml+xml",
        "User-Agent": "Prisco.me link preview/1.0",
      },
      signal: AbortSignal.timeout(7_000),
    });
    if (response.status < 300 || response.status >= 400) {
      return { response, finalUrl: current };
    }
    const location = response.headers.get("location");
    if (!location || redirects === MAX_REDIRECTS) throw new Error("Troppi reindirizzamenti");
    current = safeRemoteUrl(new URL(location, current).href);
  }
  throw new Error("Impossibile leggere il collegamento");
}

function safeRemoteUrl(value: string) {
  const url = new URL(value);
  if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error("URL non valido");
  const host = url.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  const forbidden =
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host.endsWith(".local") ||
    host === "0.0.0.0" ||
    host === "::1" ||
    /^127\./.test(host) ||
    /^10\./.test(host) ||
    /^192\.168\./.test(host) ||
    /^169\.254\./.test(host) ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(host) ||
    /^f[cd][0-9a-f]{2}:/i.test(host) ||
    /^fe[89ab][0-9a-f]:/i.test(host);
  if (forbidden) throw new Error("Host non consentito");
  url.username = "";
  url.password = "";
  return url.href;
}

export function parseOpenGraph(html: string, pageUrl: string): OpenGraphPreview {
  const tags = new Map<string, string>();
  for (const tag of html.match(/<meta\s+[^>]*>/gi) ?? []) {
    const attrs = [...tag.matchAll(/([:\w-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)].reduce(
      (result, match) => ({
        ...result,
        [match[1].toLowerCase()]: decodeHtml(match[2] ?? match[3] ?? match[4]),
      }),
      {} as Record<string, string>,
    );
    const key = (attrs.property || attrs.name)?.toLowerCase();
    if (key && attrs.content && !tags.has(key)) tags.set(key, attrs.content.trim());
  }

  const titleTag = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1];
  const imageValue = tags.get("og:image") || tags.get("twitter:image");
  let image: string | undefined;
  if (imageValue) {
    try {
      image = new URL(imageValue, pageUrl).href;
    } catch {
      image = undefined;
    }
  }
  const title = tags.get("og:title") || tags.get("twitter:title") || decodeHtml(titleTag ?? "");
  return {
    title: title.trim().slice(0, 200) || new URL(pageUrl).hostname,
    description: (
      tags.get("og:description") ||
      tags.get("description") ||
      tags.get("twitter:description")
    )
      ?.trim()
      .slice(0, 500),
    image,
    siteName: tags.get("og:site_name")?.slice(0, 100),
  };
}

function decodeHtml(value: string) {
  return value
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&amp;/gi, "&")
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code: string) =>
      String.fromCodePoint(Number.parseInt(code, 16)),
    );
}
