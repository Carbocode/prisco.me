import { AppWindow, MonitorSmartphone } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

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
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { Textarea } from "@/components/ui/textarea";
import { authClient } from "@/features/auth/client/auth-client";
import { formString, formValues } from "@/features/auth/components/auth-ui";
import { useSiteLocale } from "@/features/site/client/site-location";
import * as m from "@/paraglide/messages.js";

type OAuthClientItem = { clientId: string; name: string | null; redirectUris: string[] };

type OAuthConsentItem = { id: string; clientId: string; scopes: string[] };

type SessionItem = {
  id: string;
  token: string;
  userAgent?: string | null;
  ipAddress?: string | null;
  expiresAt: Date;
};

export function AuthorizationsPage() {
  const locale = useSiteLocale();
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
    else
      toast.error(sessionResult.error?.message ?? m.authorizations_sessions_failed({}, { locale }));
    if (clientResult.data) {
      setClients(
        clientResult.data.map((item) => ({
          clientId: typeof item.client_id === "string" ? item.client_id : "",
          name: typeof item.client_name === "string" ? item.client_name : null,
          redirectUris: Array.isArray(item.redirect_uris)
            ? item.redirect_uris.filter((value): value is string => typeof value === "string")
            : [],
        })),
      );
    } else
      toast.error(
        clientResult.error?.message ?? m.authorizations_load_clients_failed({}, { locale }),
      );

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
    } else
      toast.error(
        consentResult.error?.message ?? m.authorizations_load_consents_failed({}, { locale }),
      );
  }, [locale]);

  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect -- State updates happen after the awaited network response.
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
      application_type: "web",
    });
    if (result.data) {
      setNewClientSecret({
        id: result.data.client_id,
        secret: result.data.client_secret ?? m.authorizations_no_secret({}, { locale }),
      });
      toast.success("Applicazione OAuth creata. Salva ora il secret.");
      await refreshApplications();
    } else toast.error(result.error?.message ?? m.authorizations_create_failed({}, { locale }));
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
    if (result.error)
      toast.error(result.error.message ?? m.authorizations_update_failed({}, { locale }));
    else toast.success(m.authorizations_app_updated({}, { locale }));
    await refreshApplications();
  }

  return (
    <div className="flex max-w-6xl flex-col gap-4">
      <header>
        <p className="text-sm font-medium text-muted-foreground">
          {m.authorizations_access_and_integrations({}, { locale })}
        </p>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {m.authorizations_authorizations({}, { locale })}
        </h1>
        <p className="text-sm text-muted-foreground">
          {m.authorizations_active_sessions_oauth_oidc_clients_and({}, { locale })}{" "}
        </p>
      </header>
      <Card size="sm">
        <CardHeader>
          <CardTitle>{m.authorizations_active_sessions({}, { locale })}</CardTitle>
          <CardDescription>
            {m.authorizations_review_and_revoke_access_to_your({}, { locale })}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ItemGroup>
            {sessions.length === 0 ? (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <MonitorSmartphone />
                  </EmptyMedia>
                  <EmptyTitle>{m.authorizations_no_sessions({}, { locale })}</EmptyTitle>
                  <EmptyDescription>
                    {m.authorizations_there_are_no_active_sessions({}, { locale })}
                  </EmptyDescription>
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
                      {item.ipAddress ?? "IP non disponibile"}{" "}
                      {m.authorizations_expires({}, { locale })}{" "}
                      {new Date(item.expiresAt).toLocaleDateString("it-IT")}
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Button
                      variant="destructive"
                      onClick={async () => {
                        const result = await authClient.revokeSession({ token: item.token });
                        if (result.error)
                          toast.error(
                            result.error.message ?? m.authorizations_revoke_failed({}, { locale }),
                          );
                        else toast.success(m.authorizations_session_revoked({}, { locale }));
                        await refreshApplications();
                      }}
                    >
                      {m.authorizations_revoke({}, { locale })}{" "}
                    </Button>
                  </ItemActions>
                </Item>
              ))
            )}
          </ItemGroup>
          <Button
            variant="outline"
            onClick={async () => {
              const result = await authClient.revokeOtherSessions();
              if (result.error)
                toast.error(result.error.message ?? m.authorizations_revoke_failed({}, { locale }));
              else toast.success(m.authorizations_sessions_revoked({}, { locale }));
              await refreshApplications();
            }}
          >
            {m.authorizations_revoke_all_others({}, { locale })}{" "}
          </Button>
        </CardContent>
      </Card>
      <Card size="sm">
        <CardHeader>
          <CardTitle>OAuth Provider</CardTitle>
          <CardDescription>
            {m.authorizations_create_apps_update_redirect_uris_rotate({}, { locale })}{" "}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <form onSubmit={(event) => void createClient(event)}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="oauth-name">
                    {m.authorizations_application_name({}, { locale })}
                  </FieldLabel>
                  <Input id="oauth-name" name="name" required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="redirect-uris">
                    {m.authorizations_redirect_uris_one_per_line({}, { locale })}
                  </FieldLabel>
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
                    {m.authorizations_public_client_pkce_no_secret({}, { locale })}{" "}
                  </FieldLabel>
                </Field>
                <Button type="submit">
                  {m.authorizations_create_oauth_client({}, { locale })}
                </Button>
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
            <FieldSeparator>{m.authorizations_registered_clients({}, { locale })}</FieldSeparator>
            <ItemGroup>
              {clients.length === 0 ? (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <AppWindow />
                    </EmptyMedia>
                    <EmptyTitle>{m.authorizations_no_oauth_clients({}, { locale })}</EmptyTitle>
                    <EmptyDescription>
                      {m.authorizations_you_haven_t_registered_any_applications({}, { locale })}
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              ) : (
                clients.map((client) => (
                  <Item key={client.clientId}>
                    <ItemContent>
                      <ItemTitle>
                        {client.name ?? m.authorizations_unnamed_app({}, { locale })}
                      </ItemTitle>
                      <ItemDescription>
                        {client.clientId} · {client.redirectUris.join(", ")}
                      </ItemDescription>
                    </ItemContent>
                    <ItemActions>
                      <Dialog>
                        <DialogTrigger render={<Button variant="outline" />}>
                          {m.authorizations_edit({}, { locale })}{" "}
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>
                              {m.authorizations_edit_application({}, { locale })}
                            </DialogTitle>
                            <DialogDescription>
                              {m.authorizations_update_the_name_and_authorized_redirect(
                                {},
                                { locale },
                              )}{" "}
                            </DialogDescription>
                          </DialogHeader>
                          <form onSubmit={(event) => void updateClient(event, client)}>
                            <FieldGroup>
                              <Field>
                                <FieldLabel htmlFor={`client-name-${client.clientId}`}>
                                  {m.authorizations_application_name({}, { locale })}{" "}
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
                                  {m.authorizations_redirect_uris_one_per_line({}, { locale })}{" "}
                                </FieldLabel>
                                <Textarea
                                  id={`client-uris-${client.clientId}`}
                                  name="redirectUris"
                                  defaultValue={client.redirectUris.join("\n")}
                                  required
                                />
                              </Field>
                              <DialogFooter>
                                <Button type="submit">
                                  {m.authorizations_save_changes({}, { locale })}
                                </Button>
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
                            toast.success(m.authorizations_secret_rotated({}, { locale }));
                          } else
                            toast.error(
                              result.error?.message ??
                                m.authorizations_rotation_failed({}, { locale }),
                            );
                        }}
                      >
                        {m.authorizations_rotate_secret({}, { locale })}{" "}
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={async () => {
                          const result = await authClient.oauth2.deleteClient({
                            client_id: client.clientId,
                          });
                          if (result.error)
                            toast.error(
                              result.error.message ??
                                m.authorizations_remove_failed({}, { locale }),
                            );
                          else toast.success(m.authorizations_app_deleted({}, { locale }));
                          await refreshApplications();
                        }}
                      >
                        {m.authorizations_delete({}, { locale })}{" "}
                      </Button>
                    </ItemActions>
                  </Item>
                ))
              )}
            </ItemGroup>
            <FieldSeparator>{m.authorizations_granted_permissions({}, { locale })}</FieldSeparator>
            <ItemGroup>
              {consents.length === 0 ? (
                <Empty>
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <AppWindow />
                    </EmptyMedia>
                    <EmptyTitle>
                      {m.authorizations_no_granted_permissions({}, { locale })}
                    </EmptyTitle>
                    <EmptyDescription>
                      {m.authorizations_you_haven_t_authorized_any_external({}, { locale })}
                    </EmptyDescription>
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
                            toast.error(
                              result.error.message ??
                                m.authorizations_revoke_failed({}, { locale }),
                            );
                          else toast.success(m.authorizations_consent_revoked({}, { locale }));
                          await refreshApplications();
                        }}
                      >
                        {m.authorizations_revoke({}, { locale })}{" "}
                      </Button>
                    </ItemActions>
                  </Item>
                ))
              )}
            </ItemGroup>
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  );
}
