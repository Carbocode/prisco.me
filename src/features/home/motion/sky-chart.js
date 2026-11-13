import { constellations as groups } from "./constellations.js";

export function createSkyChart(
  chartRoot,
  { frame, listen, observeIntersection, observeResize, reduceMQ, initialChartWidth },
) {
  if (!chartRoot) return null;
  const svg = chartRoot.querySelector("[data-sky-svg]");
  const NS = "http://www.w3.org/2000/svg";

  // Coordinate locali di ogni costellazione; "wide" è la posizione nella carta desktop.
  // Etichette: n/s/e/w rispetto alla stella. m:1 = stella principale.

  let mode = "";
  let chartWidth = initialChartWidth;
  let activated = false;
  const seen = observeIntersection(
    (entries) =>
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        setActive(entry.target, true);
        seen.unobserve(entry.target);
      }),
    { rootMargin: "-30% 0px -30% 0px" },
  );
  let lit = false;

  const el = (tag, attrs, parent) => {
    const node = document.createElementNS(NS, tag);
    for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
    parent?.appendChild(node);
    return node;
  };
  // Generatore deterministico: la polvere di stelle non cambia a ogni render.
  const rand = (seed) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;
  const spark = (x, y, r) =>
    `M${x} ${y - r}Q${x + r * 0.14} ${y - r * 0.14} ${x + r} ${y}Q${x + r * 0.14} ${y + r * 0.14} ${x} ${y + r}Q${x - r * 0.14} ${y + r * 0.14} ${x - r} ${y}Q${x - r * 0.14} ${y - r * 0.14} ${x} ${y - r}Z`;

  // Desktop: l'illustrazione si accende al passaggio del mouse.
  // Mobile: si accende quando la costellazione arriva al centro dello schermo.
  const setActive = (grp, on) => grp.classList.toggle("is-active", on);

  function render() {
    const next = chartWidth < 760 ? "tall" : "wide";
    if (next === mode) return;
    mode = next;
    chartRoot.dataset.skyLayout = mode;
    seen.disconnect();
    svg.replaceChildren();

    // Measure the whole drawing and its labels, so mobile preserves proportions.
    const W = mode === "wide" ? 1320 : 480;
    let y = 16;
    const placed = groups.map((g) => {
      const [artLeft, artTop, artRight, artBottom] = g.bounds;
      const labelBounds = g.stars.map(([label, x, sy, side]) => {
        const width = label.length * 8.4 + 20;
        return [
          x - (side === "w" ? width + 20 : side === "e" ? 0 : width / 2),
          sy - (side === "n" ? 38 : 14),
          x + (side === "e" ? width + 20 : side === "w" ? 0 : width / 2),
          sy + (side === "s" ? 40 : 20),
        ];
      });
      const left = Math.min(artLeft, ...labelBounds.map((b) => b[0]));
      const top = Math.min(artTop, ...labelBounds.map((b) => b[1]));
      const right = Math.max(artRight, ...labelBounds.map((b) => b[2]));
      const bottom = Math.max(artBottom, ...labelBounds.map((b) => b[3]));
      const titleY = top - 20;
      const titleX = (artLeft + artRight) / 2;
      if (mode === "wide")
        return {
          g,
          k: 1,
          ox: g.wide[0],
          oy: g.wide[1],
          titleX,
          titleY,
        };
      const scale = Math.min(1, (W - 40) / (right - left));
      const transform = `translate(${(W - (right - left) * scale) / 2 - left * scale} ${y - titleY * scale}) scale(${scale})`;
      y += (bottom - titleY + 48) * scale;
      return { g, k: 1, ox: 0, oy: 0, titleX, titleY, transform };
    });
    const H = mode === "wide" ? 940 : Math.ceil(y);
    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);
    svg.style.width = "100%";
    // Reserve the exact responsive height immediately; draw only when visible.
    if (!activated) return;

    // Fondo: reticolo celeste, eclittica e polvere di stelle.
    const bg = el("g", {}, svg);
    const cx = W / 2,
      cy = H * 1.9;
    [1.25, 1.55, 1.85, 2.15].forEach((f) =>
      el("circle", { class: "sky-grid", cx, cy, r: H * f }, bg),
    );
    for (let i = -3; i <= 3; i++)
      el("line", { class: "sky-grid", x1: cx, y1: cy, x2: cx + i * W * 0.32, y2: -40 }, bg);
    el(
      "path",
      {
        class: "sky-grid is-ecliptic",
        d:
          mode === "wide"
            ? `M-20 ${H * 0.78}C${W * 0.3} ${H * 0.35} ${W * 0.65} ${H * 0.95} ${W + 20} ${H * 0.25}`
            : `M${W * 0.15} -20C${W * 0.9} ${H * 0.3} ${W * 0.1} ${H * 0.65} ${W * 0.85} ${H + 20}`,
      },
      bg,
    );
    const r = rand(mode === "wide" ? 7 : 11);
    for (let i = 0; i < (mode === "wide" ? 190 : 120); i++) {
      const dust = el(
        "circle",
        {
          class: "sky-dust",
          cx: (r() * W).toFixed(1),
          cy: (r() * H).toFixed(1),
          r: (0.4 + r() * r() * 1.3).toFixed(2),
          opacity: (0.12 + r() * 0.4).toFixed(2),
        },
        bg,
      );
      if (i % 3 === 0) {
        dust.classList.add("is-twinkling");
        dust.style.cssText = `--dt:${(2.5 + r() * 4).toFixed(1)}s;--dd:${(-r() * 6).toFixed(1)}s`;
      }
    }

    let delay = 0;
    placed.forEach(({ g, k, ox, oy, titleX, titleY, transform }) => {
      const pos = g.stars.map(([, x, sy]) => [ox + x * k, oy + sy * k]);
      const grp = el("g", { class: "sky-group", "data-group": g.id, style: `--c:${g.c}` }, svg);
      if (transform) grp.setAttribute("transform", transform);

      // Area di hover: un rettangolo generoso attorno alla costellazione.
      const xs = pos.map((p) => p[0]),
        ys = pos.map((p) => p[1]);
      el(
        "rect",
        {
          class: "sky-hit",
          x: Math.min(...xs) - 40,
          y: Math.min(...ys) - 70,
          width: Math.max(...xs) - Math.min(...xs) + 80,
          height: Math.max(...ys) - Math.min(...ys) + 110,
        },
        grp,
      );

      // Nome della costellazione, come sulle carte antiche.
      const tx = ox + titleX;
      const nameY = oy + titleY;
      const anchor = "middle";
      el(
        "text",
        { class: "sky-name", x: tx, y: nameY, "text-anchor": anchor, style: `--d:${delay}ms` },
        grp,
      ).textContent = g.name;

      // Illustrazione: invisibile a riposo, si disegna quando la costellazione si accende.
      const art = el(
        "g",
        {
          class: "sky-art",
          transform: `translate(${ox} ${oy}) scale(${k})`,
          style: `--sw:${(1.2 / k).toFixed(2)}`,
        },
        grp,
      );
      [...g.shapes.map((d) => [d, "is-shape"]), ...g.strokes.map((d) => [d, "is-stroke"])].forEach(
        ([d, kind], n) =>
          el(
            "path",
            { d, class: `sky-art-line ${kind}`, pathLength: 1, style: `--a:${n * 70}ms` },
            art,
          ),
      );

      // Linee, accorciate per non toccare le stelle.
      const lines = el("g", {}, grp);
      g.edges.forEach(([i, j], n) => {
        const [x1, y1] = pos[i],
          [x2, y2] = pos[j];
        const len = Math.hypot(x2 - x1, y2 - y1),
          gap = 13 / len;
        el(
          "path",
          {
            class: "sky-line",
            pathLength: 1,
            style: `--d:${delay + 380 + n * 90}ms`,
            d: `M${(x1 + (x2 - x1) * gap).toFixed(1)} ${(y1 + (y2 - y1) * gap).toFixed(1)}L${(x2 - (x2 - x1) * gap).toFixed(1)} ${(y2 - (y2 - y1) * gap).toFixed(1)}`,
          },
          lines,
        );
      });

      g.stars.forEach(([label, , , side, major], n) => {
        const [x, sy] = pos[n];
        const d = `--d:${delay + n * 70}ms`;
        // Keep placement separate from animation. All animated shapes use a fixed
        // local origin, independent of SVG bounding-box updates in each browser.
        const position = el("g", { transform: `translate(${x} ${sy})` }, grp);
        const star = el(
          "g",
          {
            class: "sky-star",
            style: `${d};--tw:${(2.6 + (n % 5) * 0.7).toFixed(1)}s;--twd:${(-n * 0.9).toFixed(1)}s;--gl:${(5 + ((n * 7) % 6)).toFixed(1)}s;--gld:${(-n * 1.3).toFixed(1)}s`,
          },
          position,
        );
        const size = major ? 9 : 6;
        el("circle", { class: "sky-hit-star", cx: 0, cy: 0, r: 22 }, star);
        el("circle", { class: "sky-burst", cx: 0, cy: 0, r: size * 1.6 }, star);
        const body = el("g", { class: "sky-body" }, star);
        el("circle", { class: "sky-halo", cx: 0, cy: 0, r: size * 2.1 }, body);
        el(
          "path",
          {
            class: "sky-glint",
            d: `M${-size * 3.2} 0H${size * 3.2}M0 ${-size * 3.2}V${size * 3.2}`,
          },
          body,
        );
        el("path", { class: "sky-spark", d: spark(0, 0, size) }, body);
        el("circle", { class: "sky-core", cx: 0, cy: 0, r: major ? 2 : 1.4 }, body);
        const off = size + 9;
        const [lx, ly, an] = {
          n: [0, -off, "middle"],
          s: [0, off + 10, "middle"],
          e: [off, 5, "start"],
          w: [-off, 5, "end"],
        }[side];
        el("text", { class: "sky-label", x: lx, y: ly, "text-anchor": an }, star).textContent =
          label;
      });

      if (mode === "tall") seen.observe(grp);
      delay += 520;
    });

    if (lit) {
      chartRoot.classList.add("is-instant", "is-lit");
      frame(() => frame(() => chartRoot.classList.remove("is-instant")));
    }
  }

  // Delegate hover so rebuilding the SVG never retains listeners on old groups.
  for (const type of ["pointerover", "pointerout"]) {
    listen(svg, type, (event) => {
      if (mode !== "wide") return;
      const group = event.target.closest(".sky-group");
      if (!group || (event.relatedTarget instanceof Node && group.contains(event.relatedTarget)))
        return;
      setActive(group, type === "pointerover");
    });
  }
  render();
  observeResize((entries) => {
    chartWidth = entries[0].contentRect.width;
    render();
  }).observe(chartRoot);
  if (reduceMQ.matches) {
    lit = true;
    chartRoot.classList.add("is-instant", "is-lit");
  }

  return {
    reveal() {
      if (!activated) {
        activated = true;
        mode = "";
        render();
      }
      if (lit) return;
      lit = true;
      frame(() => chartRoot.classList.add("is-lit"));
    },
  };
}
