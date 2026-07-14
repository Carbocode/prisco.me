import type { Passkey } from "@better-auth/passkey";
import { createFileRoute } from "@tanstack/react-router";
import { Fingerprint, KeyRound, ShieldCheck } from "lucide-react";
import QRCode from "qrcode";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { formString, formValues } from "@/components/auth-ui";
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
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { authClient } from "@/lib/auth-client";

type TwoFactorSetup = { uri: string; qr: string; backupCodes: string[] };

export const Route = createFileRoute("/dashboard/profile/authentication")({
  head: () => ({ meta: [{ title: "Autenticazione | Prisco.me" }] }),
  component: AuthenticationPage,
});

function AuthenticationPage() {
  const session = authClient.useSession();
  const user = session.data!.user;
  const [setup, setSetup] = useState<TwoFactorSetup | null>(null);
  const [passkeys, setPasskeys] = useState<Passkey[]>([]);

  const refreshPasskeys = useCallback(async () => {
    const result = await authClient.passkey.listUserPasskeys();
    if (result.data) setPasskeys(result.data);
    else toast.error(result.error?.message ?? "Impossibile caricare le passkey.");
  }, []);

  useEffect(() => {
    void refreshPasskeys();
  }, [refreshPasskeys]);

  async function changePassword(event: React.FormEvent<HTMLFormElement>) {
    const values = formValues(event);
    const result = await authClient.changePassword({
      currentPassword: formString(values, "currentPassword"),
      newPassword: formString(values, "newPassword"),
      revokeOtherSessions: true,
    });
    if (result.error) toast.error(result.error.message ?? "Aggiornamento non riuscito.");
    else toast.success("Password aggiornata e altre sessioni revocate.");
  }

  async function enableTwoFactor(event: React.FormEvent<HTMLFormElement>) {
    const values = formValues(event);
    const result = await authClient.twoFactor.enable({ password: formString(values, "password") });
    if (result.error || !result.data) {
      toast.error(result.error?.message ?? "Impossibile attivare la 2FA.");
      return;
    }
    const qr = await QRCode.toDataURL(result.data.totpURI, { width: 240, margin: 1 });
    setSetup({ uri: result.data.totpURI, qr, backupCodes: result.data.backupCodes });
  }

  async function confirmTwoFactor(event: React.FormEvent<HTMLFormElement>) {
    const values = formValues(event);
    const result = await authClient.twoFactor.verifyTotp({ code: formString(values, "code") });
    if (result.error) toast.error(result.error.message ?? "Codice non valido.");
    else {
      toast.success("Autenticazione a due fattori attivata.");
      setSetup(null);
      await session.refetch();
    }
  }

  async function disableTwoFactor(event: React.FormEvent<HTMLFormElement>) {
    const values = formValues(event);
    const result = await authClient.twoFactor.disable({ password: formString(values, "password") });
    if (result.error) toast.error(result.error.message ?? "Disattivazione non riuscita.");
    else toast.success("Autenticazione a due fattori disattivata.");
    await session.refetch();
  }

  async function regenerateCodes(event: React.FormEvent<HTMLFormElement>) {
    const values = formValues(event);
    const result = await authClient.twoFactor.generateBackupCodes({
      password: formString(values, "password"),
    });
    if (result.data) {
      setSetup({ uri: "", qr: "", backupCodes: result.data.backupCodes });
      toast.success("Codici di recupero rigenerati.");
    } else toast.error(result.error?.message ?? "Impossibile generare i codici.");
  }

  async function addPasskey(event: React.FormEvent<HTMLFormElement>) {
    const values = formValues(event);
    const result = await authClient.passkey.addPasskey({
      name: formString(values, "name") || undefined,
    });
    if (result?.error) toast.error(result.error.message ?? "Aggiunta non riuscita.");
    else toast.success("Passkey aggiunta.");
    await refreshPasskeys();
  }

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Autenticazione</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Gestisci password, verifica in due passaggi e accesso con passkey.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>
            La modifica revoca automaticamente tutte le altre sessioni.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(event) => void changePassword(event)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="current-password">Password attuale</FieldLabel>
                <Input
                  id="current-password"
                  name="currentPassword"
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="new-password">Nuova password</FieldLabel>
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
                Aggiorna password
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Autenticazione a due fattori</CardTitle>
          <CardDescription>TOTP, dispositivi attendibili e codici di recupero.</CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            {!user.twoFactorEnabled ? (
              <form onSubmit={(event) => void enableTwoFactor(event)}>
                <FieldGroup>
                  <Field>
                    <FieldLabel htmlFor="enable-2fa-password">Conferma la password</FieldLabel>
                    <Input id="enable-2fa-password" name="password" type="password" required />
                  </Field>
                  <Button type="submit">
                    <ShieldCheck />
                    Configura 2FA
                  </Button>
                </FieldGroup>
              </form>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                <form onSubmit={(event) => void regenerateCodes(event)}>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="backup-password">Password</FieldLabel>
                      <Input id="backup-password" name="password" type="password" required />
                    </Field>
                    <Button type="submit" variant="outline">
                      Rigenera codici di recupero
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
                      Disattiva 2FA
                    </Button>
                  </FieldGroup>
                </form>
              </div>
            )}
            {setup && (
              <>
                <FieldSeparator>Configurazione</FieldSeparator>
                <Alert>
                  <AlertDescription>
                    {setup.qr && (
                      <img
                        src={setup.qr}
                        className="mb-4 size-52 rounded-lg"
                        alt="QR code per configurare l’app di autenticazione"
                      />
                    )}
                    {setup.uri && <code className="block break-all text-xs">{setup.uri}</code>}
                    <p className="mt-4 text-sm font-semibold">Salva i codici di recupero:</p>
                    <div className="mt-2 grid grid-cols-2 gap-2 font-mono text-sm">
                      {setup.backupCodes.map((code) => (
                        <span key={code}>{code}</span>
                      ))}
                    </div>
                    {setup.uri && (
                      <form className="mt-5" onSubmit={(event) => void confirmTwoFactor(event)}>
                        <FieldGroup>
                          <Field>
                            <FieldLabel htmlFor="totp-code">Codice di verifica</FieldLabel>
                            <Input id="totp-code" name="code" inputMode="numeric" required />
                          </Field>
                          <Button type="submit">Conferma</Button>
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
      <Card>
        <CardHeader>
          <CardTitle>Passkey</CardTitle>
          <CardDescription>
            Usa biometria, PIN del dispositivo o una chiave di sicurezza per accedere senza
            password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(event) => void addPasskey(event)}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="passkey-name">Nome passkey</FieldLabel>
                <Input id="passkey-name" name="name" placeholder="es. MacBook personale" />
              </Field>
              <Button type="submit">Aggiungi passkey</Button>
            </FieldGroup>
          </form>
          <div className="mt-6 grid gap-3">
            {passkeys.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Fingerprint />
                  </EmptyMedia>
                  <EmptyTitle>Nessuna passkey</EmptyTitle>
                  <EmptyDescription>Non hai ancora registrato una passkey.</EmptyDescription>
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
                            toast.error(result.error.message ?? "Rinomina non riuscita.");
                          else toast.success("Passkey rinominata.");
                          await refreshPasskeys();
                        }
                      }}
                    >
                      Rinomina
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={async () => {
                        const result = await authClient.passkey.deletePasskey({ id: item.id });
                        if (result.error)
                          toast.error(result.error.message ?? "Rimozione non riuscita.");
                        else toast.success("Passkey rimossa.");
                        await refreshPasskeys();
                      }}
                    >
                      Rimuovi
                    </Button>
                  </ItemActions>
                </Item>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
