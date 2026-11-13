# CMS workspace

CMS owns editorial administration, article forms, taxonomies, organizations, media, revisions, and publication. The private shell belongs to `dashboard`; Plate and block interactions belong to `editor`.

## Page composition

Use installed shadcn components directly without changing their styles or introducing primitive wrappers. Page layout containers may arrange them. Keep list and creation workflows in separate Tabs on categories, tags, organizations, and media. Successful creation returns to the list. Category editing uses a Dialog with labelled fields rather than inputs spread across a wide table row. Search remains available independently of creation.

The overview links editorial counts to the filtered article archive. The archive keeps its filters in route search parameters. Local taxonomy and library searches filter already loaded records.

## Article workspace

`components/article-form/article-form.tsx` composes the view; `use-article-form.ts` owns state and persistence orchestration. Model conversion, types, and revision comparison remain separate.

Title and excerpt precede the writing canvas. On desktop a Resizable split gives writing most of the initial space. Properties are grouped into Article, Visibility, and Revisions tabs. Smaller screens expose Writing and Properties tabs with mounted panels so changing tabs preserves the editor and its history. Primary save and publication actions remain in the header; secondary lifecycle actions use a DropdownMenu and retain existing permission checks and confirmations.

WebMCP reads the same controlled state and saves through the existing form operation. Presentation changes must preserve draft-only persistence, conflict checks, unsaved navigation blocking, and server authorization.

## Verification

Run `bun run check` and relevant CMS/editor tests. For broad changes, run `bun run ci`. Browser checks should include archive filters, creation and editing, mobile navigation, draft save/reload, unsaved navigation, read-only access, revisions, and editor controls. Use an isolated local database for operations that write data; never use production content as a test fixture.
