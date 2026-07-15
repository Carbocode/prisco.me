import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { renderCmsDocument } from "../editor/render-cms-document";
import { parseCmsDocument, serializeCmsDocument, toPlateValue } from "./cms-document";
import { hasValidMediaSignature, mediaStorageKey } from "./media";
import { slugify, slugPattern } from "./slug";
import {
  createArticleSchema,
  createCategorySchema,
  createOrganizationSchema,
  createTagSchema,
} from "./validation";
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
  it("converte i documenti Tiptap nel formato Plate", () => {
    expect(
      toPlateValue({
        type: "doc",
        content: [
          {
            type: "heading",
            attrs: { level: 3 },
            content: [{ type: "text", text: "Titolo", marks: [{ type: "bold" }] }],
          },
        ],
      }),
    ).toEqual([{ type: "h3", children: [{ text: "Titolo", bold: true }] }]);
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
  it("richiede una categoria e lascia opzionale l’organizzazione", () => {
    const base = {
      title: "Progetto",
      slug: "progetto",
      content: { type: "doc" as const },
      tagIds: [],
    };
    expect(createArticleSchema.safeParse({ ...base, categoryIds: [] }).success).toBe(false);
    expect(
      createArticleSchema.safeParse({
        ...base,
        categoryIds: [
          "00000000-0000-4000-8000-000000000501",
          "00000000-0000-4000-8000-000000000502",
        ],
      }).success,
    ).toBe(false);
    expect(
      createArticleSchema.safeParse({
        ...base,
        categoryIds: ["00000000-0000-4000-8000-000000000501"],
        organizationId: null,
      }).success,
    ).toBe(true);
  });
  it("riserva gli slug esclusivamente numerici alle route data", () => {
    expect(
      createArticleSchema.safeParse({
        title: "Progetto",
        slug: "2026",
        content: { type: "doc" },
        categoryIds: ["00000000-0000-4000-8000-000000000501"],
        tagIds: [],
      }).success,
    ).toBe(false);
    expect(createCategorySchema.safeParse({ name: "Categoria", slug: "123" }).success).toBe(false);
    expect(
      createTagSchema.safeParse({
        name: "Tag",
        slug: "123",
        categoryId: "00000000-0000-4000-8000-000000000501",
        color: "blue",
      }).success,
    ).toBe(false);
    expect(
      createOrganizationSchema.safeParse({
        name: "Organizzazione",
        slug: "123",
        type: "company",
      }).success,
    ).toBe(false);
    expect(createCategorySchema.safeParse({ name: "Categoria", slug: "2026-news" }).success).toBe(
      true,
    );
  });
  it("genera storage key non controllate dal client e verifica magic bytes", () => {
    expect(mediaStorageKey("image/webp", new Date("2026-07-01"), "uuid")).toBe(
      "cms/2026/07/uuid.webp",
    );
    expect(
      hasValidMediaSignature(
        new Uint8Array([0x52, 0x49, 0x46, 0x46, 0, 0, 0, 0, 0x57, 0x45, 0x42, 0x50]),
        "image/webp",
      ),
    ).toBe(true);
    expect(hasValidMediaSignature(new Uint8Array([0x1a, 0x45, 0xdf, 0xa3]), "video/webm")).toBe(
      true,
    );
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
  it("renderizza formati avanzati, task list e tabelle", () => {
    const html = renderToStaticMarkup(
      <>
        {renderCmsDocument({
          type: "doc",
          content: [
            {
              type: "heading",
              attrs: { level: 4, textAlign: "center" },
              content: [{ type: "text", text: "Titolo" }],
            },
            {
              type: "paragraph",
              content: [
                { type: "text", text: "sottolineato", marks: [{ type: "underline" }] },
                { type: "text", text: "evidenziato", marks: [{ type: "highlight" }] },
                { type: "text", text: "apice", marks: [{ type: "superscript" }] },
                { type: "text", text: "pedice", marks: [{ type: "subscript" }] },
              ],
            },
            { type: "codeBlock", content: [{ type: "text", text: "const value = 1;" }] },
            {
              type: "taskList",
              content: [
                {
                  type: "taskItem",
                  attrs: { checked: true },
                  content: [
                    {
                      type: "paragraph",
                      content: [{ type: "text", text: "Completata" }],
                    },
                  ],
                },
              ],
            },
            {
              type: "table",
              content: [
                {
                  type: "tableRow",
                  content: [
                    {
                      type: "tableHeader",
                      content: [
                        {
                          type: "paragraph",
                          content: [{ type: "text", text: "Colonna" }],
                        },
                      ],
                    },
                    {
                      type: "tableCell",
                      content: [
                        {
                          type: "paragraph",
                          content: [{ type: "text", text: "Valore" }],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
            {
              type: "toggle",
              children: [{ text: "Contenuto espandibile" }],
            },
          ],
        })}
      </>,
    );
    const plateHtml = renderToStaticMarkup(
      <>
        {renderCmsDocument({
          type: "doc",
          content: [
            {
              type: "h1",
              lineHeight: 2,
              children: [{ text: "Titolo principale", color: "#ff0000", kbd: true }],
            },
            { type: "toggle", children: [{ text: "Contenuto espandibile" }] },
          ],
        })}
      </>,
    );
    expect(html).toContain('style="text-align:center"');
    expect(plateHtml).toContain('<h1 id="titolo-principale-0" style="line-height:2">');
    expect(plateHtml).toContain('style="color:#ff0000"');
    expect(plateHtml).toContain("<kbd>Titolo principale</kbd>");
    expect(html).toContain("<u>sottolineato</u>");
    expect(html).toContain("<mark>evidenziato</mark>");
    expect(html).toContain("<sup>apice</sup>");
    expect(html).toContain("<sub>pedice</sub>");
    expect(html).toContain("<pre><code>const value = 1;</code></pre>");
    expect(html).toContain('class="cms-task-list-item"');
    expect(html).toContain('type="checkbox"');
    expect(html).toContain('class="cms-content-table"');
    expect(html).toContain('<th scope="col">');
    expect(plateHtml).toContain('<details open="">');
  });
});
