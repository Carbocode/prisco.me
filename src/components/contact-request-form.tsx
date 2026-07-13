import { useForm } from "@tanstack/react-form";
import { Send } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  contactRequestSchema,
  createContactRequest,
  type ContactRequestValues,
} from "@/server/contact-requests";

import { Card, CardContent, CardFooter } from "./ui/card";

const toFieldErrors = (errors: Array<{ message?: string } | string | undefined>) =>
  errors.map((error) => (typeof error === "string" ? { message: error } : error));

const contactInterests = ["product", "technical", "consulting", "opportunity", "other"] as const;
type ContactInterest = (typeof contactInterests)[number];

function isContactInterest(value: string): value is ContactInterest {
  return contactInterests.some((interest) => interest === value);
}

export default function ContactRequestForm() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      interest: "product" as ContactRequestValues["interest"],
      message: "",
      consentToContact: false,
    },
    validators: {
      onChange: contactRequestSchema,
    },
    onSubmit: async ({ value }) => {
      setSubmitError(null);
      setSubmitted(false);

      try {
        await createContactRequest({ data: value });
        form.reset();
        setSubmitted(true);
      } catch {
        setSubmitError("Si e verificato un problema durante l'invio. Riprova tra poco.");
      }
    },
  });

  return (
    <Card className="overflow-hidden border-white/10 bg-white/[0.04] py-0">
      <div className="relative flex h-28 items-end justify-between overflow-hidden border-b border-white/10 bg-gradient-to-br from-sky-400/15 via-violet-400/10 to-slate-950 px-6 py-5">
        <div className="site-grid absolute inset-0 opacity-40" />
        <div className="relative">
          <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-sky-200">
            Open channel
          </p>
          <p className="mt-1 text-sm text-white">
            Il prossimo prodotto inizia da una conversazione.
          </p>
        </div>
        <Send className="relative text-sky-200/80" size={28} strokeWidth={1.4} aria-hidden="true" />
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          event.stopPropagation();
          void form.handleSubmit();
        }}
      >
        <CardContent>
          <FieldSet>
            <FieldGroup className="gap-6">
              <div className="grid gap-6 md:grid-cols-2">
                <form.Field name="name">
                  {(field) => {
                    const invalid = field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field>
                        <FieldLabel htmlFor={field.name}>Nome*</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          autoComplete="name"
                          placeholder="Mario Rossi"
                          minLength={2}
                          maxLength={120}
                          required
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) => field.handleChange(event.target.value)}
                          aria-invalid={invalid}
                        />
                        {invalid && <FieldError errors={toFieldErrors(field.state.meta.errors)} />}
                      </Field>
                    );
                  }}
                </form.Field>

                <form.Field name="email">
                  {(field) => {
                    const invalid = field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field>
                        <FieldLabel htmlFor={field.name}>Email*</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="email"
                          autoComplete="email"
                          placeholder="mario@email.it"
                          maxLength={255}
                          required
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) => field.handleChange(event.target.value)}
                          aria-invalid={invalid}
                        />
                        {invalid && <FieldError errors={toFieldErrors(field.state.meta.errors)} />}
                      </Field>
                    );
                  }}
                </form.Field>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <form.Field name="phone">
                  {(field) => {
                    const invalid = field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field>
                        <FieldLabel htmlFor={field.name}>Telefono</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          autoComplete="tel"
                          placeholder="+39 333 123 4567"
                          minLength={6}
                          maxLength={40}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) => field.handleChange(event.target.value)}
                          aria-invalid={invalid}
                        />
                        {invalid && <FieldError errors={toFieldErrors(field.state.meta.errors)} />}
                      </Field>
                    );
                  }}
                </form.Field>

                <form.Field name="company">
                  {(field) => {
                    const invalid = field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field>
                        <FieldLabel htmlFor={field.name}>Azienda o progetto</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          autoComplete="organization"
                          placeholder="Nome dell’azienda o del progetto"
                          maxLength={160}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) => field.handleChange(event.target.value)}
                          aria-invalid={invalid}
                        />
                        {invalid && <FieldError errors={toFieldErrors(field.state.meta.errors)} />}
                      </Field>
                    );
                  }}
                </form.Field>
              </div>

              <form.Field name="interest">
                {(field) => {
                  const invalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field>
                      <FieldLabel htmlFor={field.name}>Motivo del contatto*</FieldLabel>
                      <select
                        id={field.name}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) => {
                          const value = event.target.value;
                          if (isContactInterest(value)) field.handleChange(value);
                        }}
                        aria-invalid={invalid}
                        className="h-10 w-full rounded-md border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        required
                      >
                        <option value="product">Sviluppo di un prodotto</option>
                        <option value="technical">Collaborazione tecnica</option>
                        <option value="consulting">Consulenza</option>
                        <option value="opportunity">Opportunita professionale</option>
                        <option value="other">Altro</option>
                      </select>
                      {invalid && <FieldError errors={toFieldErrors(field.state.meta.errors)} />}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="message">
                {(field) => {
                  const invalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={invalid}>
                      <FieldLabel htmlFor={field.name}>Messaggio</FieldLabel>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        placeholder="Raccontami il tuo progetto o la tua idea."
                        rows={5}
                        minLength={10}
                        maxLength={4000}
                        required
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) => field.handleChange(event.target.value)}
                        aria-invalid={invalid}
                      />

                      {invalid && <FieldError errors={toFieldErrors(field.state.meta.errors)} />}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="consentToContact">
                {(field) => {
                  const invalid = field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field orientation="horizontal">
                      <Checkbox
                        id={field.name}
                        checked={field.state.value}
                        onCheckedChange={field.handleChange}
                        aria-invalid={invalid}
                        required
                      />

                      <FieldLabel htmlFor={field.name}>
                        Acconsento a essere ricontattato per questa richiesta.
                      </FieldLabel>

                      {invalid && <FieldError errors={toFieldErrors(field.state.meta.errors)} />}
                    </Field>
                  );
                }}
              </form.Field>
            </FieldGroup>
          </FieldSet>
        </CardContent>
        <CardFooter className="gap-2">
          <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
            {([canSubmit, isSubmitting]) => (
              <Button type="submit" disabled={!canSubmit || isSubmitting}>
                {isSubmitting ? "Invio in corso..." : "Invia richiesta"}
              </Button>
            )}
          </form.Subscribe>

          {submitted && (
            <p aria-live="polite" className="text-sm text-emerald-600">
              Messaggio inviato. Ti risponderò presto.
            </p>
          )}
          {submitError && (
            <p role="alert" className="text-sm text-destructive">
              {submitError}
            </p>
          )}
        </CardFooter>
      </form>
    </Card>
  );
}
