import { act, cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { HoverAnimatedImage } from "./hover-animated-image";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

describe("HoverAnimatedImage", () => {
  it("mantiene visibile l'immagine finché lo snapshot non è pronto", () => {
    const view = render(<HoverAnimatedImage src="/cover.jpg" alt="Cover" />);

    expect(view.getByRole("img").className).not.toContain("opacity-0");
    expect(view.container.querySelector("canvas")?.className).toContain("opacity-0");
  });

  it("crea lo snapshot anche quando l'immagine era già in cache prima dell'hydration", () => {
    const drawImage = vi.fn();
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- il componente usa solo drawImage
      { drawImage } as unknown as CanvasRenderingContext2D,
    );
    vi.spyOn(HTMLImageElement.prototype, "complete", "get").mockReturnValue(true);
    vi.spyOn(HTMLImageElement.prototype, "naturalWidth", "get").mockReturnValue(1600);
    vi.spyOn(HTMLImageElement.prototype, "naturalHeight", "get").mockReturnValue(900);

    const view = render(<HoverAnimatedImage src="/cached.gif" alt="Animazione" />);

    expect(drawImage).toHaveBeenCalledOnce();
    expect(view.getByRole("img").className).toContain("opacity-0");
    expect(view.container.querySelector("canvas")?.className).toContain("opacity-100");
  });

  it("passa allo snapshot dopo il normale evento load", async () => {
    const drawImage = vi.fn();
    vi.spyOn(HTMLCanvasElement.prototype, "getContext").mockReturnValue(
      // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- il componente usa solo drawImage
      { drawImage } as unknown as CanvasRenderingContext2D,
    );
    const view = render(<HoverAnimatedImage src="/lazy.webp" alt="Animazione" />);
    const image = view.container.querySelector("img");
    expect(image).toBeInstanceOf(HTMLImageElement);
    if (!image) return;
    Object.defineProperties(image, {
      complete: { configurable: true, value: true },
      naturalWidth: { configurable: true, value: 800 },
      naturalHeight: { configurable: true, value: 450 },
    });

    await act(() => image.dispatchEvent(new Event("load")));

    expect(drawImage).toHaveBeenCalledOnce();
    expect(image.className).toContain("group-hover/animated-webp:opacity-100");
  });
});
