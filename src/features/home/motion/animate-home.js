import { createAnimationScope } from "./animation-scope.js";
import { createJourneyMotion } from "./journey-motion.js";
import { remapJourneyScroll } from "./journey-position";
import { createManifestoWords } from "./manifesto-words.js";
import { clamp } from "./math.js";
import { attachPointerEffects } from "./pointer-effects.js";
import { createSkyChart } from "./sky-chart.js";

export function animateHome(container) {
  const page = container.closest("[data-home-page]");
  const scroller = container.closest("[data-home-scroll]");
  let scrollOrigin = scroller.getBoundingClientRect().top;
  const initialChartWidth = container.querySelector("[data-sky-chart]").clientWidth;
  const header = page.querySelector("[data-home-header]");
  const initialHeaderHeight = header?.offsetHeight ?? 0;
  page.classList.add("has-home-motion");
  const localRect = (element) => {
    const rect = element.getBoundingClientRect();
    return {
      top: rect.top - scrollOrigin,
      bottom: rect.bottom - scrollOrigin,
      height: rect.height,
    };
  };
  const scope = createAnimationScope(scroller);
  const { frame, listen, observeIntersection, observeResize } = scope;

  const $ = (s, el = container) => el.querySelector(s);
  const $$ = (s, el = container) => Array.from(el.querySelectorAll(s));
  const reduceMQ = matchMedia("(prefers-reduced-motion: reduce)");
  const finePointer = matchMedia("(pointer: fine)");
  const root = container;
  root.classList.add("js");

  /* --- Manifesto: parola per parola ---------------------------------- */
  const manifesto = $("[data-manifesto]");
  const { words, restore: restoreManifesto } = createManifestoWords(manifesto);

  /* --- Carta del cielo: costellazioni generate da dati -------------- */
  const skyChart = createSkyChart(container.querySelector("[data-sky-chart]"), {
    frame,
    listen,
    observeIntersection,
    observeResize,
    reduceMQ,
    initialChartWidth,
  });

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
    return max;
  };

  let activeIndex = -1;
  const setActive = (i) => {
    if (i === activeIndex) return;
    activeIndex = i;
    ticks.forEach((t, j) => t.classList.toggle("is-active", j === i));
  };

  /* --- Hero: parallasse col puntatore -------------------------------- */
  const hero = $("[data-hero]");
  if (header) {
    setScrollValue(page, "--home-header-height", `${initialHeaderHeight}px`);
    observeResize((entries) => {
      const height = entries[0].borderBoxSize?.[0]?.blockSize ?? entries[0].contentRect.height;
      setScrollValue(page, "--home-header-height", `${height}px`);
    }).observe(header);
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

  attachPointerEffects(container, hero, { listen, frame, reduceMQ, finePointer });

  /* --- Traversata orizzontale ---------------------------------------- */
  const journeyMotion = createJourneyMotion(container, scroller, { listen, reduceMQ, localRect });
  const { update: updateJourney } = journeyMotion;

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
  function setScrollValue(element, property, value) {
    // Reading inline style does not measure layout; no parallel cache is needed.
    if (element.style.getPropertyValue(property) !== value)
      element.style.setProperty(property, value);
  }
  const onFrame = () => {
    ticking = false;
    // Layout measurements are cached: scrolling must not flush animated SVG layout.
    const y = scroller.scrollTop;
    const vh = viewportHeight;
    const max = scrollRange;
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
  let viewportWidth = 0;
  let viewportHeight = 0;
  let scrollRange = 1;
  let layoutPending = false;
  const requestLayout = () => {
    if (layoutPending) return;
    layoutPending = true;
    frame(() => {
      layoutPending = false;
      layout();
    });
  };
  const layout = () => {
    viewportWidth = scroller.clientWidth;
    viewportHeight = scroller.clientHeight;
    viewportSize = `${viewportWidth}x${viewportHeight}`;
    // Classic scrollbars stay outside the overlay frame, header and footer peek.
    setScrollValue(site, "--home-scrollbar", `${scroller.offsetWidth - viewportWidth}px`);
    scrollOrigin = scroller.getBoundingClientRect().top;
    const previous = journeyMotion.position;
    const previousScroll = scroller.scrollTop;
    const wasHorizontal = previous.horizontal;
    setScrollValue(root, "--home-viewport-height", `${viewportHeight}px`);
    setScrollValue(root, "--home-viewport-width", `${viewportWidth}px`);
    journeyMotion.configure({ width: viewportWidth, height: viewportHeight });
    if (wasHorizontal && journeyMotion.position.horizontal) {
      const adjusted = remapJourneyScroll(previousScroll, previous, journeyMotion.position);
      if (Math.abs(adjusted - scroller.scrollTop) > 0.5) {
        scroller.scrollTop = adjusted;
        // Layout compensation is not a user change of scroll direction.
        headerAnchor = scroller.scrollTop;
      }
    }
    scrollRange = measureSections();
    measureGeometry();
    // Paint markers only after every scene measurement is complete.
    ticks.forEach((tick, index) => {
      tick.style.top = clamp(sectionTops[index] / scrollRange) * 100 + "%";
    });
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
  observeResize((entries) => {
    const { width, height } = entries[0].contentRect;
    if (`${width}x${height}` !== viewportSize) requestLayout();
  }).observe(scroller);
  // Image decoding and responsive content can change height after initial layout.
  observeResize((entries) => {
    const height = entries[0].borderBoxSize?.[0]?.blockSize ?? entries[0].contentRect.height;
    if (Math.abs(height - contentHeight) > 0.5) requestLayout();
  }).observe(root);
  listen(window, "load", requestLayout);
  if (document.fonts?.status !== "loaded" && document.fonts?.ready)
    void document.fonts.ready.then(() => {
      if (!scope.disposed) requestLayout();
    });
  layout();

  return () => {
    scope.dispose();
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
    restoreManifesto();
    ticks.forEach((t) => t.remove());
  };
}
