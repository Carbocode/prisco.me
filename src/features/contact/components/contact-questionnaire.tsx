import { Questionnaire as QuestionnairePrimitive } from "@shadcn/react/questionnaire";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, MailCheck, PartyPopper, RotateCcw, SendIcon } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";

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
import { trackContactForm } from "@/features/contact/client/contact-analytics";
import {
  contactRequestSchema,
  type ContactRequestValues,
} from "@/features/contact/domain/contact-request.schema";
import {
  type StepListener,
  type Sent,
  firstName,
  getQuestionnaireCopy,
  emptyAnswers,
  type Answers,
  type ItemName,
  type Errors,
  type FieldName,
  collectErrors,
  isFieldName,
  itemByField,
  isItemName,
} from "@/features/contact/domain/questionnaire-model";
import { createContactRequest } from "@/features/contact/server/contact-requests.functions";
import { useSiteLocale } from "@/features/site/client/site-location";
import * as m from "@/paraglide/messages.js";

export default function ContactQuestionnaire({ onStepChange }: { onStepChange?: StepListener }) {
  const locale = useSiteLocale();
  const { interestChoices, flows } = getQuestionnaireCopy(locale);
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
              {name
                ? m.question_thanks_by_name({ name }, { locale })
                : m.question_thanks({}, { locale })}
            </EmptyTitle>
            <EmptyDescription>
              {m.question_your_request_about({}, { locale })}
              {interest}
              {m.question_came_through_i_ll_read_it({}, { locale })} <strong>{sent.email}</strong>{" "}
              {flows[sent.interest].reply}.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Alert>
              <MailCheck />
              <AlertDescription>{m.question_if_you_don_t_see_a({}, { locale })} </AlertDescription>
            </Alert>
            <Link className={buttonVariants()} to="/">
              <ArrowLeft data-icon="inline-start" />
              {m.question_back_to_the_homepage({}, { locale })}{" "}
            </Link>
            <Button
              variant="ghost"
              onClick={() => {
                setSent(null);
                setAttempt((value) => value + 1);
              }}
            >
              <RotateCcw data-icon="inline-start" />
              {m.question_send_another_request({}, { locale })}{" "}
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
  const locale = useSiteLocale();
  const { interestChoices, flows } = getQuestionnaireCopy(locale);
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
    [flow, interestChoices],
  );

  const current = Math.max(
    items.findIndex((item) => item.name === activeItem),
    0,
  );
  const stepLabel = {
    interest: m.question_step_interest({}, { locale }),
    details: flow.stepLabel,
    contact: m.question_step_contact({}, { locale }),
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
    const stepErrors = collectErrors(answers, activeItem, locale);
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
      const nextErrors = collectErrors(answers, undefined, locale);
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
      setSubmitError(m.question_submit_error({}, { locale }));
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
      aria-label={m.question_contact_request({}, { locale })}
    >
      <Progress value={((current + 1) / items.length) * 100} aria-hidden="true" />
      <QuestionnaireProgress>
        {m.question_step({}, { locale })} {current + 1} {m.question_of({}, { locale })}{" "}
        {items.length} · {stepLabel}
      </QuestionnaireProgress>

      {/* Margine negativo e padding: l’anello di focus dei campi non viene tagliato dallo scroll. */}
      <div className="-m-1 flex min-h-0 flex-1 flex-col overflow-y-auto p-1">
        <QuestionnaireItem name="interest" required invalid={Boolean(errors.interest)}>
          <QuestionnaireTitle>
            {m.question_let_s_start_with_the_idea({}, { locale })}
          </QuestionnaireTitle>
          <QuestionnaireDescription>
            {m.question_choose_the_closest_option_it_doesn({}, { locale })}{" "}
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
            {errors.interest ?? m.question_interest_required({}, { locale })}
          </QuestionnaireError>
        </QuestionnaireItem>

        <QuestionnaireItem name="details" invalid={detailsInvalid}>
          <QuestionnaireTitle>{flow.title}</QuestionnaireTitle>
          <QuestionnaireDescription>
            {m.question_everything_here_is_optional_even_one({}, { locale })}{" "}
          </QuestionnaireDescription>
          {flow.focus && (
            <FieldSet>
              <FieldLegend variant="label">
                {flow.focus.legend} {m.question_optional({}, { locale })}
              </FieldLegend>
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
            <FieldLabel htmlFor="contact-message">
              {m.question_message_optional({}, { locale })}
            </FieldLabel>
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
              <FieldLabel htmlFor="contact-company">
                {flow.company.label} {m.question_optional({}, { locale })}
              </FieldLabel>
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
              ? m.question_check_fields({}, { locale })
              : m.question_optional_step_hint({}, { locale })}
          </QuestionnaireError>
        </QuestionnaireItem>

        <QuestionnaireItem name="contact" required multiple invalid={contactInvalid}>
          <QuestionnaireTitle>{flow.contactTitle}</QuestionnaireTitle>
          <QuestionnaireDescription>
            {m.question_i_ll_write_back_personally_no({}, { locale })}{" "}
          </QuestionnaireDescription>
          <Field data-invalid={Boolean(errors.name)}>
            <FieldLabel htmlFor="contact-name">{m.question_name({}, { locale })}</FieldLabel>
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
              <FieldDescription>
                {m.question_i_ll_only_use_this_to({}, { locale })}
              </FieldDescription>
            )}
          </Field>
          <Field data-invalid={Boolean(errors.phone)}>
            <FieldLabel htmlFor="contact-phone">
              {m.question_phone_optional({}, { locale })}
            </FieldLabel>
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
              <FieldLabel htmlFor="contact-consent">
                {m.question_i_agree_to_be_contacted({}, { locale })}
              </FieldLabel>
              <FieldDescription>
                {m.question_only_to_respond_to_this_request({}, { locale })}
              </FieldDescription>
              {errors.consentToContact && <FieldError>{errors.consentToContact}</FieldError>}
            </FieldContent>
          </Field>
          <QuestionnaireError>
            {contactInvalid
              ? m.question_check_fields({}, { locale })
              : m.question_contact_step_hint({}, { locale })}
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
          {m.question_back({}, { locale })}{" "}
        </QuestionnairePrevious>
        <QuestionnaireSkip size="lg" variant="ghost">
          {m.question_skip({}, { locale })}{" "}
        </QuestionnaireSkip>
        <QuestionnaireNext size="lg">
          {m.question_next({}, { locale })} <ArrowRight data-icon="inline-end" />
        </QuestionnaireNext>
        <QuestionnaireSubmit size="lg" disabled={submitting}>
          {submitting ? (
            <>
              <Spinner data-icon="inline-start" />
              {m.question_sending({}, { locale })}{" "}
            </>
          ) : (
            <>
              {m.question_send_request({}, { locale })} <SendIcon data-icon="inline-end" />
            </>
          )}
        </QuestionnaireSubmit>
      </QuestionnaireActions>
    </Questionnaire>
  );
}
