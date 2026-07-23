import type { CSSProperties, HTMLAttributes } from "react";
import { Fragment } from "react";

import { SkillGlyph } from "@/components/tech-icon";
import type { Skill } from "@/lib/projects";

type DesertSceneProps = HTMLAttributes<HTMLDivElement> & {
  skills?: Skill[];
};

const TUMBLEWEEDS = [
  {
    afterDune: "/home/dune-5.svg",
    bottom: "43%",
    size: "clamp(22px, 3.2vw, 50px)",
    hop: "clamp(9px, 1.38vw, 22px)",
    iconSize: 18,
    travel: 27,
    bounce: 2.1,
    delay: 0,
  },
  {
    afterDune: "/home/dune-4.svg",
    bottom: "35%",
    size: "clamp(28px, 4.2vw, 64px)",
    hop: "clamp(12px, 1.81vw, 28px)",
    iconSize: 23,
    travel: 22,
    bounce: 1.8,
    delay: 6,
  },
  {
    afterDune: "/home/dune-3.svg",
    bottom: "27%",
    size: "clamp(32px, 5.2vw, 78px)",
    hop: "clamp(14px, 2.24vw, 34px)",
    iconSize: 28,
    travel: 18,
    bounce: 1.5,
    delay: 12,
  },
];

// Ordine dal piano piu lontano a quello piu vicino.
const MOUNTAIN_LAYERS = [
  { src: "/home/mountain-3.svg", bottom: "57%" },
  { src: "/home/mountain-2.svg", bottom: "52%" },
  { src: "/home/mountain-1.svg", bottom: "46%" },
];

// I file con il numero piu alto formano i piani lontani; i numeri bassi
// avanzano verso l'osservatore e coprono progressivamente la base del livello precedente.
const DUNE_LAYERS = [
  { src: "/home/dune-7.svg", bottom: "8%" },
  { src: "/home/dune-6.svg", bottom: "6.65%" },
  { src: "/home/dune-5.svg", bottom: "5.3%" },
  { src: "/home/dune-4.svg", bottom: "4%" },
  { src: "/home/dune-3.svg", bottom: "2.65%" },
  { src: "/home/dune-2.svg", bottom: "0%" },
  { src: "/home/dune-1.svg", bottom: "0%" },
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
      <div className="relative aspect-[1280/841] w-full overflow-hidden">
        {MOUNTAIN_LAYERS.map((layer, index) => (
          <img
            key={layer.src}
            src={layer.src}
            alt=""
            className="mountain-enter absolute left-0 h-auto w-full"
            style={{ bottom: layer.bottom, animationDelay: `${150 + index * 130}ms` }}
          />
        ))}

        <div
          className="absolute inset-x-0 bottom-0 h-[64.8%] w-full"
          style={{
            background:
              "linear-gradient(to bottom, #92abd0 0%, #4c5677 21.9%, #37425c 35.6%, #0a1622 68.5%, #0a1622 100%)",
          }}
        />

        {DUNE_LAYERS.map((layer) => (
          <Fragment key={layer.src}>
            <img
              src={layer.src}
              alt=""
              className="absolute -left-2 h-auto w-[calc(100%+1rem)] max-w-none"
              style={{ bottom: layer.bottom }}
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
  const { bottom, size, hop, iconSize, travel, bounce, delay } = config;
  const travelStyle = {
    bottom,
    left: `calc(-1 * ${size})`,
    width: size,
    height: size,
    animationDuration: `${travel}s`,
    animationDelay: `${delay}s`,
    "--tumbleweed-distance": `calc(100vw + ${size} + ${size})`,
    "--tumbleweed-hop": hop,
  } as CSSProperties;

  return (
    <div className="tumbleweed-travel" style={travelStyle}>
      <div
        className="tumbleweed-bounce"
        style={{
          animationDuration: `${bounce}s`,
          animationDelay: `${delay}s`,
        }}
      >
        <div className="relative size-full">
          <div
            className="tumbleweed-roll absolute inset-0"
            style={{
              animationDuration: `${Math.max(0.9, travel / 14)}s`,
            }}
          >
            <img src="/home/illustrations/tumbleweed.svg" alt="" className="h-full w-full" />
          </div>
          {skill && (
            <div className="absolute inset-0 flex size-full items-center justify-center text-amber-50/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.55)]">
              <SkillGlyph skill={skill} size={iconSize} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
