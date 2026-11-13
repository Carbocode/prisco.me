import {
  contactRequestSchema,
  type ContactRequestValues,
} from "@/features/contact/domain/contact-request.schema";

type Interest = ContactRequestValues["interest"];

export const interestChoices = [
  {
    value: "product",
    label: "Un prodotto da costruire",
    description: "Da “secondo me funzionerebbe” alla prima versione online.",
  },
  {
    value: "technical",
    label: "Una mano tecnica",
    description: "Un nodo da sciogliere nel codice, o due mani in più nel team.",
  },
  {
    value: "consulting",
    label: "Un confronto",
    description: "Hai più strade davanti. Ragioniamoci insieme.",
  },
  {
    value: "opportunity",
    label: "Un’opportunità professionale",
    description: "Un team, un ruolo, una collaborazione. Sono qui.",
  },
  {
    value: "other",
    label: "Qualcos’altro",
    description: "Non rientra nelle altre voci? Mi hai già incuriosito.",
  },
] as const satisfies ReadonlyArray<{ value: Interest; label: string; description: string }>;

type Choice = { value: string; label: string };

type Flow = {
  stepLabel: string;
  title: string;
  focus?: { legend: string; summary: string; choices: readonly Choice[] };
  message: { placeholder: string; hint: string };
  company?: { label: string; placeholder: string };
  contactTitle: string;
  phoneHint: string;
  reply: string;
};

export const flows: Record<Interest, Flow> = {
  product: {
    stepLabel: "L’idea",
    title: "Che prodotto hai in mente?",
    focus: {
      legend: "A che punto sei?",
      summary: "Fase",
      choices: [
        { value: "idea", label: "È ancora un’intuizione" },
        { value: "prototype", label: "C’è già un prototipo" },
        { value: "live", label: "È online e va migliorato" },
        { value: "unsure", label: "Lo scopriamo insieme" },
      ],
    },
    message: {
      placeholder: "Es. un’app per prenotare lezioni di surf, da lanciare in primavera",
      hint: "A chi serve e che problema risolve: bastano due righe.",
    },
    company: { label: "Nome del progetto o dell’azienda", placeholder: "Es. SurfBook" },
    contactTitle: "Bella idea. Dove ti rispondo?",
    phoneHint: "Se preferisci raccontarla a voce.",
    reply: "con qualche domanda sull’idea e una proposta per sentirci",
  },
  technical: {
    stepLabel: "Il problema",
    title: "Su cosa ti serve una mano?",
    focus: {
      legend: "Di che tipo di aiuto si tratta?",
      summary: "Tipo di aiuto",
      choices: [
        { value: "fix", label: "Sistemare codice che esiste già" },
        { value: "build", label: "Progettare qualcosa di nuovo" },
        { value: "team", label: "Rinforzare il team per un periodo" },
        { value: "review", label: "Una revisione o un parere esterno" },
      ],
    },
    message: {
      placeholder: "Es. migrare il backend su Cloudflare senza fermare il servizio",
      hint: "Lo stack e cosa non funziona come vorresti.",
    },
    company: { label: "Azienda o team", placeholder: "Es. Acme S.r.l." },
    contactTitle: "Ci diamo un’occhiata insieme. Dove ti rispondo?",
    phoneHint: "Utile se la questione è urgente.",
    reply: "con le prime domande tecniche per inquadrare il problema",
  },
  consulting: {
    stepLabel: "La scelta",
    title: "Qual è la scelta da mettere a fuoco?",
    focus: {
      legend: "Su cosa vuoi confrontarti?",
      summary: "Tema",
      choices: [
        { value: "stack", label: "Tecnologie e architettura" },
        { value: "product", label: "Prodotto e priorità" },
        { value: "process", label: "Processi e modo di lavorare" },
        { value: "unsure", label: "Un po’ di tutto" },
      ],
    },
    message: {
      placeholder: "Es. React Native o PWA per il nostro MVP?",
      hint: "Le opzioni sul tavolo e cosa ti frena.",
    },
    company: { label: "Azienda o team", placeholder: "Es. Acme S.r.l." },
    contactTitle: "Ragioniamoci. Dove ti rispondo?",
    phoneHint: "Se preferisci una chiamata.",
    reply: "con qualche domanda per preparare il confronto",
  },
  opportunity: {
    stepLabel: "L’opportunità",
    title: "Di che opportunità si tratta?",
    focus: {
      legend: "Che tipo di collaborazione?",
      summary: "Collaborazione",
      choices: [
        { value: "hire", label: "Un’assunzione" },
        { value: "freelance", label: "Un progetto freelance" },
        { value: "partner", label: "Una partnership o un side project" },
        { value: "talk", label: "Prima ne parliamo" },
      ],
    },
    message: {
      placeholder: "Es. senior engineer in un team prodotto, full remote",
      hint: "Ruolo, team e tempistiche, se le conosci già.",
    },
    company: { label: "Azienda", placeholder: "Es. Acme S.r.l." },
    contactTitle: "Mi fa piacere. Dove ti rispondo?",
    phoneHint: "Se preferisci una prima chiacchierata al telefono.",
    reply: "per capire meglio ruolo e tempistiche",
  },
  other: {
    stepLabel: "Il contesto",
    title: "Dimmi pure, di cosa si tratta?",
    message: {
      placeholder: "Scrivi liberamente",
      hint: "Scrivilo come lo racconteresti a un caffè.",
    },
    contactTitle: "Mi hai incuriosito. Dove ti rispondo?",
    phoneHint: "Se preferisci una chiamata.",
    reply: "appena l’ho letta",
  },
};

export type Answers = {
  interest?: Interest;
  focus?: string;
  message: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  consentToContact: boolean;
};

export const emptyAnswers: Answers = {
  message: "",
  name: "",
  email: "",
  company: "",
  phone: "",
  consentToContact: false,
};

export type FieldName = Exclude<keyof Answers, "focus">;

export type ItemName = "interest" | "details" | "contact";

export const itemByField: Record<FieldName, ItemName> = {
  interest: "interest",
  message: "details",
  company: "details",
  name: "contact",
  email: "contact",
  phone: "contact",
  consentToContact: "contact",
};

export type Errors = Partial<Record<FieldName, string>>;

export const isFieldName = (value: string): value is FieldName => value in itemByField;

export const isItemName = (value: string): value is ItemName =>
  value === "interest" || value === "details" || value === "contact";

export type Sent = { name: string; email: string; interest: Interest };

export const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? "";

export function collectErrors(answers: Answers, item?: ItemName): Errors {
  const parsed = contactRequestSchema.safeParse(answers);
  if (parsed.success) return {};
  const errors: Errors = {};
  for (const issue of parsed.error.issues) {
    const field = String(issue.path[0]);
    if (!isFieldName(field) || (item && itemByField[field] !== item)) continue;
    errors[field] ??= issue.message;
  }
  return errors;
}

export type StepListener = (step: number) => void;
