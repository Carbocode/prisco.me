import { describe, expect, it } from "vitest";

import { mediaDeliveryBaseUrl, mediaFilename, mediaUrl } from "./media";

describe("media delivery URLs", () => {
  it("uses the local Worker route during development", () => {
    expect(mediaDeliveryBaseUrl("development", "https://media.prisco.me")).toBe("/media");
    expect(mediaUrl("/media", "cms/2026/07/example.webp")).toBe("/media/cms/2026/07/example.webp");
  });

  it("uses the generated storage basename as the saved filename", () => {
    expect(mediaFilename("cms/2026/07/550e8400-e29b-41d4-a716-446655440000.webp")).toBe(
      "550e8400-e29b-41d4-a716-446655440000.webp",
    );
  });

  it("uses the public R2 domain outside development", () => {
    expect(mediaDeliveryBaseUrl("production", "https://media.prisco.me")).toBe(
      "https://media.prisco.me",
    );
  });
});
