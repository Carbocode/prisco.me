import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import z from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  contactRequestSchema,
  createContactRequest,
} from "@/server/contact-requests";
import { Card, CardContent, CardFooter } from "./ui/card";

const toFieldErrors = (
  errors: Array<{ message?: string } | string | undefined>,
) =>
  errors.map((error) =>
    typeof error === "string" ? { message: error } : error,
  );

export default function ContactRequestForm() {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      company: "",
      message: "",
      consentToContact: false,
    },
    validators: {
      onBlur: contactRequestSchema,
      onSubmit: contactRequestSchema,
    },
    onSubmit: async ({ value }) => {
      setSubmitError(null);
      setSubmitted(false);

      try {
        await createContactRequest({ data: value });
        form.reset();
        setSubmitted(true);
      } catch {
        setSubmitError(
          "Si e verificato un problema durante l'invio. Riprova tra poco.",
        );
      }
    },
  });

  return (
    <Card
      onSubmit={(event) => {
        event.preventDefault();
        event.stopPropagation();
        form.handleSubmit();
      }}
    >
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          <FieldSet>
            <FieldGroup className="gap-6">
              <div className="grid gap-6 md:grid-cols-2">
                <form.Field name="name">
                  {(field) => {
                    const invalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field>
                        <FieldLabel htmlFor={field.name}>Nome*</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          autoComplete="name"
                          placeholder="Mario Rossi"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
                          aria-invalid={invalid}
                        />
                        {invalid && (
                          <FieldError
                            errors={toFieldErrors(field.state.meta.errors)}
                          />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                <form.Field name="email">
                  {(field) => {
                    const invalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field>
                        <FieldLabel htmlFor={field.name}>Email*</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          type="email"
                          autoComplete="email"
                          placeholder="mario@email.it"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
                          aria-invalid={invalid}
                        />
                        {invalid && (
                          <FieldError
                            errors={toFieldErrors(field.state.meta.errors)}
                          />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <form.Field name="phone">
                  {(field) => {
                    const invalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field>
                        <FieldLabel htmlFor={field.name}>Telefono</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          autoComplete="tel"
                          placeholder="+39 333 123 4567"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
                          aria-invalid={invalid}
                        />
                        {invalid && (
                          <FieldError
                            errors={toFieldErrors(field.state.meta.errors)}
                          />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>

                <form.Field name="company">
                  {(field) => {
                    const invalid =
                      field.state.meta.isTouched && !field.state.meta.isValid;
                    return (
                      <Field>
                        <FieldLabel htmlFor={field.name}>Azienda</FieldLabel>
                        <Input
                          id={field.name}
                          name={field.name}
                          autoComplete="organization"
                          placeholder="Studio Prisco"
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(event) =>
                            field.handleChange(event.target.value)
                          }
                          aria-invalid={invalid}
                        />
                        {invalid && (
                          <FieldError
                            errors={toFieldErrors(field.state.meta.errors)}
                          />
                        )}
                      </Field>
                    );
                  }}
                </form.Field>
              </div>

              <form.Field name="message">
                {(field) => {
                  const invalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={invalid}>
                      <FieldLabel htmlFor={field.name}>Messaggio</FieldLabel>
                      <Textarea
                        id={field.name}
                        name={field.name}
                        placeholder="Raccontaci il tuo progetto e cosa possiamo fare per te."
                        rows={5}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value)
                        }
                        aria-invalid={invalid}
                      />

                      {invalid && (
                        <FieldError
                          errors={toFieldErrors(field.state.meta.errors)}
                        />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="consentToContact">
                {(field) => {
                  const invalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field orientation="horizontal">
                      <Checkbox
                        id={field.name}
                        checked={field.state.value}
                        onCheckedChange={(checked) =>
                          field.handleChange(Boolean(checked))
                        }
                        aria-invalid={invalid}
                      />

                      <FieldLabel htmlFor={field.name}>
                        Acconsento a essere ricontattato per questa richiesta.
                      </FieldLabel>

                      {invalid && (
                        <FieldError
                          errors={toFieldErrors(field.state.meta.errors)}
                        />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
            </FieldGroup>
          </FieldSet>
        </form>
      </CardContent>
      <CardFooter className="gap-2">
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <Button
              onClick={form.handleSubmit}
              disabled={!canSubmit || isSubmitting}
            >
              {form.state.isSubmitting
                ? "Invio in corso..."
                : "Invia richiesta"}
            </Button>
          )}
        </form.Subscribe>

        {submitted && (
          <p className="text-sm text-emerald-600">
            Richiesta inviata. Ti risponderemo presto.
          </p>
        )}
        {submitError && (
          <p className="text-sm text-destructive">{submitError}</p>
        )}
      </CardFooter>
    </Card>
  );
}
