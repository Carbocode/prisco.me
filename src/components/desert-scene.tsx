import type { HTMLAttributes } from "react";
import { useEffect, useState } from "react";

import { SkillGlyph } from "@/components/tech-icon";
import type { Skill } from "@/lib/projects";

type DesertSceneProps = HTMLAttributes<HTMLDivElement> & {
  /** Skills from the DB; a random one rides inside each tumbleweed. */
  skills?: Skill[];
};

/*
 * Fixed per-tumbleweed choreography. Timings are staggered so the three never
 * cross the dunes in lockstep; `reverse` sends one rolling the other way. The
 * roll period is derived (not authored) so one rotation always equals one
 * circumference of ground — the ball rolls instead of skidding.
 */
const TUMBLEWEEDS = [
  { size: 74, bottom: 7, travel: 19, bounce: 1.6, delay: 0, reverse: false },
  { size: 58, bottom: 20, travel: 24, bounce: 2.0, delay: -6, reverse: true },
  { size: 66, bottom: 12, travel: 16, bounce: 1.4, delay: -11, reverse: false },
];

// Nominal travel distance (the -16vw → 116vw sweep at a typical viewport) used
// to sync rotation to horizontal motion.
const NOMINAL_TRAVEL_PX = 1.32 * 1440;

function rollPeriod(size: number, travelSeconds: number) {
  const circumference = Math.PI * size;
  const rotations = NOMINAL_TRAVEL_PX / circumference;
  return travelSeconds / rotations;
}

/*
 * The horizon band that sits directly under the hero sky. Its top edge
 * matches the sky's ending colour (#5c6e86) and its bottom edge fades into
 * slate-950, so it stitches the celestial hero to the dark ground where the
 * page content lives. Layered dunes (the star of the scene), a couple of
 * saguaro cacti and drifting tumbleweeds fill the space in between.
 *
 * Purely decorative: aria-hidden and non-interactive.
 */
export default function DesertScene({ className, skills = [], ...props }: DesertSceneProps) {
  const classes = ["pointer-events-none relative w-full select-none overflow-hidden", className]
    .filter(Boolean)
    .join(" ");

  // Pool of skills that carry a real logo (the DB `icon` slug). Start empty on
  // the server and fill on mount so the random picks never trip up hydration.
  const pool = skills.filter((skill) => skill.icon);
  const [picks, setPicks] = useState<(Skill | undefined)[]>(() => TUMBLEWEEDS.map(() => undefined));

  useEffect(() => {
    if (pool.length === 0) return;
    setPicks(TUMBLEWEEDS.map(() => pool[Math.floor(Math.random() * pool.length)]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [skills]);

  return (
    <div className={classes} aria-hidden="true" {...props}>
      <svg
        viewBox="0 0 1440 520"
        preserveAspectRatio="xMidYMax slice"
        className="block h-[340px] w-full sm:h-[440px] lg:h-[520px]"
        role="presentation"
      >
        <defs>
          <linearGradient id="desert-sky" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5c6e86" />
            <stop offset="30%" stopColor="#4a4f61" />
            <stop offset="55%" stopColor="#3b3327" />
            <stop offset="100%" stopColor="#201710" />
          </linearGradient>
        </defs>

        {/* sky-to-ground backdrop */}
        <rect x="0" y="0" width="1440" height="520" fill="url(#desert-sky)" />

        {/* lingering stars in the strip of sky above the dunes — reuse the
            hero's own star assets so they read as the same sky */}
        <image
          href="/home/small-stars.svg"
          x="0"
          y="-40"
          width="1440"
          height="230"
          preserveAspectRatio="xMidYMin slice"
          opacity="0.55"
        />
        <image href="/home/star.svg" x="234" y="18" width="34" height="34" opacity="0.75" />
        <image href="/home/star.svg" x="996" y="8" width="30" height="30" opacity="0.7" />
        <image href="/home/star.svg" x="744" y="74" width="22" height="22" opacity="0.55" />

        {/* far dune — cool, hazy, closest to the sky colour */}
        <path
          d="M0 214 C 240 156 470 246 720 196 C 968 148 1200 240 1440 184 L1440 520 L0 520 Z"
          fill="#5b6274"
        />
        {/* mid dune — warm muted sand */}
        <path
          d="M0 304 C 300 252 520 344 782 292 C 1024 246 1244 332 1440 288 L1440 520 L0 520 Z"
          fill="#7d6f5c"
        />
        {/* near dune — deeper, warmer */}
        <path
          d="M0 404 C 262 362 502 434 764 396 C 1014 360 1232 424 1440 392 L1440 520 L0 520 Z"
          fill="#4f4234"
        />
        {/* front ground — the topsoil; blends into the earth cross-section */}
        <path
          d="M0 462 C 300 442 620 476 900 456 C 1152 438 1300 466 1440 452 L1440 520 L0 520 Z"
          fill="#201710"
        />

        {/* saguaro cacti standing on the dunes */}
        <Saguaro x={210} y={318} scale={0.9} fill="#2b2318" />
        <Saguaro x={1170} y={300} scale={1.15} fill="#241d14" />
        <Saguaro x={640} y={410} scale={0.7} fill="#1c160f" />
      </svg>

      {/* tumbleweeds rolling and hopping across the dunes */}
      {TUMBLEWEEDS.map((tw, index) => (
        <RollingTumbleweed key={index} config={tw} skill={picks[index]} />
      ))}
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
  const { size, bottom, travel, bounce, delay, reverse } = config;
  const roll = rollPeriod(size, travel);

  return (
    <div
      className={reverse ? "tumbleweed-travel-reverse" : "tumbleweed-travel"}
      style={{
        bottom: `${bottom}%`,
        width: size,
        height: size,
        animationDuration: `${travel}s`,
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
            <TumbleweedRing />
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

/*
 * A tangled ball of twigs: an outer rim with an inner ring and a scribble of
 * crossing branches. Scales to its container so one drawing serves every size.
 */
function TumbleweedRing() {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      stroke="#8a6b4a"
      strokeWidth="2"
      strokeLinecap="round"
      className="h-full w-full opacity-90"
    >
      <circle cx="50" cy="50" r="46" />
      <circle cx="50" cy="50" r="31" opacity="0.7" />
      <path d="M12 44 C 40 30 62 34 88 46" opacity="0.8" />
      <path d="M16 60 C 42 74 64 70 86 58" opacity="0.8" />
      <path d="M40 10 C 34 38 38 62 46 90" opacity="0.75" />
      <path d="M62 12 C 70 40 66 64 58 88" opacity="0.75" />
      <line x1="20" y1="30" x2="80" y2="72" opacity="0.5" />
      <line x1="26" y1="74" x2="78" y2="26" opacity="0.5" />
    </svg>
  );
}

/*
 * A classic saguaro silhouette assembled from rounded bars: a central trunk
 * with one arm rising on each side. Drawn from its base (x, y = ground point).
 */
function Saguaro({ x, y, scale, fill }: { x: number; y: number; scale: number; fill: string }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} fill={fill}>
      {/* trunk */}
      <rect x="-9" y="-118" width="18" height="118" rx="9" />
      {/* left arm */}
      <rect x="-30" y="-74" width="13" height="42" rx="6.5" />
      <rect x="-30" y="-62" width="24" height="13" rx="6.5" />
      {/* right arm */}
      <rect x="17" y="-88" width="13" height="52" rx="6.5" />
      <rect x="7" y="-74" width="23" height="13" rx="6.5" />
    </g>
  );
}
