import { createFileRoute } from "@tanstack/react-router";
import { Link2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { formString, formValues } from "@/components/auth-ui";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

  return (
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Profilo</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Gestisci identità, indirizzo email e provider collegati.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Identità</CardTitle>
          <CardDescription>
            Ruolo: {user.role ?? "user"}. L’accesso admin può essere assegnato soltanto da un
            amministratore.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <form onSubmit={(event) => void updateIdentity(event)}>
              <FieldGroup>
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
              </FieldGroup>
            </form>
            <FieldSeparator>Indirizzo email</FieldSeparator>
            <form onSubmit={(event) => void changeEmail(event)}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="profile-email">Email</FieldLabel>
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
              </FieldGroup>
            </form>
            <FieldSeparator>Account collegati</FieldSeparator>
            <div className="grid gap-3">
              {accounts.map((item) => (
                <Item key={item.id}>
                  <ItemMedia variant="icon">
                    <Link2 />
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle>{item.providerId}</ItemTitle>
                    <ItemDescription>{item.accountId}</ItemDescription>
                  </ItemContent>
                  {item.providerId !== "credential" && (
                    <ItemActions>
                      <Button
                        variant="destructive"
                        onClick={async () => {
                          const result = await authClient.unlinkAccount({
                            providerId: item.providerId,
                            accountId: item.accountId,
                          });
                          if (result.error)
                            toast.error(result.error.message ?? "Scollegamento non riuscito.");
                          else toast.success("Account scollegato.");
                          await refreshAccounts();
                        }}
                      >
                        Scollega
                      </Button>
                    </ItemActions>
                  )}
                </Item>
              ))}
            </div>
          </FieldGroup>
        </CardContent>
      </Card>
    </div>
  );
}
