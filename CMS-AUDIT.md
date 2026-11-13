# Post-audit fixes

Implemented in this workspace on November 12, 2026. The original audit below is retained as a snapshot predating the changes; its file paths and line references are historical.

- Organizations: writes support the required legacy column; tested Drizzle queries against the original SQL schema. Added description, website, and archiving controls.
- Concurrency: migration `0033_cms_integrity.sql` checks the version before inserting a snapshot and protects the entire transaction. Updates, revisions, associations, and audit records roll back together. Saving returns the row actually updated without adopting a subsequent concurrent save's version. State transitions also retain snapshots and audit records in the same batch.
- Authors: may edit only their own drafts; interface matches permissions.
- Media: removed destructive rewriting of content and revisions. Assets referenced even only in history cannot be trashed. Unused assets are hidden without deleting R2 objects and can be restored. Triggers prevent stale forms from reattaching trashed media. No automatic physical deletion: retention is indefinite.
- Redirects: applied by public routes and updated on category changes; chains are shortened during mutations, including returns to previous slugs. Category slugs associated with articles are protected: reassign articles before changing or archiving the category.
- History: new revisions include categories, ordered tags, and experience associations, with visual comparison before restoration. Older revisions lacking this information retain current associations: data never stored cannot be reconstructed retroactively.
- Scheduling: portfolio and archives share visibility for scheduled articles whose publication date has passed; dashboard and filters show effective status. Dates persist on save and editors can update them after publication.
- Forms: protection for internal navigation and browser exit, tracking changes made during requests, and locking editor and controls during saves. Draft autosave was not introduced; saving remains explicit.
- Partial updates: removed defaults that cleared tags/experiences or reset category configuration when fields were omitted; two dedicated tests.
- Relations: server validation of active categories, tags, media, and organizations; database write constraints; protection against moving tags already in use.
- Link previews: new previews use remote images without creating unmanaged R2 copies. Existing orphaned copies were not removed.
- Administrative fields: added project role/period, canonical URL, experience links, and tag marquee row.
- Taxonomies: trash and restore in the CMS dashboard; archived names and slugs remain reserved and are recoverable by restoring the item.
- Loading: database-wide aggregate counters, SQL media usage aggregation, and full documents loaded only for individual public articles. Archives and pickers still paginate metadata lists on the client; very large volumes would benefit from server-side pagination too.

Migration verified on isolated local D1 and applied to the project's local D1. No production migration or deployment. Before deploying code, also apply `0033_cms_integrity.sql` in production through the normal migration workflow.

Validation at the time: 97 tests passed, including eight SQLite regression tests covering transactions, media, relations, counts, and organization compatibility, plus existing tests. Typecheck, lint, build, asset validation, and Drizzle check passed. No browser end-to-end tests. Global formatting remained blocked by three pre-existing `design-proposals` HTML files, unchanged by that work.

---

# CMS functional audit — November 12, 2026

Review of CMS interfaces, validation, authorization, services, repositories, schema, and public page/portfolio integration. No application or data changes during the original audit. Findings derive from reading flows; local reproductions are identified where performed. No remote database or D1/R2 end-to-end verification.

## High priority

1. **Organization creation blocked by migrations.** `drizzle/0018_migrate_portfolio_to_cms.sql:10`, `drizzle/0019_rename_organization_type.sql:4`, `src/features/cms/server/organization.functions.ts:28`. The old `type` column remains NOT NULL without a default; Drizzle writes only `organization_type`. Reproduced in in-memory SQLite using table creation and migration 0019: the application's INSERT fails with `NOT NULL constraint failed: cms_organizations.type`. Align physical schema and writes while preserving associations.

2. **Concurrent saves can change categories/tags even when they lose the version check.** `src/features/cms/server/article.service.ts:169`. The batch protects only the article UPDATE with `version`; association DELETE/INSERT, revision, redirect, and audit writes still run if that UPDATE changes zero rows. The final check compares against the initial version: a concurrent change can make it pass even when this UPDATE failed. Revision-number collisions may stop some interleavings but do not ensure safety, for example against publication or media deletion. The entire mutation needs an atomic constraint and verification of the actual UPDATE result.

3. **Authors can directly edit published articles.** `src/lib/cms-permissions.ts:51`, `src/features/cms/server/article.service.ts:121`, `src/features/cms/domain/workflow.ts:10`. Authors cannot publish, but can update their own articles regardless of status. Public content uses the same row and changes immediately. If publication permission is intended to enforce editorial review, it can currently be bypassed after first publication. Disallow these edits or separate draft and published versions.

4. **Automatic redirects stored but never applied.** `src/features/cms/server/public.functions.ts:22`, `src/routes/$archiveSlug/$.tsx:40`, `src/features/cms/server/article.service.ts:207`. `getCmsRedirectFn` has no callers and no other redirect readers were found in public code. Changing a slug stores a record but the old URL falls through to content lookup and returns 404, despite the interface promising continued access. Category-only changes and category slug changes also do not produce redirects. Integrate resolution into routes and cover all path changes.

5. **Media deletion remains destructive to history.** `src/features/cms/server/media.functions.ts:126`, `:149`, `:200`. Removes nodes from documents and revisions without first creating a revision, then immediately deletes R2. If a later check finds a conflict, it restores only the media record without undoing successful dissociations. An error shown to the user can therefore still leave content changed. Define an explicit recovery policy and prevent partial content changes on conflict.

6. **The final check before R2 deletion does not close the concurrency gap.** `src/features/cms/server/media.functions.ts:177`, `src/features/cms/server/article.service.ts:69`, `:123`. A save can reintroduce the ID between the check and deletion: article writes do not verify active media, and a foreign key accepts soft-deleted media. Revision restoration can also reintroduce it. Category hero cleanup updates by ID alone and can clear a selection made in the meantime. Coordinate write checks and condition updates on the association actually read.

7. **Archiving a category can make published articles unreachable.** `src/features/cms/server/category.functions.ts:57`, `src/features/cms/server/article.service.ts:514`. No check of associated articles or reassignment. Public categories exclude archived ones, while article hydration still returns them. Links/canonical URLs point to a category that no longer resolves. Block archiving when in use or require a replacement and update paths.

## Incomplete or inconsistent functionality

8. **Incomplete revisions.** `src/features/cms/server/article.service.ts:174`, `:395`. Snapshots save only the article row; categories, tags, and tag order are outside history. Restoring title, slug, and content therefore retains current associations. Revision preview/diff is also missing: the interface exposes only restore. Restoration can also add revision and audit records before noticing an UPDATE conflict.

9. **Scheduled publication inconsistent with portfolio.** `src/features/cms/server/cms.repository.ts:139`, `src/server/portfolio.ts:74`, `:90`, `:111`. Archives consider `scheduled` articles public after their date; portfolio requires `published`. No automatic state transition was found. Scheduled projects appear in archives when due but not home/portfolio or experience associations. Dashboard still labels them scheduled.

10. **Publication date editable in the interface but not persisted by Save.** `src/features/cms/components/article-form.tsx:235`, `:594`. `publishedAt` is sent only by Publish, hidden for published or scheduled articles. Editing an existing article's date and saving reports success without changing the date. Rescheduling requires withdrawal and republication, temporarily taking content offline. Clearly separate operations or allow saving dates with appropriate authorization.

11. **Unsaved-change protection only on browser close/reload.** `src/features/cms/components/article-form.tsx:184`, `:262`. No internal navigation blocker: router links can abandon unsaved changes. Fields remain editable during saves and success always clears `dirty`, even if more changes were made meanwhile. Local recovery/autosave is missing. At least distinguish the submitted form version from current state and protect internal navigation.

12. **Permissions applied on the server but not to interface actions.** `src/features/cms/components/article-form.tsx:377`, `src/routes/dashboard/cms/categories.tsx:321`, `src/lib/cms-permissions.ts:51`. Authors see publication, archive, restore, taxonomy, and media actions that the server rejects. This is not a server bypass: functionality is presented as available but ends in errors. Derive visibility/enabled state from effective permissions.

13. **Only syntactic relation validation.** `src/features/cms/domain/validation.ts:40`, `src/features/cms/server/article.service.ts:69`, `src/features/cms/server/tag.functions.ts:44`. Valid UUIDs and foreign keys do not guarantee active categories, tags, organizations, or media, or that tags belong to the selected category. The form enforces this but the server does not. Moving a tag to another category also leaves existing associations unchanged. Add domain validation to mutations.

14. **Link preview images outside the media library.** `src/features/cms/server/embed.functions.ts:77`. Open Graph images are copied to R2 without `cms_media` records. They do not appear in the library, have no usage counts, and are not recovered by media deletion. Repeated previews can create orphan copies even without saving an article. Register these assets and manage their lifecycle or use a separate expiring cache.

15. **Public fields without complete CMS controls.** `src/db/cms-schema.ts:107`, `:203`, `src/features/cms/domain/validation.ts:44`, `src/features/cms/components/article-form.tsx:112`. Project role and period are supported by schema, API, and public pages but missing from the form. Home uses `marqueeRow`, absent from tag management. `canonicalUrl` is read and restored but not editable in the normal workflow. Project-experience associations are read by portfolio without controls in the reviewed CMS routes. Complete these features if they must be administrable.

16. **Taxonomy archiving without restoration.** `src/features/cms/server/category.functions.ts:57`, `src/features/cms/server/tag.functions.ts:65`, `src/features/cms/server/organization.functions.ts:49`. Rows are hidden by soft deletion, but there is no trash list or restore operation. Unique constraints keep names/slugs reserved: recreating archived items with identical values fails. A specific response for this case is also missing.

17. **R2 error hidden by the interface.** `src/routes/dashboard/cms/media.tsx:292`. The server returns `storageDeleted: false` after two failures, but the caller ignores the result and shows success. The file remains accessible; the only persistent trace is the audit, without a dedicated CMS page or retry queue. Expose the real outcome and provide verifiable recovery.

18. **Truncated dashboard statistics and unscalable loading.** `src/routes/dashboard/cms/index.tsx:28`, `src/features/cms/server/media.functions.ts:29`, `src/features/cms/server/article.service.ts:482`, `src/routes/$archiveSlug/$.tsx:41`. Counters use at most the first 100 articles, ignoring `total`. The library rereads all content to count usage; public routes load entire archives, including documents, before filtering. Media deletion scans and potentially updates all revisions in one batch. Add database pagination/filtering, aggregate counts, and a large-volume strategy.

## Validation and limitations

- `bun run test`: 24 files, 87 passing tests. No dedicated CMS server, concurrency, D1/R2 mutation, or full editorial workflow tests were found.
- `bun run typecheck`, `bun run lint`, `bun run db:check`: passed. Drizzle checks do not execute migrations and do not detect the legacy organization column issue.
- `bun run assets:check`: passed.
- `bun run check`: failed formatting for three pre-existing files: `design-proposals/landing-antigravity38.html`, `landing-gpt61.html`, and `landing-opus55.html`. Lint and typecheck therefore ran separately.
- Organization reproduction used only in-memory SQLite without changing the development database.
- No browser, build, end-to-end tests, or remote database access. Concurrency findings derive from query order and conditions, not a load test.

Suggested order: mutation/media safety; organization creation; published content permissions; redirects/categories; complete revisions; scheduling and form persistence; remaining administrative features.
