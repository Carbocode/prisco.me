import { clamp } from "./math.js";

export function createJourneyMotion(container, scroller, { listen, reduceMQ, localRect }) {
  const $ = (selector) => container.querySelector(selector);
  const $$ = (selector, element = container) => Array.from(element.querySelectorAll(selector));
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

  const configure = ({ width: viewportWidth, height: viewportHeight }) => {
    currentStop = -2;
    sceneWidth = viewportWidth;
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
    trackDistance = Math.max(0, track.scrollWidth - viewportWidth);
    // The exit continues during the natural scroll into the next section.
    // It adds no distance to the pinned horizontal journey.
    exitDistance = Math.max(160, Math.min(360, viewportHeight * 0.45));
    jDist = trackDistance;
    tumbleweedSize = tw.offsetWidth || 60;
    jTop = localRect(journey).top + scroller.scrollTop;
    slack = Math.max(0, (desert.offsetWidth - viewportWidth) / 2);
    stopCenters = stops.map((s) => s.offsetLeft + s.offsetWidth / 2);
    const height = viewportHeight + jDist + "px";
    if (journey.style.height !== height) journey.style.height = height;
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

  return {
    configure,
    update: updateJourney,
    get position() {
      return { start: jTop, distance: jDist, horizontal };
    },
  };
}
