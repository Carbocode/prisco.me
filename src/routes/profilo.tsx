import type { Passkey } from "@better-auth/passkey";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { KeyRound, LogOut, ShieldCheck, Smartphone, UserCog } from "lucide-react";
import QRCode from "qrcode";
import { useCallback, useEffect, useState } from "react";

import { AuthPage, RequireAuth, formString, formValues } from "@/components/auth-ui";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth-client";

type SessionItem = {
  id: string;
  token: string;
  userAgent?: string | null;
  ipAddress?: string | null;
  createdAt: Date;
  expiresAt: Date;
};
type AccountItem = { id: string; accountId: string; providerId: string };
type OAuthClientItem = { clientId: string; name: string | null; redirectUris: string[] };
type OAuthConsentItem = { id: string; clientId: string; scopes: string[] };

export const Route = createFileRoute("/profilo")({
  head: () => ({
    meta: [{ title: "Profilo e sicurezza | Prisco.me" }, { name: "robots", content: "noindex" }],
  }),
  component: ProfileRoute,
});

function ProfileRoute() {
  return (
    <AuthPage
      title="Il tuo profilo."
      description="Gestisci identità, credenziali, dispositivi, sessioni e applicazioni collegate a Better Auth."
    >
      <RequireAuth>
        <Profile />
      </RequireAuth>
    </AuthPage>
  );
}

function Profile() {
  const session = authClient.useSession();
  const navigate = useNavigate();
  const user = session.data!.user;
  const [notice, setNotice] = useState("");
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [accounts, setAccounts] = useState<AccountItem[]>([]);
  const [passkeys, setPasskeys] = useState<Passkey[]>([]);
  const [clients, setClients] = useState<OAuthClientItem[]>([]);
  const [consents, setConsents] = useState<OAuthConsentItem[]>([]);
  const [twoFactorSetup, setTwoFactorSetup] = useState<{
    uri: string;
    qr: string;
    backupCodes: string[];
  } | null>(null);
  const [newClientSecret, setNewClientSecret] = useState<{ id: string; secret: string } | null>(
    null,
  );

  const refresh = useCallback(async () => {
    const [sessionResult, accountResult, passkeyResult, clientResult, consentResult] =
      await Promise.all([
        authClient.listSessions(),
        authClient.listAccounts(),
        authClient.passkey.listUserPasskeys(),
        authClient.oauth2.getClients(),
        authClient.oauth2.getConsents(),
      ]);
    if (sessionResult.data) setSessions(sessionResult.data);
    if (accountResult.data) setAccounts(accountResult.data);
    if (passkeyResult.data) setPasskeys(passkeyResult.data);
    if (clientResult.data)
      setClients(
        clientResult.data.map((item) => ({
          clientId: typeof item.clientId === "string" ? item.clientId : "",
          name: typeof item.name === "string" ? item.name : null,
          redirectUris: Array.isArray(item.redirectUris)
            ? item.redirectUris.filter((value): value is string => typeof value === "string")
            : [],
        })),
      );
    if (consentResult.data)
      setConsents(
        consentResult.data.map((item) => ({
          id: item.id,
          clientId: item.clientId,
          scopes: Array.isArray(item.scopes)
            ? item.scopes.filter((value): value is string => typeof value === "string")
            : [],
        })),
      );
  }, []);
  useEffect(() => {
    void refresh();
  }, [refresh]);

  async function updateIdentity(event: React.FormEvent<HTMLFormElement>) {
    const values = formValues(event);
    const result = await authClient.updateUser({
      name: formString(values, "name"),
      username: formString(values, "username"),
    });
    setNotice(result.error?.message ?? "Profilo aggiornato.");
    await session.refetch();
  }
  async function changeEmail(event: React.FormEvent<HTMLFormElement>) {
    const values = formValues(event);
    const result = await authClient.changeEmail({
      newEmail: formString(values, "email"),
      callbackURL: "/profilo",
    });
    setNotice(result.error?.message ?? "Indirizzo email aggiornato o verifica inviata.");
    await session.refetch();
  }
  async function changePassword(event: React.FormEvent<HTMLFormElement>) {
    const values = formValues(event);
    const result = await authClient.changePassword({
      currentPassword: formString(values, "currentPassword"),
      newPassword: formString(values, "newPassword"),
      revokeOtherSessions: true,
    });
    setNotice(result.error?.message ?? "Password aggiornata e altre sessioni revocate.");
    await refresh();
  }
  async function enable2fa(event: React.FormEvent<HTMLFormElement>) {
    const values = formValues(event);
    const result = await authClient.twoFactor.enable({ password: formString(values, "password") });
    if (result.error || !result.data)
      return setNotice(result.error?.message ?? "Impossibile attivare la 2FA.");
    const qr = await QRCode.toDataURL(result.data.totpURI, { width: 240, margin: 1 });
    setTwoFactorSetup({ uri: result.data.totpURI, qr, backupCodes: result.data.backupCodes });
  }
  async function confirm2fa(event: React.FormEvent<HTMLFormElement>) {
    const values = formValues(event);
    const result = await authClient.twoFactor.verifyTotp({ code: formString(values, "code") });
    if (result.error) setNotice(result.error.message ?? "Codice non valido.");
    else {
      setNotice("Autenticazione a due fattori attivata.");
      setTwoFactorSetup(null);
      await session.refetch();
    }
  }
  async function disable2fa(event: React.FormEvent<HTMLFormElement>) {
    const values = formValues(event);
    const result = await authClient.twoFactor.disable({ password: formString(values, "password") });
    setNotice(result.error?.message ?? "Autenticazione a due fattori disattivata.");
    await session.refetch();
  }
  async function regenerateCodes(event: React.FormEvent<HTMLFormElement>) {
    const values = formValues(event);
    const result = await authClient.twoFactor.generateBackupCodes({
      password: formString(values, "password"),
    });
    if (result.data) setTwoFactorSetup({ uri: "", qr: "", backupCodes: result.data.backupCodes });
    else setNotice(result.error?.message ?? "Impossibile generare i codici.");
  }
  async function addPasskey(event: React.FormEvent<HTMLFormElement>) {
    const values = formValues(event);
    const result = await authClient.passkey.addPasskey({
      name: formString(values, "name") || undefined,
    });
    setNotice(result?.error?.message ?? "Passkey aggiunta.");
    await refresh();
  }
  async function createClient(event: React.FormEvent<HTMLFormElement>) {
    const values = formValues(event);
    const result = await authClient.oauth2.createClient({
      client_name: formString(values, "name"),
      redirect_uris: formString(values, "redirectUris")
        .split("\n")
        .map((v) => v.trim())
        .filter(Boolean),
      token_endpoint_auth_method: values.get("public") ? "none" : "client_secret_basic",
      type: "web",
    });
    if (result.data) {
      setNewClientSecret({
        id: result.data.client_id,
        secret: result.data.client_secret ?? "Client pubblico: nessun secret",
      });
      setNotice("Applicazione OAuth creata. Salva ora il secret: non verrà mostrato di nuovo.");
      await refresh();
    } else setNotice(result.error?.message ?? "Creazione non riuscita.");
  }

  return (
    <div className="grid gap-6">
      {notice && (
        <Alert>
          <AlertDescription>{notice}</AlertDescription>
        </Alert>
      )}
      <div className="flex flex-wrap gap-3">
        <Button
          variant="outline"
          onClick={() =>
            void authClient.signOut({
              fetchOptions: { onSuccess: () => void navigate({ to: "/blog" }) },
            })
          }
        >
          <LogOut size={16} className="mr-2" />
          Esci
        </Button>
        {session.data?.session.impersonatedBy && (
          <Button
            variant="outline"
            onClick={async () => {
              await authClient.admin.stopImpersonating();
              window.location.assign("/admin");
            }}
          >
            Termina impersonificazione
          </Button>
        )}
        {user.role === "admin" && (
          <Button render={<Link to="/admin" />}>
            <UserCog size={16} className="mr-2" />
            Area admin
          </Button>
        )}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Identità</CardTitle>
            <CardDescription>
              Ruolo: {user.role ?? "user"}. L’accesso admin può essere assegnato soltanto da un
              amministratore.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={(event) => void updateIdentity(event)}>
              <Field>
                <FieldLabel htmlFor="profile-name">Nome</FieldLabel>
                <Input id="profile-name" name="name" defaultValue={user.name} required />
              </Field>
              <Field>
                <FieldLabel htmlFor="profile-username">Username</FieldLabel>
                <Input
                  id="profile-username"
                  name="username"
                  defaultValue={user.username ?? ""}
                  required
                />
              </Field>
              <Button type="submit">Salva identità</Button>
            </form>
            <form
              className="mt-6 space-y-4 border-t border-white/10 pt-5"
              onSubmit={(event) => void changeEmail(event)}
            >
              <Field>
                <FieldLabel htmlFor="profile-email">Indirizzo email</FieldLabel>
                <Input
                  id="profile-email"
                  name="email"
                  type="email"
                  defaultValue={user.email}
                  required
                />
              </Field>
              <Button type="submit" variant="outline">
                Aggiorna email
              </Button>
            </form>
            <div className="mt-6 border-t border-white/10 pt-5">
              <p className="text-sm font-medium">Account collegati</p>
              <ul className="mt-3 space-y-2">
                {accounts.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-center justify-between rounded-lg bg-black/20 p-3 text-sm"
                  >
                    <span>{item.providerId}</span>
                    {item.providerId !== "credential" && (
                      <Button
                        variant="destructive"
                        onClick={async () => {
                          await authClient.unlinkAccount({
                            providerId: item.providerId,
                            accountId: item.accountId,
                          });
                          await refresh();
                        }}
                      >
                        Scollega
                      </Button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Password</CardTitle>
            <CardDescription>
              La modifica revoca automaticamente tutte le altre sessioni.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={(event) => void changePassword(event)}>
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
                <KeyRound size={16} className="mr-2" />
                Aggiorna password
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Autenticazione a due fattori</CardTitle>
          <CardDescription>TOTP, dispositivi attendibili e codici di recupero.</CardDescription>
        </CardHeader>
        <CardContent>
          {!user.twoFactorEnabled ? (
            <form
              className="flex max-w-lg flex-col gap-4"
              onSubmit={(event) => void enable2fa(event)}
            >
              <Field>
                <FieldLabel htmlFor="enable-2fa-password">Conferma la password</FieldLabel>
                <Input id="enable-2fa-password" name="password" type="password" required />
              </Field>
              <Button type="submit">
                <ShieldCheck size={16} className="mr-2" />
                Configura 2FA
              </Button>
            </form>
          ) : (
            <div className="grid gap-5 md:grid-cols-2">
              <form className="space-y-4" onSubmit={(event) => void regenerateCodes(event)}>
                <Field>
                  <FieldLabel htmlFor="backup-password">Password</FieldLabel>
                  <Input id="backup-password" name="password" type="password" required />
                </Field>
                <Button type="submit" variant="outline">
                  Rigenera codici di recupero
                </Button>
              </form>
              <form className="space-y-4" onSubmit={(event) => void disable2fa(event)}>
                <Field>
                  <FieldLabel htmlFor="disable-2fa-password">Password</FieldLabel>
                  <Input id="disable-2fa-password" name="password" type="password" required />
                </Field>
                <Button type="submit" variant="destructive">
                  Disattiva 2FA
                </Button>
              </form>
            </div>
          )}
          {twoFactorSetup && (
            <Alert>
              <AlertDescription>
                {twoFactorSetup.qr && (
                  <img
                    src={twoFactorSetup.qr}
                    className="mb-4 size-52 rounded-lg"
                    alt="QR code per configurare l’app di autenticazione"
                  />
                )}{" "}
                {twoFactorSetup.uri && (
                  <code className="block break-all text-xs text-slate-400">
                    {twoFactorSetup.uri}
                  </code>
                )}
                <p className="mt-4 text-sm font-semibold">Salva i codici di recupero:</p>
                <div className="mt-2 grid grid-cols-2 gap-2 font-mono text-sm">
                  {twoFactorSetup.backupCodes.map((code) => (
                    <span key={code}>{code}</span>
                  ))}
                </div>
                {twoFactorSetup.uri && (
                  <form
                    className="mt-5 flex max-w-sm gap-3"
                    onSubmit={(event) => void confirm2fa(event)}
                  >
                    <Input name="code" placeholder="123456" required />
                    <Button type="submit">Conferma</Button>
                  </form>
                )}
              </AlertDescription>
            </Alert>
          )}
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
          <form
            className="flex max-w-lg flex-col gap-3 sm:flex-row"
            onSubmit={(event) => void addPasskey(event)}
          >
            <Input name="name" placeholder="es. MacBook personale" />
            <Button type="submit">Aggiungi passkey</Button>
          </form>
          <div className="mt-5 grid gap-3 md:grid-cols-2">
            {passkeys.map((item) => (
              <Item key={item.id}>
                <ItemMedia variant="icon">
                  <Smartphone />
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
                        await authClient.passkey.updatePasskey({ id: item.id, name });
                        await refresh();
                      }
                    }}
                  >
                    Rinomina
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={async () => {
                      await authClient.passkey.deletePasskey({ id: item.id });
                      await refresh();
                    }}
                  >
                    Rimuovi
                  </Button>
                </ItemActions>
              </Item>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Sessioni attive</CardTitle>
          <CardDescription>
            Controlla browser e dispositivi che hanno accesso al tuo account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {sessions.map((item) => (
              <Item key={item.id}>
                <ItemContent>
                  <ItemTitle>{item.userAgent ?? "Dispositivo sconosciuto"}</ItemTitle>
                  <ItemDescription>
                    {item.ipAddress ?? "IP non disponibile"} · scade{" "}
                    {new Date(item.expiresAt).toLocaleDateString("it-IT")}
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button
                    variant="destructive"
                    onClick={async () => {
                      await authClient.revokeSession({ token: item.token });
                      await refresh();
                    }}
                  >
                    Revoca
                  </Button>
                </ItemActions>
              </Item>
            ))}
          </div>
          <Button
            variant="outline"
            onClick={async () => {
              await authClient.revokeOtherSessions();
              await refresh();
            }}
          >
            Revoca tutte le altre
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>OAuth Provider</CardTitle>
          <CardDescription>
            Prisco.me può autorizzare applicazioni OAuth 2.1/OIDC. Crea client, ruota secret e
            revoca consensi.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="grid gap-4 lg:grid-cols-2"
            onSubmit={(event) => void createClient(event)}
          >
            <Field>
              <FieldLabel htmlFor="oauth-name">Nome applicazione</FieldLabel>
              <Input id="oauth-name" name="name" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="redirect-uris">Redirect URI, uno per riga</FieldLabel>
              <Textarea
                id="redirect-uris"
                name="redirectUris"
                required
                placeholder="https://app.example/callback"
              />
            </Field>
            <Field orientation="horizontal">
              <Checkbox id="oauth-public" name="public" />
              <FieldLabel htmlFor="oauth-public">Client pubblico (PKCE, senza secret)</FieldLabel>
            </Field>
            <Button type="submit">Crea client OAuth</Button>
          </form>
          {newClientSecret && (
            <Alert>
              <AlertDescription>
                <p>Client ID</p>
                <code>{newClientSecret.id}</code>
                <p>Client secret</p>
                <code>{newClientSecret.secret}</code>
              </AlertDescription>
            </Alert>
          )}
          <div className="mt-6 grid gap-3">
            {clients.map((client) => (
              <Item key={client.clientId}>
                <ItemContent>
                  <ItemTitle>{client.name ?? "Applicazione senza nome"}</ItemTitle>
                  <ItemDescription>
                    {client.clientId} · {client.redirectUris.join(", ")}
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button
                    variant="outline"
                    onClick={async () => {
                      const name = prompt("Nome applicazione", client.name ?? "");
                      const redirect = prompt(
                        "Redirect URI (separati da virgola)",
                        client.redirectUris.join(", "),
                      );
                      if (name && redirect) {
                        await authClient.oauth2.updateClient({
                          client_id: client.clientId,
                          update: {
                            client_name: name,
                            redirect_uris: redirect
                              .split(",")
                              .map((item) => item.trim())
                              .filter(Boolean),
                          },
                        });
                        await refresh();
                      }
                    }}
                  >
                    Modifica
                  </Button>
                  <Button
                    variant="outline"
                    onClick={async () => {
                      const result = await authClient.oauth2.client.rotateSecret({
                        client_id: client.clientId,
                      });
                      if (result.data)
                        setNewClientSecret({
                          id: client.clientId,
                          secret: result.data.client_secret ?? "",
                        });
                    }}
                  >
                    Ruota secret
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={async () => {
                      await authClient.oauth2.deleteClient({ client_id: client.clientId });
                      await refresh();
                    }}
                  >
                    Elimina
                  </Button>
                </ItemActions>
              </Item>
            ))}
          </div>
          <h3 className="mt-8 font-semibold">Consensi concessi</h3>
          <div className="mt-3 grid gap-3">
            {consents.map((consent) => (
              <Item key={consent.id}>
                <ItemContent>
                  <ItemTitle>{consent.clientId}</ItemTitle>
                  <ItemDescription>{consent.scopes.join(", ")}</ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button
                    variant="destructive"
                    onClick={async () => {
                      await authClient.oauth2.deleteConsent({ id: consent.id });
                      await refresh();
                    }}
                  >
                    Revoca
                  </Button>
                </ItemActions>
              </Item>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Elimina account</CardTitle>
          <CardDescription>
            Operazione definitiva: vengono rimossi utente, credenziali, sessioni, passkey e dati
            OAuth.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            onClick={async () => {
              if (confirm("Eliminare definitivamente l’account?"))
                await authClient.deleteUser({ callbackURL: "/blog" });
            }}
          >
            Elimina definitivamente
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
