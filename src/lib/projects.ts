export type ProjectCategory = "web" | "mobile" | "backend" | "experiment";

/** Dati visivi e identificativi di una competenza tecnica. */
export type Skill = {
  id: string;
  name: string;
  /** Slug del logo (Simple Icons / logo dedicato). Null → fallback per nome. */
  icon: string | null;
  /** Classi Tailwind del colore del chip. Null → fallback per nome. */
  color: string | null;
  /** Testo di fallback quando manca il logo. */
  mark: string | null;
  /** Icona Fluent Color di fallback. */
  fluentIcon: string | null;
  marqueeRow: number | null;
};

export type ProjectSection = {
  title: string;
  body: string;
  bullets?: string[];
  image?: string;
};

export type Project = {
  slug: string;
  title: string;
  summary: string;
  description: string;
  role: string;
  company: string;
  categories: ProjectCategory[];
  skills: Skill[];
  period?: string;
  image?: string;
  demoUrl?: string;
  repositoryUrl?: string;
  featured?: boolean;
  sections: ProjectSection[];
};

/** Progetto collegato mostrato all'interno di un'esperienza. */
export type LinkedProject = Pick<Project, "slug" | "title" | "summary">;

export type Experience = {
  id: string;
  kind: "work" | "education";
  org: string;
  orgDetail?: string;
  title: string;
  detail?: string;
  period: string;
  narrative: string;
  /** Mese di inizio "YYYY-MM". */
  startDate: string;
  /** Mese di fine "YYYY-MM". */
  endDate: string;
  current?: boolean;
  skills: Skill[];
  projects: LinkedProject[];
};

export const projectCategories: Array<{ value: "all" | ProjectCategory; label: string }> = [
  { value: "all", label: "Tutti" },
  { value: "web", label: "Web" },
  { value: "mobile", label: "Mobile" },
  { value: "backend", label: "Backend" },
  { value: "experiment", label: "Esperimenti" },
];

export const categoryLabels: Record<ProjectCategory, string> = {
  web: "Web",
  mobile: "Mobile",
  backend: "Backend",
  experiment: "Esperimento",
};

/** Elenco unico delle aziende presenti nei progetti, in ordine alfabetico. */
export function getCompanies(projects: Project[]) {
  return Array.from(new Set(projects.map((project) => project.company))).sort((a, b) =>
    a.localeCompare(b),
  );
}

/** Elenco unico delle tecnologie presenti nei progetti, in ordine alfabetico. */
export function getTechnologies(projects: Project[]) {
  return Array.from(new Set(projects.flatMap((project) => project.skills.map((s) => s.name)))).sort(
    (a, b) => a.localeCompare(b),
  );
}

export function getProjectBySlug(projects: Project[], slug: string) {
  return projects.find((project) => project.slug === slug);
}
