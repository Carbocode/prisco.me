import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import type { Project } from "../domain/portfolio";
import { SkillGlyph } from "./tech-icon";

export function ProjectCard({ project, compact = false }: { project: Project; compact?: boolean }) {
  const primarySkill = project.skills[0];

  return (
    <Card className="h-full">
      <div data-slot="card-media" className="relative aspect-video w-full shrink-0">
        {project.image ? (
          <img
            src={project.image}
            alt={`Anteprima di ${project.title}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className="relative h-full w-full overflow-hidden bg-gradient-to-br from-glow/15 via-secondary-glow-strong/10 to-canvas"
            aria-hidden="true"
          >
            <div className="site-grid absolute inset-0 opacity-50" />
            <div className="absolute -right-10 -top-12 size-40 rounded-full border border-link/20" />
            <div className="absolute -bottom-16 -left-12 size-44 rounded-full border border-secondary-glow/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="display-font text-4xl font-semibold tracking-monogram text-ink-inverse/80">
                VP
              </span>
            </div>
          </div>
        )}
        {primarySkill && (
          <Badge className="absolute bottom-3 left-3" aria-hidden="true">
            <SkillGlyph skill={primarySkill} size={34} />
          </Badge>
        )}
      </div>
      <CardHeader>
        <CardTitle>{project.title}</CardTitle>
        <CardDescription>
          {project.company}
          {project.period ? ` · ${project.period}` : ""}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col">
        <div className="flex flex-wrap gap-2">
          {project.skills.slice(0, 5).map((skill) => (
            <Badge key={skill.id}>
              <SkillGlyph skill={skill} size={12} />
              <span>{skill.name}</span>
            </Badge>
          ))}
        </div>
        <CardDescription>{compact ? project.summary : project.description}</CardDescription>
      </CardContent>
      <CardFooter className="mt-auto">
        <a
          className={buttonVariants({ variant: "outline" })}
          href={`/progetti/${project.slug}`}
          aria-label={`Scopri ${project.title}`}
        >
          Scopri il progetto
        </a>
      </CardFooter>
    </Card>
  );
}
