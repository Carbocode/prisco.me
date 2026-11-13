// Change variables only on the affected layers, never on the entire hero subtree.
export function createHeroParallax(hero) {
  const layers = Array.from(hero.querySelectorAll(".depth"));
  function set(property, value) {
    for (const layer of layers) {
      if (layer.style.getPropertyValue(property) !== value)
        layer.style.setProperty(property, value);
    }
  }
  return {
    pointer(x, y) {
      set("--px", x);
      set("--py", y);
    },
    scroll(progress) {
      set("--hp", progress);
    },
    dispose() {
      for (const layer of layers)
        for (const property of ["--px", "--py", "--hp"]) layer.style.removeProperty(property);
    },
  };
}
