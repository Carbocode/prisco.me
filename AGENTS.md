# Mandatory architecture and organization

These rules apply throughout the repository and to every new implementation or refactoring. Before changing code, read [docs/architecture.md](docs/architecture.md) and any README for the affected feature. For the home page, also read [src/features/home/README.md](src/features/home/README.md).

## Language

- Write technical documentation, agent instructions, architecture notes, setup guides, audit reports, and AI discovery resources in English. This includes README files, `AGENTS.md`, `docs/`, `llms.txt`, ARD descriptions and representative queries, and future machine-readable API documentation.
- Keep public editorial content and interface copy in their intended language. SEO/GEO metadata and structured data that describe an Italian page must accurately reflect that page; preserve its Italian titles, descriptions, and `inLanguage`/locale values. Do not relabel Italian content as English merely because its metadata is machine-readable.
- Preserve protocol keys, identifiers, URLs, commands, code examples, and historical technical references when translating documentation.

## Code placement

- Organize application code by feature in `src/features/<feature>`. Extend the existing owning feature before creating a new one.
- Put pages in `pages/`, feature-specific components in `components/`, models and pure functions in `domain/`, server operations in `server/`, browser integrations in `client/`, and feature styles in `styles/` where these divisions are useful. Do not create empty directories or layers without a concrete responsibility.
- Existing features and their responsibilities are listed in `docs/architecture.md`. In particular, `cms` owns editorial writing and administration, `content` owns the document model and public reading, and `editor` owns the Plate interface. `auth` owns access and permissions; `account` owns user settings; `dashboard` owns the private area shell and navigation.
- `src/components` contains only shared components, organized under `ui`, `layout`, `artwork`, `media`, and `data-table`. Components used by a single feature stay in that feature.
- `src/lib` and `src/hooks` contain only cross-feature utilities and hooks. Do not move domain logic there for convenience or recreate generic containers such as `src/server`, `src/services`, or a flat set of application components under `src/components`.
- Site identity, URLs, and common settings belong in `src/config/site.ts`. Database schema and infrastructure belong in `src/db`; application queries belong in the owning feature's server modules.

## Routes and module boundaries

- Keep `src/routes` focused on TanStack Start configuration: loaders, params and search validation, authorization, endpoints, redirects, and metadata. Extract substantial views into `features/<feature>/pages`; small composition adapters may remain in routes.
- Extracted pages must use `getRouteApi` when reading route data. Do not import the `Route` module from the page that the route itself imports.
- Keep the HTML document and global providers in `src/app`. Preserve framework entrypoints in their configured locations. Do not manually edit `src/routeTree.gen.ts`.
- `domain` modules must remain independent of React, routes, components, hooks, and server runtimes. Use type-only imports for dependencies needed exclusively as types.
- Client modules may call server functions through `*.functions.ts`. They must not directly import repositories, D1 connections, R2 access, secrets, or server authentication configuration, including through re-exports.
- Server functions must retain server-side validation and access checks; hiding an interface control is not authorization.
- The public content renderer must not depend on the Plate editor. The canonical document model and shared embeds belong to `content`; the editor reuses them.
- Cross-feature dependencies must point to the module that owns the shared capability or model. Do not import another feature's page to reuse its logic or duplicate canonical types or validation.
- Do not introduce circular dependencies. Do not add re-export files that obscure boundaries or mix client and server modules.

## Separation of responsibilities

- Separate view composition, state management, pure transformations, and persistence when they have distinct responsibilities. Do not merge previously separated modules back into one file.
- For the article form, preserve the separation between the view, `use-article-form.ts`, model, types, and revision comparison. For the editor, keep plugins, nodes, dialogs, toolbar, and static data separate. For the questionnaire, keep the flow model separate from its view.
- In `cms/server/articles`, keep queries, mutations, publication, revisions, hydration, and snapshots separate. Do not recreate a monolithic article service.
- For home and career, keep pages, components or sections, artwork, animations, and pure calculations separate. Release listeners, observers, and animation frames on unmount.
- Split by responsibility, without arbitrary line-count thresholds or speculative abstractions. Composition components must not become wrappers around shadcn primitives: the specific rules below apply.

## Styles, rendering, and maintenance

- Keep `src/styles.css` as the global entrypoint and preserve its import cascade order. Keep feature styles inside their features; for home, preserve the `home.css` entrypoint and scene-based division.
- For public dates and grouping by day or year, reuse `src/lib/dates.ts` and the time zone in `src/config/site.ts`. Do not use the browser's implicit time zone for markup also rendered on the server.
- Do not compute current dates used in rendering during Worker module initialization. Keep the first server and client render consistent.
- Before moving a module, find all consumers and update static imports, dynamic imports, mocks, tests, and documentation. Do not change public URLs or the database schema as a consequence of simply moving files.
- Keep tests beside the module they verify. For code changes, run `bun run check` and relevant tests; for cross-cutting refactors, run `bun run ci` and verify the affected browser flows. Use an isolated local database for checks that write data.
- When responsibilities, boundaries, or directory structure change, update `docs/architecture.md` and affected README files in the same change. Also update these instructions when a mandatory convention changes. Do not remove or weaken a rule merely to fit the implementation just written.
- Before finishing, check that every new file has a clear owner, no cycles or server imports into clients were introduced, and report the checks performed and any actual limitations.

# Interface rules

## Static SVG artwork and WebP caches

- For complex static artwork or artwork with filters, prefer a prerendered lossless WebP that looks the same in all browsers. Always retain the original SVG as an editable source.
- CSS transformations and animations of the whole image (parallax, rotation, opacity) are compatible with prerendering. Keep SVG for internal geometry animations, interactive elements, icons, and logos that benefit from vectors.
- `scripts/static-artwork.json` lists sources, resolutions, and hashes of generated WebPs. Add eligible new artwork to the manifest and use its corresponding `.webp` in components and CSS backgrounds.
- When changing an SVG listed in the manifest, regenerate its WebP autonomously with `bun run assets:render`, without waiting for a user request. The command updates only missing or changed assets and does not require a site server.
- If the rendering browser is missing, install it with `bunx playwright install firefox`, then rerun the command.
- Run `bun run assets:check` before finishing: it verifies source, settings, and output hashes. This check is included in `bun run check` and CI.
- Do not remove effects to fix performance issues or introduce different artwork for Firefox. After artwork changes, verify transparency, resolution, and preservation of effects.

## Functional sections

All functional application sections must use the shadcn components available in the project. This includes forms, selectors, lists, and tables.

In these sections:

- Use the appropriate shadcn components directly.
- Do not enclose shadcn components in custom wrappers.
- Do not override, extend, or customize shadcn component styles.
- Do not recreate an element already available in shadcn using HTML or custom components.

Only landing page, hero, and showcase sections are exempt and may use custom visual composition.

## CMS management tables

- Keep the dashboard main within the available width. Contain horizontal overflow inside individual tables, editors, or other components.
- Use dedicated sibling routes for CMS creation and uploads; do not put creation forms in list-page tabs or run list loaders for creation pages.
- Perform management-list search, filters, row sorting, and pagination in validated server queries with bounded page sizes. Keep column sizing, visibility, order, and pinning in browser state.
- Place table filter menus on the left and search with refresh on the right. Keep column controls in the table footer and creation actions outside the table toolbar. Use a central segmented primary filter only when it adds value, such as article status. Avoid redundant headings, subtitles, and introductory cards.
- Pinned columns must use computed offsets and opaque surfaces; contain editor stacking below portalled shadcn menus and dialogs.

# TanStack Start rules

## GEO and structured data

For Generative Engine Optimization (GEO), follow the official TanStack Start guide:
https://tanstack.com/start/latest/docs/framework/react/guide/geo

- Insert JSON-LD through the route's `head()`, using the `scripts` property.
- Use `children: JSON.stringify(...)` in `scripts` objects.
- Do not place `<script type="application/ld+json">` tags directly in React components or the document shell.
- Do not use `dangerouslySetInnerHTML` for JSON-LD.
- When JSON-LD depends on dynamic data, load it in the route's `loader` and read it from `loaderData` inside `head()`.
- Use `schema.org` vocabulary consistent with the content: `WebSite` and `Person` in the root, `Article` for articles, `CreativeWork` for projects, `ContactPage` for contact pages, and `FAQPage` for FAQs.
- Also maintain traditional meta tags, canonical URLs, and Open Graph in `head()`.
- Structure content with clear statements, a correct heading hierarchy, and author attribution where useful.
- Consider machine-readable endpoints or `llms.txt` only when they add genuinely maintainable information.

For `llms.txt`, follow the dedicated section:
https://tanstack.com/start/latest/docs/framework/react/guide/geo#llms-txt

- Create the route as `src/routes/llms[.]txt.ts`.
- Expose the public path `/llms.txt`.
- Use a server route with `server.handlers.GET`.
- Return `new Response(content, { headers: { "Content-Type": "text/plain" } })`.
- Keep content brief, factual, and maintainable: site description, main pages, key facts, and contact details.
- Do not include secrets, non-public personal data, fragile promotional content, or information requiring frequent manual updates.

For `ContactPage`, also follow:
https://www.karpi.studio/schema-glossary-types/contact-page

- Include at least `name`, `description`, `url`, `mainEntity`, `isPartOf`, and `inLanguage`.
- Connect `mainEntity` to the site's main entity (`Person` for this personal project; use `Organization` only if the context changes).
- Connect `isPartOf` to the root `WebSite`.
- Prefer stable `@id` references such as `https://prisco.me/#person` and `https://prisco.me/#website`.
