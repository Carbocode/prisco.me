import { getSkillColor, SkillGlyph } from "@/components/tech-icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Project } from "@/lib/projects";
import { cn } from "@/lib/utils";

export function ProjectCard({ project, compact = false }: { project: Project; compact?: boolean }) {
  const primarySkill = project.skills[0];

  return (
    <Card className="h-full pt-0">
      <div className="relative aspect-video w-full shrink-0">
        {project.image ? (
          <img
            src={project.image}
            alt={`Anteprima di ${project.title}`}
            className="h-full w-full object-cover"
          />
        ) : (
          <div
            className="relative h-full w-full overflow-hidden bg-gradient-to-br from-sky-400/15 via-violet-400/10 to-slate-950"
            aria-hidden="true"
          >
            <div className="site-grid absolute inset-0 opacity-50" />
            <div className="absolute -right-10 -top-12 size-40 rounded-full border border-sky-300/20" />
            <div className="absolute -bottom-16 -left-12 size-44 rounded-full border border-violet-300/20" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="display-font text-4xl font-semibold tracking-[-0.08em] text-slate-100/80">
                VP
              </span>
            </div>
          </div>
        )}
        {primarySkill && (
          <Badge
            className={cn(
              getSkillColor(primarySkill),
              "absolute bottom-3 left-3 h-11 w-11 p-0 shadow-md backdrop-blur-md",
            )}
            aria-hidden="true"
          >
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
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap gap-2">
          {project.skills.slice(0, 5).map((skill) => (
            <Badge key={skill.id} className={getSkillColor(skill)}>
              <SkillGlyph skill={skill} size={12} />
              <span>{skill.name}</span>
            </Badge>
          ))}
        </div>
        <CardDescription>{compact ? project.summary : project.description}</CardDescription>
      </CardContent>
      <CardFooter className="mt-auto">
        <Button
          variant="outline"
          render={<a href={`/progetti/${project.slug}`} aria-label={`Scopri ${project.title}`} />}
        >
          Scopri il progetto
        </Button>
      </CardFooter>
    </Card>
  );
}
