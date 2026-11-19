import { Link2, Save, Unlink, UserRound } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

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
import { localizedPath } from "@/config/site";
import { authClient } from "@/features/auth/client/auth-client";
import { formString, formValues } from "@/features/auth/components/auth-ui";
import { useSiteLocale } from "@/features/site/client/site-location";
import * as m from "@/paraglide/messages.js";

type AccountItem = { id: string; accountId: string; providerId: string };

export function ProfilePage() {
  const locale = useSiteLocale();
  const session = authClient.useSession();
  const user = session.data!.user;
  const [accounts, setAccounts] = useState<AccountItem[]>([]);

  const refreshAccounts = useCallback(async () => {
    const result = await authClient.listAccounts();
    if (result.data) setAccounts(result.data);
    else toast.error(result.error?.message ?? m.profile_accounts_failed({}, { locale }));
  }, [locale]);

  useEffect(() => {
    // oxlint-disable-next-line react/set-state-in-effect -- State updates happen after the awaited network response.
    void refreshAccounts();
  }, [refreshAccounts]);

  async function updateIdentity(event: React.FormEvent<HTMLFormElement>) {
    const values = formValues(event);
    const result = await authClient.updateUser({
      name: formString(values, "name"),
      username: formString(values, "username"),
    });
    if (result.error) toast.error(result.error.message ?? m.profile_update_failed({}, { locale }));
    else toast.success(m.profile_updated({}, { locale }));
    await session.refetch();
  }

  async function changeEmail(event: React.FormEvent<HTMLFormElement>) {
    const values = formValues(event);
    const result = await authClient.changeEmail({
      newEmail: formString(values, "email"),
      callbackURL: localizedPath("/dashboard/profile", locale),
    });
    if (result.error) toast.error(result.error.message ?? m.profile_update_failed({}, { locale }));
    else toast.success(m.profile_email_updated({}, { locale }));
    await session.refetch();
  }

  async function unlinkAccount(item: AccountItem) {
    const result = await authClient.unlinkAccount({
      accountId: item.id,
    });
    if (result.error)
      toast.error(result.error.message ?? m.profile_disconnect_failed({}, { locale }));
    else toast.success(m.profile_disconnected({}, { locale }));
    await refreshAccounts();
  }

  return (
    <div className="flex max-w-5xl flex-col gap-4">
      <header>
        <div className="flex items-center gap-2">
          <h1 className="font-heading text-2xl font-semibold tracking-tight">
            {m.profile_profile({}, { locale })}
          </h1>
          <Badge variant="outline">{user.role ?? "user"}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          {m.profile_public_identity_sign_in_address_and({}, { locale })}{" "}
        </p>
      </header>

      <div className="grid items-start gap-4 lg:grid-cols-2">
        <Card size="sm">
          <CardHeader>
            <CardTitle>{m.profile_identity({}, { locale })}</CardTitle>
            <CardDescription>
              {m.profile_name_and_username_displayed_in_areas({}, { locale })}{" "}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(event) => void updateIdentity(event)}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="profile-name">{m.profile_name({}, { locale })}</FieldLabel>
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
                  {m.profile_save_identity({}, { locale })}{" "}
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>

        <Card size="sm">
          <CardHeader>
            <CardTitle>Email</CardTitle>
            <CardDescription>
              {m.profile_used_for_sign_in_verification_and({}, { locale })}{" "}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(event) => void changeEmail(event)}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="profile-email">
                    {m.profile_email_address({}, { locale })}
                  </FieldLabel>
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
                  {m.profile_update_email({}, { locale })}{" "}
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>

      <Card size="sm">
        <CardHeader>
          <CardTitle>{m.profile_connected_accounts({}, { locale })}</CardTitle>
          <CardDescription>
            {m.profile_external_methods_you_can_use_to({}, { locale })}
          </CardDescription>
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
                    <ItemTitle>{item.providerId}</ItemTitle>
                    <ItemDescription>{item.accountId}</ItemDescription>
                  </ItemContent>
                  {item.providerId !== "credential" ? (
                    <ItemActions>
                      <AlertDialog>
                        <AlertDialogTrigger render={<Button size="sm" variant="outline" />}>
                          <Unlink data-icon="inline-start" />
                          {m.profile_disconnect({}, { locale })}{" "}
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              {m.profile_disconnect_14({}, { locale })} {item.providerId}?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              {m.profile_make_sure_you_have_another_way({}, { locale })}{" "}
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>
                              {m.profile_cancel({}, { locale })}
                            </AlertDialogCancel>
                            <AlertDialogAction
                              variant="destructive"
                              onClick={() => void unlinkAccount(item)}
                            >
                              {m.profile_disconnect({}, { locale })}{" "}
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
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <UserRound />
                </EmptyMedia>
                <EmptyTitle>{m.profile_no_connected_providers({}, { locale })}</EmptyTitle>
                <EmptyDescription>
                  {m.profile_your_account_uses_only_its_primary({}, { locale })}{" "}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
