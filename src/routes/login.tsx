import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { KeyRound, ScanFace } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { z } from "zod";

import { AuthPage, formString, formValues } from "@/components/auth-ui";
import { TurnstileWidget } from "@/components/turnstile-widget";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import { getTurnstileSiteKey } from "@/server/turnstile";

const searchSchema = z.object({
  mode: z.enum(["login", "register"]).catch("login"),
  callbackURL: z.string().startsWith("/").optional(),
});

export const Route = createFileRoute("/login")({
  validateSearch: searchSchema,
  loader: () => getTurnstileSiteKey(),
  head: () => ({
    meta: [{ title: "Accedi o registrati | Prisco.me" }, { name: "robots", content: "noindex" }],
  }),
  component: AccessPage,
});

function AccessPage() {
  const search = Route.useSearch();
  const turnstileSiteKey = Route.useLoaderData();
  const navigate = useNavigate();
  const session = authClient.useSession();
  const [mode, setMode] = useState(search.mode);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileRevision, setTurnstileRevision] = useState(0);
  const callbackURL = search.callbackURL ?? "/dashboard/profile";

  useEffect(() => {
    if (session.data) void navigate({ href: callbackURL });
  }, [callbackURL, navigate, session.data]);

  const resetTurnstile = useCallback(() => {
    setTurnstileToken(null);
    setTurnstileRevision((revision) => revision + 1);
  }, []);

  const handleTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token);
  }, []);

  const handleTurnstileExpire = useCallback(() => {
    setMessage("La verifica anti-bot è scaduta. Attendi la nuova verifica e riprova.");
    resetTurnstile();
  }, [resetTurnstile]);

  const handleTurnstileError = useCallback(() => {
    setTurnstileToken(null);
    setMessage("Il servizio di verifica anti-bot non è disponibile. Riprova tra poco.");
  }, []);

  function captchaFetchOptions(token: string, onRetryAfter: (value: string | null) => void) {
    return {
      headers: { "x-captcha-response": token },
      onError: ({ response }: { response: Response }) => {
        onRetryAfter(response.headers.get("X-Retry-After"));
      },
    };
  }

  function authErrorMessage(
    error: { status?: number; code?: string; message?: string },
    retryAfter: string | null,
    fallback: string,
  ) {
    if (error.status === 429) {
      return retryAfter
        ? `Troppi tentativi. Riprova tra ${retryAfter} secondi.`
        : "Troppi tentativi. Attendi qualche istante e riprova.";
    }
    if (error.code === "MISSING_RESPONSE") return "Completa la verifica anti-bot.";
    if (error.code === "VERIFICATION_FAILED" || error.status === 403)
      return "Verifica anti-bot non valida o scaduta. Riprova.";
    if (error.code === "UNKNOWN_ERROR" || (error.status ?? 0) >= 500)
      return "Il servizio di verifica anti-bot non è disponibile. Riprova tra poco.";
    return error.message ?? fallback;
  }

  async function signIn(event: React.FormEvent<HTMLFormElement>) {
    const data = formValues(event);
    if (!turnstileToken) {
      setMessage("Completa la verifica anti-bot prima di accedere.");
      return;
    }
    setPending(true);
    setMessage("");
    let retryAfter: string | null = null;
    const identifier = formString(data, "identifier");
    const password = formString(data, "password");
    const result = identifier.includes("@")
      ? await authClient.signIn.email({
          email: identifier,
          password,
          callbackURL,
          fetchOptions: captchaFetchOptions(turnstileToken, (value) => (retryAfter = value)),
        })
      : await authClient.signIn.username({
          username: identifier,
          password,
          callbackURL,
          fetchOptions: captchaFetchOptions(turnstileToken, (value) => (retryAfter = value)),
        });
    setPending(false);
    if (result.error) {
      setMessage(authErrorMessage(result.error, retryAfter, "Accesso non riuscito."));
      resetTurnstile();
    }
  }

  async function signUp(event: React.FormEvent<HTMLFormElement>) {
    const data = formValues(event);
    if (!turnstileToken) {
      setMessage("Completa la verifica anti-bot prima di registrarti.");
      return;
    }
    setPending(true);
    setMessage("");
    let retryAfter: string | null = null;
    const result = await authClient.signUp.email({
      name: formString(data, "name"),
      username: formString(data, "username"),
      email: formString(data, "email"),
      password: formString(data, "password"),
      callbackURL,
      fetchOptions: captchaFetchOptions(turnstileToken, (value) => (retryAfter = value)),
    });
    setPending(false);
    if (result.error) {
      setMessage(authErrorMessage(result.error, retryAfter, "Registrazione non riuscita."));
      resetTurnstile();
    } else void navigate({ href: callbackURL });
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
                <Field>
                  <TurnstileWidget
                    key={`login-${turnstileRevision}`}
                    siteKey={turnstileSiteKey}
                    onVerify={handleTurnstileVerify}
                    onExpire={handleTurnstileExpire}
                    onError={handleTurnstileError}
                  />
                  <FieldDescription>
                    La verifica protegge l’account dai tentativi di accesso automatici.
                  </FieldDescription>
                </Field>
                <Button disabled={pending || !turnstileToken} type="submit">
                  {pending ? (
                    <Spinner data-icon="inline-start" />
                  ) : (
                    <KeyRound data-icon="inline-start" />
                  )}
                  {pending ? "Accesso…" : "Accedi"}
                </Button>
                <p>
                  Non hai ancora un account?{" "}
                  <Link
                    className={buttonVariants({ variant: "link" })}
                    to="/login"
                    search={{ mode: "register", callbackURL: search.callbackURL }}
                    onClick={() => {
                      setMode("register");
                      setMessage("");
                      resetTurnstile();
                    }}
                  >
                    Registrati
                  </Link>
                </p>
                <FieldSeparator>oppure</FieldSeparator>
                <Button
                  type="button"
                  disabled={pending}
                  onClick={() => void passkeySignIn()}
                  variant="outline"
                >
                  <ScanFace data-icon="inline-start" />
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
                <Field>
                  <TurnstileWidget
                    key={`register-${turnstileRevision}`}
                    siteKey={turnstileSiteKey}
                    onVerify={handleTurnstileVerify}
                    onExpire={handleTurnstileExpire}
                    onError={handleTurnstileError}
                  />
                  <FieldDescription>
                    La verifica protegge la registrazione dagli account automatici.
                  </FieldDescription>
                </Field>
                <Button disabled={pending || !turnstileToken} type="submit">
                  {pending && <Spinner data-icon="inline-start" />}
                  {pending ? "Creazione…" : "Crea account"}
                </Button>
                <p>
                  Hai già un account?{" "}
                  <Link
                    className={buttonVariants({ variant: "link" })}
                    to="/login"
                    search={{ mode: "login", callbackURL: search.callbackURL }}
                    onClick={() => {
                      setMode("login");
                      setMessage("");
                      resetTurnstile();
                    }}
                  >
                    Accedi
                  </Link>
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
