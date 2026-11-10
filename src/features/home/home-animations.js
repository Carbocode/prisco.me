import { remapJourneyScroll } from "./journey-position";

export function animateHome(container) {
  const page = container.closest("[data-home-page]");
  page.classList.add("has-home-motion");
  const scroller = container.closest("[data-home-scroll]");
  const localRect = (element) => {
    const rect = element.getBoundingClientRect();
    const origin = scroller.getBoundingClientRect();
    return { top: rect.top - origin.top, bottom: rect.bottom - origin.top, height: rect.height };
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
  const horizontalMQ = matchMedia("(prefers-reduced-motion: no-preference)");
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
        id: "interfacce",
        top: -52,
        name: "Interfacce",
        c: "#b6dfff",
        art: "il Compasso",
        shapes: [
          "M190 -52L190 -24",
          "M182 2L100 282L112 284L196 6Z",
          "M198 6L318 284L330 280L206 2Z",
          "M190 -24A13 13 0 1 1 189.9 -24Z",
        ],
        strokes: [
          "M128 168Q190 190 262 166",
          "M40 300Q215 372 395 296",
          "M184 -38L196 -38",
          "M106 270L116 270M316 270L326 268",
        ],
        wide: [70, 110],
        stars: [
          ["Angular", 0, 70, "s"],
          ["React", 120, 20, "n", 1],
          ["Next.js", 240, 40, "n"],
          ["Astro", 300, 130, "e"],
          ["Tailwind CSS", 130, 120, "e", 1],
          ["Lit", 30, 190, "w"],
          ["Web Components", 110, 260, "s"],
          ["WCAG", 230, 220, "s"],
          ["Storybook", 330, 265, "s"],
        ],
        edges: [
          [0, 1],
          [1, 2],
          [2, 3],
          [1, 4],
          [4, 5],
          [5, 6],
          [4, 7],
          [7, 8],
          [3, 7],
        ],
      },
      {
        id: "mobile",
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
          "M30 34C70 52 100 80 118 108M60 30C92 50 120 78 136 102M342 34C302 52 272 80 254 108M310 30C278 50 250 78 234 102",
        ],
        wide: [770, 110],
        stars: [
          ["Ionic", 0, 40, "n"],
          ["Capacitor", 85, 120, "s", 1],
          ["React Native", 170, 45, "n"],
          ["Swift / SwiftUI", 260, 130, "s", 1],
          ["MVVM", 340, 40, "n"],
        ],
        edges: [
          [0, 1],
          [1, 2],
          [2, 3],
          [3, 4],
        ],
      },
      {
        id: "dati",
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
          "M306 214C338 224 370 212 394 192",
          "M170 262C224 272 292 266 346 244M190 248C240 256 296 250 344 230",
          "M326 6C320 -28 294 -40 280 -28M326 6C332 -28 358 -40 372 -28M326 6L326 -18",
        ],
        wide: [420, 450],
        stars: [
          ["PHP", 0, 60, "n"],
          ["Symfony", 90, 20, "n"],
          ["Java", 190, 50, "n", 1],
          [".NET / C#", 280, 20, "n"],
          ["Python", 370, 70, "n"],
          ["MySQL", 130, 150, "w"],
          ["Prisma ORM", 240, 140, "e"],
          ["PostgreSQL", 200, 240, "s", 1],
          ["MongoDB", 330, 200, "e"],
          ["Elasticsearch", 70, 250, "s"],
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
        ],
      },
      {
        id: "prodotto",
        top: -28,
        name: "Prodotto e progettazione",
        c: "#ffd4b1",
        art: "la Mongolfiera",
        shapes: [
          "M105 -28C212 -28 262 70 232 142C212 192 142 230 122 256L86 256C66 230 -4 192 -24 142C-54 70 -2 -28 105 -28Z",
          "M68 318L116 318L112 352L72 352Z",
        ],
        strokes: [
          "M105 -28C58 40 70 180 94 256M105 -28C152 40 140 180 114 256M-27 120C60 148 150 148 235 120",
          "M86 256L70 318M122 256L114 318M100 270C96 280 104 288 100 298",
        ],
        wide: [850, 360],
        stars: [
          ["Figma", 110, 0, "n", 1],
          ["Product Design", 210, 90, "e"],
          ["UML", 0, 80, "w"],
          ["Software Architecture", 180, 200, "e"],
          ["Stripe", 10, 190, "w"],
          ["PostHog", 100, 240, "w", 1],
          ["Mapbox", 90, 340, "s"],
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
        name: "Piattaforma e strumenti",
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
          "M-36 310Q-16 300 4 310T44 310T84 310T124 310T164 310T204 310T244 310T284 310T324 310T364 310",
          "M84 254A6 6 0 1 1 83.9 254ZM144 254A6 6 0 1 1 143.9 254ZM204 254A6 6 0 1 1 203.9 254ZM264 254A6 6 0 1 1 263.9 254Z",
        ],
        wide: [70, 520],
        stars: [
          ["Cloudflare", 20, 110, "n", 1],
          ["TanStack Start", 110, 40, "n", 1],
          ["Vite", 205, 90, "n"],
          ["Sentry", 300, 35, "n"],
          ["JWT", 290, 170, "e"],
          ["Better Auth", 210, 250, "s"],
          ["Claude Code", 100, 200, "w"],
          ["Codex", 40, 280, "s"],
        ],
        edges: [
          [0, 1],
          [1, 2],
          [2, 3],
          [2, 4],
          [4, 5],
          [5, 6],
          [6, 7],
          [6, 0],
        ],
      },
    ];

    let mode = "";
    let seen = null;
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
      seen?.disconnect();
      seen =
        mode === "tall"
          ? observeIntersection(
              (entries) =>
                entries.forEach((entry) => {
                  if (!entry.isIntersecting) return;
                  setActive(entry.target, true);
                  seen.unobserve(entry.target);
                }),
              { rootMargin: "-30% 0px -30% 0px" },
            )
          : null;
      svg.replaceChildren();

      // Posizioni: nella carta desktop si usa "wide"; su mobile le costellazioni si impilano.
      const W = mode === "wide" ? 1200 : 420;
      let y = 70;
      const placed = groups.map((g) => {
        if (mode === "wide") return { g, k: 1, ox: g.wide[0], oy: g.wide[1] };
        // Ingombro stimato includendo le etichette, che non vengono scalate.
        const reach = ([label, x, , side]) => {
          const w = label.length * 7.6 + 16;
          return side === "e" ? [x, w] : side === "w" ? [x, -w] : [x, 0, w / 2];
        };
        const left = Math.min(
          ...g.stars.map((st) => {
            const [x, d, half] = reach(st);
            return x + Math.min(0, d) - (half ?? 0);
          }),
        );
        const right = Math.max(
          ...g.stars.map((st) => {
            const [x, d, half] = reach(st);
            return x + Math.max(0, d) + (half ?? 0);
          }),
        );
        const spanX = Math.max(...g.stars.map((st) => st[1]));
        const maxY = Math.max(...g.stars.map((st) => st[2]));
        const k = Math.min(1, (W - 30 - (right - left - spanX)) / spanX);
        // Spazio extra per le illustrazioni che sporgono sopra le stelle.
        const lift = Math.max(0, -(g.top ?? 0) - 10) * k;
        const at = {
          g,
          k,
          lift,
          ox: (W - (right - left - spanX) - spanX * k) / 2 - left,
          oy: y + lift,
        };
        y += lift + maxY * k + 175;
        return at;
      });
      const H = mode === "wide" ? 840 : y - 60;
      svg.setAttribute("viewBox", `0 0 ${W} ${H}`);

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
      placed.forEach(({ g, k, ox, oy, lift = 0 }) => {
        const pos = g.stars.map(([, x, sy]) => [ox + x * k, oy + sy * k]);
        const grp = el("g", { class: "sky-group", "data-group": g.id, style: `--c:${g.c}` }, svg);

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
        const nameX = Math.min(...xs) - 10,
          nameY = Math.min(...ys) - (mode === "wide" ? 40 : 52 + lift);
        const tx = mode === "wide" ? nameX : W / 2;
        const anchor = mode === "wide" ? "start" : "middle";
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
          const star = el(
            "g",
            {
              class: "sky-star",
              style: `${d};--tw:${(2.6 + (n % 5) * 0.7).toFixed(1)}s;--twd:${(-n * 0.9).toFixed(1)}s;--gl:${(5 + ((n * 7) % 6)).toFixed(1)}s;--gld:${(-n * 1.3).toFixed(1)}s`,
            },
            grp,
          );
          const size = major ? 9 : 6;
          el("circle", { class: "sky-hit-star", cx: x, cy: sy, r: 22 }, star);
          el("circle", { class: "sky-burst", cx: x, cy: sy, r: size * 1.6 }, star);
          const body = el("g", { class: "sky-body" }, star);
          el("circle", { class: "sky-halo", cx: x, cy: sy, r: size * 2.1 }, body);
          el(
            "path",
            {
              class: "sky-glint",
              d: `M${x - size * 3.2} ${sy}H${x + size * 3.2}M${x} ${sy - size * 3.2}V${sy + size * 3.2}`,
            },
            body,
          );
          el("path", { class: "sky-spark", d: spark(x, sy, size) }, body);
          el("circle", { class: "sky-core", cx: x, cy: sy, r: major ? 2 : 1.4 }, body);
          const off = size + 9;
          const [lx, ly, an] = {
            n: [x, sy - off, "middle"],
            s: [x, sy + off + 10, "middle"],
            e: [x + off, sy + 5, "start"],
            w: [x - off, sy + 5, "end"],
          }[side];
          el("text", { class: "sky-label", x: lx, y: ly, "text-anchor": an }, star).textContent =
            label;
        });

        if (mode === "wide") {
          listen(grp, "pointerenter", () => setActive(grp, true));
          listen(grp, "pointerleave", () => setActive(grp, false));
        } else {
          seen.observe(grp);
        }
        delay += 520;
      });

      if (lit) {
        chartRoot.classList.add("is-instant", "is-lit");
        frame(() => frame(() => chartRoot.classList.remove("is-instant")));
      }
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
  $$("[data-reveal], [data-stratum], [data-core]").forEach((el) => revealIO.observe(el));

  /* --- Navigazione attiva + altimetro -------------------------------- */
  const sections = $$("[data-section]");
  const navLinks = $$("[data-nav]");
  const rail = page.querySelector(".gauge-rail");
  const gauge = page.querySelector("[data-gauge]");
  let gaugeTimer;

  const underground = $("[data-underground]");

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
    navLinks.forEach((a, j) => {
      if (j === i) a.setAttribute("aria-current", "true");
      else a.removeAttribute("aria-current");
    });
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
  let headerAnchor = scroller.scrollTop;
  let headerVisible = true;
  let storyStarting = false;
  let storyStartTimer;
  const updateHeader = (y) => {
    if (!header) return;
    const delta = y - headerAnchor;
    if (storyStarting) {
      headerVisible = false;
      headerAnchor = y;
    } else if (y <= 8) {
      headerVisible = true;
      headerAnchor = y;
    } else if (Math.abs(delta) >= 8) {
      headerVisible = delta < 0;
      headerAnchor = y;
    }
    const interacting =
      header.matches(":focus-within") || !!header.querySelector('[aria-expanded="true"]');
    const visible = !storyStarting && (headerVisible || interacting);
    page.classList.toggle("is-framed", visible);
    header.classList.add("is-floating");
    header.classList.toggle("is-visible", visible);
    header.inert = !visible;
  };

  const scrollCue = $(".scroll-cue");
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
  listen(hero, "pointermove", (e) => {
    if (reduceMQ.matches || !finePointer.matches) return;
    cancelAnimationFrame(pointerRAF);
    pointerRAF = frame(() => {
      const r = hero.getBoundingClientRect();
      hero.style.setProperty("--px", ((e.clientX - r.left) / r.width - 0.5).toFixed(3));
      hero.style.setProperty("--py", ((e.clientY - r.top) / r.height - 0.5).toFixed(3));
    });
  });
  listen(hero, "pointerleave", () => {
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

  /* --- Strati: bagliore che segue il puntatore ----------------------- */
  $$("[data-stratum]").forEach((el) => {
    listen(el, "pointermove", (e) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty("--hx", (((e.clientX - r.left) / r.width) * 100).toFixed(1) + "%");
    });
  });

  /* --- Traversata orizzontale ---------------------------------------- */
  const journey = $("[data-journey]");
  const stage = $("[data-journey-stage]");
  const track = $("[data-track]");
  const stops = $$(".stop", track);
  const parLayers = $$("[data-par]", journey);
  const tw = $("[data-tw]");
  const twBounce = $("[data-tw-bounce]");
  const twRoll = $("[data-tw-roll]");
  const hudLabel = $("[data-hud-label]");
  const hud = $(".journey-hud");
  const desert = $("[data-desert]");
  let jTop = 0,
    jDist = 0,
    trackDistance = 0,
    exitDistance = 0,
    slack = 0,
    horizontal = false,
    stopCenters = [];

  const setupJourney = () => {
    const wasHorizontal = horizontal;
    horizontal = horizontalMQ.matches;
    journey.classList.toggle("is-horizontal", horizontal);
    // Resizing the frame must never clear a live scene between animation frames.
    if (wasHorizontal && !horizontal) {
      track.style.transform = "";
      parLayers.forEach((layer) => {
        layer.style.transform = "";
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
  const updateJourney = () => {
    if (!horizontal) return;
    const distance = scroller.scrollTop - jTop;
    const p = trackDistance ? clamp(distance / trackDistance) : 0;
    const exit = exitDistance ? clamp((distance - trackDistance) / exitDistance) : 0;
    const x = p * trackDistance;
    track.style.transform = "translate3d(" + (-x).toFixed(1) + "px,0,0)";
    // La scena è più larga del viewport: ogni piano scorre entro il margine disponibile.
    parLayers.forEach((l) => {
      l.style.transform =
        "translate3d(" + ((0.5 - p) * 2 * slack * parseFloat(l.dataset.par)).toFixed(1) + "px,0,0)";
    });
    // Il cespuglio rotola davvero: rotazione = distanza / circonferenza.
    const size = tw.offsetWidth || 60;
    const exitX = exit * (scroller.clientWidth * 0.5 + size);
    const travelled = x * 0.44 + exitX;
    twRoll.style.transform = "rotate(" + ((travelled / (Math.PI * size)) * 360).toFixed(1) + "deg)";
    const lift = Math.abs(Math.sin(travelled / 90));
    twBounce.style.transform = "translate3d(0," + (-lift * size * 0.45).toFixed(1) + "px,0)";
    tw.style.setProperty("--lift", lift.toFixed(3));
    tw.style.transform =
      "translate3d(" +
      (slack + scroller.clientWidth * (0.12 + p * 0.62) + exitX).toFixed(1) +
      "px,0,0)";

    let best = -1,
      bestD = Infinity;
    stopCenters.forEach((c, i) => {
      const screenX = c - x;
      const d = Math.abs(screenX - scroller.clientWidth * 0.5);
      if (d < bestD) {
        bestD = d;
        best = i;
      }
      const year = stops[i].querySelector(".stop-year");
      if (year)
        year.style.setProperty(
          "--yx",
          ((screenX - scroller.clientWidth * 0.5) * -0.08).toFixed(1) + "px",
        );
    });
    if (p < 0.04) best = -1;
    if (best !== currentStop) {
      currentStop = best;
      stops.forEach((s, i) => s.classList.toggle("is-current", i === best));
      const y = best >= 0 ? stops[best].dataset.year : "";
      const n = stops.length - 1;
      hudLabel.textContent =
        best < 0
          ? "Partenza"
          : best >= n
            ? "Prossima tappa"
            : "Tappa " + (best + 1) + " / " + n + " · " + y;
    }
    hud.style.setProperty("--jp", p.toFixed(3));
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
  const depthHud = $("[data-depth-hud]");
  const depthValue = $("[data-depth-value]");
  const depthLayer = $("[data-depth-layer]");
  const depthLayers = [
    ["#reperti", "Crosta"],
    ["#sedimenti", "Mantello"],
    ["#nucleo", "Nucleo"],
  ].map(([sel, name]) => [$(sel), name]);
  let ticking = false;

  const onFrame = () => {
    ticking = false;
    const y = scroller.scrollTop;
    updateHeader(y);
    const vh = scroller.clientHeight;
    const max = Math.max(1, scroller.scrollHeight - vh);
    const docP = clamp(y / max);
    page.style.setProperty("--doc-p", docP.toFixed(4));

    const uTop = localRect(underground).top;

    // Sezione attiva: l'ultima il cui inizio ha superato metà viewport.
    let idx = 0;
    sectionTops.forEach((t, i) => {
      if (y + vh * 0.45 >= t) idx = i;
    });
    setActive(idx);

    if (reduceMQ.matches) {
      words.forEach((w) => w.classList.add("lit"));
      depthHud.classList.remove("is-on");
      return;
    }

    // Hero che si allontana
    const hp = clamp(y / (hero.offsetHeight || vh));
    hero.style.setProperty("--hp", hp.toFixed(4));

    // Manifesto illuminato parola per parola
    const mr = localRect(manifesto);
    const mp = clamp((vh * 0.85 - mr.top) / (mr.height + vh * 0.35));
    const lit = Math.round(mp * words.length);
    words.forEach((w, i) => w.classList.toggle("lit", i < lit));

    updateJourney();

    // Reperti fossili con parallasse leggera
    if (uTop < vh && uTop > -underground.offsetHeight) {
      fossils.forEach((f) => {
        const r = localRect(f);
        const off = (r.top + r.height / 2 - vh / 2) * -parseFloat(f.dataset.fy);
        f.style.setProperty("--fy", off.toFixed(1) + "px");
      });
    }

    // Il nucleo si scalda avvicinandosi
    const cr = localRect(coreZone);
    coreZone.style.setProperty("--heat", clamp((vh - cr.top) / (cr.height + vh * 0.2)).toFixed(3));

    // Profondimetro: da 0 a 6.371 km lungo tutto il sottosuolo.
    const uh = underground.offsetHeight;
    const inside = uTop < vh * 0.55 && uTop + uh > vh * 0.45;
    depthHud.classList.toggle("is-on", inside);
    if (inside) {
      const dp = clamp((vh * 0.5 - uTop) / Math.max(1, uh - vh * 0.5));
      depthValue.textContent = `−${String(Math.round(6371 * dp ** 1.7)).replace(/\B(?=(\d{3})+(?!\d))/g, ".")} km`;
      const layer = depthLayers.findLast(([el]) => localRect(el).top < vh * 0.5);
      depthLayer.textContent = layer ? layer[1] : "Crosta";
    }
  };

  const requestFrame = () => {
    if (!ticking) {
      ticking = true;
      frame(onFrame);
    }
  };

  let resizeTimer;
  const layout = () => {
    const previous = { start: jTop, distance: jDist };
    const previousScroll = scroller.scrollTop;
    const wasHorizontal = horizontal;
    root.style.setProperty("--home-viewport-height", `${scroller.clientHeight}px`);
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
  listen(window, "resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(layout, 120);
  });
  listen(horizontalMQ, "change", layout);
  listen(reduceMQ, "change", () => {
    layout();
    if (reduceMQ.matches) {
      hero.style.setProperty("--hp", 0);
      $$("[data-reveal], [data-stratum], [data-core]").forEach((el) => el.classList.add("is-in"));
    }
  });
  listen(page, "transitionend", (event) => {
    if (event.target === page && event.propertyName === "padding-left") layout();
  });
  observeResize(layout).observe(scroller);
  listen(window, "load", layout);
  if (document.fonts && document.fonts.ready)
    document.fonts.ready.then(() => {
      if (!disposed) layout();
    });
  layout();

  return () => {
    disposed = true;
    disposers.forEach((fn) => fn());
    pendingFrames.forEach(cancelAnimationFrame);
    clearTimeout(resizeTimer);
    clearTimeout(gaugeTimer);
    clearTimeout(storyStartTimer);
    root.classList.remove("js");
    page.classList.remove("is-framed", "has-home-motion");
    page.style.removeProperty("--doc-p");
    page.style.removeProperty("--home-header-height");
    if (header) {
      header.classList.remove("is-floating", "is-visible");
      header.inert = false;
      header.style.removeProperty("--hero-header-y");
    }
    manifesto.replaceChildren(...originalManifesto);
    ticks.forEach((t) => t.remove());
  };
}
