import { ActionLink, PageShell, Section } from "@/components/layout/page-shell";
import { localizedPath } from "@/config/site";
import { ShowcaseCard } from "@/features/content/components/showcase-card";
import { TechIcon } from "@/features/portfolio/components/tech-icon";
import { useSiteLocale } from "@/features/site/client/site-location";
import { technologyGroups } from "@/features/site/data/technology-groups";
import * as m from "@/paraglide/messages.js";

export function SiteInformationPage() {
  const locale = useSiteLocale();
  return (
    <PageShell
      title={
        <>
          {m.about_a_portfolio_built_like_a_product({}, { locale })}{" "}
          <span className="text-link">{m.about_for_you({}, { locale })}</span>
        </>
      }
      titleClassName="tracking-heading"
      description={m.about_vincenzo_prisco_designs_develops_and_maintains({}, { locale })}
    >
      <Section>
        <div className="grid gap-5 md:grid-cols-2">
          {technologyGroups(locale).map((group) => (
            <TechnologyGroupCard key={group.title} group={group} />
          ))}
        </div>
      </Section>

      <Section className="pt-16 sm:pt-20">
        <div className="grid gap-6 lg:grid-cols-3">
          <DetailCard
            number="01"
            title={m.about_accessibility({}, { locale })}
            body={m.about_contrast_visible_focus_semantic_structure_and({}, { locale })}
          />
          <DetailCard
            number="02"
            title="Performance"
            body={m.about_pages_load_their_content_quickly_with({}, { locale })}
          />
          <DetailCard
            number="03"
            title={m.about_evolution({}, { locale })}
            body={m.about_project_content_is_typed_and_the({}, { locale })}
          />
        </div>
      </Section>

      <section className="bg-gradient-to-r from-glow/10 to-secondary-glow-strong/10 px-6 py-20 text-center">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-5">
          <h2 className="display-font text-3xl font-semibold sm:text-4xl">
            {m.about_found_something_you_want_to_explore({}, { locale })}{" "}
          </h2>
          <p className="leading-7 text-ink-body">
            {m.about_get_in_touch_or_browse_the({}, { locale })}{" "}
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <ActionLink href={localizedPath("/contact", locale)}>
              {m.about_let_s_talk({}, { locale })}
            </ActionLink>
            <a
              className="inline-flex h-10 items-center justify-center rounded-md border border-white/20 bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-link"
              href="https://github.com/Carbocode/prisco-website"
              target="_blank"
              rel="noreferrer"
            >
              Repository{" "}
              <span className="ml-2" aria-hidden="true">
                ↗
              </span>
            </a>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function TechnologyGroupCard({ group }: { group: ReturnType<typeof technologyGroups>[number] }) {
  return (
    <ShowcaseCard>
      <h2 className="display-font text-2xl leading-tight font-semibold text-white">
        {group.title}
      </h2>
      <p className="mt-3 text-sm leading-7 text-ink-body">{group.description}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        {group.technologies.map((item) => (
          <span
            key={item.name}
            className="rounded-xl border border-white/10 bg-canvas/40 px-3 py-2"
          >
            <TechIcon skill={item} compact />
          </span>
        ))}
      </div>
    </ShowcaseCard>
  );
}

function DetailCard({ number, title, body }: { number: string; title: string; body: string }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/3 p-6">
      <span className="text-xs font-semibold tracking-caption-wide text-link">{number}</span>
      <h3 className="display-font mt-5 text-xl font-semibold text-white">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-ink-subtle">{body}</p>
    </article>
  );
}
