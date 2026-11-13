# Mobile PageSpeed validation

## Animations and main thread — November 13, 2026

Star entrance and continuous twinkling now animate separate elements. Parallax variables are updated only on graphic layers, avoiding style invalidation throughout the hero subtree. The green pulse animates a pseudo-element with `transform` and `opacity`; the side indicator uses `scaleX` instead of changing its width.

Lighthouse mobile on the local production build: main thread 2.8 s, TBT 140 ms. This is neither a measurement of the published site nor a controlled comparison with the previous public PageSpeed run. The animation audit reports only two fossil images with `filter` transitions: entrance blur and lighting are preserved. No competing animations on the same element were reported in this capture.

Also verified Firefox and Chromium at 390 and 1440 px, parallax, entrance and twinkling, dunes, and reduced motion. CI passes with 108 tests. The ARD manifest passed the official CLI with `ArdManifest` and `ArdEntry` schema validation, without errors or warnings. Changes require deployment before another PageSpeed measurement on the public domain.

Reference report: https://pagespeed.web.dev/analysis/https-prisco-me/yjmum4qbi9?hl=it&form_factor=mobile

The animated article cover is excluded from changes as requested.

## Changes

| Finding                         | Change and status                                                                                                                                                                                                                                                                                                     |
| ------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| React console error             | Fixed copyright calculation during Worker initialization: the server rendered 1970 while the client rendered the current year. Verified production hydration.                                                                                                                                                         |
| LCP discovery and priority      | High priority for Moon and star images. Responsive planet variants.                                                                                                                                                                                                                                                   |
| Oversized images                | Lossless WebP variants for planets, landscapes, and decorations, registered in the manifest. SVG sources, transparency, and effects preserved.                                                                                                                                                                        |
| Images without dimensions       | Explicit star and cloud dimensions. Local audit passes.                                                                                                                                                                                                                                                               |
| Blocking CSS and critical chain | Initial CSS is managed and inlined into HTML by TanStack Start; removed the manual `?url` stylesheet link. No blocking CSS requests in the local audit.                                                                                                                                                               |
| Unused JavaScript               | PostHog slim with only required extensions: events, navigation, metrics, errors, and recording after consent. Contact events share the singleton. Zod Mini for route search; full contact schema imported only by server validation or the contact module. Warning reduced but remains in React and PostHog runtimes. |
| Legacy JavaScript               | Web Vitals compiled locally from the SDK-distributed source while retaining diagnostic attribution. Excluded Array.at/findLast fallbacks already covered by Vite's browser baseline. Local audit passes.                                                                                                              |
| Main thread                     | Diagnostics load after `load` when the browser is idle. Constellations render only when visible, with the correct height reserved immediately.                                                                                                                                                                        |
| Forced reflows                  | Batched recalculations, grouped viewport measurements, and avoided repeated CSS writes. Necessary scene and framework layout reads remain; warning not fully eliminated.                                                                                                                                              |
| Media cache                     | Report identifies two files on `media.prisco.me` with a four-hour TTL. Local `/media/$` already has annual caching but does not control the public R2 domain's headers. A Cloudflare domain rule is needed; remote configuration was not changed.                                                                     |
| PostHog configuration cache     | Approximately 1 KiB with a five-minute TTL controlled by PostHog. Annual caching is not forced on dynamic configuration. Web Vitals is served among hashed local assets.                                                                                                                                              |
| Accessible logo name            | Includes the visible text “Vincenzo Prisco”.                                                                                                                                                                                                                                                                          |
| llms.txt links                  | Converted to Markdown links.                                                                                                                                                                                                                                                                                          |

LCP, Speed Index, TTI, and total payload depend on these changes and measurement conditions; no specific post-deployment score is guaranteed. The report suggests no additional `preconnect` origins.

## Validation

- `bun run check`, including asset hashes, formatting, lint, and types.
- Vitest suite and production build.
- Local production browser checks: mobile/desktop hydration, responsive image selection, font loading, consent, constellation chart, and navigation.
- Local production Lighthouse mobile before and after this pass. This is not a new measurement of the published site: local networking, database content, and machine load differ from public PageSpeed. Each build was measured once; timings are indicative.

The build uses TanStack Start's inline CSS option. Web Vitals uses a source entrypoint distributed with PostHog: after SDK upgrades, recheck attribution, consent, and extension loading.

After deployment, rerun PageSpeed on the public URL to confirm results with production content and CDN behavior.

## Further decoration and layout optimization

The 13 static instances consisting only of a raster image inside SVG are now HTML images with `srcSet`, intrinsic dimensions, and lazy loading. Containers, positions, and CSS transforms remain identical; `object-fit: contain` preserves fossil proportions. SVG sources remain in the repository. The geode retains SVG geometry and four animated reflections.

Added lossless resolutions closer to actual display sizes, including fossils, roots, cavities, and planets. Desert layers retain explicit dimensions.

During scrolling, viewport height and scroll range come from a geometry cache refreshed on layout changes. Observer measurements come from their notifications, and indicator positions are written after all scene measurements. Fonts that have already loaded do not trigger another layout.

Verified Firefox and Chromium on mobile and desktop, resizing, dune loading, and image activation on reaching the section. A local comparison of native images and equivalent SVG containers confirms visual preservation.

Warnings about lossless image compression and React/PostHog runtime portions unused during Lighthouse may remain. Features were not removed to eliminate them. Wrangler's Cloudflare authentication had expired and could not be renewed in the noninteractive session, so remote caching was not changed.
