import { createFileRoute, Link } from "@tanstack/react-router";

import { ActionLink, PageShell, Section } from "@/components/page-shell";
import { SkillChip } from "@/components/tech-icon";
import { getProjectBySlug } from "@/lib/projects";

export const Route = createFileRoute("/progetti/$slug")({
  head: ({ params }) => {
    const project = getProjectBySlug(params.slug);
    const title = project
      ? `${project.title} | Vincenzo Prisco`
      : "Progetto non trovato | Vincenzo Prisco";
    const description = project?.summary ?? "Il progetto richiesto non è disponibile.";

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "article" },
      ],
      links: [{ rel: "canonical", href: `https://prisco.me/progetti/${params.slug}` }],
    };
  },
  component: ProjectDetailPage,
});

function ProjectDetailPage() {
  const { slug } = Route.useParams();
  const project = getProjectBySlug(slug);

  if (!project) {
    return (
      <PageShell eyebrow="Progetto non trovato" title="Questo progetto non esiste.">
        <Section>
          <Link to="/progetti" className="text-sky-300 hover:text-sky-200">
            Torna al portfolio →
          </Link>
        </Section>
      </PageShell>
    );
  }

  return (
    <PageShell
      eyebrow={`${project.role}${project.period ? ` · ${project.period}` : ""}`}
      title={project.title}
      description={project.description}
      actions={<ActionLink href="/contatti">Parliamo di un progetto</ActionLink>}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: project.title,
            description: project.description,
            url: `https://prisco.me/progetti/${project.slug}`,
            author: { "@type": "Person", name: "Vincenzo Prisco" },
            keywords: project.technologies.join(", "),
          }),
        }}
      />
      <Section>
        <div className="grid gap-3 border-b border-white/10 pb-8 sm:grid-cols-2 lg:grid-cols-3">
          {project.technologies.map((technology) => (
            <SkillChip key={technology} name={technology} />
          ))}
        </div>
        <aside className="card-sheen relative mb-12 max-w-4xl overflow-hidden rounded-2xl border border-sky-300/20 bg-gradient-to-br from-sky-300/10 via-violet-300/[0.06] to-transparent p-6">
          <div className="site-grid absolute inset-0 opacity-35" />
          <div className="relative grid gap-6 sm:grid-cols-[0.7fr_1.3fr] sm:items-end">
            <div>
              <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-sky-200">
                Product map
              </span>
              <p className="display-font mt-2 text-6xl font-semibold tracking-[-0.1em] text-white/90">
                0{project.technologies.length}
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-slate-950/35 p-3 text-xs">
                <span className="block text-slate-500">Ruolo</span>
                <span className="mt-1 block text-slate-200">{project.role}</span>
              </div>
              <div className="rounded-xl border border-white/10 bg-slate-950/35 p-3 text-xs">
                <span className="block text-slate-500">Periodo</span>
                <span className="mt-1 block text-slate-200">{project.period ?? "In corso"}</span>
              </div>
            </div>
          </div>
        </aside>
        <div className="mt-12 max-w-4xl space-y-12">
          {project.sections.map((section) => (
            <section key={section.title}>
              <h2 className="display-font text-2xl font-semibold sm:text-3xl">{section.title}</h2>
              <p className="mt-4 text-lg leading-8 text-slate-300">{section.body}</p>
              {section.bullets && (
                <ul className="mt-5 space-y-3 text-slate-300">
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>✦ {bullet}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
      </Section>
      <section className="border-t border-white/10 bg-white/[0.03] px-6 py-16">
        <div className="mx-auto flex max-w-4xl flex-col gap-5">
          <h2 className="display-font text-3xl font-semibold">Costruiamo qualcosa insieme?</h2>
          <p className="leading-7 text-slate-300">
            Raccontami il contesto: possiamo partire dal problema prima ancora che dalla tecnologia.
          </p>
          <ActionLink href="/contatti">Scrivimi</ActionLink>
        </div>
      </section>
    </PageShell>
  );
}
