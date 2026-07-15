import { useForm } from "@tanstack/react-form";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldError, FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  contactRequestSchema,
  createContactRequest,
  type ContactRequestValues,
} from "@/server/contact-requests";

import { Alert, AlertDescription } from "./ui/alert";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./ui/card";

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
    <Card>
      <CardHeader>
        <CardTitle>Invia una richiesta</CardTitle>
        <CardDescription>Il prossimo prodotto inizia da una conversazione.</CardDescription>
      </CardHeader>
      <form
        id="contact-request-form"
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
                      <Select
                        items={[
                          { value: "product", label: "Sviluppo di un prodotto" },
                          { value: "technical", label: "Collaborazione tecnica" },
                          { value: "consulting", label: "Consulenza" },
                          { value: "opportunity", label: "Opportunità professionale" },
                          { value: "other", label: "Altro" },
                        ]}
                        value={field.state.value}
                        onValueChange={(value) =>
                          value && isContactInterest(value) && field.handleChange(value)
                        }
                      >
                        <SelectTrigger id={field.name} aria-invalid={invalid}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="product">Sviluppo di un prodotto</SelectItem>
                            <SelectItem value="technical">Collaborazione tecnica</SelectItem>
                            <SelectItem value="consulting">Consulenza</SelectItem>
                            <SelectItem value="opportunity">Opportunità professionale</SelectItem>
                            <SelectItem value="other">Altro</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
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
      </form>
      <CardFooter>
        <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
          {([canSubmit, isSubmitting]) => (
            <Button type="submit" form="contact-request-form" disabled={!canSubmit || isSubmitting}>
              {isSubmitting ? "Invio in corso..." : "Invia richiesta"}
            </Button>
          )}
        </form.Subscribe>

        {submitted && (
          <Alert>
            <AlertDescription>Messaggio inviato. Ti risponderò presto.</AlertDescription>
          </Alert>
        )}
        {submitError && (
          <Alert variant="destructive">
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}
      </CardFooter>
    </Card>
  );
}
