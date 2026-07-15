import { describe, expect, it } from "vitest";

import { mediaDeliveryBaseUrl, mediaUrl } from "./media";

describe("media delivery URLs", () => {
  it("uses the local Worker route during development", () => {
    expect(mediaDeliveryBaseUrl("dev", "https://media.prisco.me")).toBe("/media");
    expect(mediaUrl("/media", "cms/2026/07/example.webp")).toBe("/media/cms/2026/07/example.webp");
  });

  it("uses the public R2 domain outside development", () => {
    expect(mediaDeliveryBaseUrl(undefined, "https://media.prisco.me")).toBe(
      "https://media.prisco.me",
    );
  });
});
