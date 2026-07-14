import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { KeyRound, ScanFace } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";

import { AuthPage, formString, formValues } from "@/components/auth-ui";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";

const searchSchema = z.object({
  mode: z.enum(["login", "register"]).catch("login"),
  callbackURL: z.string().startsWith("/").optional(),
});

export const Route = createFileRoute("/login")({
  validateSearch: searchSchema,
  head: () => ({
    meta: [{ title: "Accedi o registrati | Prisco.me" }, { name: "robots", content: "noindex" }],
  }),
  component: AccessPage,
});

function AccessPage() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const session = authClient.useSession();
  const [mode, setMode] = useState(search.mode);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const callbackURL = search.callbackURL ?? "/dashboard/profile";

  useEffect(() => {
    if (session.data) void navigate({ href: callbackURL });
  }, [callbackURL, navigate, session.data]);

  async function signIn(event: React.FormEvent<HTMLFormElement>) {
    const data = formValues(event);
    setPending(true);
    setMessage("");
    const identifier = formString(data, "identifier");
    const password = formString(data, "password");
    const result = identifier.includes("@")
      ? await authClient.signIn.email({ email: identifier, password, callbackURL })
      : await authClient.signIn.username({ username: identifier, password, callbackURL });
    setPending(false);
    if (result.error) setMessage(result.error.message ?? "Accesso non riuscito.");
  }

  async function signUp(event: React.FormEvent<HTMLFormElement>) {
    const data = formValues(event);
    setPending(true);
    setMessage("");
    const result = await authClient.signUp.email({
      name: formString(data, "name"),
      username: formString(data, "username"),
      email: formString(data, "email"),
      password: formString(data, "password"),
      callbackURL,
    });
    setPending(false);
    if (result.error) setMessage(result.error.message ?? "Registrazione non riuscita.");
    else void navigate({ href: callbackURL });
  }

  async function passkeySignIn() {
    setPending(true);
    setMessage("");
    const result = await authClient.signIn.passkey({ autoFill: false });
    setPending(false);
    if (result?.error) setMessage(result.error.message ?? "Passkey non riconosciuta.");
    else void navigate({ href: callbackURL });
  }

  return (
    <AuthPage
      title={mode === "login" ? "Bentornato." : "Crea il tuo account."}
      description="Gestisci identità, sicurezza, passkey, sessioni e autorizzazioni OAuth da un unico profilo."
    >
      <Card className="mx-auto w-full max-w-md">
        <CardContent>
          {mode === "login" ? (
            <form onSubmit={(event) => void signIn(event)}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="login-identifier">Email o username</FieldLabel>
                  <Input
                    id="login-identifier"
                    name="identifier"
                    autoComplete="username webauthn"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="login-password">Password</FieldLabel>
                  <Input
                    id="login-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                  />
                </Field>
                <Button disabled={pending} type="submit">
                  <KeyRound size={17} className="mr-2" />
                  Accedi
                </Button>
                <p>
                  Non hai ancora un account?{" "}
                  <Button
                    variant="link"
                    render={
                      <Link
                        to="/login"
                        search={{ mode: "register", callbackURL: search.callbackURL }}
                        onClick={() => {
                          setMode("register");
                          setMessage("");
                        }}
                      />
                    }
                  >
                    Registrati
                  </Button>
                </p>
                <FieldSeparator>oppure</FieldSeparator>
                <Button
                  type="button"
                  disabled={pending}
                  onClick={() => void passkeySignIn()}
                  variant="outline"
                >
                  <ScanFace size={17} className="mr-2" />
                  Accedi con passkey
                </Button>
              </FieldGroup>
            </form>
          ) : (
            <form onSubmit={(event) => void signUp(event)}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="register-name">Nome</FieldLabel>
                  <Input id="register-name" name="name" autoComplete="name" required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="register-username">Username</FieldLabel>
                  <Input
                    id="register-username"
                    name="username"
                    autoComplete="username"
                    placeholder="vincenzo.prisco"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="register-email">Email</FieldLabel>
                  <Input
                    id="register-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="register-password">Password</FieldLabel>
                  <Input
                    id="register-password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                  />
                  <FieldDescription>
                    Almeno 8 caratteri. Il ruolo iniziale è sempre Utente.
                  </FieldDescription>
                </Field>
                <Button disabled={pending} type="submit">
                  Crea account
                </Button>
                <p>
                  Hai già un account?{" "}
                  <Button
                    variant="link"
                    render={
                      <Link
                        to="/login"
                        search={{ mode: "login", callbackURL: search.callbackURL }}
                        onClick={() => {
                          setMode("login");
                          setMessage("");
                        }}
                      />
                    }
                  >
                    Accedi
                  </Button>
                </p>
              </FieldGroup>
            </form>
          )}
          {message && (
            <Alert variant="destructive">
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </AuthPage>
  );
}
