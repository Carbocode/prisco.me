import { createFileRoute } from "@tanstack/react-router";
import { env } from "cloudflare:workers";

import { getDb } from "@/db";
import { cmsAuditLogs, cmsMedia } from "@/db/schema";
import {
  hasValidMediaSignature,
  MAX_MEDIA_BYTES,
  mediaStorageKey,
  mediaTypes,
  mediaDeliveryBaseUrl,
  mediaUrl,
} from "@/features/cms/domain/media";
import { requireCmsPermission } from "@/features/cms/server/cms-auth";
import { CmsError } from "@/features/cms/server/cms-errors";
import { auditInsert } from "@/features/cms/server/cms.repository";
import { jsonError } from "@/features/cms/server/http";
export const Route = createFileRoute("/api/cms/media/upload")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const origin = request.headers.get("Origin");
          if (origin && new URL(origin).host !== new URL(request.url).host)
            throw new CmsError(403, "INVALID_ORIGIN", "Invalid origin");
          const length = Number(request.headers.get("Content-Length"));
          if (length && length > MAX_MEDIA_BYTES + 64 * 1024)
            throw new CmsError(413, "FILE_TOO_LARGE", "File is too large");
          const session = await requireCmsPermission("cmsMedia", "upload");
          const form = await request.formData();
          const file = form.get("file");
          if (!(file instanceof File)) throw new CmsError(400, "FILE_REQUIRED", "File is required");
          if (file.size > MAX_MEDIA_BYTES)
            throw new CmsError(413, "FILE_TOO_LARGE", "File is too large");
          if (!isSupportedMime(file.type))
            throw new CmsError(415, "UNSUPPORTED_MEDIA_TYPE", "Unsupported media type");
          const mimeType = file.type;
          const bytes = new Uint8Array(await file.arrayBuffer());
          if (!hasValidMediaSignature(bytes, mimeType))
            throw new CmsError(
              415,
              "INVALID_FILE_SIGNATURE",
              "File content does not match its media type",
            );
          const expectedExtension = mediaTypes[mimeType];
          const originalExtension = file.name.split(".").pop()?.toLowerCase();
          if (!originalExtension || originalExtension !== expectedExtension)
            throw new CmsError(
              415,
              "INVALID_FILE_EXTENSION",
              "File extension does not match its media type",
            );
          const storageKey = mediaStorageKey(mimeType);
          await env.CMS_MEDIA.put(storageKey, bytes, { httpMetadata: { contentType: mimeType } });
          const id = crypto.randomUUID();
          const altTextValue = form.get("altText");
          const altText =
            typeof altTextValue === "string" ? altTextValue.slice(0, 300) || null : null;
          const width = formDimension(form.get("width"));
          const height = formDimension(form.get("height"));
          try {
            await getDb(env).batch([
              getDb(env).insert(cmsMedia).values({
                id,
                storageKey,
                filename: file.name,
                mimeType,
                sizeBytes: file.size,
                width,
                height,
                altText,
                createdById: session.user.id,
              }),
              getDb(env)
                .insert(cmsAuditLogs)
                .values(
                  auditInsert(session.user.id, "media.uploaded", "media", id, {
                    mimeType,
                    sizeBytes: file.size,
                  }),
                ),
            ]);
          } catch (error) {
            await env.CMS_MEDIA.delete(storageKey);
            throw error;
          }
          return Response.json(
            {
              data: {
                id,
                storageKey,
                filename: file.name,
                mimeType,
                sizeBytes: file.size,
                url: mediaUrl(
                  mediaDeliveryBaseUrl(env.VITE_MODE, env.MEDIA_PUBLIC_URL),
                  storageKey,
                ),
              },
            },
            { status: 201, headers: { "Cache-Control": "no-store" } },
          );
        } catch (error) {
          return jsonError(error);
        }
      },
    },
  },
});

function isSupportedMime(value: string): value is keyof typeof mediaTypes {
  return value in mediaTypes;
}

function formDimension(value: FormDataEntryValue | null) {
  if (typeof value !== "string" || !/^\d{1,5}$/.test(value)) return null;
  const dimension = Number(value);
  return dimension > 0 ? dimension : null;
}
