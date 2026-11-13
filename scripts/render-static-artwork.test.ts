import { spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

import { expect, it } from "vitest";

it.each([
  "unchanged",
  "source",
  "width",
  "output",
  "missing",
  "animated",
  "variant-output",
  "variant-width",
  "variant-missing",
])("checks prerender integrity: %s", (change) => {
  const root = mkdtempSync(join(tmpdir(), "static-artwork-test-"));
  try {
    const asset = JSON.parse(readFileSync("scripts/static-artwork.json", "utf8"))[0];
    const source = join(root, "public", asset.source);
    const output = source.replace(/\.svg$/, ".webp");
    mkdirSync(dirname(source), { recursive: true });
    mkdirSync(join(root, "scripts"));
    copyFileSync(`public/${asset.source}`, source);
    copyFileSync(`public/${asset.source.replace(/\.svg$/, ".webp")}`, output);
    for (const variant of asset.variants ?? []) {
      const file = asset.source.replace(/\.svg$/, `-${variant.width}.webp`);
      copyFileSync(`public/${file}`, join(root, "public", file));
    }
    const variantOutput = output.replace(/\.webp$/, `-${asset.variants[0].width}.webp`);
    if (change === "variant-output") writeFileSync(variantOutput, "changed variant");
    if (change === "variant-missing") rmSync(variantOutput);
    if (change === "variant-width") asset.variants[0].width += 1;
    copyFileSync("scripts/render-static-artwork.js", join(root, "scripts/render.mjs"));
    if (change === "source")
      writeFileSync(source, readFileSync(source, "utf8") + "<!-- edited -->");
    if (change === "width") asset.width += 1;
    if (change === "output") writeFileSync(output, "changed output");
    if (change === "missing") rmSync(output);
    if (change === "animated")
      writeFileSync(source, '<svg><animate attributeName="opacity" /></svg>');
    writeFileSync(join(root, "scripts/static-artwork.json"), JSON.stringify([asset]));
    const result = spawnSync(process.execPath, [join(root, "scripts/render.mjs"), "--check"], {
      encoding: "utf8",
    });
    expect(result.status).toBe(change === "unchanged" ? 0 : 1);
    if (change === "unchanged") expect(result.stdout).toContain("up to date");
    else if (change === "animated")
      expect(result.stderr).toContain("animated SVGs must remain vector");
    else expect(result.stderr).toContain("bun run assets:render");
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
