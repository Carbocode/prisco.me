import { remapJourneyScroll } from "./journey-position";

export function animateHome(container) {
  const page = container.closest("[data-home-page]");
  page.classList.add("has-home-motion");
  const scroller = container.closest("[data-home-scroll]");
  let scrollOrigin = scroller.getBoundingClientRect().top;
  const localRect = (element) => {
    const rect = element.getBoundingClientRect();
    return {
      top: rect.top - scrollOrigin,
      bottom: rect.bottom - scrollOrigin,
      height: rect.height,
    };
  };
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

  const $ = (s, el = container) => el.querySelector(s);
  const $$ = (s, el = container) => Array.from(el.querySelectorAll(s));
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const reduceMQ = matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = matchMedia("(pointer: fine)");
  const root = container;
  root.classList.add("js");

  /* --- Manifesto: parola per parola ---------------------------------- */
  const manifesto = $("[data-manifesto]");
  const wrapWords = (node) => {
    for (const child of Array.from(node.childNodes)) {
      if (child.nodeType === Node.TEXT_NODE) {
        const frag = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach((part) => {
          if (!part) return;
          if (/^\s+$/.test(part)) {
            frag.append(part);
            return;
          }
          const s = document.createElement("span");
          s.className = "w";
          s.textContent = part;
          frag.append(s);
        });
        child.replaceWith(frag);
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        wrapWords(child);
      }
    }
  };
  const originalManifesto = Array.from(manifesto.childNodes, (node) => node.cloneNode(true));
  wrapWords(manifesto);
  const words = $$(".w", manifesto);

  function initSkyChart() {
    const chartRoot = container.querySelector("[data-sky-chart]");
    if (!chartRoot) return null;
    const svg = $("[data-sky-svg]", chartRoot);
    const NS = "http://www.w3.org/2000/svg";

    // Coordinate locali di ogni costellazione; "wide" è la posizione nella carta desktop.
    // Etichette: n/s/e/w rispetto alla stella. m:1 = stella principale.
    const groups = [
      {
        id: "dati",
        bounds: [-40, -40, 398, 281],
        top: -40,
        name: "Backend e dati",
        c: "#a6ded8",
        art: "la Balena",
        shapes: [
          "M30 150C50 60 140 0 230 5C330 10 398 70 398 150C398 235 336 276 240 279C140 281 70 246 30 150Z",
          "M34 160C14 140 2 110 -6 80L-40 30C-16 36 4 44 16 58C22 34 36 20 54 12C40 50 34 100 40 140Z",
        ],
        strokes: [
          "M340 146A4 4 0 1 1 339.9 146Z",
          "M215 190Q245 205 230 248Q200 235 195 210M50 142Q62 173 88 189",
          "M306 214C338 224 370 212 394 192",
          "M170 262C224 272 292 266 346 244M190 248C240 256 296 250 344 230",
          "M326 6C320 -28 294 -40 280 -28M326 6C332 -28 358 -40 372 -28M326 6L326 -18",
        ],
        wide: [80, 90],
        stars: [
          ["PHP", 10, 75, "w"],
          ["Rust", 100, 35, "n"],
          ["Java", 220, 10, "n", 1],
          [".NET / C#", 325, 55, "n"],
          ["Python", 395, 145, "e"],
          ["MySQL", 100, 205, "w"],
          ["Bash", 235, 135, "s"],
          ["PostgreSQL", 230, 275, "s", 1],
          ["MongoDB", 350, 235, "e"],
          ["Elasticsearch", 60, 285, "s"],
          ["Docker", 310, 140, "n"],
          ["Kubernetes", 10, 150, "s"],
          ["Linux", 125, 125, "n"],
        ],
        edges: [
          [0, 1],
          [1, 2],
          [2, 3],
          [3, 4],
          [2, 5],
          [5, 6],
          [6, 2],
          [6, 7],
          [7, 8],
          [8, 4],
          [7, 9],
          [6, 10],
          [10, 8],
          [0, 11],
          [0, 12],
          [12, 5],
        ],
      },
      {
        id: "mobile",
        bounds: [-18, 16, 358, 178],
        name: "Mobile",
        c: "#e0c6ff",
        art: "la Rondine",
        shapes: [
          "M158 78C118 56 58 18 -18 16C26 48 58 98 98 132C122 126 146 112 160 100Z",
          "M182 78C222 56 282 18 358 16C314 48 282 98 242 132C218 126 194 112 180 100Z",
          "M170 59C182 59 186 80 186 100C186 124 178 132 170 132C162 132 154 124 154 100C154 80 158 59 170 59Z",
          "M170 38A11 11 0 1 1 169.9 38Z",
          "M161 128L144 178L170 150L196 178L179 128Z",
        ],
        strokes: [
          "M168 39L170 30L172 39",
          "M160 88Q170 96 180 88M165 105L170 126L175 105",
          "M30 34C70 52 100 80 118 108M60 30C92 50 120 78 136 102M342 34C302 52 272 80 254 108M310 30C278 50 250 78 234 102",
        ],
        wide: [490, 360],
        stars: [
          ["Ionic", 0, 25, "n"],
          ["Capacitor", 100, 115, "s", 1],
          ["React Native", 170, 48, "n"],
          ["Swift / SwiftUI", 240, 115, "s", 1],
          ["MVVM", 340, 25, "n"],
        ],
        edges: [
          [0, 1],
          [1, 2],
          [2, 3],
          [3, 4],
        ],
      },
      {
        id: "interfacce",
        bounds: [-5, -52, 400, 330],
        top: -52,
        name: "Framework",
        c: "#b6dfff",
        art: "il Compasso",
        shapes: [
          "M190 -52L190 -24",
          "M182 2L100 282L112 284L196 6Z",
          "M198 6L318 284L330 280L206 2Z",
          "M190 -24A13 13 0 1 1 189.9 -24Z",
        ],
        strokes: [
          "M145 155Q190 178 260 162",
          "M152 148L148 161M172 156L170 169M194 159L194 173M217 157L220 170M240 152L245 165",
          "M40 300Q215 372 395 296",
          "M184 -38L196 -38",
          "M106 270L116 270M316 270L326 268",
        ],
        wide: [710, 550],
        stars: [
          ["Angular", 105, 278, "w"],
          ["React", 190, 0, "n", 1],
          ["Next.js", 250, 140, "e"],
          ["Astro", 324, 280, "s"],
          ["Tailwind CSS", 145, 155, "w", 1],
          ["Lit", 125, 220, "w"],
          ["Symfony", 100, 325, "s"],
          ["TanStack Start", 310, 325, "s"],
          ["Storybook", 292, 215, "e"],
        ],
        edges: [
          [1, 4],
          [4, 5],
          [5, 0],
          [1, 2],
          [2, 8],
          [8, 3],
          [4, 2],
          [0, 6],
          [7, 3],
        ],
      },
      {
        id: "ai-agenti",
        bounds: [-54, -28, 262, 352],
        top: -28,
        name: "AI e Agenti",
        c: "#ffd4b1",
        art: "la Mongolfiera",
        shapes: [
          "M105 -28C212 -28 262 70 232 142C212 192 142 230 122 256L86 256C66 230 -4 192 -24 142C-54 70 -2 -28 105 -28Z",
          "M68 318L116 318L112 352L72 352Z",
        ],
        strokes: [
          "M105 -28C58 40 70 180 94 256M105 -28C152 40 140 180 114 256M-27 120C60 148 150 148 235 120",
          "M86 256L70 318M122 256L114 318M100 270C96 280 104 288 100 298",
          "M-5 174Q105 210 215 174M72 329L114 329M80 319L84 350M96 319L100 350",
        ],
        wide: [980, 110],
        stars: [
          ["Codex", 105, -10, "n", 1],
          ["Claude Code", 235, 90, "e", 1],
          ["T3Code", -25, 105, "w"],
          ["Hermes", 215, 185, "e"],
          ["OpenClaw", 5, 205, "w"],
          ["MCP", 105, 265, "e", 1],
          ["n8n", 95, 345, "s"],
        ],
        edges: [
          [0, 1],
          [0, 2],
          [1, 3],
          [2, 4],
          [3, 5],
          [4, 5],
          [5, 6],
        ],
      },
      {
        id: "piattaforma",
        bounds: [-36, 4, 364, 320],
        name: "Piattaforma",
        c: "#c6d1ff",
        art: "il Veliero",
        shapes: [
          "M-14 222L344 222C324 262 292 290 250 296L62 296C30 290 8 262 -14 222Z",
          "M116 30C176 62 182 160 116 202Z",
          "M236 38C296 70 300 160 236 202Z",
          "M240 46L334 204L244 204Z",
          "M116 6L144 14L116 22Z",
        ],
        strokes: [
          "M114 222L114 4M234 222L234 22",
          "M10 238L326 238M40 276L280 276M18 218L114 30M116 70L234 26M116 202L234 202",
          "M-36 310Q-16 300 4 310T44 310T84 310T124 310T164 310T204 310T244 310T284 310T324 310T364 310",
          "M84 254A6 6 0 1 1 83.9 254ZM144 254A6 6 0 1 1 143.9 254ZM204 254A6 6 0 1 1 203.9 254ZM264 254A6 6 0 1 1 263.9 254Z",
        ],
        wide: [160, 550],
        stars: [
          ["Cloudflare", 5, 225, "w", 1],
          ["EXPO Services", 115, 35, "n", 1],
          ["Supabase", 175, 130, "e"],
          ["Sentry", 235, 40, "n"],
          ["JWT", 315, 195, "e"],
          ["Grafana", 255, 285, "s"],
          ["PostHog", 90, 215, "n"],
          ["Stripe", 60, 285, "s"],
        ],
        edges: [
          [0, 1],
          [1, 6],
          [2, 3],
          [3, 4],
          [2, 4],
          [4, 5],
          [5, 6],
          [6, 7],
          [6, 0],
        ],
      },
    ];

    let mode = "";
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
      const next = chartRoot.clientWidth < 760 ? "tall" : "wide";
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
        [
          ...g.shapes.map((d) => [d, "is-shape"]),
          ...g.strokes.map((d) => [d, "is-stroke"]),
        ].forEach(([d, kind], n) =>
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
    observeResize(render).observe(chartRoot);
    if (reduceMQ.matches) {
      lit = true;
      chartRoot.classList.add("is-instant", "is-lit");
    }

    return {
      reveal() {
        if (lit) return;
        lit = true;
        frame(() => chartRoot.classList.add("is-lit"));
      },
    };
  }

  /* --- Carta del cielo: costellazioni generate da dati -------------- */
  const skyChart = initSkyChart();

  /* --- Rivelazioni allo scroll --------------------------------------- */
  const revealIO = observeIntersection(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        if (entry.target.hasAttribute("data-sky-chart")) skyChart?.reveal();
        revealIO.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
  );
  $$("[data-reveal], [data-core]").forEach((el) => revealIO.observe(el));

  /* --- Navigazione attiva + altimetro -------------------------------- */
  const sections = $$("[data-section]");
  // Suspend decorative loops outside the viewport, with a small pre-roll margin.
  const motionIO = observeIntersection(
    (entries) => {
      entries.forEach((entry) =>
        entry.target.classList.toggle("is-motion-visible", entry.isIntersecting),
      );
    },
    { rootMargin: "200px 0px" },
  );
  sections.forEach((section) => motionIO.observe(section));
  const rail = page.querySelector(".gauge-rail");
  const gaugeCursor = page.querySelector(".gauge-cursor");
  const gauge = page.querySelector("[data-gauge]");
  let gaugeTimer;

  const ticks = sections.map(() => {
    const t = document.createElement("span");
    t.className = "gauge-tick";
    rail.append(t);
    return t;
  });

  let sectionTops = [];
  const measureSections = () => {
    const max = Math.max(1, scroller.scrollHeight - scroller.clientHeight);
    sectionTops = sections.map((s) => localRect(s).top + scroller.scrollTop);
    ticks.forEach((t, i) => {
      t.style.top = clamp(sectionTops[i] / max) * 100 + "%";
    });
  };

  let activeIndex = -1;
  const setActive = (i) => {
    if (i === activeIndex) return;
    activeIndex = i;
    ticks.forEach((t, j) => t.classList.toggle("is-active", j === i));
  };

  /* --- Hero: parallasse col puntatore -------------------------------- */
  const hero = $("[data-hero]");
  const header = page.querySelector("[data-home-header]");
  if (header) {
    const measureHeader = () =>
      page.style.setProperty("--home-header-height", `${header.offsetHeight}px`);
    measureHeader();
    observeResize(measureHeader).observe(header);
  }
  // The frame is an overlay: toggling it never changes the scroll range, so the
  // edges of the story can always open it without feeding back into this logic.
  let headerAnchor = scroller.scrollTop;
  let headerVisible = true;
  let headerKeyboardFocus = false;
  let storyStarting = false;
  let storyStartTimer;
  const updateHeader = (y, maxScroll = scroller.scrollHeight - scroller.clientHeight) => {
    if (!header) return;
    if (storyStarting) {
      headerVisible = false;
      headerAnchor = y;
    } else if (y <= 8 || (maxScroll > 0 && y >= maxScroll - 8)) {
      headerVisible = true;
      headerAnchor = y;
    } else if (headerVisible ? y < headerAnchor : y > headerAnchor) {
      // Follow the scroll while it confirms the current state: a reversal is
      // measured from the furthest point reached, not from the last toggle.
      headerAnchor = y;
    } else if (Math.abs(y - headerAnchor) >= 8) {
      headerVisible = !headerVisible;
      headerAnchor = y;
    }
    const interacting = headerKeyboardFocus || !!header.querySelector('[aria-expanded="true"]');
    const visible = !storyStarting && (headerVisible || interacting);
    page.classList.toggle("is-framed", visible);
    header.classList.add("is-floating");
    header.classList.toggle("is-visible", visible);
  };

  const scrollCue = $(".scroll-cue");
  // Any new input takes over from the cue, so its final jump cannot undo a reversal.
  const cancelStoryStart = () => {
    if (!storyStarting) return;
    clearTimeout(storyStartTimer);
    storyStarting = false;
    headerAnchor = scroller.scrollTop;
    requestFrame();
  };
  ["wheel", "touchstart", "pointerdown", "keydown"].forEach((type) =>
    listen(scroller, type, cancelStoryStart, { passive: true }),
  );
  listen(scrollCue, "click", (event) => {
    event.preventDefault();
    clearTimeout(storyStartTimer);
    scrollCue.focus({ preventScroll: true });
    storyStarting = true;
    updateHeader(scroller.scrollTop);
    scroller.scrollTo({
      top: scroller.scrollTop + 120,
      behavior: reduceMQ.matches ? "auto" : "smooth",
    });
    storyStartTimer = setTimeout(
      () => {
        scroller.scrollTo({ top: Math.max(120, scroller.scrollTop), behavior: "auto" });
        headerAnchor = scroller.scrollTop;
        storyStarting = false;
        requestFrame();
      },
      reduceMQ.matches ? 0 : 650,
    );
  });

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
      hero.style.setProperty("--px", ((pointerPosition.x - r.left) / r.width - 0.5).toFixed(3));
      hero.style.setProperty("--py", ((pointerPosition.y - r.top) / r.height - 0.5).toFixed(3));
    });
  });
  listen(hero, "pointerleave", () => {
    pointerPosition = null;
    hero.style.setProperty("--px", 0);
    hero.style.setProperty("--py", 0);
  });

  /* --- Bottoni magnetici --------------------------------------------- */
  $$("[data-magnetic]").forEach((btn) => {
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

  /* --- Traversata orizzontale ---------------------------------------- */
  const journey = $("[data-journey]");
  const stage = $("[data-journey-stage]");
  const track = $("[data-track]");
  const trackItems = Array.from(track.children);
  const stops = $$(".stop", track);
  const parLayers = $$("[data-par]", journey).map((element) => ({
    element,
    speed: parseFloat(element.dataset.par),
  }));
  const stopYears = stops.map((stop) => stop.querySelector(".stop-year"));
  const tw = $("[data-tw]");
  const twBounce = $("[data-tw-bounce]");
  const twRoll = $("[data-tw-roll]");
  const desert = $("[data-desert]");
  let jTop = 0,
    jDist = 0,
    trackDistance = 0,
    exitDistance = 0,
    slack = 0,
    horizontal = false,
    stopCenters = [];
  let sceneWidth = 0,
    tumbleweedSize = 60,
    lastJourneyProgress = -1,
    lastJourneyExit = -1;

  const setupJourney = () => {
    sceneWidth = scroller.clientWidth;
    tumbleweedSize = tw.offsetWidth || 60;
    lastJourneyProgress = -1;
    lastJourneyExit = -1;
    const wasHorizontal = horizontal;
    horizontal = !reduceMQ.matches;
    journey.classList.toggle("is-horizontal", horizontal);
    // Resizing the frame must never clear a live scene between animation frames.
    if (wasHorizontal && !horizontal) {
      trackItems.forEach((element) => {
        element.style.translate = "";
      });
      parLayers.forEach(({ element }) => {
        element.style.transform = "";
      });
      [tw, twBounce, twRoll].forEach((element) => {
        element.style.transform = "";
      });
    }
    if (!horizontal) {
      journey.style.height = "";
      return;
    }
    trackDistance = Math.max(0, track.scrollWidth - scroller.clientWidth);
    // The exit continues during the natural scroll into the next section.
    // It adds no distance to the pinned horizontal journey.
    exitDistance = Math.max(160, Math.min(360, scroller.clientHeight * 0.45));
    jDist = trackDistance;
    journey.style.height = scroller.clientHeight + jDist + "px";
    jTop = localRect(journey).top + scroller.scrollTop;
    slack = Math.max(0, (desert.offsetWidth - scroller.clientWidth) / 2);
    stopCenters = stops.map((s) => s.offsetLeft + s.offsetWidth / 2);
  };

  let currentStop = -1;
  const updateJourney = (scrollY = scroller.scrollTop) => {
    if (!horizontal) return;
    const distance = scrollY - jTop;
    const p = trackDistance ? clamp(distance / trackDistance) : 0;
    const exit = exitDistance ? clamp((distance - trackDistance) / exitDistance) : 0;
    if (p === lastJourneyProgress && exit === lastJourneyExit) return;
    lastJourneyProgress = p;
    lastJourneyExit = exit;
    const x = p * trackDistance;
    // Move bounded cards instead of promoting the entire, very wide track to
    // one GPU surface. The scene and scroll distance stay exactly the same.
    const translation = (-x).toFixed(1) + "px 0";
    trackItems.forEach((element) => {
      element.style.translate = translation;
    });
    // La scena è più larga del viewport: ogni piano scorre entro il margine disponibile.
    parLayers.forEach(({ element, speed }) => {
      element.style.transform =
        "translate3d(" + ((0.5 - p) * 2 * slack * speed).toFixed(1) + "px,0,0)";
    });
    // Il cespuglio rotola davvero: rotazione = distanza / circonferenza.
    const size = tumbleweedSize;
    const exitX = exit * (sceneWidth * 0.5 + size);
    const travelled = x * 0.44 + exitX;
    twRoll.style.transform = "rotate(" + ((travelled / (Math.PI * size)) * 360).toFixed(1) + "deg)";
    const lift = Math.abs(Math.sin(travelled / 90));
    twBounce.style.transform = "translate3d(0," + (-lift * size * 0.45).toFixed(1) + "px,0)";
    tw.style.setProperty("--lift", lift.toFixed(3));
    tw.style.transform =
      "translate3d(" + (slack + sceneWidth * (0.12 + p * 0.62) + exitX).toFixed(1) + "px,0,0)";

    let best = -1,
      bestD = Infinity;
    stopCenters.forEach((c, i) => {
      const screenX = c - x;
      const d = Math.abs(screenX - sceneWidth * 0.5);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
      const year = stopYears[i];
      if (year)
        year.style.setProperty("--yx", ((screenX - sceneWidth * 0.5) * -0.08).toFixed(1) + "px");
    });
    if (p < 0.04) best = -1;
    if (best !== currentStop) {
      currentStop = best;
      stops.forEach((s, i) => s.classList.toggle("is-current", i === best));
    }
  };

  // Tastiera: portare in vista la tappa che riceve il focus.
  listen(track, "focusin", (e) => {
    if (!horizontal) return;
    stage.scrollLeft = 0;
    const item = e.target.closest(".stop, .journey-intro");
    if (!item) return;
    const target = clamp(
      (item.offsetLeft + item.offsetWidth / 2 - scroller.clientWidth / 2) / (jDist || 1),
    );
    scroller.scrollTo({ top: jTop + target * jDist, behavior: "auto" });
  });

  /* --- Ciclo di scroll ----------------------------------------------- */
  const fossils = $$("[data-fy]");
  const coreZone = $("[data-core-zone]");
  let ticking = false;
  let geometry;
  let contentHeight = 0;
  const measureGeometry = () => {
    const y = scroller.scrollTop;
    const documentRect = (element) => {
      const { top, height } = localRect(element);
      return { top: top + y, height };
    };
    geometry = {
      heroHeight: hero.offsetHeight,
      manifestoRect: documentRect(manifesto),
      coreRect: documentRect(coreZone),
      fossilRects: fossils.map((element) => {
        const rect = documentRect(element);
        // Remove the existing parallax translation from the measured position.
        return {
          element,
          top: rect.top - (parseFloat(element.style.getPropertyValue("--fy")) || 0),
          height: rect.height,
          speed: parseFloat(element.dataset.fy),
        };
      }),
    };
    contentHeight = root.offsetHeight;
  };

  let litWords = -1;
  const setScrollValue = (element, property, value) => {
    // Reading inline style does not measure layout; no parallel cache is needed.
    if (element.style.getPropertyValue(property) !== value)
      element.style.setProperty(property, value);
  };
  const onFrame = () => {
    ticking = false;
    // Layout measurements are cached: scrolling must not flush animated SVG layout.
    const y = scroller.scrollTop;
    const vh = scroller.clientHeight;
    const max = Math.max(1, scroller.scrollHeight - vh);
    const { heroHeight, manifestoRect, coreRect, fossilRects } = geometry;
    const reduced = reduceMQ.matches;
    const hp = reduced ? 0 : clamp(y / (heroHeight || vh || 1));

    updateHeader(y, max);
    setScrollValue(gaugeCursor, "--doc-p", clamp(y / max).toFixed(4));
    let idx = 0;
    sectionTops.forEach((t, i) => {
      if (y + vh * 0.45 >= t) idx = i;
    });
    setActive(idx);

    const lit = reduced
      ? words.length
      : Math.round(
          clamp((vh * 0.85 - (manifestoRect.top - y)) / (manifestoRect.height + vh * 0.35)) *
            words.length,
        );
    if (lit !== litWords) {
      for (let i = Math.max(0, Math.min(litWords, lit)); i < Math.max(litWords, lit); i++)
        words[i].classList.toggle("lit", i < lit);
      litWords = lit;
    }
    if (reduced) return;

    setScrollValue(hero, "--hp", hp.toFixed(4));
    updateJourney(y);
    for (const { element, top, height, speed } of fossilRects) {
      if (top - y >= vh + 200 || top + height - y <= -200) continue;
      const offset = ((top - y + height / 2 - vh / 2) * -speed).toFixed(1);
      setScrollValue(element, "--fy", offset + "px");
    }
    setScrollValue(
      coreZone,
      "--heat",
      clamp((vh - (coreRect.top - y)) / (coreRect.height + vh * 0.2)).toFixed(3),
    );
  };

  const requestFrame = () => {
    if (!ticking) {
      ticking = true;
      frame(onFrame);
    }
  };

  const site = page.parentElement;
  let viewportSize = "";
  const layout = () => {
    viewportSize = `${scroller.clientWidth}x${scroller.clientHeight}`;
    // Classic scrollbars stay outside the overlay frame, header and footer peek.
    site.style.setProperty("--home-scrollbar", `${scroller.offsetWidth - scroller.clientWidth}px`);
    scrollOrigin = scroller.getBoundingClientRect().top;
    const previous = { start: jTop, distance: jDist };
    const previousScroll = scroller.scrollTop;
    const wasHorizontal = horizontal;
    root.style.setProperty("--home-viewport-height", `${scroller.clientHeight}px`);
    root.style.setProperty("--home-viewport-width", `${scroller.clientWidth}px`);
    setupJourney();
    if (wasHorizontal && horizontal) {
      const adjusted = remapJourneyScroll(previousScroll, previous, {
        start: jTop,
        distance: jDist,
      });
      if (Math.abs(adjusted - scroller.scrollTop) > 0.5) {
        scroller.scrollTop = adjusted;
        // Layout compensation is not a user change of scroll direction.
        headerAnchor = scroller.scrollTop;
      }
    }
    measureSections();
    measureGeometry();
    currentStop = -2;
    // Paint the new geometry immediately, with no intermediate reset frame.
    updateJourney();
    requestFrame();
  };

  listen(
    scroller,
    "scroll",
    () => {
      clearTimeout(gaugeTimer);
      gauge.classList.toggle("is-visible", scroller.scrollTop > 8);
      gaugeTimer = setTimeout(() => gauge.classList.remove("is-visible"), 900);
      requestFrame();
    },
    { passive: true },
  );
  // Keyboard focus reaching the hidden header opens the frame around it.
  if (header) {
    listen(header, "focusin", (event) => {
      headerKeyboardFocus = event.target.matches(":focus-visible");
      requestFrame();
    });
    listen(header, "focusout", () => {
      headerKeyboardFocus = false;
      requestFrame();
    });
    // A retained navigation focus must not pin the frame after scrolling resumes.
    for (const type of ["wheel", "touchstart"]) {
      listen(
        page,
        type,
        () => {
          if (!headerKeyboardFocus) return;
          headerKeyboardFocus = false;
          requestFrame();
        },
        { passive: true },
      );
    }
  }
  listen(reduceMQ, "change", () => {
    layout();
    if (reduceMQ.matches) {
      setScrollValue(hero, "--hp", "0.0000");
      $$("[data-reveal], [data-core]").forEach((el) => el.classList.add("is-in"));
    }
  });
  // Only real viewport changes (window, rotation, scrollbar) reach the scroller now.
  observeResize(() => {
    if (`${scroller.clientWidth}x${scroller.clientHeight}` !== viewportSize) layout();
  }).observe(scroller);
  // Image decoding and responsive content can change height after initial layout.
  observeResize(() => {
    if (root.offsetHeight !== contentHeight) layout();
  }).observe(root);
  listen(window, "load", layout);
  if (document.fonts && document.fonts.ready)
    void document.fonts.ready.then(() => {
      if (!disposed) layout();
    });
  layout();

  return () => {
    disposed = true;
    disposers.forEach((fn) => fn());
    pendingFrames.forEach(cancelAnimationFrame);
    clearTimeout(gaugeTimer);
    clearTimeout(storyStartTimer);
    root.classList.remove("js");
    page.classList.remove("is-framed", "has-home-motion");
    gaugeCursor.style.removeProperty("--doc-p");
    sections.forEach((section) => section.classList.remove("is-motion-visible"));
    page.style.removeProperty("--home-header-height");
    site.style.removeProperty("--home-scrollbar");
    if (header) {
      header.classList.remove("is-floating", "is-visible");
      header.style.removeProperty("--hero-header-y");
    }
    manifesto.replaceChildren(...originalManifesto);
    ticks.forEach((t) => t.remove());
  };
}
