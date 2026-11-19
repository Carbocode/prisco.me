import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/features/auth/client/auth-client";
import { AuthPage, formString, formValues } from "@/features/auth/components/auth-ui";
import { useSiteLocale } from "@/features/site/client/site-location";
import * as m from "@/paraglide/messages.js";

export const Route = createFileRoute("/verify-2fa")({
  head: ({
    match: {
      context: { locale },
    },
  }) => ({
    meta: [
      { title: m.twofactor_seo_title({}, { locale }) },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TwoFactorChallenge,
});

function TwoFactorChallenge() {
  const locale = useSiteLocale();
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
    if (result.error) setError(result.error.message ?? m.twofactor_invalid({}, { locale }));
    else void navigate({ to: "/dashboard/profile" });
  }
  return (
    <AuthPage
      title={m.twofactor_confirm_that_it_s_you({}, { locale })}
      description={m.twofactor_enter_the_code_from_your_authenticator({}, { locale })}
    >
      <Card>
        <CardContent>
          <form onSubmit={(event) => void verify(event)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="two-factor-code">
                  {backup
                    ? m.twofactor_recovery_code({}, { locale })
                    : m.twofactor_six_digit_code({}, { locale })}
                </FieldLabel>
                <Input id="two-factor-code" name="code" autoComplete="one-time-code" required />
              </Field>
              <Field orientation="horizontal">
                <Checkbox id="trust-device" name="trust" />
                <FieldLabel htmlFor="trust-device">
                  {m.twofactor_trust_this_device({}, { locale })}{" "}
                </FieldLabel>
              </Field>
              <Button type="submit">{m.twofactor_verify({}, { locale })}</Button>
            </FieldGroup>
          </form>
          <Button variant="outline" onClick={() => setBackup(!backup)}>
            {m.twofactor_use({}, { locale })}{" "}
            {backup
              ? m.twofactor_app({}, { locale })
              : m.twofactor_use_recovery_code({}, { locale })}
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
