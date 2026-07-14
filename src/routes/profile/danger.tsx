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

export const Route = createFileRoute("/profile/danger")({
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
    <div className="grid gap-6">
      <div>
        <h1 className="text-2xl font-semibold">Elimina account</h1>
        <p className="text-muted-foreground mt-1 text-sm">
          Rimuovi definitivamente il tuo account e tutti i dati associati.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Elimina account</CardTitle>
          <CardDescription>
            Operazione definitiva: vengono rimossi utente, credenziali, sessioni, passkey e dati
            OAuth.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AlertDialog>
            <AlertDialogTrigger render={<Button variant="destructive" />}>
              Elimina definitivamente
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
