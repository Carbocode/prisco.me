# Home

`home-page.tsx` composes the page, attaches animations to the container, and manages the footer toggle. `home.types.ts` defines input data without server or CMS dependencies.

- `sections/`: the story's six sections. Each receives only the data it uses. Career excerpt preparation lives beside the relevant section.
- `artwork/`: illustrations and SVG definitions, separate from section content. Includes responsive fossil and desert images; SVG sources and WebPs remain in `public/home/`, with the manifest in `scripts/static-artwork.json`.
- `motion/`: `animate-home.js` coordinates geometry, scrolling, header, and indicators. Separate modules manage constellations and their data, the horizontal journey, manifesto words, and pointer effects. `animation-scope.js` owns listeners, observers, and frames and releases them on unmount. Pure journey position calculations and their test live in the same group.
- `styles/`: CSS divided by scene and shared responsibility. `home.css` is the single entrypoint and makes cascade order explicit.

Sections compose artwork; artwork must not import sections or the page. Animations use the markup's existing `data-*` attributes without depending on React components or CMS data.

`motion/hero-parallax.js` applies parallax variables only to `.depth` layers to avoid invalidating styles throughout the hero subtree during scrolling and pointer movement. Star entrance belongs to `.star-enter`, while twinkling belongs to the inner image: do not assign competing `transform` and `opacity` animations to the same element. Also keep parallax and CSS animation layers separate.

Page tests verify SSR rendering and story behavior. Visual tests recursively read CSS imports. Pure functions keep tests beside their implementation.
