# Desktop PageSpeed validation

Reference report: https://pagespeed.web.dev/analysis/https-prisco-me/yjmum4qbi9?hl=it&form_factor=desktop

The original desktop report has the same main issues as mobile. Desktop identifies the star background as LCP, while mobile identifies the Moon; both now have high priority.

## Coverage

| Finding                     | Status                                                                                                                |
| --------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| React hydration error       | Fixed copyright calculation during Worker initialization.                                                             |
| Blocking CSS                | Initial CSS inlined into HTML by TanStack Start.                                                                      |
| Legacy JavaScript           | Local Web Vitals and unnecessary Array fallbacks excluded for Vite's baseline.                                        |
| Unused JavaScript           | PostHog slim and compact route validation; runtime portions not executed during the audit remain.                     |
| Oversized images            | Responsive lossless variants; added intermediate 1920 px landscapes, 512 px clouds, and 64/128 px stars.              |
| Images without dimensions   | Explicit dimensions for stars, clouds, mountains, and dunes.                                                          |
| Reflow and main thread      | Reduced repeated measurements and deferred constellation drawing; necessary layout and component measurements remain. |
| Accessible logo name        | Includes the visible name.                                                                                            |
| llms.txt                    | Markdown links.                                                                                                       |
| Media cache                 | Depends on the public Cloudflare domain. Animated article cover remains excluded as requested.                        |
| PostHog configuration cache | Service-controlled TTL retained for dynamic configuration.                                                            |

Total page weight and image warnings are not considered fully resolved: illustrations remain lossless and the public report includes the excluded animated cover. No effects were removed and no browser-specific illustrations were introduced.

## Validation

The latest local desktop Lighthouse run at the time of this report scored 99/100 for performance. Accessibility, best practices, SEO, console, blocking CSS, legacy JavaScript, LCP discovery, and image dimension audits pass. Warnings remain for some lossless images, unused JavaScript, and reflow.

Desktop Lighthouse on the local production build; checked responsive files, intrinsic dimensions, and loading of every desert layer. Also ran `bun run check`, the Vitest suite, and the build.

Local testing does not replace public PageSpeed: database, network, and CDN differ. Rerun desktop measurement on the published site after deployment. See [mobile validation](./pagespeed-mobile.md) for common details and SDK integration limitations.

## Further decoration and layout optimization

The 13 static instances consisting only of a raster image inside SVG are now HTML images with `srcSet`, intrinsic dimensions, and lazy loading. Containers, positions, and CSS transforms remain identical; `object-fit: contain` preserves fossil proportions. SVG sources remain in the repository. The geode retains SVG geometry and four animated reflections.

Added lossless resolutions closer to actual display sizes, including fossils, roots, cavities, and planets. Desert layers retain explicit dimensions.

During scrolling, viewport height and scroll range come from a geometry cache refreshed on layout changes. Observer measurements come from their notifications, and indicator positions are written after all scene measurements. Fonts that have already loaded do not trigger another layout.

Verified Firefox and Chromium on mobile and desktop, resizing, dune loading, and image activation on reaching the section. A local comparison of native images and equivalent SVG containers confirms visual preservation.

Warnings about lossless image compression and React/PostHog runtime portions unused during Lighthouse may remain. Features were not removed to eliminate them. Wrangler's Cloudflare authentication had expired and could not be renewed in the noninteractive session, so remote caching was not changed.
