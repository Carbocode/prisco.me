/** Owns all listeners, observers and animation frames for one mounted story. */
export function createAnimationScope(scroller) {
  const disposers = [];
  let disposed = false;
  const pendingFrames = new Set();
  const frame = (fn) => {
    if (disposed) return 0;
    const id = requestAnimationFrame(() => {
      pendingFrames.delete(id);
      if (!disposed) fn();
    });
    pendingFrames.add(id);
    return id;
  };
  const listen = (target, event, fn, options) => {
    target.addEventListener(event, fn, options);
    disposers.push(() => target.removeEventListener(event, fn, options));
  };
  const observeIntersection = (...args) => {
    const observer = new IntersectionObserver(args[0], { ...args[1], root: scroller });
    disposers.push(() => observer.disconnect());
    return observer;
  };
  const observeResize = (...args) => {
    const observer = new ResizeObserver(...args);
    disposers.push(() => observer.disconnect());
    return observer;
  };

  return {
    frame,
    listen,
    observeIntersection,
    observeResize,
    get disposed() {
      return disposed;
    },
    dispose() {
      disposed = true;
      disposers.forEach((dispose) => dispose());
      pendingFrames.forEach(cancelAnimationFrame);
    },
  };
}
