/* oxlint-disable no-underscore-dangle -- TanStack Router espone il parametro splat come `_splat`. */
import { createFileRoute } from "@tanstack/react-router";
import { env } from "cloudflare:workers";

const mediaKeyPattern = /^cms\/\d{4}\/\d{2}\/[0-9a-f-]{36}\.(?:webp|webm)$/;

export const Route = createFileRoute("/media/$")({
  server: {
    handlers: {
      GET: async ({ params, request }) => {
        const key = params._splat ?? "";
        if (!mediaKeyPattern.test(key)) return new Response("Not found", { status: 404 });

        const object = await env.CMS_MEDIA.get(key, { range: request.headers });
        if (!object) return new Response("Not found", { status: 404 });

        const headers = new Headers();
        object.writeHttpMetadata(headers);
        headers.set("Accept-Ranges", "bytes");
        headers.set("Cache-Control", "public, max-age=31536000, immutable");
        headers.set("ETag", object.httpEtag);

        const range = object.range;
        if (request.headers.has("Range") && range) {
          const { start, length } = resolveRange(range, object.size);
          headers.set("Content-Length", String(length));
          headers.set("Content-Range", `bytes ${start}-${start + length - 1}/${object.size}`);
          return new Response(object.body, { status: 206, headers });
        }

        headers.set("Content-Length", String(object.size));
        return new Response(object.body, { headers });
      },
    },
  },
});

function resolveRange(range: R2Range, size: number) {
  if ("suffix" in range) {
    const length = Math.min(range.suffix, size);
    return { start: size - length, length };
  }
  const start = range.offset ?? 0;
  return { start, length: Math.min(range.length ?? size - start, size - start) };
}
