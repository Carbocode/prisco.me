# Static home artwork

SVG files are the editable originals. Components and CSS use lossless WebP
renders for static illustrations, including images moved by CSS animations.
Interactive constellations and animated inline SVG geometry remain vector.

The rendering manifest is `scripts/static-artwork.json`. It records each source,
render width, source/settings hash, and output hash. Widths account for scaling
and high density displays. Original filters, shadows and transparency are baked
into the images by Firefox, then encoded as lossless WebP.

After changing an original SVG, run:

```sh
bun run assets:render
bun run assets:check
```

If Firefox is not installed for Playwright, run `bunx playwright install firefox`.
Rendering uses a blank browser page and requires no development server. Unchanged
assets are skipped. Add eligible new SVGs to the manifest with `source` (relative
to `public`) and `width`; rendering fills in the hashes. Commit the originals,
generated WebP files, and updated manifest together.

`assets:check` runs in the project check/CI pipeline and fails for changed sources,
changed render widths, missing outputs, or manually changed output files. Icons,
logos, and artwork whose internal geometry is animated should remain SVG.
See the root `AGENTS.md` for the mandatory maintenance rules.
