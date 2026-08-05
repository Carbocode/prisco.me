import { describe, expect, it } from "vitest";

import { toEmbedUrl, toPreviewImageUrl, toTwitterPostUrl } from "./embed-url";

describe("embed URL resolution", () => {
  it.each([
    ["https://youtu.be/dQw4w9WgXcQ", "https://www.youtube.com/embed/dQw4w9WgXcQ"],
    ["https://vimeo.com/123456", "https://player.vimeo.com/video/123456"],
    [
      "https://www.instagram.com/reel/ABC_123/",
      "https://www.instagram.com/p/ABC_123/embed/captioned/",
    ],
    [
      "https://www.linkedin.com/posts/example_activity-1234567890123456789-test",
      "https://www.linkedin.com/embed/feed/update/urn:li:activity:1234567890123456789",
    ],
    [
      "https://www.tiktok.com/@example/video/1234567890123456789",
      "https://www.tiktok.com/player/v1/1234567890123456789",
    ],
    [
      "https://open.spotify.com/track/abc123?si=test",
      "https://open.spotify.com/embed/track/abc123",
    ],
  ])("maps %s to an iframe URL", (source, expected) => {
    expect(toEmbedUrl(source)).toBe(expected);
  });

  it("keeps stored local preview images usable", () => {
    expect(toPreviewImageUrl("/media/cms/2026/08/example.webp")).toBe(
      "/media/cms/2026/08/example.webp",
    );
  });

  it("recognizes X and Twitter post URLs for the official widget", () => {
    expect(toTwitterPostUrl("https://x.com/openai/status/1234567890")).toBe(
      "https://x.com/openai/status/1234567890",
    );
    expect(toTwitterPostUrl("https://example.com/openai/status/1234567890")).toBeNull();
  });
});
