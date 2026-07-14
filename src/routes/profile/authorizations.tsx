import { createFileRoute } from "@tanstack/react-router";
import { AppWindow, MonitorSmartphone } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { formString, formValues } from "@/components/auth-ui";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/lib/auth-client";

type OAuthClientItem = { clientId: string; name: string | null; redirectUris: string[] };
type OAuthConsentItem = { id: string; clientId: string; scopes: string[] };
type SessionItem = {
  id: string;
  token: string;
  userAgent?: string | null;
  ipAddress?: string | null;
  expiresAt: Date;
};

export const Route = createFileRoute("/profile/authorizations")({
  head: () => ({ meta: [{ title: "Autorizzazioni | Prisco.me" }] }),
  component: AuthorizationsPage,
});

function AuthorizationsPage() {
  const [clients, setClients] = useState<OAuthClientItem[]>([]);
  const [consents, setConsents] = useState<OAuthConsentItem[]>([]);
  const [sessions, setSessions] = useState<SessionItem[]>([]);
  const [newClientSecret, setNewClientSecret] = useState<{ id: string; secret: string } | null>(
    null,
  );

  const refreshApplications = useCallback(async () => {
    const [sessionResult, clientResult, consentResult] = await Promise.all([
      authClient.listSessions(),
      authClient.oauth2.getClients(),
      authClient.oauth2.getConsents(),
    ]);
    if (sessionResult.data) setSessions(sessionResult.data);
    else toast.error(sessionResult.error?.message ?? "Impossibile caricare le sessioni.");
    if (clientResult.data) {
      setClients(
        clientResult.data.map((item) => ({
          clientId: typeof item.clientId === "string" ? item.clientId : "",
          name: typeof item.name === "string" ? item.name : null,
          redirectUris: Array.isArray(item.redirectUris)
            ? item.redirectUris.filter((value): value is string => typeof value === "string")
            : [],
        })),
      );
    } else toast.error(clientResult.error?.message ?? "Impossibile caricare i client OAuth.");

    if (consentResult.data) {
      setConsents(
        consentResult.data.map((item) => ({
          id: item.id,
          clientId: item.clientId,
          scopes: Array.isArray(item.scopes)
            ? item.scopes.filter((value): value is string => typeof value === "string")
            : [],
        })),
      );
    } else toast.error(consentResult.error?.message ?? "Impossibile caricare i consensi OAuth.");
  }, []);

  useEffect(() => {
    void refreshApplications();
  }, [refreshApplications]);

  async function createClient(event: React.FormEvent<HTMLFormElement>) {
    const values = formValues(event);
    const result = await authClient.oauth2.createClient({
      client_name: formString(values, "name"),
      redirect_uris: formString(values, "redirectUris")
        .split("\n")
        .map((value) => value.trim())
        .filter(Boolean),
      token_endpoint_auth_method: values.get("public") ? "none" : "client_secret_basic",
      type: "web",
    });
    if (result.data) {
      setNewClientSecret({
        id: result.data.client_id,
        secret: result.data.client_secret ?? "Client pubblico: nessun secret",
      });
      toast.success("Applicazione OAuth creata. Salva ora il secret.");
      await refreshApplications();
    } else toast.error(result.error?.message ?? "Creazione non riuscita.");
  }

  async function updateClient(event: React.FormEvent<HTMLFormElement>, client: OAuthClientItem) {
    const values = formValues(event);
    const result = await authClient.oauth2.updateClient({
      client_id: client.clientId,
      update: {
        client_name: formString(values, "name"),
        redirect_uris: formString(values, "redirectUris")
          .split("\n")
          .map((value) => value.trim())
          .filter(Boolean),
      },
    });
    if (result.error) toast.error(result.error.message ?? "Aggiornamento non riuscito.");
    else toast.success("Applicazione aggiornata.");
    await refreshApplications();
  }

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Autorizzazioni</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Controlla sessioni, client OAuth 2.1/OIDC e autorizzazioni concesse.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Sessioni attive</CardTitle>
          <CardDescription>Controlla e revoca gli accessi al tuo account.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {sessions.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <MonitorSmartphone />
                  </EmptyMedia>
                  <EmptyTitle>Nessuna sessione</EmptyTitle>
                  <EmptyDescription>Non risultano sessioni attive.</EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              sessions.map((item) => (
                <Item key={item.id}>
                  <ItemMedia variant="icon">
                    <MonitorSmartphone />
                  </ItemMedia>
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
                        const result = await authClient.revokeSession({ token: item.token });
                        if (result.error)
                          toast.error(result.error.message ?? "Revoca non riuscita.");
                        else toast.success("Sessione revocata.");
                        await refreshApplications();
                      }}
                    >
                      Revoca
                    </Button>
                  </ItemActions>
                </Item>
              ))
            )}
          </div>
          <Button
            variant="outline"
            onClick={async () => {
              const result = await authClient.revokeOtherSessions();
              if (result.error) toast.error(result.error.message ?? "Revoca non riuscita.");
              else toast.success("Le altre sessioni sono state revocate.");
              await refreshApplications();
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
            Crea applicazioni, aggiorna redirect URI, ruota secret e revoca consensi.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <form onSubmit={(event) => void createClient(event)}>
              <FieldGroup>
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
                  <FieldLabel htmlFor="oauth-public">
                    Client pubblico (PKCE, senza secret)
                  </FieldLabel>
                </Field>
                <Button type="submit">Crea client OAuth</Button>
              </FieldGroup>
            </form>
            {newClientSecret && (
              <Alert>
                <AlertDescription>
                  <p>Client ID</p>
                  <code className="block break-all">{newClientSecret.id}</code>
                  <p className="mt-3">Client secret</p>
                  <code className="block break-all">{newClientSecret.secret}</code>
                </AlertDescription>
              </Alert>
            )}
            <FieldSeparator>Client registrati</FieldSeparator>
            <div className="grid gap-3">
              {clients.length === 0 ? (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <AppWindow />
                    </EmptyMedia>
                    <EmptyTitle>Nessun client OAuth</EmptyTitle>
                    <EmptyDescription>Non hai ancora registrato applicazioni.</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                clients.map((client) => (
                  <Item key={client.clientId}>
                    <ItemContent>
                      <ItemTitle>{client.name ?? "Applicazione senza nome"}</ItemTitle>
                      <ItemDescription>
                        {client.clientId} · {client.redirectUris.join(", ")}
                      </ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <Dialog>
                        <DialogTrigger render={<Button variant="outline" />}>
                          Modifica
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Modifica applicazione</DialogTitle>
                            <DialogDescription>
                              Aggiorna il nome e gli URI di reindirizzamento autorizzati.
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={(event) => void updateClient(event, client)}>
                            <FieldGroup>
                              <Field>
                                <FieldLabel htmlFor={`client-name-${client.clientId}`}>
                                  Nome applicazione
                                </FieldLabel>
                                <Input
                                  id={`client-name-${client.clientId}`}
                                  name="name"
                                  defaultValue={client.name ?? ""}
                                  required
                                />
                              </Field>
                              <Field>
                                <FieldLabel htmlFor={`client-uris-${client.clientId}`}>
                                  Redirect URI, uno per riga
                                </FieldLabel>
                                <Textarea
                                  id={`client-uris-${client.clientId}`}
                                  name="redirectUris"
                                  defaultValue={client.redirectUris.join("\n")}
                                  required
                                />
                              </Field>
                              <DialogFooter>
                                <Button type="submit">Salva modifiche</Button>
                              </DialogFooter>
                            </FieldGroup>
                          </form>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="outline"
                        onClick={async () => {
                          const result = await authClient.oauth2.client.rotateSecret({
                            client_id: client.clientId,
                          });
                          if (result.data) {
                            setNewClientSecret({
                              id: client.clientId,
                              secret: result.data.client_secret ?? "",
                            });
                            toast.success("Secret ruotato. Salvalo ora.");
                          } else toast.error(result.error?.message ?? "Rotazione non riuscita.");
                        }}
                      >
                        Ruota secret
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={async () => {
                          const result = await authClient.oauth2.deleteClient({
                            client_id: client.clientId,
                          });
                          if (result.error)
                            toast.error(result.error.message ?? "Eliminazione non riuscita.");
                          else toast.success("Applicazione eliminata.");
                          await refreshApplications();
                        }}
                      >
                        Elimina
                      </Button>
                    </ItemActions>
                  </Item>
                ))
              )}
            </div>
            <FieldSeparator>Consensi concessi</FieldSeparator>
            <div className="grid gap-3">
              {consents.length === 0 ? (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <AppWindow />
                    </EmptyMedia>
                    <EmptyTitle>Nessun consenso</EmptyTitle>
                    <EmptyDescription>Non hai autorizzato applicazioni esterne.</EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                consents.map((consent) => (
                  <Item key={consent.id}>
                    <ItemContent>
                      <ItemTitle>{consent.clientId}</ItemTitle>
                      <ItemDescription>{consent.scopes.join(", ")}</ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <Button
                        variant="destructive"
                        onClick={async () => {
                          const result = await authClient.oauth2.deleteConsent({ id: consent.id });
                          if (result.error)
                            toast.error(result.error.message ?? "Revoca non riuscita.");
                          else toast.success("Consenso revocato.");
                          await refreshApplications();
                        }}
                      >
                        Revoca
                      </Button>
                    </ItemActions>
                  </Item>
                ))
              )}
            </div>
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  );
}
