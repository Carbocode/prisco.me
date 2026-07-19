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

function travelSpeed(travelSeconds: number) {
  return NOMINAL_TRAVEL_PX / travelSeconds;
}

function rollPeriod(size: number, speed: number) {
  return (Math.PI * size) / speed;
}

export default function DesertScene({ className, skills = [], ...props }: DesertSceneProps) {
  const classes = ["pointer-events-none relative w-full select-none overflow-hidden", className]
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
      <img
        src="/home/illustrations/desert-landscape.svg"
        alt=""
        className="block h-[340px] w-full object-cover object-bottom sm:h-[440px] lg:h-[520px]"
      />

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
