# CMS workspace

CMS owns editorial administration, article forms, taxonomies, organizations, media, revisions, and publication. The private shell belongs to `dashboard`; Plate and block interactions belong to `editor`.

## Management lists

Article, category, tag, organization, and media routes store pagination, search, filters, and row sorting in validated route search parameters. Server functions retain permission checks. Queries apply allowlisted ordering and a stable ID tie-breaker before LIMIT/OFFSET. Responses contain one page and an aggregate count; an invalidated page is clamped after filters or deletion. Page sizes are 10, 20, or 50.

Article lists project summary fields instead of full documents or SEO data. Category dropdowns share lightweight ID/name options; they do not fetch all article or tag records. Category image pickers query the media library only when opened. The media library uses the same preview-card grid as the media selector, with server pagination, filtering and sorting. Cards show a large preview, a truncated display name with its full value in the native tooltip, and one action menu. Technical metadata stays in the preview dialog; editing uses a separate dialog so card heights do not change when fields are opened. Selection remains a direct action in pickers. It does not scan all document/revision associations; destructive actions fetch and verify current usage separately. Trash uses the same paginated lists with delete-permission checks, rather than loading an unbounded trash panel on the overview.

`components/data-table/dashboard-data-table.tsx` owns TanStack Table v9 composition. Column sizing, visibility, logical start/end pinning, and column ordering stay in browser state. Row sorting is controlled by the route and performed on the server. Resize commits on release to avoid rebuilding the table for every pointer movement. Reordering pinned columns updates their pinned region. Pinned cells have opaque decorative surfaces and computed offsets; menus retain shadcn portal stacking.

Table filter menus sit left, search and an explicit refresh button sit right, and only the article status uses a central segmented filter. Column preferences live in the table footer. Creation links sit outside the table toolbar. Refresh awaits route revalidation and preserves filters, pagination and column layout. Search debounces requests by 300 ms and synchronizes URL navigation. The main area never scrolls horizontally: the standard shadcn table container handles wide tables. Use installed shadcn components directly; do not add introductory cards or redundant subtitles.

## Creation and editing

Creation and upload use `/dashboard/cms/{categories,tags,organizations,media}/new`; article creation retains its existing URL. New routes are sibling routes so list loaders and their datasets do not run when creating a record. Successful creation invalidates relevant data and returns to the list. The media encoder is imported only during upload.

Category, tag, and organization action dialogs live beside their feature models under `components`. They do not render table rows, so column visibility, ordering, and pinning apply uniformly. Category image selection uses the paginated remote media browser.

## Article workspace

`components/article-form/article-form.tsx` composes the view; `use-article-form.ts` owns state and persistence orchestration. Model conversion, types, and revision comparison remain separate.

Title and excerpt align with the writing canvas. Desktop uses one scrollable writing area with a sticky formatting toolbar; the Properties button toggles a fixed-width inspector without remounting the editor. Smaller screens expose properties in a shadcn Sheet. Primary save and publication actions remain in the header; secondary lifecycle actions retain permission checks and confirmations.

WebMCP reads the same controlled state and saves through the existing form operation. Presentation changes must preserve draft-only persistence, conflict checks, unsaved navigation blocking, and server authorization.

The article writing form still uses its existing complete editorial option datasets. Management list pagination does not change that separate workflow.

## Verification

Run `bun run check`, table interaction tests, SQL query tests, and debounced search tests. For broad changes run `bun run ci`. Browser checks should include desktop sidebar close/reopen, media previews, all lists and creation routes, sorting across multiple pages, filters, visibility/reorder/pinning/resize, and containment of overflow. Use an isolated local database for write checks; never use production content as a fixture.
