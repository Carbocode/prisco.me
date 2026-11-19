import { Link, useNavigate } from "@tanstack/react-router";
import { getRouteApi } from "@tanstack/react-router";
import { KeyRound, ScanFace } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

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
import { localizedPath } from "@/config/site";
import { authClient } from "@/features/auth/client/auth-client";
import { AuthPage, formString, formValues } from "@/features/auth/components/auth-ui";
import { TurnstileWidget } from "@/features/auth/components/turnstile-widget";
import { useSiteLocale } from "@/features/site/client/site-location";
import * as m from "@/paraglide/messages.js";

const routeApi = getRouteApi("/login");

export function AccessPage() {
  const locale = useSiteLocale();
  const search = routeApi.useSearch();
  const turnstileSiteKey = routeApi.useLoaderData();
  const captchaEnabled = Boolean(turnstileSiteKey);
  const navigate = useNavigate();
  const session = authClient.useSession();
  const [mode, setMode] = useState(search.mode);
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [turnstileRevision, setTurnstileRevision] = useState(0);
  const callbackURL = search.callbackURL ?? localizedPath("/dashboard/profile", locale);

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
    setMessage(m.login_expired({}, { locale }));
    resetTurnstile();
  }, [locale, resetTurnstile]);

  const handleTurnstileError = useCallback(() => {
    setTurnstileToken(null);
    setMessage(m.login_unavailable({}, { locale }));
  }, [locale]);

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
        ? m.login_wait_seconds({ seconds: retryAfter }, { locale })
        : m.login_rate_limit({}, { locale });
    }
    if (error.code === "MISSING_RESPONSE") return m.login_check_required({}, { locale });
    if (error.code === "INVALID_USERNAME") return m.login_username_invalid({}, { locale });
    if (error.code === "VERIFICATION_FAILED" || error.status === 403)
      return m.login_check_failed({}, { locale });
    if (error.code === "UNKNOWN_ERROR" || (error.status ?? 0) >= 500)
      return m.login_unavailable({}, { locale });
    return error.message ?? fallback;
  }

  async function signIn(event: React.FormEvent<HTMLFormElement>) {
    const data = formValues(event);
    if (captchaEnabled && !turnstileToken) {
      setMessage(m.login_check_sign_in({}, { locale }));
      return;
    }
    setPending(true);
    setMessage("");
    let retryAfter: string | null = null;
    const identifier = formString(data, "identifier").trim();
    const password = formString(data, "password");
    const result = identifier.includes("@")
      ? await authClient.signIn.email({
          email: identifier,
          password,
          callbackURL,
          fetchOptions: turnstileToken
            ? captchaFetchOptions(turnstileToken, (value) => (retryAfter = value))
            : undefined,
        })
      : await authClient.signIn.username({
          username: identifier,
          password,
          callbackURL,
          fetchOptions: turnstileToken
            ? captchaFetchOptions(turnstileToken, (value) => (retryAfter = value))
            : undefined,
        });
    setPending(false);
    if (result.error) {
      setMessage(
        authErrorMessage(result.error, retryAfter, m.login_sign_in_failed({}, { locale })),
      );
      resetTurnstile();
    }
  }

  async function signUp(event: React.FormEvent<HTMLFormElement>) {
    const data = formValues(event);
    if (captchaEnabled && !turnstileToken) {
      setMessage(m.login_check_register({}, { locale }));
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
      fetchOptions: turnstileToken
        ? captchaFetchOptions(turnstileToken, (value) => (retryAfter = value))
        : undefined,
    });
    setPending(false);
    if (result.error) {
      setMessage(
        authErrorMessage(result.error, retryAfter, m.login_register_failed({}, { locale })),
      );
      resetTurnstile();
    } else void navigate({ href: callbackURL });
  }

  async function passkeySignIn() {
    setPending(true);
    setMessage("");
    const result = await authClient.signIn.passkey({ autoFill: false });
    setPending(false);
    if (result?.error) setMessage(result.error.message ?? m.login_passkey_failed({}, { locale }));
    else void navigate({ href: callbackURL });
  }

  return (
    <AuthPage
      title={mode === "login" ? m.login_welcome({}, { locale }) : m.login_register({}, { locale })}
      description={m.login_manage_your_identity_security_passkeys_sessions({}, { locale })}
    >
      <Card className="mx-auto w-full max-w-md">
        <CardContent>
          {mode === "login" ? (
            <form onSubmit={(event) => void signIn(event)}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="login-identifier">
                    {m.login_email_or_username({}, { locale })}
                  </FieldLabel>
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
                {turnstileSiteKey ? (
                  <Field>
                    <TurnstileWidget
                      key={`login-${turnstileRevision}`}
                      siteKey={turnstileSiteKey}
                      onVerify={handleTurnstileVerify}
                      onExpire={handleTurnstileExpire}
                      onError={handleTurnstileError}
                    />
                    <FieldDescription>
                      {m.login_verification_protects_your_account_from_automated(
                        {},
                        { locale },
                      )}{" "}
                    </FieldDescription>
                  </Field>
                ) : null}
                <Button disabled={pending || (captchaEnabled && !turnstileToken)} type="submit">
                  {pending ? (
                    <Spinner data-icon="inline-start" />
                  ) : (
                    <KeyRound data-icon="inline-start" />
                  )}
                  {pending ? m.login_signing_in({}, { locale }) : m.login_sign_in({}, { locale })}
                </Button>
                <p>
                  {m.login_don_t_have_an_account({}, { locale })}{" "}
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
                    {m.login_sign_up({}, { locale })}{" "}
                  </Link>
                </p>
                <FieldSeparator>{m.login_or({}, { locale })}</FieldSeparator>
                <Button
                  type="button"
                  disabled={pending}
                  onClick={() => void passkeySignIn()}
                  variant="outline"
                >
                  <ScanFace data-icon="inline-start" />
                  {m.login_sign_in_with_a_passkey({}, { locale })}{" "}
                </Button>
              </FieldGroup>
            </form>
          ) : (
            <form onSubmit={(event) => void signUp(event)}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="register-name">{m.login_name({}, { locale })}</FieldLabel>
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
                    {m.login_at_least_characters_new_accounts_start({}, { locale })}{" "}
                  </FieldDescription>
                </Field>
                {turnstileSiteKey ? (
                  <Field>
                    <TurnstileWidget
                      key={`register-${turnstileRevision}`}
                      siteKey={turnstileSiteKey}
                      onVerify={handleTurnstileVerify}
                      onExpire={handleTurnstileExpire}
                      onError={handleTurnstileError}
                    />
                    <FieldDescription>
                      {m.login_verification_protects_sign_ups_from_automated({}, { locale })}{" "}
                    </FieldDescription>
                  </Field>
                ) : null}
                <Button disabled={pending || (captchaEnabled && !turnstileToken)} type="submit">
                  {pending && <Spinner data-icon="inline-start" />}
                  {pending
                    ? m.login_creating_account({}, { locale })
                    : m.login_create_account({}, { locale })}
                </Button>
                <p>
                  {m.login_already_have_an_account({}, { locale })}{" "}
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
                    {m.login_sign_in({}, { locale })}{" "}
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
