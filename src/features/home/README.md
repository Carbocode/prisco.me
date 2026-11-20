# Home

`home-page.tsx` composes the page, attaches animations to the container, and manages the footer toggle. `home.types.ts` defines input data without server or CMS dependencies.

- `sections/`: the story's six sections. Each receives only the data it uses. The horizontal Journey section composes five profile cards from the localized Home copy.
- `artwork/`: illustrations and SVG definitions, separate from section content. Includes responsive fossil and desert images; SVG sources and WebPs remain in `public/home/`, with the manifest in `scripts/static-artwork.json`.
- `motion/`: `animate-home.js` coordinates geometry, scrolling, header, and indicators. Separate modules manage constellations and their data (the compact chart uses a two–one–two arrangement), the horizontal journey, manifesto words, and pointer effects. `animation-scope.js` owns listeners, observers, and frames and releases them on unmount. Pure journey position calculations and their test live in the same group.
- `styles/`: CSS divided by scene and shared responsibility. `home.css` is the single entrypoint and makes cascade order explicit.

Sections compose artwork; artwork must not import sections or the page. Animations use the markup's existing `data-*` attributes without depending on React components or CMS data.

`motion/hero-parallax.js` applies parallax variables only to `.depth` layers to avoid invalidating styles throughout the hero subtree during scrolling and pointer movement. Star entrance belongs to `.star-enter`, while twinkling belongs to the inner image: do not assign competing `transform` and `opacity` animations to the same element. Also keep parallax and CSS animation layers separate.

Page tests verify SSR rendering and story behavior. Visual tests recursively read CSS imports. Pure functions keep tests beside their implementation.

The core scene rotates seven independently cached WebP layers with CSS transforms, rather than filtering an animated SVG group on every frame. Editable sources are `public/home/core-ring-*.svg`; their lossless renders are tracked in the static artwork manifest. Each square layer is centered on the original (600, 720) rotation pivot and includes transparent margins for the glow. Keep the halo and embers independent, and reserve compositor layers only while the section is near the viewport.

Core ring images load lazily with low fetch priority so they do not compete with the hero. Read viewport geometry before changing layout variables, and pass cached scroll positions to animation updates instead of measuring after style writes.

Viewport dimensions are scoped to the hero or Journey scene that consumes them, rather than inherited through the whole story. Keep this scope when adding animation variables, and remove them on disposal. Header height remains shared with the frame and scroll container.

Decorative loops outside the hero start paused in server-rendered HTML; the visibility observer resumes them near the viewport. Do not gate the initial pause on `.js`, which would run offscreen animations throughout hydration. The absolutely positioned, clipped core stage uses `content-visibility: auto` without changing document flow or clipping additional artwork.

Layout refreshes run in three frames: read the viewport and prepare scene styles, measure Journey and set its height, then measure downstream geometry and paint. Scroll updates use the last complete geometry and wait while a refresh is pending. Refresh requests coalesce, position compensation preserves input received between phases, and the animation scope cancels pending phases on unmount.

Hero entrance animations start with the stylesheet, without waiting for hydration to add `.js`; hydration must not hide and replay already painted hero content. Fossil reveals crossfade sharp and statically blurred image layers using opacity, instead of interpolating `filter`. Both layers reuse the same responsive asset. Reduced-motion and no-JavaScript views show only the sharp layer.

The Italian and English routes share the Home view. UI strings are compiled from the root `messages/` catalogs. Both languages display the published CMS entries and use archive and article URLs for the current interface language. Editorial entries keep their original text.

The server negotiates language on requests to `/`. It uses the language switch cookie before inspecting `Accept-Language`, and temporarily redirects to `/en` when English is preferred. Localized paths and links to other pages follow their URL.

The footer language link sends the explicit choice in the destination URL. The server honors it on that request and stores a language cookie for later Home visits.

Home reads only the public card fields for the entries selected in the CMS. Projects and writings each render up to two cards in selection order and are omitted independently when empty. Publication and category eligibility are checked again on every Home load.
