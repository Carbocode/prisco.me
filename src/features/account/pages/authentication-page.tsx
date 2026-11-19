import type { Passkey } from "@better-auth/passkey";
import { Fingerprint, KeyRound, ShieldCheck } from "lucide-react";
import QRCode from "qrcode";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Field, FieldGroup, FieldLabel, FieldSeparator } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { authClient } from "@/features/auth/client/auth-client";
import { formString, formValues } from "@/features/auth/components/auth-ui";
import { useSiteLocale } from "@/features/site/client/site-location";
import * as m from "@/paraglide/messages.js";

type TwoFactorSetup = { uri: string; qr: string; backupCodes: string[] };

export function AuthenticationPage() {
  const locale = useSiteLocale();
  const session = authClient.useSession();
  const user = session.data!.user;
  const [setup, setSetup] = useState<TwoFactorSetup | null>(null);
  const [passkeys, setPasskeys] = useState<Passkey[]>([]);

  const refreshPasskeys = useCallback(async () => {
    const result = await authClient.passkey.listUserPasskeys();
    if (result.data) setPasskeys(result.data);
    else toast.error(result.error?.message ?? m.security_load_passkeys_failed({}, { locale }));
  }, [locale]);

  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect -- State updates happen after the awaited network response.
    void refreshPasskeys();
  }, [refreshPasskeys]);

  async function changePassword(event: React.FormEvent<HTMLFormElement>) {
    const values = formValues(event);
    const result = await authClient.changePassword({
      currentPassword: formString(values, "currentPassword"),
      newPassword: formString(values, "newPassword"),
      revokeOtherSessions: true,
    });
    if (result.error) toast.error(result.error.message ?? m.security_update_failed({}, { locale }));
    else toast.success(m.security_password_updated({}, { locale }));
  }

  async function enableTwoFactor(event: React.FormEvent<HTMLFormElement>) {
    const values = formValues(event);
    const result = await authClient.twoFactor.enable({ password: formString(values, "password") });
    if (result.error || !result.data || result.data.method !== "totp") {
      toast.error(result.error?.message ?? m.security_enable_failed({}, { locale }));
      return;
    }
    const qr = await QRCode.toDataURL(result.data.totpURI, { width: 240, margin: 1 });
    setSetup({ uri: result.data.totpURI, qr, backupCodes: result.data.backupCodes });
  }

  async function confirmTwoFactor(event: React.FormEvent<HTMLFormElement>) {
    const values = formValues(event);
    const result = await authClient.twoFactor.verifyTotp({ code: formString(values, "code") });
    if (result.error) toast.error(result.error.message ?? m.security_invalid_code({}, { locale }));
    else {
      toast.success(m.security_enabled({}, { locale }));
      setSetup(null);
      await session.refetch();
    }
  }

  async function disableTwoFactor(event: React.FormEvent<HTMLFormElement>) {
    const values = formValues(event);
    const result = await authClient.twoFactor.disable({ password: formString(values, "password") });
    if (result.error)
      toast.error(result.error.message ?? m.security_disable_failed({}, { locale }));
    else toast.success(m.security_disabled({}, { locale }));
    await session.refetch();
  }

  async function regenerateCodes(event: React.FormEvent<HTMLFormElement>) {
    const values = formValues(event);
    const result = await authClient.twoFactor.generateBackupCodes({
      password: formString(values, "password"),
    });
    if (result.data) {
      setSetup({ uri: "", qr: "", backupCodes: result.data.backupCodes });
      toast.success(m.security_codes_regenerated({}, { locale }));
    } else toast.error(result.error?.message ?? m.security_codes_failed({}, { locale }));
  }

  async function addPasskey(event: React.FormEvent<HTMLFormElement>) {
    const values = formValues(event);
    const result = await authClient.passkey.addPasskey({
      name: formString(values, "name") || undefined,
    });
    if (result?.error) toast.error(result.error.message ?? m.security_add_failed({}, { locale }));
    else toast.success(m.security_passkey_added({}, { locale }));
    await refreshPasskeys();
  }

  return (
    <div className="flex max-w-5xl flex-col gap-4">
      <header>
        <p className="text-sm font-medium text-muted-foreground">
          {m.security_account_security({}, { locale })}
        </p>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {m.security_authentication({}, { locale })}
        </h1>
        <p className="text-sm text-muted-foreground">
          {m.security_passwords_two_factor_authentication_and_passwordless({}, { locale })}{" "}
        </p>
      </header>
      <Card size="sm">
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>
            {m.security_changing_your_password_automatically_revokes_all({}, { locale })}{" "}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(event) => void changePassword(event)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="current-password">
                  {m.security_current_password({}, { locale })}
                </FieldLabel>
                <Input
                  id="current-password"
                  name="currentPassword"
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="new-password">
                  {m.security_new_password({}, { locale })}
                </FieldLabel>
                <Input
                  id="new-password"
                  name="newPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                />
              </Field>
              <Button type="submit">
                <KeyRound />
                {m.security_update_password({}, { locale })}{" "}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <Card size="sm">
        <CardHeader>
          <CardTitle>{m.security_two_factor_authentication({}, { locale })}</CardTitle>
          <CardDescription>
            {m.security_totp_trusted_devices_and_recovery_codes({}, { locale })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            {!user.twoFactorEnabled ? (
              <form onSubmit={(event) => void enableTwoFactor(event)}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="enable-2fa-password">
                      {m.security_confirm_your_password({}, { locale })}
                    </FieldLabel>
                    <Input id="enable-2fa-password" name="password" type="password" required />
                  </Field>
                  <Button type="submit">
                    <ShieldCheck />
                    {m.security_set_up_fa({}, { locale })}{" "}
                  </Button>
                </FieldGroup>
              </form>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                <form onSubmit={(event) => void regenerateCodes(event)}>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="backup-password">Password</FieldLabel>
                      <Input id="backup-password" name="password" type="password" required />
                    </Field>
                    <Button type="submit" variant="outline">
                      {m.security_regenerate_recovery_codes({}, { locale })}{" "}
                    </Button>
                  </FieldGroup>
                </form>
                <form onSubmit={(event) => void disableTwoFactor(event)}>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="disable-2fa-password">Password</FieldLabel>
                      <Input id="disable-2fa-password" name="password" type="password" required />
                    </Field>
                    <Button type="submit" variant="destructive">
                      {m.security_disable_fa({}, { locale })}{" "}
                    </Button>
                  </FieldGroup>
                </form>
              </div>
            )}
            {setup && (
              <>
                <FieldSeparator>{m.security_setup({}, { locale })}</FieldSeparator>
                <Alert>
                  <AlertDescription>
                    {setup.qr && (
                      <img
                        src={setup.qr}
                        className="mb-4 size-52 rounded-lg"
                        alt={m.security_qr_code_for_setting_up_your({}, { locale })}
                      />
                    )}
                    {setup.uri && <code className="block break-all text-xs">{setup.uri}</code>}
                    <p className="mt-4 text-sm font-semibold">
                      {m.security_save_your_recovery_codes({}, { locale })}
                    </p>
                    <div className="mt-2 grid grid-cols-2 gap-2 font-mono text-sm">
                      {setup.backupCodes.map((code) => (
                        <span key={code}>{code}</span>
                      ))}
                    </div>
                    {setup.uri && (
                      <form className="mt-5" onSubmit={(event) => void confirmTwoFactor(event)}>
                        <FieldGroup>
                          <Field>
                            <FieldLabel htmlFor="totp-code">
                              {m.security_verification_code({}, { locale })}
                            </FieldLabel>
                            <Input id="totp-code" name="code" inputMode="numeric" required />
                          </Field>
                          <Button type="submit">{m.security_confirm({}, { locale })}</Button>
                        </FieldGroup>
                      </form>
                    )}
                  </AlertDescription>
                </Alert>
              </>
            )}
          </FieldGroup>
        </CardContent>
      </Card>
      <Card size="sm">
        <CardHeader>
          <CardTitle>Passkey</CardTitle>
          <CardDescription>
            {m.security_use_biometrics_your_device_pin_or({}, { locale })}{" "}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(event) => void addPasskey(event)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="passkey-name">
                  {m.security_passkey_name({}, { locale })}
                </FieldLabel>
                <Input
                  id="passkey-name"
                  name="name"
                  placeholder={m.security_e_g_personal_macbook({}, { locale })}
                />
              </Field>
              <Button type="submit">{m.security_add_passkey({}, { locale })}</Button>
            </FieldGroup>
          </form>
          <ItemGroup className="mt-4">
            {passkeys.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Fingerprint />
                  </EmptyMedia>
                  <EmptyTitle>{m.security_no_passkeys({}, { locale })}</EmptyTitle>
                  <EmptyDescription>
                    {m.security_you_haven_t_registered_a_passkey({}, { locale })}
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              passkeys.map((item) => (
                <Item key={item.id}>
                  <ItemMedia variant="icon">
                    <Fingerprint />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{item.name ?? "Passkey"}</ItemTitle>
                    <ItemDescription>
                      {item.deviceType} · {item.backedUp ? "sincronizzata" : "solo dispositivo"}
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Button
                      variant="outline"
                      onClick={async () => {
                        const name = prompt("Nuovo nome della passkey", item.name ?? "");
                        if (name) {
                          const result = await authClient.passkey.updatePasskey({
                            id: item.id,
                            name,
                          });
                          if (result.error)
                            toast.error(
                              result.error.message ?? m.security_rename_failed({}, { locale }),
                            );
                          else toast.success(m.security_passkey_renamed({}, { locale }));
                          await refreshPasskeys();
                        }
                      }}
                    >
                      {m.security_rename({}, { locale })}{" "}
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={async () => {
                        const result = await authClient.passkey.deletePasskey({ id: item.id });
                        if (result.error)
                          toast.error(
                            result.error.message ?? m.security_remove_failed({}, { locale }),
                          );
                        else toast.success(m.security_passkey_removed({}, { locale }));
                        await refreshPasskeys();
                      }}
                    >
                      {m.security_remove({}, { locale })}{" "}
                    </Button>
                  </ItemActions>
                </Item>
              ))
            )}
          </ItemGroup>
        </CardContent>
      </Card>
    </div>
  );
}
