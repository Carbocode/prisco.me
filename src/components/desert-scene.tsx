import type { HTMLAttributes } from "react";
import { useEffect, useRef, useState } from "react";

import { SkillGlyph } from "@/components/tech-icon";
import type { Skill } from "@/lib/projects";

type DesertSceneProps = HTMLAttributes<HTMLDivElement> & {
  skills?: Skill[];
};

const TUMBLEWEEDS = [
  { size: 74, bottom: 7, travel: 19, bounce: 1.6, delay: 0, reverse: false },
  { size: 58, bottom: 20, travel: 24, bounce: 2.0, delay: -6, reverse: true },
  { size: 66, bottom: 12, travel: 16, bounce: 1.4, delay: -11, reverse: false },
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
  const [picks, setPicks] = useState<(Skill | undefined)[]>(() => TUMBLEWEEDS.map(() => undefined));
  const sceneRef = useRef<HTMLDivElement>(null);
  const [sceneWidth, setSceneWidth] = useState(1440);

  useEffect(() => {
    if (pool.length === 0) return;
    setPicks(TUMBLEWEEDS.map(() => pool[Math.floor(Math.random() * pool.length)]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skills]);

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
          <img
            key={layer.src}
            src={layer.src}
            alt=""
            className="absolute -left-2 h-auto w-[calc(100%+1rem)] max-w-none"
            style={{ bottom: layer.bottom }}
          />
        ))}
      </div>

      {TUMBLEWEEDS.map((tw, index) => (
        <RollingTumbleweed key={index} config={tw} sceneWidth={sceneWidth} skill={picks[index]} />
      ))}
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
  const { size, bottom, travel, bounce, delay, reverse } = config;
  const speed = travelSpeed(travel);
  const travelDuration = (sceneWidth * 1.32) / speed;
  const roll = rollPeriod(size, speed);

  return (
    <div
      className={reverse ? "tumbleweed-travel-reverse" : "tumbleweed-travel"}
      style={{
        bottom: `${bottom}%`,
        width: size,
        height: size,
        animationDuration: `${travelDuration}s`,
        animationDelay: `${delay}s`,
      }}
    >
      <div
        className="tumbleweed-bounce"
        style={{ animationDuration: `${bounce}s`, animationDelay: `${delay}s` }}
      >
        <div className="relative" style={{ width: size, height: size }}>
          <div
            className={`absolute inset-0 ${reverse ? "tumbleweed-roll-reverse" : "tumbleweed-roll"}`}
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
