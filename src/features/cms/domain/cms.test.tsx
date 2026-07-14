import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { renderCmsDocument } from "../editor/render-cms-document";
import { parseCmsDocument, serializeCmsDocument } from "./cms-document";
import { hasValidImageSignature, mediaStorageKey } from "./media";
import { slugify, slugPattern } from "./slug";
import { createServiceSchema } from "./validation";
import { canEditArticle, publicationState } from "./workflow";

describe("CMS domain", () => {
  it("normalizza slug Unicode e separatori", () => {
    expect(slugify("  Caffè & Codice -- 2026! ")).toBe("caffe-codice-2026");
    expect(slugPattern.test("slug-valido")).toBe(true);
    expect(slugPattern.test("-slug--no-")).toBe(false);
  });
  it("serializza solo documenti con root doc", () => {
    const value = { type: "doc" as const, content: [{ type: "paragraph" }] };
    expect(parseCmsDocument(serializeCmsDocument(value))).toEqual(value);
    expect(() => parseCmsDocument('{"type":"html"}')).toThrow();
  });
  it("determina pubblicazione immediata o programmata", () => {
    const now = new Date("2026-01-01T00:00:00Z");
    expect(publicationState(undefined, now).status).toBe("published");
    expect(publicationState(new Date("2026-01-02T00:00:00Z"), now).status).toBe("scheduled");
  });
  it("applica ownership autore", () => {
    expect(canEditArticle("author", "a", "a")).toBe(true);
    expect(canEditArticle("author", "a", "b")).toBe(false);
    expect(canEditArticle("editor", "a", "b")).toBe(true);
  });
  it("rifiuta protocolli CTA pericolosi", () => {
    const base = { name: "Servizio", slug: "servizio", content: { type: "doc" as const } };
    expect(createServiceSchema.safeParse({ ...base, callToActionUrl: "/contact" }).success).toBe(
      true,
    );
    expect(
      createServiceSchema.safeParse({ ...base, callToActionUrl: "javascript:alert(1)" }).success,
    ).toBe(false);
  });
  it("genera storage key non controllate dal client e verifica magic bytes", () => {
    expect(mediaStorageKey("image/png", new Date("2026-07-01"), "uuid")).toBe(
      "cms/2026/07/uuid.png",
    );
    expect(
      hasValidImageSignature(
        new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]),
        "image/png",
      ),
    ).toBe(true);
  });
  it("renderizza nodi noti, filtra link e ignora nodi sconosciuti", () => {
    const html = renderToStaticMarkup(
      <>
        {renderCmsDocument({
          type: "doc",
          content: [
            {
              type: "paragraph",
              content: [
                {
                  type: "text",
                  text: "sicuro",
                  marks: [{ type: "link", attrs: { href: "javascript:bad" } }],
                },
              ],
            },
            { type: "script", content: [{ type: "text", text: "male" }] },
          ],
        })}
      </>,
    );
    expect(html).toContain("sicuro");
    expect(html).not.toContain("javascript");
    expect(html).not.toContain("male");
  });
});
