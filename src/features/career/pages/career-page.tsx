import { useSuspenseQuery } from "@tanstack/react-query";

import { PageShell } from "@/components/layout/page-shell";
import { CareerGalaxy } from "@/features/career/artwork/career-galaxy";
import { GanttJourney } from "@/features/career/components/gantt-journey";
import { getPortfolioQueryOptions } from "@/features/portfolio/server/portfolio.functions";
import { useSiteLocale } from "@/features/site/client/site-location";
import * as m from "@/paraglide/messages.js";

export function CareerPage() {
  const locale = useSiteLocale();
  const { data } = useSuspenseQuery(getPortfolioQueryOptions());

  return (
    <PageShell hero={false} title={m.nav_career({}, { locale })}>
      <section className="relative isolate bg-subsoil px-4 pb-10 pt-24 sm:px-6 lg:px-10">
        <CareerGalaxy />
        <div className="relative z-10">
          <GanttJourney experiences={data.experiences} />
        </div>
      </section>
    </PageShell>
  );
}
