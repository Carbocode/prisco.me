import Star from "@/components/artwork/star";

type CareerStarConfig = {
  top: number;
  left?: number;
  right?: number;
  size: "sm" | "md" | "lg" | "xl";
  opacity: number;
};

const careerStars: CareerStarConfig[] = [
  { top: 2, left: 5, size: "sm", opacity: 0.45 },
  { top: 7, right: 8, size: "md", opacity: 0.55 },
  { top: 13, left: 38, size: "lg", opacity: 0.4 },
  { top: 20, right: 18, size: "sm", opacity: 0.5 },
  { top: 27, left: 8, size: "xl", opacity: 0.32 },
  { top: 35, right: 5, size: "md", opacity: 0.5 },
  { top: 43, left: 24, size: "sm", opacity: 0.4 },
  { top: 51, right: 27, size: "lg", opacity: 0.42 },
  { top: 59, left: 4, size: "md", opacity: 0.5 },
  { top: 67, right: 9, size: "xl", opacity: 0.3 },
  { top: 75, left: 42, size: "md", opacity: 0.48 },
  { top: 83, right: 34, size: "sm", opacity: 0.5 },
  { top: 91, left: 13, size: "lg", opacity: 0.38 },
  { top: 97, right: 6, size: "md", opacity: 0.45 },
];

export function CareerGalaxy() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-career-galaxy" />
      <div
        className="absolute inset-0 opacity-60 dynamic-background-image dynamic-background-position dynamic-background-repeat dynamic-background-size"
        style={{
          "--dynamic-background-image": "url(/home/small-stars.webp)",
          "--dynamic-background-position": "center top",
          "--dynamic-background-repeat": "repeat",
          "--dynamic-background-size": "1154px 427px",
        }}
      />
      <div className="absolute left-8/100 top-30/100 h-72 w-72 rounded-full bg-secondary-aura/6 blur-3xl" />
      <div className="absolute right-4/100 top-62/100 h-96 w-96 rounded-full bg-highlight-aura/5 blur-3xl" />
      <GalaxyRibbon top="9%" rotation={-4} opacity={0.75} />
      <GalaxyRibbon top="36%" rotation={3} opacity={0.6} />
      <GalaxyRibbon top="63%" rotation={-2} opacity={0.7} />
      <GalaxyRibbon top="88%" rotation={4} opacity={0.55} />
      {careerStars.map((star, index) => (
        <Star
          key={`${star.top}-${index}`}
          alt=""
          size={star.size}
          className="absolute drop-shadow-star dynamic-top dynamic-left dynamic-right dynamic-opacity"
          style={{
            "--dynamic-top": `${star.top}%`,
            "--dynamic-left":
              typeof (star.left == null ? undefined : `${star.left}%`) === "number"
                ? (star.left == null ? undefined : `${star.left}%`) + "px"
                : star.left == null
                  ? undefined
                  : `${star.left}%`,
            "--dynamic-right":
              typeof (star.right == null ? undefined : `${star.right}%`) === "number"
                ? (star.right == null ? undefined : `${star.right}%`) + "px"
                : star.right == null
                  ? undefined
                  : `${star.right}%`,
            "--dynamic-opacity": star.opacity,
          }}
        />
      ))}
    </div>
  );
}

type GalaxyRibbonProps = {
  top: string;
  rotation: number;
  opacity: number;
};

function GalaxyRibbon({ top, rotation, opacity }: GalaxyRibbonProps) {
  const mainWave = "M-120 166 C190 18 410 246 735 112 C1020 -6 1245 224 1560 58";
  const companionWave = "M-100 202 C215 74 430 278 760 150 C1050 38 1260 260 1540 106";

  return (
    <svg
      viewBox="0 0 1440 280"
      preserveAspectRatio="none"
      className="absolute left-1/2 h-72 w-145/100 dynamic-top dynamic-opacity dynamic-transform"
      style={{
        "--dynamic-top": typeof top === "number" ? top + "px" : top,
        "--dynamic-opacity": opacity,
        "--dynamic-transform": `translateX(-50%) rotate(${rotation}deg)`,
      }}
    >
      <path
        d={mainWave}
        fill="none"
        stroke="var(--color-ink-inverse)"
        strokeLinecap="round"
        strokeWidth="76"
        opacity="0.045"
        className="blur-ribbon"
      />
      <path
        d={mainWave}
        fill="none"
        stroke="var(--color-ink-inverse)"
        strokeLinecap="round"
        strokeWidth="18"
        opacity="0.08"
        className="blur-ribbon-soft"
      />
      <path
        d={mainWave}
        fill="none"
        stroke="var(--color-ink-inverse)"
        strokeLinecap="round"
        strokeWidth="1.4"
        opacity="0.36"
      />
      <path
        d={companionWave}
        fill="none"
        stroke="var(--color-ink-inverse)"
        strokeLinecap="round"
        strokeWidth="1"
        opacity="0.2"
      />
    </svg>
  );
}
