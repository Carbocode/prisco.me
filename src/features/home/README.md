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

The Italian and English routes share the Home view. UI strings are compiled from the root `messages/` catalogs. Both languages display the published CMS entries and use archive and article URLs for the current interface language. Editorial entries keep their original text.

The server negotiates language on requests to `/`. It uses the language switch cookie before inspecting `Accept-Language`, and temporarily redirects to `/en` when English is preferred. Localized paths and links to other pages follow their URL.

The footer language link sends the explicit choice in the destination URL. The server honors it on that request and stores a language cookie for later Home visits.
