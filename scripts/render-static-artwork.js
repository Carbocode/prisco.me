import { createHash } from "node:crypto";
import { readFile, writeFile } from "node:fs/promises";

const manifestPath = new URL("./static-artwork.json", import.meta.url);
const publicRoot = new URL("../public/", import.meta.url);
const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const digest = (value) => createHash("sha256").update(value).digest("hex");
const pending = [];
let variantsChanged = false;

for (const asset of manifest) {
  const svg = await readFile(new URL(asset.source, publicRoot), "utf8");
  if (/<(?:animate\w*|set|script)\b|@keyframes/i.test(svg))
    throw new Error(`${asset.source}: animated SVGs must remain vector artwork`);
  const sourceHash = digest(`firefox-canvas-v1:${asset.width}:${svg}`);
  let outputHash;
  try {
    outputHash = digest(
      await readFile(new URL(asset.source.replace(/\.svg$/, ".webp"), publicRoot)),
    );
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
  if (asset.sourceHash !== sourceHash || !outputHash || asset.outputHash !== outputHash)
    pending.push({ asset, svg, sourceHash });
}

if (process.argv.includes("--check")) {
  if (pending.length) {
    console.error("Run bun run assets:render for stale or missing artwork:");
    for (const { asset } of pending) console.error(asset.source);
    process.exitCode = 1;
  } else console.log("Static artwork is up to date.");
} else if (pending.length) {
  const { firefox } = await import("playwright");
  const { default: sharp } = await import("sharp");
  const browser = await firefox.launch();
  try {
    const page = await browser.newPage();
    for (const { asset, svg, sourceHash } of pending) {
      const png = await page.evaluate(
        async ({ source, width }) => {
          const image = new Image();
          image.src = `data:image/svg+xml;base64,${source}`;
          await image.decode();
          const canvas = document.createElement("canvas");
          canvas.width = width;
          canvas.height = Math.round((width * image.naturalHeight) / image.naturalWidth);
          canvas.getContext("2d").drawImage(image, 0, 0, canvas.width, canvas.height);
          return canvas.toDataURL("image/png").split(",")[1];
        },
        { source: Buffer.from(svg).toString("base64"), width: asset.width },
      );
      const output = asset.source.replace(/\.svg$/, ".webp");
      const webp = await sharp(Buffer.from(png, "base64"))
        .webp({ lossless: true, effort: 6 })
        .toBuffer();
      await writeFile(new URL(output, publicRoot), webp);
      asset.sourceHash = sourceHash;
      asset.outputHash = digest(webp);
      console.log(output);
    }
    await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
  } finally {
    await browser.close();
  }
} else console.log("Static artwork is up to date.");

// Derive smaller lossless images from the canonical render to preserve all SVG effects.
for (const asset of manifest) {
  for (const variant of asset.variants ?? []) {
    const output = asset.source.replace(/\.svg$/, `-${variant.width}.webp`);
    const source = await readFile(new URL(asset.source.replace(/\.svg$/, ".webp"), publicRoot));
    const sourceHash = digest(`sharp-resize-v1:${variant.width}:${digest(source)}`);
    let outputHash;
    try {
      outputHash = digest(await readFile(new URL(output, publicRoot)));
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
    if (variant.sourceHash === sourceHash && outputHash && variant.outputHash === outputHash)
      continue;
    if (process.argv.includes("--check")) {
      console.error(`Run bun run assets:render for ${output}`);
      process.exitCode = 1;
      continue;
    }
    const { default: sharp } = await import("sharp");
    const webp = await sharp(source)
      .resize({ width: variant.width })
      .webp({ lossless: true, effort: 6 })
      .toBuffer();
    await writeFile(new URL(output, publicRoot), webp);
    variant.sourceHash = sourceHash;
    variant.outputHash = digest(webp);
    variantsChanged = true;
    console.log(output);
  }
}
if (variantsChanged) await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
