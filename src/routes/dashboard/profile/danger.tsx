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
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/dashboard/profile/danger")({
  head: () => ({ meta: [{ title: "Elimina account | Prisco.me" }] }),
  component: DangerPage,
});

function DangerPage() {
  const navigate = useNavigate();
  async function deleteAccount() {
    const result = await authClient.deleteUser({ callbackURL: "/" });
    if (result.error) toast.error(result.error.message ?? "Eliminazione non riuscita.");
    else {
      toast.success("Account eliminato.");
      void navigate({ to: "/" });
    }
  }

  return (
    <div className="flex max-w-3xl flex-col gap-4">
      <header>
        <p className="text-sm font-medium text-destructive">Zona pericolosa</p>
        <h1 className="font-heading text-2xl font-semibold tracking-tight">Elimina account</h1>
        <p className="text-sm text-muted-foreground">
          Rimuovi definitivamente account, credenziali e accessi associati.
        </p>
      </header>
      <Card size="sm">
        <CardHeader>
          <CardTitle>Elimina account</CardTitle>
          <CardDescription>
            Vengono rimossi utente, credenziali, sessioni, passkey e dati OAuth. L’operazione non
            può essere annullata.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="destructive" />}>
              Elimina account
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogMedia>
                  <TriangleAlert />
                </AlertDialogMedia>
                <AlertDialogTitle>Eliminare definitivamente l’account?</AlertDialogTitle>
                <AlertDialogDescription>
                  Questa azione non può essere annullata. Tutti i dati di autenticazione verranno
                  rimossi.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annulla</AlertDialogCancel>
                <AlertDialogAction variant="destructive" onClick={() => void deleteAccount()}>
                  Elimina account
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardContent>
      </Card>
    </div>
  );
}
