import { expect, it, vi } from "vitest";

import { createJourneyMotion } from "./journey-motion.js";

it("prepares scene styles without forcing geometry reads, then measures in a separate phase", () => {
  const container = document.createElement("div");
  container.innerHTML = `<section data-journey>
    <div data-journey-stage><div data-track><article class="stop"></article></div></div>
    <div data-desert></div><div data-tw></div><div data-tw-bounce></div><div data-tw-roll></div>
  </section>`;
  const track = container.querySelector("[data-track]");
  const readWidth = vi.fn(() => 1200);
  Object.defineProperty(track, "scrollWidth", { get: readWidth });
  const localRect = vi.fn(() => ({ top: 100 }));
  const motion = createJourneyMotion(container, container, {
    listen: vi.fn(),
    reduceMQ: { matches: false },
    localRect,
  });

  motion.prepare({ width: 400, height: 800 });
  expect(readWidth).not.toHaveBeenCalled();
  expect(localRect).not.toHaveBeenCalled();
  motion.measure();
  expect(readWidth).toHaveBeenCalledOnce();
  expect(motion.position).toEqual({ start: 100, distance: 800, horizontal: true });
  expect(container.querySelector("[data-journey]")?.style.height).toBe("1600px");

  motion.dispose();
  expect(
    container.querySelector("[data-journey]")?.style.getPropertyValue("--home-viewport-width"),
  ).toBe("");
});
