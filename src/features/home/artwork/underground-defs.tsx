/* Landing/showcase artwork: scoped visual styles are permitted by AGENTS.md. */
/* oxlint-disable shadcn/no-unknown-classes, shadcn/no-raw-colors, shadcn/no-inline-styles */
export function UndergroundDefs() {
  return (
    <svg className="u-defs" width="0" height="0" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="u-rim" x1="0" y1="0" x2=".35" y2="1">
          <stop stopColor="#fff" stopOpacity=".8" />
          <stop offset="1" stopColor="#999" stopOpacity=".09" />
        </linearGradient>
        <linearGradient id="u-rim-warm" x1="0" y1="0" x2=".2" y2="1">
          <stop stopColor="#fff4d8" stopOpacity=".85" />
          <stop offset="1" stopColor="#ffb070" stopOpacity=".08" />
        </linearGradient>
        <linearGradient id="u-bone" x1=".1" y1="0" x2=".9" y2="1">
          <stop offset=".08" stopColor="#fff4e6" stopOpacity=".78" />
          <stop offset=".5" stopColor="#d9b597" stopOpacity=".58" />
          <stop offset=".92" stopColor="#fff1e2" stopOpacity=".42" />
        </linearGradient>
        <linearGradient id="u-stone" x1=".1" y1="0" x2=".8" y2="1">
          <stop offset=".05" stopColor="#f1d5c6" stopOpacity=".5" />
          <stop offset=".55" stopColor="#a77a6b" stopOpacity=".38" />
          <stop offset="1" stopColor="#f6e2d6" stopOpacity=".22" />
        </linearGradient>
        <linearGradient id="u-root" x1="0" y1="0" x2=".3" y2="1">
          <stop stopColor="#f6dcc0" stopOpacity=".8" />
          <stop offset="1" stopColor="#b98564" stopOpacity=".45" />
        </linearGradient>
        <linearGradient id="u-amethyst" x1=".1" y1="0" x2=".9" y2="1">
          <stop offset=".06" stopColor="#fbf1ff" stopOpacity=".8" />
          <stop offset=".5" stopColor="#c39be0" stopOpacity=".55" />
          <stop offset=".94" stopColor="#fff" stopOpacity=".4" />
        </linearGradient>
        <linearGradient id="u-facet" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#8f62b3" stopOpacity=".55" />
          <stop offset="1" stopColor="#4c2a6c" stopOpacity=".35" />
        </linearGradient>
        <radialGradient id="u-hollow" cx=".5" cy=".58" r=".55">
          <stop stopColor="#120604" stopOpacity=".7" />
          <stop offset=".75" stopColor="#2a120d" stopOpacity=".35" />
          <stop offset="1" stopColor="#2a120d" stopOpacity=".1" />
        </radialGradient>
        <radialGradient id="u-glow" cx=".5" cy=".5" r=".5">
          <stop stopColor="#fff" stopOpacity=".55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <filter
          id="u-lift"
          x="-25%"
          y="-25%"
          width="150%"
          height="160%"
          colorInterpolationFilters="sRGB"
        >
          <feDropShadow dy="4" stdDeviation="2" floodColor="#160603" floodOpacity=".3" result="a" />
          <feDropShadow in="a" dy="12" stdDeviation="12" floodColor="#160603" floodOpacity=".28" />
        </filter>
        <filter
          id="u-lift-soft"
          x="-25%"
          y="-25%"
          width="150%"
          height="160%"
          colorInterpolationFilters="sRGB"
        >
          <feDropShadow
            dy="3"
            stdDeviation="1.5"
            floodColor="#160603"
            floodOpacity=".28"
            result="a"
          />
          <feDropShadow in="a" dy="8" stdDeviation="7" floodColor="#160603" floodOpacity=".22" />
        </filter>
        <filter
          id="u-heat"
          x="-10%"
          y="-10%"
          width="120%"
          height="120%"
          colorInterpolationFilters="sRGB"
        >
          <feDropShadow dy="-6" stdDeviation="10" floodColor="#ffb35c" floodOpacity=".45" />
        </filter>
      </defs>
    </svg>
  );
}
