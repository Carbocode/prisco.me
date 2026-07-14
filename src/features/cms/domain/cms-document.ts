import { z } from "zod";

export type CmsDocument = { type: "doc"; content?: Array<Record<string, unknown>> };
export const CURRENT_CONTENT_VERSION = 1;
export const EMPTY_CMS_DOCUMENT: CmsDocument = { type: "doc", content: [] };

export const cmsDocumentSchema = z
  .object({
    type: z.literal("doc"),
    content: z.array(z.record(z.string(), z.unknown())).optional(),
  })
  .refine(
    (document) => new TextEncoder().encode(JSON.stringify(document)).byteLength <= 512 * 1024,
    {
      message: "Il contenuto supera 512 KiB",
    },
  );

export function serializeCmsDocument(document: CmsDocument) {
  return JSON.stringify(cmsDocumentSchema.parse(document));
}

export function parseCmsDocument(value: string): CmsDocument {
  return cmsDocumentSchema.parse(JSON.parse(value) as unknown);
}
