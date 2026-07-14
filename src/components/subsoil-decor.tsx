import type { SVGProps } from "react";

/*
 * Scattered geological "finds", one motif per stratum of the earth
 * cross-section — the underground counterpart to the sky's stars and the
 * dunes' tumbleweeds. Purely decorative: rendered in a non-interactive layer
 * behind the page content and positioned by scroll-percentage so each motif
 * lands in the matching band of `.earth-cross-section`.
 */
export default function SubsoilDecor() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {/* topsoil — loose pebbles and a dangling root */}
      <Root className="absolute left-[7%] top-[3%] w-10 opacity-50" />
      <Pebbles className="absolute left-[4%] top-[10%] w-24 opacity-70 sm:w-28" />
      <Pebbles className="absolute right-[5%] top-[16%] w-20 opacity-60" />

      {/* sediment / rock — a boulder and a buried ammonite */}
      <Boulder className="absolute left-[8%] top-[27%] hidden w-24 opacity-70 sm:block" />
      <Ammonite className="absolute right-[6%] top-[31%] w-20 opacity-55 sm:w-24" />
      <Bone className="absolute left-[10%] top-[40%] hidden w-24 opacity-45 lg:block" />

      {/* deep rock — mineral crystals */}
      <Crystals className="absolute right-[7%] top-[46%] w-24 opacity-60 sm:w-28" />
      <Boulder className="absolute right-[10%] top-[57%] hidden w-20 opacity-60 sm:block" />
      <Crystals className="absolute left-[6%] top-[60%] w-20 opacity-55" />

      {/* warm rock approaching the mantle — ore veins */}
      <OreVein className="absolute left-[9%] top-[70%] hidden w-24 opacity-70 sm:block" />
      <OreVein className="absolute right-[8%] top-[74%] w-20 opacity-65" />

      {/* mantle — glowing magma cracks near the core */}
      <MagmaCrack className="absolute right-[11%] top-[84%] w-16 opacity-80" />
      <MagmaCrack className="absolute left-[10%] top-[89%] w-20 opacity-80" />
    </div>
  );
}

function Pebbles(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 52" fill="none" {...props}>
      <ellipse cx="24" cy="35" rx="22" ry="14" fill="#5a4636" />
      <ellipse cx="20" cy="30" rx="12" ry="6" fill="#6d553f" opacity="0.5" />
      <ellipse cx="60" cy="39" rx="16" ry="10" fill="#4c3a2c" />
      <ellipse cx="82" cy="30" rx="12" ry="8" fill="#634c39" />
      <ellipse cx="79" cy="26" rx="5" ry="3" fill="#7c6047" opacity="0.6" />
    </svg>
  );
}

function Boulder(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 80" fill="none" {...props}>
      <polygon points="8,74 1,38 22,10 58,4 82,30 76,68 44,78" fill="#3f3021" />
      <polygon points="22,10 58,4 82,30 60,26 36,20" fill="#4d3b28" opacity="0.7" />
      <path
        d="M30 30 L52 44 M40 54 L64 46"
        stroke="#2a2016"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Ammonite(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 90 90" fill="none" {...props}>
      <g
        stroke="#c8b79b"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      >
        <path d="M60 22 A28 28 0 1 1 26 46 A17 17 0 1 1 56 40 A8 8 0 0 1 50 52" />
        <path d="M45 10 L47 26" opacity="0.6" />
        <path d="M16 40 L30 44" opacity="0.6" />
        <path d="M40 78 L44 62" opacity="0.6" />
        <path d="M74 52 L60 50" opacity="0.6" />
      </g>
    </svg>
  );
}

function Bone(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 60" fill="#c8b79b" {...props}>
      <g transform="rotate(-18 50 30)">
        <rect x="24" y="24" width="52" height="11" rx="5.5" />
        <circle cx="24" cy="22" r="8" />
        <circle cx="24" cy="36" r="8" />
        <circle cx="76" cy="22" r="8" />
        <circle cx="76" cy="36" r="8" />
      </g>
    </svg>
  );
}

function Crystals(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 100 70" fill="none" {...props}>
      <polygon points="30,66 18,30 40,30" fill="#6f96a6" opacity="0.55" />
      <polygon points="30,66 40,30 50,42" fill="#4f7686" opacity="0.6" />
      <polygon points="58,66 48,20 66,26" fill="#8aa6b3" opacity="0.5" />
      <polygon points="58,66 66,26 74,40" fill="#5c8091" opacity="0.6" />
      <polygon points="44,66 40,44 54,48" fill="#9db9c4" opacity="0.45" />
    </svg>
  );
}

function OreVein(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 90 100" fill="none" {...props}>
      <path
        d="M14 4 Q40 26 26 48 T44 96"
        stroke="#8a6a3a"
        strokeWidth="4"
        fill="none"
        strokeLinecap="round"
        opacity="0.7"
      />
      <circle cx="28" cy="30" r="5" fill="#c08a44" />
      <circle cx="24" cy="54" r="4" fill="#a9773a" />
      <circle cx="38" cy="74" r="5.5" fill="#c9974d" />
      <circle cx="33" cy="16" r="3.5" fill="#b6863f" />
    </svg>
  );
}

function MagmaCrack(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 60 100"
      fill="none"
      style={{ filter: "drop-shadow(0 0 7px rgba(255,120,32,0.8))" }}
      {...props}
    >
      <path
        d="M30 2 L38 26 L24 44 L40 62 L28 86 L34 98"
        stroke="#ffa145"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M30 2 L38 26 L24 44 L40 62 L28 86 L34 98"
        stroke="#fff1cc"
        strokeWidth="1"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.8"
      />
    </svg>
  );
}

function Root(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 40 90" fill="none" {...props}>
      <g stroke="#4a3626" strokeWidth="2.6" fill="none" strokeLinecap="round">
        <path d="M20 0 C 22 24 14 34 18 54 C 21 70 16 80 20 90" />
        <path d="M18 30 C 10 34 8 42 4 46" />
        <path d="M19 48 C 27 52 30 60 34 64" />
        <path d="M18 66 C 12 70 11 76 8 80" />
      </g>
    </svg>
  );
}
