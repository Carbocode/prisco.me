import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Ban, LogIn, Shield, Trash2, UserPlus } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { AuthPage, RequireAuth, formString, formValues } from "@/components/auth-ui";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "@/components/ui/empty";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { authClient } from "@/lib/auth-client";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  username?: string | null;
  role?: string | null;
  banned?: boolean | null;
  banReason?: string | null;
  createdAt: Date;
};

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Amministrazione | Prisco.me" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminRoute,
});

function AdminRoute() {
  return (
    <AuthPage
      title="Amministrazione."
      description="Area esclusiva per amministratori. Qui puoi governare utenti, ruoli, accessi e sessioni; le prossime pagine riservate partiranno da questo spazio."
    >
      <RequireAuth admin>
        <AdminPanel />
      </RequireAuth>
    </AuthPage>
  );
}

function AdminPanel() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const loadUsers = useCallback(async () => {
    const result = await authClient.admin.listUsers({
      query: {
        limit: 100,
        searchValue: search || undefined,
        searchField: "email",
        searchOperator: "contains",
      },
    });
    if (result.data) {
      setUsers(result.data.users);
      setTotal(result.data.total);
    } else setNotice(result.error?.message ?? "Utenti non disponibili.");
  }, [search]);
  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  async function createUser(event: React.FormEvent<HTMLFormElement>) {
    const values = formValues(event);
    const result = await authClient.admin.createUser({
      name: formString(values, "name"),
      email: formString(values, "email"),
      password: formString(values, "password"),
      role: values.get("admin") ? "admin" : "user",
      data: { username: formString(values, "username") },
    });
    setNotice(result.error?.message ?? "Utente creato.");
    await loadUsers();
  }
  async function setRole(item: AdminUser) {
    const role = item.role === "admin" ? "user" : "admin";
    const result = await authClient.admin.setRole({ userId: item.id, role });
    setNotice(result.error?.message ?? `Ruolo aggiornato a ${role}.`);
    await loadUsers();
  }
  async function toggleBan(item: AdminUser) {
    const result = item.banned
      ? await authClient.admin.unbanUser({ userId: item.id })
      : await authClient.admin.banUser({
          userId: item.id,
          banReason: prompt("Motivo del blocco") ?? "Bloccato da un amministratore",
        });
    setNotice(result.error?.message ?? (item.banned ? "Utente riabilitato." : "Utente bloccato."));
    await loadUsers();
  }
  async function resetPassword(item: AdminUser) {
    const password = prompt(`Nuova password per ${item.email}`);
    if (!password) return;
    const result = await authClient.admin.setUserPassword({
      userId: item.id,
      newPassword: password,
    });
    setNotice(result.error?.message ?? "Password impostata.");
  }
  async function impersonate(item: AdminUser) {
    const result = await authClient.admin.impersonateUser({ userId: item.id });
    if (result.error) setNotice(result.error.message ?? "Operazione non riuscita.");
    else void navigate({ to: "/profile" });
  }
  async function remove(item: AdminUser) {
    if (!confirm(`Eliminare definitivamente ${item.email}?`)) return;
    const result = await authClient.admin.removeUser({ userId: item.id });
    setNotice(result.error?.message ?? "Utente eliminato.");
    await loadUsers();
  }

  return (
    <div className="grid gap-6">
      {notice && (
        <Alert>
          <AlertDescription>{notice}</AlertDescription>
        </Alert>
      )}
      <Card>
        <CardHeader>
          <CardTitle>Crea utente</CardTitle>
          <CardDescription>
            Anche da admin il ruolo predefinito è Utente; abilita esplicitamente Admin solo quando
            necessario.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={(event) => void createUser(event)}>
            <Field>
              <FieldLabel htmlFor="admin-name">Nome</FieldLabel>
              <Input id="admin-name" name="name" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="admin-username">Username</FieldLabel>
              <Input id="admin-username" name="username" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="admin-email">Email</FieldLabel>
              <Input id="admin-email" name="email" type="email" required />
            </Field>
            <Field>
              <FieldLabel htmlFor="admin-password">Password iniziale</FieldLabel>
              <Input id="admin-password" name="password" type="password" required />
            </Field>
            <Field orientation="horizontal">
              <Checkbox id="admin-role" name="admin" />
              <FieldLabel htmlFor="admin-role">Abilita subito come Admin</FieldLabel>
            </Field>
            <Button type="submit">
              <UserPlus size={16} className="mr-2" />
              Crea utente
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Utenti ({total})</CardTitle>
          <CardDescription>
            Ricerca, promozione, blocco, impersonificazione e revoca delle credenziali.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="user-search">Cerca per email</FieldLabel>
              <Input
                id="user-search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cerca per email"
              />
            </Field>
            <Button variant="outline" onClick={() => void loadUsers()}>
              Cerca
            </Button>
          </FieldGroup>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Utente</TableHead>
                <TableHead>Ruolo</TableHead>
                <TableHead>Stato</TableHead>
                <TableHead>Azioni</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-slate-500">
                      {item.email}
                      {item.username ? ` · @${item.username}` : ""}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{item.role ?? "user"}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.banned ? "destructive" : "outline"}>
                      {item.banned ? "Bloccato" : "Attivo"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Cambia ruolo"
                        title="Cambia ruolo"
                        onClick={() => void setRole(item)}
                      >
                        <Shield size={17} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Blocca o sblocca"
                        title="Blocca o sblocca"
                        onClick={() => void toggleBan(item)}
                      >
                        <Ban size={17} />
                      </Button>
                      <Button
                        variant="ghost"
                        title="Imposta password"
                        onClick={() => void resetPassword(item)}
                      >
                        PW
                      </Button>
                      <Button
                        variant="ghost"
                        title="Revoca tutte le sessioni"
                        onClick={async () => {
                          await authClient.admin.revokeUserSessions({ userId: item.id });
                          setNotice("Sessioni revocate.");
                        }}
                      >
                        Sessioni
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Impersona utente"
                        title="Impersona"
                        onClick={() => void impersonate(item)}
                      >
                        <LogIn size={17} />
                      </Button>
                      <Button
                        variant="destructive"
                        size="icon"
                        aria-label="Elimina utente"
                        title="Elimina"
                        onClick={() => void remove(item)}
                      >
                        <Trash2 size={17} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Pagine riservate</CardTitle>
          <CardDescription>
            Il controllo del ruolo è già attivo lato interfaccia e le API admin restano protette da
            Better Auth.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Empty>
            <EmptyHeader>
              <EmptyTitle>Nessuna pagina riservata</EmptyTitle>
              <EmptyDescription>
                Spazio pronto per le prossime funzionalità esclusive.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </CardContent>
      </Card>
    </div>
  );
}
