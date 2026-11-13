import { createServerFn } from "@tanstack/react-start";

import { loadPortfolio } from "@/features/portfolio/server/portfolio.repository";

export const getPortfolio = createServerFn({ method: "GET" }).handler(async () => {
  console.info("Inizio recupero portfolio dal database", { action: "get_portfolio_start" });
  try {
    const data = await loadPortfolio();
    console.info("Portfolio recuperato con successo", {
      action: "get_portfolio_success",
      skills: data.skills.length,
      projects: data.projects.length,
      experiences: data.experiences.length,
    });
    return data;
  } catch (error) {
    console.error("Errore durante il recupero del portfolio", {
      action: "get_portfolio_error",
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });
    throw error;
  }
});

export const getPortfolioQueryOptions = () => ({
  queryKey: ["portfolio"],
  queryFn: () => getPortfolio(),
});
