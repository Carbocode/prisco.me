import { Questionnaire as QuestionnairePrimitive } from "@shadcn/react/questionnaire";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, MailCheck, PartyPopper, RotateCcw, SendIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";

import { trackContactForm } from "@/components/contact-analytics";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Progress } from "@/components/ui/progress";
import {
  Questionnaire,
  QuestionnaireActions,
  QuestionnaireChoice,
  QuestionnaireChoiceDescription,
  QuestionnaireChoices,
  QuestionnaireDescription,
  QuestionnaireError,
  QuestionnaireInput,
  QuestionnaireItem,
  QuestionnaireNext,
  QuestionnairePrevious,
  QuestionnaireProgress,
  QuestionnaireSkip,
  QuestionnaireSubmit,
  QuestionnaireTitle,
} from "@/components/ui/questionnaire";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { contactRequestSchema, type ContactRequestValues } from "@/lib/contact-request-schema";
import { createContactRequest } from "@/server/contact-requests";

type Interest = ContactRequestValues["interest"];

const interestChoices = [
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

/**
 * Each first answer opens its own path: the context step asks only what is useful
 * for that kind of request, and the copy follows the conversation.
 */
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

const flows: Record<Interest, Flow> = {
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

type Answers = {
  interest?: Interest;
  focus?: string;
  message: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  consentToContact: boolean;
};

const emptyAnswers: Answers = {
  message: "",
  name: "",
  email: "",
  company: "",
  phone: "",
  consentToContact: false,
};

type FieldName = Exclude<keyof Answers, "focus">;
type ItemName = "interest" | "details" | "contact";

// Three steps, each with a single purpose: what you need, the context, where to reply.
const itemByField: Record<FieldName, ItemName> = {
  interest: "interest",
  message: "details",
  company: "details",
  name: "contact",
  email: "contact",
  phone: "contact",
  consentToContact: "contact",
};

type Errors = Partial<Record<FieldName, string>>;

const isFieldName = (value: string): value is FieldName => value in itemByField;
const isItemName = (value: string): value is ItemName =>
  value === "interest" || value === "details" || value === "contact";

type Sent = { name: string; email: string; interest: Interest };

const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? "";

function collectErrors(answers: Answers, item?: ItemName): Errors {
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

type StepListener = (step: number) => void;

/** `onStepChange` riceve il passo attivo (0–2) e 3 a richiesta inviata. */
export default function ContactQuestionnaire({ onStepChange }: { onStepChange?: StepListener }) {
  const [attempt, setAttempt] = useState(0);
  const [sent, setSent] = useState<Sent | null>(null);

  useEffect(() => {
    if (sent !== null) onStepChange?.(3);
  }, [sent, onStepChange]);

  if (sent !== null) {
    const name = firstName(sent.name);
    const interest = interestChoices.find((choice) => choice.value === sent.interest)?.label;
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <Empty className="min-h-0 overflow-y-auto">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <PartyPopper />
            </EmptyMedia>
            <EmptyTitle>
              {name ? `Grazie ${name}, messaggio ricevuto!` : "Grazie, messaggio ricevuto!"}
            </EmptyTitle>
            <EmptyDescription>
              La tua richiesta su «{interest}» è arrivata. La leggo io, Vincenzo, e ti scrivo a{" "}
              <strong>{sent.email}</strong> {flows[sent.interest].reply}.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Alert>
              <MailCheck />
              <AlertDescription>
                Se non trovi la risposta, dai un’occhiata alla cartella spam.
              </AlertDescription>
            </Alert>
            <Link className={buttonVariants()} to="/">
              <ArrowLeft data-icon="inline-start" />
              Torna alla home
            </Link>
            <Button
              variant="ghost"
              onClick={() => {
                setSent(null);
                setAttempt((value) => value + 1);
              }}
            >
              <RotateCcw data-icon="inline-start" />
              Invia un’altra richiesta
            </Button>
          </EmptyContent>
        </Empty>
      </div>
    );
  }

  return <ContactQuestionnaireForm key={attempt} onSent={setSent} onStepChange={onStepChange} />;
}

function ContactQuestionnaireForm({
  onSent,
  onStepChange,
}: {
  onSent: (sent: Sent) => void;
  onStepChange?: StepListener;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const started = useRef(false);
  const [answers, setAnswers] = useState<Answers>(emptyAnswers);
  const [activeItem, setActiveItem] = useState<ItemName>("interest");
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const flow = flows[answers.interest ?? "other"];

  const items = useMemo<
    { name: ItemName; required: boolean; choices: readonly { value: string }[] }[]
  >(
    () => [
      { name: "interest", required: true, choices: interestChoices },
      { name: "details", required: false, choices: flow.focus?.choices ?? [] },
      { name: "contact", required: true, choices: [] },
    ],
    [flow],
  );

  const current = Math.max(
    items.findIndex((item) => item.name === activeItem),
    0,
  );
  const stepLabel = {
    interest: "Come posso aiutarti",
    details: flow.stepLabel,
    contact: "Dove ti rispondo",
  }[activeItem];

  useEffect(() => {
    trackContactForm("step_viewed", { step: activeItem, index: current + 1 });
  }, [activeItem, current]);

  useEffect(() => {
    onStepChange?.(current);
  }, [current, onStepChange]);

  const update = (field: FieldName | "focus", patch: Partial<Answers>) => {
    if (!started.current) {
      started.current = true;
      trackContactForm("started");
    }
    setAnswers((previous) => ({ ...previous, ...patch }));
    if (field !== "focus") setErrors(({ [field]: _cleared, ...rest }) => rest);
  };

  const validateStep = () => {
    const stepErrors = collectErrors(answers, activeItem);
    if (Object.keys(stepErrors).length > 0) {
      setErrors({ ...errors, ...stepErrors });
      return false;
    }
    return true;
  };

  const advance = () => {
    if (!validateStep() || current >= items.length - 1) return;
    // Each filled field replaces the previous one as the item's "answer", so the
    // primitive's own status is the source of truth: an optional step it considers
    // unanswered must be skipped explicitly, or the final submit is blocked.
    const status = formRef.current
      ?.querySelector('[data-slot="questionnaire-item"][data-active]')
      ?.getAttribute("data-status");
    const emptyOptional = activeItem === "details" && status !== "answered";
    if (emptyOptional) {
      formRef.current
        ?.querySelector<HTMLButtonElement>('[data-slot="questionnaire-skip"]')
        ?.click();
    } else {
      setActiveItem(items[current + 1].name);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    const parsed = contactRequestSchema.safeParse(answers);
    if (!parsed.success) {
      const nextErrors = collectErrors(answers);
      setErrors(nextErrors);
      const firstInvalid = items.find((item) =>
        Object.keys(nextErrors).some(
          (field) => isFieldName(field) && itemByField[field] === item.name,
        ),
      );
      if (firstInvalid) setActiveItem(firstInvalid.name);
      return;
    }

    const interestFlow = flows[parsed.data.interest];
    const focus = interestFlow.focus?.choices.find((choice) => choice.value === answers.focus);
    const value: ContactRequestValues = {
      ...parsed.data,
      phone: parsed.data.phone ?? "",
      company: interestFlow.company ? (parsed.data.company ?? "") : "",
      message: [parsed.data.message, focus && `${interestFlow.focus?.summary}: ${focus.label}`]
        .filter(Boolean)
        .join("\n\n"),
    };
    const analytics = {
      interest: parsed.data.interest,
      focus: focus?.value ?? "none",
      has_message: parsed.data.message.length > 0,
      has_company: Boolean(value.company),
      has_phone: Boolean(parsed.data.phone),
    };

    setSubmitting(true);
    try {
      await createContactRequest({ data: value });
      trackContactForm("submitted", analytics);
      onSent({ name: parsed.data.name, email: parsed.data.email, interest: parsed.data.interest });
    } catch {
      trackContactForm("submit_failed", analytics);
      setSubmitError(
        "L’invio non è riuscito, ma le tue risposte sono ancora qui: riprova tra qualche istante.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const contactInvalid = (["name", "email", "phone", "consentToContact"] as const).some(
    (field) => errors[field],
  );
  const detailsInvalid = Boolean(errors.message || errors.company);

  return (
    <Questionnaire
      className="min-h-0 flex-1"
      ref={formRef}
      items={items}
      item={activeItem}
      onItemChange={(item) => {
        const next = items.findIndex((entry) => entry.name === item);
        if (isItemName(item) && (next <= current || validateStep())) setActiveItem(item);
      }}
      onClickCapture={(event) => {
        if (
          event.target instanceof Element &&
          event.target.closest('[data-slot="questionnaire-next"]')
        ) {
          event.preventDefault();
          advance();
        }
      }}
      onKeyDownCapture={(event) => {
        if (event.nativeEvent.isComposing || event.repeat) return;
        const target = event.target;
        if (!(target instanceof HTMLElement)) return;
        const isTextarea = target.tagName === "TEXTAREA";
        if (isTextarea && !event.ctrlKey && !event.metaKey) {
          event.stopPropagation();
          return;
        }
        const isInput = target.tagName === "INPUT" || isTextarea;
        const isNext = Boolean(target.closest('[data-slot="questionnaire-next"]'));
        const enter =
          event.key === "Enter" && (isInput || isNext || event.ctrlKey || event.metaKey);
        const right = event.key === "ArrowRight" && !isInput && target.tagName !== "BUTTON";
        if ((enter || right) && current < items.length - 1) {
          event.preventDefault();
          event.stopPropagation();
          advance();
        }
      }}
      shortcuts="letters"
      onSubmit={(event) => void handleSubmit(event)}
      aria-label="Richiesta di contatto"
    >
      <Progress value={((current + 1) / items.length) * 100} aria-hidden="true" />
      <QuestionnaireProgress>
        Passo {current + 1} di {items.length} · {stepLabel}
      </QuestionnaireProgress>

      {/* Margine negativo e padding: l’anello di focus dei campi non viene tagliato dallo scroll. */}
      <div className="-m-1 flex min-h-0 flex-1 flex-col overflow-y-auto p-1">
        <QuestionnaireItem name="interest" required invalid={Boolean(errors.interest)}>
          <QuestionnaireTitle>Partiamo dalla scintilla. Come posso aiutarti?</QuestionnaireTitle>
          <QuestionnaireDescription>
            Non devi incastrare tutto in una categoria: scegli la più vicina.
          </QuestionnaireDescription>
          <QuestionnaireChoices>
            {interestChoices.map((choice) => (
              <QuestionnaireChoice
                key={choice.value}
                value={choice.value}
                onChange={() =>
                  // A different path has different follow-up options: reset the old one.
                  update("interest", { interest: choice.value, focus: undefined })
                }
              >
                <span className="font-medium">{choice.label}</span>
                <QuestionnaireChoiceDescription>
                  {choice.description}
                </QuestionnaireChoiceDescription>
              </QuestionnaireChoice>
            ))}
          </QuestionnaireChoices>
          <QuestionnaireError>
            {errors.interest ?? "Scegli l’opzione più vicina a quello che ti serve."}
          </QuestionnaireError>
        </QuestionnaireItem>

        <QuestionnaireItem name="details" invalid={detailsInvalid}>
          <QuestionnaireTitle>{flow.title}</QuestionnaireTitle>
          <QuestionnaireDescription>
            Tutto facoltativo: anche una sola risposta mi aiuta a risponderti meglio.
          </QuestionnaireDescription>
          {flow.focus && (
            <FieldSet>
              <FieldLegend variant="label">{flow.focus.legend} (facoltativo)</FieldLegend>
              <QuestionnaireChoices>
                {flow.focus.choices.map((choice) => (
                  <QuestionnaireChoice
                    key={choice.value}
                    value={choice.value}
                    onChange={() => update("focus", { focus: choice.value })}
                  >
                    <span className="font-medium">{choice.label}</span>
                  </QuestionnaireChoice>
                ))}
              </QuestionnaireChoices>
            </FieldSet>
          )}
          <Field data-invalid={Boolean(errors.message)}>
            <FieldLabel htmlFor="contact-message">Messaggio (facoltativo)</FieldLabel>
            <QuestionnairePrimitive.Input
              id="contact-message"
              render={<Textarea rows={3} />}
              placeholder={flow.message.placeholder}
              maxLength={3900}
              aria-invalid={Boolean(errors.message)}
              onChange={(event) => update("message", { message: event.target.value })}
            />
            {errors.message ? (
              <FieldError>{errors.message}</FieldError>
            ) : (
              <FieldDescription>{flow.message.hint}</FieldDescription>
            )}
          </Field>
          {flow.company && (
            <Field data-invalid={Boolean(errors.company)}>
              <FieldLabel htmlFor="contact-company">{flow.company.label} (facoltativo)</FieldLabel>
              <QuestionnaireInput
                id="contact-company"
                autoComplete="organization"
                placeholder={flow.company.placeholder}
                maxLength={160}
                aria-invalid={Boolean(errors.company)}
                onChange={(event) => update("company", { company: event.target.value })}
              />
              {errors.company && <FieldError>{errors.company}</FieldError>}
            </Field>
          )}
          <QuestionnaireError>
            {detailsInvalid
              ? "Controlla i campi evidenziati qui sopra."
              : "Rispondi oppure vai avanti: è tutto facoltativo."}
          </QuestionnaireError>
        </QuestionnaireItem>

        <QuestionnaireItem name="contact" required multiple invalid={contactInvalid}>
          <QuestionnaireTitle>{flow.contactTitle}</QuestionnaireTitle>
          <QuestionnaireDescription>
            Ti scrivo io, personalmente. Niente newsletter, niente spam.
          </QuestionnaireDescription>
          <Field data-invalid={Boolean(errors.name)}>
            <FieldLabel htmlFor="contact-name">Nome</FieldLabel>
            <QuestionnaireInput
              id="contact-name"
              autoComplete="name"
              maxLength={120}
              aria-invalid={Boolean(errors.name)}
              onChange={(event) => update("name", { name: event.target.value })}
            />
            {errors.name && <FieldError>{errors.name}</FieldError>}
          </Field>
          <Field data-invalid={Boolean(errors.email)}>
            <FieldLabel htmlFor="contact-email">Email</FieldLabel>
            <QuestionnaireInput
              id="contact-email"
              type="email"
              inputMode="email"
              autoComplete="email"
              spellCheck={false}
              maxLength={255}
              aria-invalid={Boolean(errors.email)}
              onChange={(event) => update("email", { email: event.target.value })}
            />
            {errors.email ? (
              <FieldError>{errors.email}</FieldError>
            ) : (
              <FieldDescription>La uso solo per risponderti.</FieldDescription>
            )}
          </Field>
          <Field data-invalid={Boolean(errors.phone)}>
            <FieldLabel htmlFor="contact-phone">Telefono (facoltativo)</FieldLabel>
            <QuestionnaireInput
              id="contact-phone"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              maxLength={40}
              aria-invalid={Boolean(errors.phone)}
              onChange={(event) => update("phone", { phone: event.target.value })}
            />
            {errors.phone ? (
              <FieldError>{errors.phone}</FieldError>
            ) : (
              <FieldDescription>{flow.phoneHint}</FieldDescription>
            )}
          </Field>
          <Field orientation="horizontal" data-invalid={Boolean(errors.consentToContact)}>
            <Checkbox
              id="contact-consent"
              checked={answers.consentToContact}
              onCheckedChange={(checked) =>
                update("consentToContact", { consentToContact: checked })
              }
              aria-invalid={Boolean(errors.consentToContact)}
            />
            <FieldContent>
              <FieldLabel htmlFor="contact-consent">Acconsento a essere ricontattato</FieldLabel>
              <FieldDescription>Solo per rispondere a questa richiesta.</FieldDescription>
              {errors.consentToContact && <FieldError>{errors.consentToContact}</FieldError>}
            </FieldContent>
          </Field>
          <QuestionnaireError>
            {contactInvalid
              ? "Controlla i campi evidenziati qui sopra."
              : "Scrivi nome ed email per inviare la richiesta."}
          </QuestionnaireError>
        </QuestionnaireItem>
      </div>

      {submitError && (
        <Alert variant="destructive">
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      <QuestionnaireActions className="shrink-0">
        <QuestionnairePrevious size="lg" variant="ghost">
          Indietro
        </QuestionnairePrevious>
        <QuestionnaireSkip size="lg" variant="ghost">
          Salta
        </QuestionnaireSkip>
        <QuestionnaireNext size="lg">
          Avanti
          <ArrowRight data-icon="inline-end" />
        </QuestionnaireNext>
        <QuestionnaireSubmit size="lg" disabled={submitting}>
          {submitting ? (
            <>
              <Spinner data-icon="inline-start" />
              Invio in corso
            </>
          ) : (
            <>
              Invia la richiesta
              <SendIcon data-icon="inline-end" />
            </>
          )}
        </QuestionnaireSubmit>
      </QuestionnaireActions>
    </Questionnaire>
  );
}
