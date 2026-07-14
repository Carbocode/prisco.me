import { describe, expect, it } from "vitest";

import { roleHasPermission } from "./cms-permissions";
describe("CMS permissions", () => {
  it("mappa i ruoli", () => {
    expect(roleHasPermission("admin", "cmsService", "publish")).toBe(true);
    expect(roleHasPermission("editor", "cmsArticle", "publish")).toBe(true);
    expect(roleHasPermission("author", "cmsArticle", "update")).toBe(true);
    expect(roleHasPermission("author", "cmsArticle", "publish")).toBe(false);
    expect(roleHasPermission("user", "cmsArticle", "read")).toBe(false);
  });
});
