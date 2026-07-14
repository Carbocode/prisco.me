import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { AuthPage, formString, formValues } from "@/components/auth-ui";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/verifica-2fa")({
  head: () => ({
    meta: [
      { title: "Verifica in due passaggi | Prisco.me" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TwoFactorChallenge,
});

function TwoFactorChallenge() {
  const navigate = useNavigate();
  const [backup, setBackup] = useState(false);
  const [error, setError] = useState("");
  async function verify(event: React.FormEvent<HTMLFormElement>) {
    const values = formValues(event);
    const code = formString(values, "code").replaceAll(" ", "");
    const result = backup
      ? await authClient.twoFactor.verifyBackupCode({
          code,
          trustDevice: Boolean(values.get("trust")),
        })
      : await authClient.twoFactor.verifyTotp({ code, trustDevice: Boolean(values.get("trust")) });
    if (result.error) setError(result.error.message ?? "Codice non valido.");
    else void navigate({ to: "/profilo" });
  }
  return (
    <AuthPage
      title="Conferma che sei tu."
      description="Inserisci il codice dell’app di autenticazione oppure usa uno dei codici di recupero."
    >
      <Card>
        <CardContent>
          <form onSubmit={(event) => void verify(event)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="two-factor-code">
                  {backup ? "Codice di recupero" : "Codice a 6 cifre"}
                </FieldLabel>
                <Input id="two-factor-code" name="code" autoComplete="one-time-code" required />
              </Field>
              <Field orientation="horizontal">
                <Checkbox id="trust-device" name="trust" />
                <FieldLabel htmlFor="trust-device">
                  Considera attendibile questo dispositivo
                </FieldLabel>
              </Field>
              <Button type="submit">Verifica</Button>
            </FieldGroup>
          </form>
          <Button variant="outline" onClick={() => setBackup(!backup)}>
            Usa {backup ? "l’app di autenticazione" : "un codice di recupero"}
          </Button>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </AuthPage>
  );
}
