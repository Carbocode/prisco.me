# Article editor and WebMCP

The editor owns Plate composition and browser-side document editing. The canonical document model and public renderer belong to `content`; article fields and persistence belong to `cms`.

## Block interactions

Each editable block exposes separate shadcn controls for insertion, dragging, and a click/keyboard-accessible action menu. Controls remain visible on touch devices and on keyboard focus; precision pointers reveal them on hover. The canvas and nested columns reserve a gutter for these controls. Block spacing belongs to the draggable wrapper so heading margins do not move text away from its controls. Ordered list numbering skips deeper list items and resumes at the parent depth. Duplication passes the target node entry to Plate and preserves normal undo history. Read-only blocks expose no mutation controls.

`components/block-draggable.test.tsx` verifies menu activation, target duplication with undo, and read-only behavior using a real Plate editor. Browser layout checks remain necessary for clipping, nested blocks, drag/drop, and touch interactions.

The editor and canvas isolate their stacking contexts. Block controls and drop indicators stay below the opaque sticky toolbar; portalled shadcn menus and dialogs keep their own default stacking. Table cells use opaque theme surfaces, with selection tint contained inside each cell.

## Site tools

On browsers implementing `document.modelContext.registerTool`, opening the CMS article form registers page-scoped WebMCP tools. Ordinary browsers retain the existing editing interface. No model API key, AI SDK, proxy, or additional inference service is installed.

- `editor_list_widgets`: examples of supported document nodes, including lists, tables, callouts, columns, code, drawings, equations, media and embeds. Emoji are text; inline widgets belong inside text blocks.
- `editor_read_blocks`: a bounded range of top-level blocks, document revision, and selection. Defaults to ten blocks; maximum fifty per request.
- `editor_list_media`: a bounded page of the media library already loaded for this form. This does not upload or generate assets.
- `editor_edit_blocks`: insert, replace or delete a top-level range using the last read revision. Recursive node validation rejects unknown properties, unsafe links, malformed containers and unavailable media references. Plate applies changes with normal history and change callbacks. Changes are unsaved.
- `article_read_fields`: current editorial fields, categories and save state.
- `article_update_fields`: change title, excerpt, SEO title/description and category. A category change requiring tag removal stays a manual operation.
- `article_save_draft`: save through the existing CMS workflow, including server permissions, validation, revisions and version conflicts. Only drafts expose this tool; publication and status transitions remain in the normal interface.

Read-only editors do not expose mutation tools. Registration uses an AbortSignal to release tools when the owning view unmounts. Unsupported or rejected registration does not interrupt manual editing. Registration failures disable that group of tools.

The experimental browser API follows the [WebMCP draft](https://webmachinelearning.github.io/webmcp/). This is not a remote MCP endpoint. A client supporting ordinary MCP is not necessarily able to discover these tools.

## Manual verification

Use a browser agent that explicitly supports WebMCP. For example, the [ChatGPT desktop built-in browser's Site tools](https://learn.chatgpt.com/docs/webmcp) require a supported model/account and site permission. Chrome development testing requires a compatible version with WebMCP enabled and agent tooling that can invoke it.

1. Open the deployed HTTPS CMS (or a secure local development context), sign in, and open a draft.
2. Inspect available site tools. Ask the agent to read fields and widgets, then read the first few blocks.
3. Ask it to insert a callout or table using the returned revision. Verify the change and the unsaved indicator; Undo should restore the previous document.
4. Read again, edit manually, then attempt an edit using the previous revision. Expect a conflict and no replacement.
5. Set a valid title and category and save through `article_save_draft`. Check `saved:true`, reload and verify persistence. Validation/conflict failures must return `saved:false`.
6. Navigate away and verify tools disappear. Open a read-only article and verify mutation tools are absent.

Suggested prompt: “Read the available widgets and article fields. Write an Italian draft using headings, a callout and a table. Use existing library assets only. Save the draft and report the save result.”

The integration tests use a mock WebMCP registry with a real Plate editor. They do not establish availability in a particular user's browser or subscription. Live client discovery and authenticated persistence require the manual verification above.
