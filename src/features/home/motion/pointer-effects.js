export function attachPointerEffects(
  container,
  hero,
  { listen, frame, reduceMQ, finePointer, heroParallax },
) {
  let pointerRAF = 0;
  let pointerPosition = null;
  listen(hero, "pointermove", (e) => {
    if (reduceMQ.matches || !finePointer.matches) return;
    pointerPosition = { x: e.clientX, y: e.clientY };
    if (pointerRAF) return;
    pointerRAF = frame(() => {
      pointerRAF = 0;
      if (!pointerPosition) return;
      const r = hero.getBoundingClientRect();
      heroParallax.pointer(
        ((pointerPosition.x - r.left) / r.width - 0.5).toFixed(3),
        ((pointerPosition.y - r.top) / r.height - 0.5).toFixed(3),
      );
    });
  });
  listen(hero, "pointerleave", () => {
    pointerPosition = null;
    heroParallax.pointer("0", "0");
  });

  /* --- Bottoni magnetici --------------------------------------------- */
  Array.from(container.querySelectorAll("[data-magnetic]")).forEach((btn) => {
    listen(btn, "pointermove", (e) => {
      if (reduceMQ.matches || !finePointer.matches) return;
      const r = btn.getBoundingClientRect();
      btn.style.setProperty("--mx", ((e.clientX - r.left - r.width / 2) * 0.22).toFixed(1) + "px");
      btn.style.setProperty("--my", ((e.clientY - r.top - r.height / 2) * 0.35).toFixed(1) + "px");
    });
    listen(btn, "pointerleave", () => {
      btn.style.setProperty("--mx", "0px");
      btn.style.setProperty("--my", "0px");
    });
  });
}
