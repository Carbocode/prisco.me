import type { HTMLAttributes } from "react";
import { Fragment } from "react";

import { SkillGlyph } from "@/components/tech-icon";
import type { Skill } from "@/lib/projects";

type DesertSceneProps = HTMLAttributes<HTMLDivElement> & {
  skills?: Skill[];
};

const TUMBLEWEEDS = [
  {
    afterDune: "/home/dune-5.webp",
    bottom: "43%",
    size: "clamp(22px, 3.2vw, 50px)",
    hop: "clamp(9px, 1.38vw, 22px)",
    travel: 27,
    bounce: 2.1,
    delay: 0,
  },
  {
    afterDune: "/home/dune-4.webp",
    bottom: "35%",
    size: "clamp(28px, 4.2vw, 64px)",
    hop: "clamp(12px, 1.81vw, 28px)",
    travel: 22,
    bounce: 1.8,
    delay: 6,
  },
  {
    afterDune: "/home/dune-3.webp",
    bottom: "27%",
    size: "clamp(32px, 5.2vw, 78px)",
    hop: "clamp(14px, 2.24vw, 34px)",
    travel: 18,
    bounce: 1.5,
    delay: 12,
  },
];

// Ordine dal piano piu lontano a quello piu vicino.
const MOUNTAIN_LAYERS = [
  { src: "/home/mountain-3.webp", bottom: "57%" },
  { src: "/home/mountain-2.webp", bottom: "52%" },
  { src: "/home/mountain-1.webp", bottom: "46%" },
];

// I file con il numero piu alto formano i piani lontani; i numeri bassi
// avanzano verso l'osservatore e coprono progressivamente la base del livello precedente.
const DUNE_LAYERS = [
  { src: "/home/dune-7.webp", bottom: "8%" },
  { src: "/home/dune-6.webp", bottom: "6.65%" },
  { src: "/home/dune-5.webp", bottom: "5.3%" },
  { src: "/home/dune-4.webp", bottom: "4%" },
  { src: "/home/dune-3.webp", bottom: "2.65%" },
  { src: "/home/dune-2.webp", bottom: "0%" },
  { src: "/home/dune-1.webp", bottom: "0%" },
];

export default function DesertScene({ className, skills = [], ...props }: DesertSceneProps) {
  const classes = ["pointer-events-none relative w-full select-none", className]
    .filter(Boolean)
    .join(" ");
  const pool = skills.filter((skill) => skill.icon);
  const picks = TUMBLEWEEDS.map((_, index) =>
    pool.length > 0 ? pool[(index * 5 + 2) % pool.length] : undefined,
  );

  return (
    <div className={classes} aria-hidden="true" {...props}>
      <div className="relative aspect-desert w-full overflow-hidden">
        {MOUNTAIN_LAYERS.map((layer, index) => (
          <img
            key={layer.src}
            src={layer.src}
            alt=""
            className="mountain-enter absolute left-0 h-auto w-full bottom-(--dynamic-bottom) dynamic-animation-delay"
            style={{
              "--dynamic-bottom":
                typeof layer.bottom === "number" ? layer.bottom + "px" : layer.bottom,
              "--dynamic-animation-delay": `${150 + index * 130}ms`,
            }}
          />
        ))}

        <div className="absolute inset-x-0 bottom-0 h-81/125 w-full bg-desert-horizon" />

        {DUNE_LAYERS.map((layer) => (
          <Fragment key={layer.src}>
            <img
              src={layer.src}
              alt=""
              className="absolute -left-2 h-auto w-(--layout-w-dune-bleed) max-w-none bottom-(--dynamic-bottom)"
              style={{
                "--dynamic-bottom":
                  typeof layer.bottom === "number" ? layer.bottom + "px" : layer.bottom,
              }}
            />
            {TUMBLEWEEDS.map((tw, index) =>
              tw.afterDune === layer.src ? (
                <RollingTumbleweed key={`${layer.src}-${index}`} config={tw} skill={picks[index]} />
              ) : null,
            )}
          </Fragment>
        ))}
      </div>
    </div>
  );
}

function RollingTumbleweed({
  config,
  skill,
}: {
  config: (typeof TUMBLEWEEDS)[number];
  skill?: Skill;
}) {
  const { bottom, size, hop, travel, bounce, delay } = config;
  const travelStyle = {
    "--tumbleweed-bottom": bottom,
    "--tumbleweed-size": size,
    "--tumbleweed-travel-duration": `${travel}s`,
    "--tumbleweed-bounce-duration": `${bounce}s`,
    "--tumbleweed-roll-duration": `${Math.max(0.9, travel / 14)}s`,
    "--tumbleweed-delay": `${delay}s`,
    "--tumbleweed-distance": `calc(100vw + ${size} + ${size})`,
    "--tumbleweed-hop": hop,
  };

  return (
    <div className="tumbleweed-travel" style={travelStyle}>
      <div className="tumbleweed-bounce size-full">
        <div className="relative size-full">
          <div className="tumbleweed-roll absolute inset-0">
            <img
              src="/home/illustrations/tumbleweed.webp"
              alt=""
              width="100"
              height="100"
              className="block h-auto w-full"
            />
          </div>
          {skill && (
            <div className="absolute inset-0 flex size-full items-center justify-center text-warm-ink/90 drop-shadow-glyph">
              <div className="size-42/100">
                <SkillGlyph skill={skill} size="100%" />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
