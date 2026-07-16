import { describe, expect, it } from "vitest";

import { hasAnimatedWebPChunks } from "./media-processing";

function webPChunk(type: string, payload: number[] = []) {
  const bytes = new Uint8Array(8 + payload.length + (payload.length % 2));
  bytes.set(Array.from(type, (character) => character.charCodeAt(0)));
  new DataView(bytes.buffer).setUint32(4, payload.length, true);
  bytes.set(payload, 8);
  return bytes;
}

function webP(...chunks: Uint8Array[]) {
  const bodyLength = 4 + chunks.reduce((total, chunk) => total + chunk.length, 0);
  const bytes = new Uint8Array(8 + bodyLength);
  bytes.set([82, 73, 70, 70]);
  new DataView(bytes.buffer).setUint32(4, bodyLength, true);
  bytes.set([87, 69, 66, 80], 8);
  let offset = 12;
  for (const chunk of chunks) {
    bytes.set(chunk, offset);
    offset += chunk.length;
  }
  return bytes;
}

describe("hasAnimatedWebPChunks", () => {
  it("riconosce un WebP animato dal chunk ANIM", () => {
    expect(hasAnimatedWebPChunks(webP(webPChunk("VP8X"), webPChunk("ANIM")))).toBe(true);
  });

  it("riconosce un WebP animato dal chunk ANMF", () => {
    expect(hasAnimatedWebPChunks(webP(webPChunk("VP8X"), webPChunk("ANMF", [1])))).toBe(true);
  });

  it("non considera animato un WebP statico", () => {
    expect(hasAnimatedWebPChunks(webP(webPChunk("VP8 ")))).toBe(false);
  });

  it("rifiuta dati che non sono WebP", () => {
    expect(hasAnimatedWebPChunks(new Uint8Array([1, 2, 3]))).toBe(false);
  });
});
