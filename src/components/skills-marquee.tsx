import { SkillChip } from "@/components/tech-icon";

type SkillMarqueeRow = {
  items: string[];
  direction?: "left" | "right";
  duration?: number;
};

const defaultRows: SkillMarqueeRow[] = [
  {
    items: [
      ".NET / C#",
      "Java",
      "Python",
      "PHP",
      "Symfony",
      "MySQL",
      "PostgreSQL",
      "MongoDB",
      "Elasticsearch",
    ],
    duration: 34,
  },
  {
    items: ["Angular", "React", "Next.js", "Astro", "TanStack", "TypeScript", "Tailwind CSS"],
    direction: "right",
    duration: 38,
  },
  {
    items: ["Swift / SwiftUI", "React Native", "MVVM", "Ionic", "Capacitor", "Mapbox", "Stripe"],
    duration: 31,
  },
  {
    items: [
      "Cloudflare",
      "PostHog",
      "Strapi",
      "Sentry",
      "Figma",
      "UML",
      "Software Architecture",
      "Product Design",
      "Storybook",
      "Codex",
      "Claude Code",
    ],
    direction: "right",
    duration: 42,
  },
];

export function SkillsMarquee({ rows = defaultRows }: { rows?: SkillMarqueeRow[] }) {
  return (
    <div
      className="skills-marquee relative mt-8 min-w-0 max-w-full space-y-3 overflow-hidden"
      aria-label="Competenze tecniche"
    >
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="overflow-hidden">
          <div
            className={[
              "skills-marquee-track",
              row.direction === "right" ? "skills-marquee-track-reverse" : "",
            ]
              .filter(Boolean)
              .join(" ")}
            style={{ animationDuration: (row.duration ?? 34) + "s" }}
          >
            <SkillGroup items={row.items} />
            <SkillGroup items={row.items} ariaHidden />
          </div>
        </div>
      ))}
    </div>
  );
}

function SkillGroup({ items, ariaHidden = false }: { items: string[]; ariaHidden?: boolean }) {
  return (
    <div className="skills-marquee-group" aria-hidden={ariaHidden}>
      {items.map((skill, index) => (
        <SkillChip key={skill + "-" + index} name={skill} />
      ))}
    </div>
  );
}
