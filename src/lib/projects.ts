export type ProjectCategory = "web" | "mobile" | "backend" | "experiment";

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
  category: ProjectCategory;
  technologies: string[];
  period?: string;
  image?: string;
  demoUrl?: string;
  repositoryUrl?: string;
  featured?: boolean;
  sections: ProjectSection[];
};

export const projectCategories: Array<{ value: "all" | ProjectCategory; label: string }> = [
  { value: "all", label: "Tutti" },
  { value: "web", label: "Web" },
  { value: "mobile", label: "Mobile" },
  { value: "backend", label: "Backend" },
  { value: "experiment", label: "Esperimenti" },
];

export const projects: Project[] = [
  {
    slug: "myvet",
    title: "MyVet User e MyVet Business",
    summary: "Un ecosistema digitale per la salute e la gestione degli animali domestici.",
    description:
      "Dall'idea iniziale a un prodotto concreto: due applicazioni con una codebase ibrida per proprietari e professionisti della pet care.",
    role: "Software Developer / Software Engineer",
    category: "web",
    technologies: ["Ionic", "Capacitor", "Angular", "Mapbox", "Cloudflare", "PostHog"],
    period: "Aprile 2023 - Settembre 2025",
    featured: true,
    sections: [
      {
        title: "Il problema",
        body: "MyVet nasce per rendere piu semplice la relazione tra proprietari di animali e professionisti della pet care, raccogliendo in un unico posto ricerca, prenotazioni e informazioni sanitarie.",
      },
      {
        title: "Due prodotti, un ecosistema",
        body: "MyVet User aiuta i proprietari a trovare professionisti, prenotare appuntamenti e conservare la storia clinica dell'animale. MyVet Business offre ai professionisti un gestionale aperto per clienti, appuntamenti e strumenti personalizzati.",
        bullets: [
          "Gestione di clienti registrati e non registrati",
          "Calendario degli appuntamenti",
          "Notifiche automatiche tramite WhatsApp",
          "Strumenti dedicati a veterinari, toelettatori ed educatori cinofili",
          "Ricerca dei professionisti e prenotazione degli appuntamenti",
          "Cartella digitale con terapie, vaccini, referti e visite",
        ],
      },
      {
        title: "Il mio contributo",
        body: "Ho partecipato all'evoluzione del prodotto dall'ideazione alla pubblicazione, lavorando su sviluppo web e mobile, architettura, problem solving e qualita del prodotto.",
      },
      {
        title: "Cosa mi ha insegnato",
        body: "Lavorare su un prodotto reale mi ha insegnato a tenere insieme esigenze degli utenti, vincoli tecnici e sostenibilita delle decisioni nel tempo.",
      },
    ],
  },
  {
    slug: "swiftui",
    title: "App nativa in SwiftUI",
    summary: "La trasposizione nativa dell'app MyVet in SwiftUI.",
    description:
      "Un progetto per esplorare una nuova implementazione nativa, mantenendo il dominio e l'esperienza del prodotto originale.",
    role: "Software Engineer",
    category: "mobile",
    technologies: ["SwiftUI", "MVVM", "Software Architecture"],
    period: "Dicembre 2024 - Settembre 2025",
    sections: [
      {
        title: "Perche una versione nativa",
        body: "La versione nativa e stata un'occasione per valutare approcci diversi rispetto all'applicazione ibrida e approfondire le possibilita offerte da SwiftUI.",
      },
      {
        title: "Architettura",
        body: "Il progetto e stato organizzato seguendo un approccio MVVM, con attenzione alla separazione delle responsabilita e alla leggibilita del codice.",
      },
      {
        title: "Cosa mi ha insegnato",
        body: "Il confronto tra implementazione ibrida e nativa ha reso piu chiare le conseguenze delle scelte architetturali sul prodotto e sul lavoro quotidiano.",
      },
    ],
  },
  {
    slug: "myvet-diet",
    title: "MyVet Diet",
    summary: "Un progetto verticale dell'ecosistema MyVet dedicato alla gestione delle diete.",
    description:
      "Un'esperienza di prodotto che unisce modellazione, pagamenti e attenzione al dominio della pet care.",
    role: "Software Engineer",
    category: "backend",
    technologies: ["Stripe", "UML", "Product Design"],
    period: "Maggio 2025 - Settembre 2025",
    sections: [
      {
        title: "Obiettivo",
        body: "MyVet Diet nasce come progetto verticale collegato all'ecosistema MyVet, con un focus specifico sulla gestione delle diete e dei relativi servizi.",
      },
      {
        title: "Decisioni di prodotto",
        body: "La modellazione UML ha aiutato a chiarire il dominio, mentre l'integrazione con Stripe ha richiesto attenzione al flusso di acquisto e alla sua affidabilita.",
      },
    ],
  },
];

export function getProjectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}
