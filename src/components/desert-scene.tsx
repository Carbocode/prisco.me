import type { CSSProperties, HTMLAttributes } from "react";
import { Fragment, useEffect, useRef, useState } from "react";

import { SkillGlyph } from "@/components/tech-icon";
import type { Skill } from "@/lib/projects";

type DesertSceneProps = HTMLAttributes<HTMLDivElement> & {
  skills?: Skill[];
};

const TUMBLEWEEDS = [
  {
    afterDune: "/home/dune-5.svg",
    bottom: "43%",
    sizeRatio: 0.032,
    minSize: 22,
    maxSize: 50,
    travel: 27,
    bounce: 2.1,
    delay: 0,
  },
  {
    afterDune: "/home/dune-4.svg",
    bottom: "35%",
    sizeRatio: 0.042,
    minSize: 28,
    maxSize: 64,
    travel: 22,
    bounce: 1.8,
    delay: 6,
  },
  {
    afterDune: "/home/dune-3.svg",
    bottom: "27%",
    sizeRatio: 0.052,
    minSize: 32,
    maxSize: 78,
    travel: 18,
    bounce: 1.5,
    delay: 12,
  },
];

const NOMINAL_TRAVEL_PX = 1.32 * 1440;

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

function travelSpeed(travelSeconds: number) {
  return NOMINAL_TRAVEL_PX / travelSeconds;
}

function rollPeriod(size: number, speed: number) {
  return (Math.PI * size) / speed;
}

export default function DesertScene({ className, skills = [], ...props }: DesertSceneProps) {
  const classes = ["pointer-events-none relative w-full select-none", className]
    .filter(Boolean)
    .join(" ");
  const pool = skills.filter((skill) => skill.icon);
  const sceneRef = useRef<HTMLDivElement>(null);
  const [sceneWidth, setSceneWidth] = useState(1440);
  const picks = TUMBLEWEEDS.map((_, index) =>
    pool.length > 0 ? pool[(index * 5 + 2) % pool.length] : undefined,
  );

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return undefined;

    const updateWidth = () => setSceneWidth(scene.clientWidth);
    const resizeObserver = new ResizeObserver(updateWidth);
    updateWidth();
    resizeObserver.observe(scene);

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div ref={sceneRef} className={classes} aria-hidden="true" {...props}>
      <div className="relative aspect-[1280/841] w-full overflow-hidden">
        {MOUNTAIN_LAYERS.map((layer) => (
          <img
            key={layer.src}
            src={layer.src}
            alt=""
            className="absolute left-0 h-auto w-full"
            style={{ bottom: layer.bottom }}
          />
        ))}

        <img src="/home/lake.svg" alt="" className="absolute inset-x-0 bottom-0 h-[64.8%] w-full" />

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
                <RollingTumbleweed
                  key={`${layer.src}-${index}`}
                  config={tw}
                  sceneWidth={sceneWidth}
                  skill={picks[index]}
                />
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
  sceneWidth,
  skill,
}: {
  config: (typeof TUMBLEWEEDS)[number];
  sceneWidth: number;
  skill?: Skill;
}) {
  const { bottom, sizeRatio, minSize, maxSize, travel, bounce, delay } = config;
  const size = Math.round(Math.min(maxSize, Math.max(minSize, sceneWidth * sizeRatio)));
  const speed = travelSpeed(travel);
  const travelDuration = (sceneWidth + size * 2) / speed;
  const roll = rollPeriod(size, speed);
  const travelStyle = {
    bottom,
    left: -size,
    width: size,
    height: size,
    animationDuration: `${travelDuration}s`,
    animationDelay: `${delay}s`,
    "--tumbleweed-distance": `${sceneWidth + size * 2}px`,
    "--tumbleweed-hop": `${Math.round(size * 0.43)}px`,
  } as CSSProperties;

  return (
    <div className="tumbleweed-travel" style={travelStyle}>
      <div
        className="tumbleweed-bounce"
        style={{ animationDuration: `${bounce}s`, animationDelay: `${delay}s` }}
      >
        <div className="relative" style={{ width: size, height: size }}>
          <div
            className="tumbleweed-roll absolute inset-0"
            style={{ animationDuration: `${roll}s` }}
          >
            <img src="/home/illustrations/tumbleweed.svg" alt="" className="h-full w-full" />
          </div>
          {skill && (
            <div
              className="absolute inset-0 flex items-center justify-center text-amber-50/90 drop-shadow-[0_1px_3px_rgba(0,0,0,0.55)]"
              style={{ width: size, height: size }}
            >
              <SkillGlyph skill={skill} size={Math.round(size * 0.42)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
