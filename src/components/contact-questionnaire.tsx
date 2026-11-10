import { Questionnaire as QuestionnairePrimitive } from "@shadcn/react/questionnaire";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, PartyPopper, RotateCcw, SendIcon } from "lucide-react";
import { useMemo, useRef, useState, type FormEvent } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
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

const stageChoices = [
  { value: "idea", label: "È ancora un’intuizione" },
  { value: "prototype", label: "C’è già un prototipo" },
  { value: "live", label: "È online e va migliorato" },
  { value: "unsure", label: "Lo scopriamo insieme" },
] as const;

type Stage = (typeof stageChoices)[number]["value"];

const messagePrompts: Record<Interest, { title: string; placeholder: string }> = {
  product: {
    title: "Che prodotto hai in mente?",
    placeholder: "Es. un’app per prenotare lezioni di surf",
  },
  technical: {
    title: "Su cosa ti serve una mano?",
    placeholder: "Es. migrare il backend su Cloudflare",
  },
  consulting: {
    title: "Qual è la scelta da mettere a fuoco?",
    placeholder: "Es. React Native o PWA per il nostro MVP?",
  },
  opportunity: {
    title: "Di che ruolo o progetto si tratta?",
    placeholder: "Es. senior engineer in un team prodotto",
  },
  other: {
    title: "Dimmi pure, di cosa si tratta?",
    placeholder: "Scrivi liberamente",
  },
};

type Answers = {
  interest?: Interest;
  stage?: Stage;
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

type ItemName = "interest" | "stage" | "message" | "contact" | "extra" | "consent";

const itemByField: Record<string, ItemName> = {
  interest: "interest",
  message: "message",
  name: "contact",
  email: "contact",
  company: "extra",
  phone: "extra",
  consentToContact: "consent",
};

const firstName = (name: string) => name.trim().split(/\s+/)[0] ?? "";

export default function ContactQuestionnaire() {
  const [attempt, setAttempt] = useState(0);
  const [sentTo, setSentTo] = useState<string | null>(null);

  if (sentTo !== null) {
    return (
      <div className="flex min-h-0 flex-1 flex-col">
        <Empty className="min-h-0 overflow-y-auto">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <PartyPopper />
            </EmptyMedia>
            <EmptyTitle>{sentTo ? `Grazie ${sentTo}, ci siamo!` : "Grazie, ci siamo!"}</EmptyTitle>
            <EmptyDescription>
              Ho ricevuto la tua richiesta. La leggo con calma e ti rispondo personalmente via email
              con le prime domande o una proposta per sentirci.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Link className={buttonVariants()} to="/">
              <ArrowLeft data-icon="inline-start" />
              Torna alla home
            </Link>
            <Button
              variant="ghost"
              onClick={() => {
                setSentTo(null);
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

  return <ContactQuestionnaireForm key={attempt} onSent={setSentTo} />;
}

function ContactQuestionnaireForm({ onSent }: { onSent: (name: string) => void }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [answers, setAnswers] = useState<Answers>(emptyAnswers);
  const [activeItem, setActiveItem] = useState<string>("interest");
  const [errors, setErrors] = useState<Partial<Record<ItemName, string>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Per le opportunità professionali la fase del progetto non ha senso: la saltiamo.
  const asksStage = answers.interest !== "opportunity";

  const items = useMemo(
    () => [
      { name: "interest", required: true, choices: interestChoices },
      ...(asksStage ? [{ name: "stage", required: false, choices: stageChoices }] : []),
      { name: "message", required: false },
      { name: "contact", required: true },
      { name: "extra", required: false },
      { name: "consent", required: true, choices: [{ value: "yes" }] },
    ],
    [asksStage],
  );

  const current = Math.max(
    items.findIndex((item) => item.name === activeItem),
    0,
  );
  const prompt = messagePrompts[answers.interest ?? "other"];
  const greeting = firstName(answers.name);

  const update = (item: ItemName, patch: Partial<Answers>) => {
    setAnswers((previous) => ({ ...previous, ...patch }));
    setErrors(({ [item]: _cleared, ...rest }) => rest);
  };

  const validateStep = () => {
    const parsed = contactRequestSchema.safeParse(answers);
    const issue = parsed.success
      ? undefined
      : parsed.error.issues.find((entry) => itemByField[String(entry.path[0])] === activeItem);
    if (issue) {
      setErrors((previous) => ({ ...previous, [activeItem]: issue.message }));
      return false;
    }
    return true;
  };

  const advance = () => {
    if (validateStep() && current < items.length - 1) {
      const emptyOptional =
        (activeItem === "message" && !answers.message.trim()) ||
        (activeItem === "extra" && !answers.company.trim() && !answers.phone.trim()) ||
        (activeItem === "stage" && !answers.stage);
      if (emptyOptional) {
        formRef.current
          ?.querySelector<HTMLButtonElement>('[data-slot="questionnaire-skip"]')
          ?.click();
      } else {
        setActiveItem(items[current + 1].name);
      }
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    const parsed = contactRequestSchema.safeParse({
      name: answers.name,
      email: answers.email,
      phone: answers.phone,
      company: answers.company,
      interest: answers.interest,
      message: answers.message,
      consentToContact: answers.consentToContact,
    });

    if (!parsed.success) {
      const nextErrors: Partial<Record<ItemName, string>> = {};
      for (const issue of parsed.error.issues) {
        const item = itemByField[String(issue.path[0])];
        if (item && !nextErrors[item]) nextErrors[item] = issue.message;
      }
      setErrors(nextErrors);
      const firstInvalid = items.find((item) => item.name in nextErrors);
      if (firstInvalid) setActiveItem(firstInvalid.name);
      return;
    }

    const stage = asksStage
      ? stageChoices.find((choice) => choice.value === answers.stage)
      : undefined;
    const value: ContactRequestValues = {
      ...parsed.data,
      phone: parsed.data.phone ?? "",
      company: parsed.data.company ?? "",
      message: stage ? `${parsed.data.message}\n\nFase: ${stage.label}` : parsed.data.message,
    };

    setSubmitting(true);
    try {
      await createContactRequest({ data: value });
      onSent(greeting);
    } catch {
      setSubmitError("Qualcosa è andato storto durante l’invio. Riprova tra poco.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Questionnaire
      className="min-h-0 flex-1"
      ref={formRef}
      items={items}
      item={activeItem}
      onItemChange={(item) => {
        const next = items.findIndex((entry) => entry.name === item);
        if (next <= current || validateStep()) setActiveItem(item);
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
        Domanda {current + 1} di {items.length}
      </QuestionnaireProgress>

      <QuestionnaireItem
        className="min-h-0 flex-1 overflow-y-auto"
        name="interest"
        required
        invalid={Boolean(errors.interest)}
      >
        <QuestionnaireTitle>Partiamo dalla scintilla. Cosa ti porta qui?</QuestionnaireTitle>
        <QuestionnaireDescription>
          Non devi incastrare tutto in una categoria. Scegli la più vicina.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          {interestChoices.map((choice) => (
            <QuestionnaireChoice
              key={choice.value}
              value={choice.value}
              onChange={() => update("interest", { interest: choice.value })}
            >
              <span className="font-medium">{choice.label}</span>
              <QuestionnaireChoiceDescription>{choice.description}</QuestionnaireChoiceDescription>
            </QuestionnaireChoice>
          ))}
        </QuestionnaireChoices>
        <QuestionnaireError>
          {errors.interest ?? "Scegli una risposta per continuare."}
        </QuestionnaireError>
      </QuestionnaireItem>

      {asksStage && (
        <QuestionnaireItem
          className="min-h-0 flex-1 overflow-y-auto"
          name="stage"
          onStatusChange={(status) => {
            if (status === "skipped") update("stage", { stage: undefined });
          }}
        >
          <QuestionnaireTitle>A che punto sei?</QuestionnaireTitle>
          <QuestionnaireDescription>
            Va bene anche un appunto nelle note del telefono.
          </QuestionnaireDescription>
          <QuestionnaireChoices>
            {stageChoices.map((choice) => (
              <QuestionnaireChoice
                key={choice.value}
                value={choice.value}
                onChange={() => update("stage", { stage: choice.value })}
              >
                <span className="font-medium">{choice.label}</span>
              </QuestionnaireChoice>
            ))}
          </QuestionnaireChoices>
          <QuestionnaireError>Scegli una risposta o salta la domanda.</QuestionnaireError>
        </QuestionnaireItem>
      )}

      <QuestionnaireItem
        className="min-h-0 flex-1 overflow-y-auto"
        name="message"
        invalid={Boolean(errors.message)}
        onStatusChange={(status) => {
          if (status === "skipped") update("message", { message: "" });
        }}
      >
        <QuestionnaireTitle>{prompt.title}</QuestionnaireTitle>
        <QuestionnaireDescription>
          Scrivilo come lo racconteresti a un caffè. Anche due righe vanno bene. È facoltativo.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnairePrimitive.Input
            render={<Textarea rows={4} />}
            aria-label={prompt.title}
            placeholder={prompt.placeholder}
            maxLength={3900}
            onChange={(event) => update("message", { message: event.target.value })}
          />
        </QuestionnaireChoices>
        <QuestionnaireError>
          {errors.message ?? "Raccontami qualcosa in più oppure lascia il campo vuoto."}
        </QuestionnaireError>
      </QuestionnaireItem>

      <QuestionnaireItem
        className="min-h-0 flex-1 overflow-y-auto"
        name="contact"
        required
        invalid={Boolean(errors.contact)}
      >
        <QuestionnaireTitle>Ora diamo un nome a questa conversazione.</QuestionnaireTitle>
        <QuestionnaireDescription>
          Come ti chiami e a quale email posso risponderti? Ti scrivo io, niente newsletter.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireInput
            aria-label="Nome"
            placeholder="Il tuo nome"
            autoComplete="name"
            maxLength={120}
            onChange={(event) => update("contact", { name: event.target.value })}
          />
          <QuestionnaireInput
            type="email"
            aria-label="Email"
            placeholder="La tua email"
            autoComplete="email"
            maxLength={255}
            onChange={(event) => update("contact", { email: event.target.value })}
          />
        </QuestionnaireChoices>
        <QuestionnaireError>
          {errors.contact ?? "Lasciami nome ed email per continuare."}
        </QuestionnaireError>
      </QuestionnaireItem>

      <QuestionnaireItem
        className="min-h-0 flex-1 overflow-y-auto"
        name="extra"
        invalid={Boolean(errors.extra)}
        onStatusChange={(status) => {
          if (status === "skipped") update("extra", { company: "", phone: "" });
        }}
      >
        <QuestionnaireTitle>
          {greeting ? `Piacere, ${greeting}! Vuoi aggiungere altro?` : "Vuoi aggiungere altro?"}
        </QuestionnaireTitle>
        <QuestionnaireDescription>
          Azienda e telefono sono facoltativi: se preferisci, salta pure.
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireInput
            aria-label="Azienda o progetto (facoltativo)"
            placeholder="Azienda o progetto (facoltativo)"
            autoComplete="organization"
            maxLength={160}
            onChange={(event) => update("extra", { company: event.target.value })}
          />
          <QuestionnaireInput
            type="tel"
            inputMode="tel"
            aria-label="Telefono"
            placeholder="Telefono"
            autoComplete="tel"
            maxLength={40}
            onChange={(event) => update("extra", { phone: event.target.value })}
          />
        </QuestionnaireChoices>
        <QuestionnaireError>
          {errors.extra ?? "Compila un campo o salta la domanda."}
        </QuestionnaireError>
      </QuestionnaireItem>

      <QuestionnaireItem
        className="min-h-0 flex-1 overflow-y-auto"
        name="consent"
        required
        multiple
        invalid={Boolean(errors.consent)}
      >
        <QuestionnaireTitle>Ultimo passo, promesso.</QuestionnaireTitle>
        <QuestionnaireDescription>
          Da qui la conversazione continua via email. Mi dai il tuo ok?
        </QuestionnaireDescription>
        <QuestionnaireChoices>
          <QuestionnaireChoice
            value="yes"
            onChange={(event) => update("consent", { consentToContact: event.target.checked })}
          >
            <span className="font-medium">Acconsento a essere ricontattato</span>
            <QuestionnaireChoiceDescription>
              Il consenso riguarda esclusivamente questa richiesta.
            </QuestionnaireChoiceDescription>
          </QuestionnaireChoice>
        </QuestionnaireChoices>
        <QuestionnaireError>
          {errors.consent ?? "Conferma il consenso per inviare la richiesta."}
        </QuestionnaireError>
      </QuestionnaireItem>

      {submitError && (
        <Alert variant="destructive">
          <AlertDescription>{submitError}</AlertDescription>
        </Alert>
      )}

      <QuestionnaireActions className="shrink-0">
        <QuestionnairePrevious variant="ghost">Indietro</QuestionnairePrevious>
        <QuestionnaireSkip variant="ghost">Salta</QuestionnaireSkip>
        <QuestionnaireNext>
          Avanti
          <ArrowRight data-icon="inline-end" />
        </QuestionnaireNext>
        <QuestionnaireSubmit disabled={submitting}>
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
