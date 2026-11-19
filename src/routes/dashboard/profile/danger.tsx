import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { TriangleAlert } from "lucide-react";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { localizedPath } from "@/config/site";
import { authClient } from "@/features/auth/client/auth-client";
import { useSiteLocale } from "@/features/site/client/site-location";
import * as m from "@/paraglide/messages.js";

export const Route = createFileRoute("/dashboard/profile/danger")({
  head: ({
    match: {
      context: { locale },
    },
  }) => ({ meta: [{ title: m.danger_seo({}, { locale }) }] }),
  component: DangerPage,
});

function DangerPage() {
  const locale = useSiteLocale();
  const navigate = useNavigate();
  async function deleteAccount() {
    const result = await authClient.deleteUser({ callbackURL: localizedPath("/", locale) });
    if (result.error) toast.error(result.error.message ?? "Eliminazione non riuscita.");
    else {
      toast.success("Account eliminato.");
      void navigate({ to: "/" });
    }
  }

  return (
    <div className="flex max-w-3xl flex-col gap-4">
      <header>
        <p className="text-sm font-medium text-destructive">
          {m.danger_danger_zone({}, { locale })}
        </p>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">
          {m.danger_delete_account({}, { locale })}
        </h1>
        <p className="text-sm text-muted-foreground">
          {m.danger_permanently_remove_the_account_credentials_and({}, { locale })}{" "}
        </p>
      </header>
      <Card size="sm">
        <CardHeader>
          <CardTitle>{m.danger_delete_account({}, { locale })}</CardTitle>
          <CardDescription>
            {m.danger_this_removes_the_user_credentials_sessions({}, { locale })}{" "}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="destructive" />}>
              {m.danger_delete_account({}, { locale })}{" "}
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogMedia>
                  <TriangleAlert />
                </AlertDialogMedia>
                <AlertDialogTitle>
                  {m.danger_permanently_delete_your_account({}, { locale })}
                </AlertDialogTitle>
                <AlertDialogDescription>
                  {m.danger_this_cannot_be_undone_all_authentication({}, { locale })}{" "}
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>{m.danger_cancel({}, { locale })}</AlertDialogCancel>
                <AlertDialogAction variant="destructive" onClick={() => void deleteAccount()}>
                  {m.danger_delete_account({}, { locale })}{" "}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
