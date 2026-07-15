import { createFileRoute } from "@tanstack/react-router";
import { Link2, Save, Unlink, UserRound } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { formString, formValues } from "@/components/auth-ui";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
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
import { authClient } from "@/lib/auth-client";

type AccountItem = { id: string; accountId: string; providerId: string };

export const Route = createFileRoute("/dashboard/profile/")({
  head: () => ({ meta: [{ title: "Profilo | Prisco.me" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const session = authClient.useSession();
  const user = session.data!.user;
  const [accounts, setAccounts] = useState<AccountItem[]>([]);

  const refreshAccounts = useCallback(async () => {
    const result = await authClient.listAccounts();
    if (result.data) setAccounts(result.data);
    else toast.error(result.error?.message ?? "Impossibile caricare gli account collegati.");
  }, []);

  useEffect(() => {
    void refreshAccounts();
  }, [refreshAccounts]);

  async function updateIdentity(event: React.FormEvent<HTMLFormElement>) {
    const values = formValues(event);
    const result = await authClient.updateUser({
      name: formString(values, "name"),
      username: formString(values, "username"),
    });
    if (result.error) toast.error(result.error.message ?? "Aggiornamento non riuscito.");
    else toast.success("Profilo aggiornato.");
    await session.refetch();
  }

  async function changeEmail(event: React.FormEvent<HTMLFormElement>) {
    const values = formValues(event);
    const result = await authClient.changeEmail({
      newEmail: formString(values, "email"),
      callbackURL: "/dashboard/profile",
    });
    if (result.error) toast.error(result.error.message ?? "Aggiornamento non riuscito.");
    else toast.success("Indirizzo email aggiornato o verifica inviata.");
    await session.refetch();
  }

  async function unlinkAccount(item: AccountItem) {
    const result = await authClient.unlinkAccount({
      providerId: item.providerId,
      accountId: item.accountId,
    });
    if (result.error) toast.error(result.error.message ?? "Scollegamento non riuscito.");
    else toast.success("Account scollegato.");
    await refreshAccounts();
  }

  return (
    <div className="flex max-w-5xl flex-col gap-4">
      <header>
        <div className="flex items-center gap-2">
          <h1 className="font-heading text-2xl font-semibold tracking-tight">Profilo</h1>
          <Badge variant="outline">{user.role ?? "user"}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Identità pubblica, recapito di accesso e provider collegati.
        </p>
      </header>

      <div className="grid items-start gap-4 lg:grid-cols-2">
        <Card size="sm">
          <CardHeader>
            <CardTitle>Identità</CardTitle>
            <CardDescription>
              Nome e username mostrati nelle aree associate al tuo account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(event) => void updateIdentity(event)}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="profile-name">Nome</FieldLabel>
                  <Input
                    id="profile-name"
                    name="name"
                    autoComplete="name"
                    defaultValue={user.name}
                    required
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="profile-username">Username</FieldLabel>
                  <Input
                    id="profile-username"
                    name="username"
                    autoComplete="username"
                    defaultValue={user.username ?? ""}
                    required
                  />
                </Field>
                <Button size="sm" type="submit">
                  <Save data-icon="inline-start" />
                  Salva identità
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>

        <Card size="sm">
          <CardHeader>
            <CardTitle>Email</CardTitle>
            <CardDescription>
              Usata per accesso, verifiche e comunicazioni relative alla sicurezza.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(event) => void changeEmail(event)}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="profile-email">Indirizzo email</FieldLabel>
                  <Input
                    id="profile-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    defaultValue={user.email}
                    required
                  />
                </Field>
                <Button size="sm" type="submit" variant="outline">
                  Aggiorna email
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card size="sm">
        <CardHeader>
          <CardTitle>Account collegati</CardTitle>
          <CardDescription>Metodi esterni che possono essere usati per accedere.</CardDescription>
        </CardHeader>
        <CardContent>
          {accounts.length ? (
            <ItemGroup>
              {accounts.map((item) => (
                <Item key={item.id} variant="outline">
                  <ItemMedia variant="icon">
                    <Link2 />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle className="capitalize">{item.providerId}</ItemTitle>
                    <ItemDescription>{item.accountId}</ItemDescription>
                  </ItemContent>
                  {item.providerId !== "credential" ? (
                    <ItemActions>
                      <AlertDialog>
                        <AlertDialogTrigger render={<Button size="sm" variant="outline" />}>
                          <Unlink data-icon="inline-start" />
                          Scollega
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Scollegare {item.providerId}?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Verifica di avere un altro metodo di accesso prima di continuare.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Annulla</AlertDialogCancel>
                            <AlertDialogAction
                              variant="destructive"
                              onClick={() => void unlinkAccount(item)}
                            >
                              Scollega
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </ItemActions>
                  ) : null}
                </Item>
              ))}
            </ItemGroup>
          ) : (
            <Empty className="p-8">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <UserRound />
                </EmptyMedia>
                <EmptyTitle>Nessun provider collegato</EmptyTitle>
                <EmptyDescription>
                  Il tuo account usa soltanto le credenziali principali.
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
