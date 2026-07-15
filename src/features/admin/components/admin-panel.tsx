/* oxlint-disable react/no-unstable-nested-components -- TanStack Table usa callback di rendering nelle definizioni di colonna. */
import { Link, useNavigate } from "@tanstack/react-router";
import type { ColumnDef } from "@tanstack/react-table";
import {
  Ban,
  KeyRound,
  LogIn,
  MoreHorizontal,
  RotateCcw,
  Search,
  Shield,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { formString, formValues } from "@/components/auth-ui";
import { DashboardDataTable } from "@/components/dashboard-data-table";
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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
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

type AdminPanelSection = "overview" | "create-user" | "users";

export function AdminPanel({ section = "overview" }: { section?: AdminPanelSection } = {}) {
  const navigate = useNavigate();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [dialog, setDialog] = useState<"ban" | "password" | null>(null);
  const [banReason, setBanReason] = useState("");
  const [password, setPassword] = useState("");

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
    } else toast.error(result.error?.message ?? "Utenti non disponibili.");
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
    if (result.error) toast.error(result.error.message ?? "Creazione non riuscita.");
    else {
      toast.success("Utente creato.");
      event.currentTarget.reset();
      void navigate({ to: "/dashboard/admin/users" });
    }
    await loadUsers();
  }

  async function setRole(item: AdminUser) {
    const role = item.role === "admin" ? "user" : "admin";
    const result = await authClient.admin.setRole({ userId: item.id, role });
    if (result.error) toast.error(result.error.message ?? "Aggiornamento non riuscito.");
    else toast.success(`Ruolo aggiornato a ${role}.`);
    await loadUsers();
  }

  async function toggleBan(item: AdminUser, reason?: string) {
    const result = item.banned
      ? await authClient.admin.unbanUser({ userId: item.id })
      : await authClient.admin.banUser({
          userId: item.id,
          banReason: reason || "Bloccato da un amministratore",
        });
    if (result.error) toast.error(result.error.message ?? "Operazione non riuscita.");
    else toast.success(item.banned ? "Utente riabilitato." : "Utente bloccato.");
    setDialog(null);
    setSelectedUser(null);
    setBanReason("");
    await loadUsers();
  }

  async function resetPassword() {
    if (!selectedUser || !password) return;
    const result = await authClient.admin.setUserPassword({
      userId: selectedUser.id,
      newPassword: password,
    });
    if (result.error) toast.error(result.error.message ?? "Aggiornamento non riuscito.");
    else toast.success("Password impostata.");
    setDialog(null);
    setSelectedUser(null);
    setPassword("");
  }

  async function impersonate(item: AdminUser) {
    const result = await authClient.admin.impersonateUser({ userId: item.id });
    if (result.error) toast.error(result.error.message ?? "Operazione non riuscita.");
    else void navigate({ to: "/dashboard/profile" });
  }

  async function remove(item: AdminUser) {
    const result = await authClient.admin.removeUser({ userId: item.id });
    if (result.error) toast.error(result.error.message ?? "Eliminazione non riuscita.");
    else toast.success("Utente eliminato.");
    await loadUsers();
  }

  const columns: ColumnDef<AdminUser>[] = [
    {
      accessorKey: "name",
      header: "Utente",
      size: 320,
      minSize: 220,
      cell: ({ row }) => (
        <div>
          <p className="truncate font-medium">{row.original.name}</p>
          <p className="truncate text-xs text-muted-foreground">
            {row.original.email}
            {row.original.username ? ` · @${row.original.username}` : ""}
          </p>
        </div>
      ),
    },
    {
      accessorKey: "role",
      header: "Ruolo",
      size: 140,
      cell: ({ row }) => <Badge variant="secondary">{row.original.role ?? "user"}</Badge>,
    },
    {
      accessorKey: "banned",
      header: "Stato",
      size: 140,
      cell: ({ row }) => (
        <Badge variant={row.original.banned ? "destructive" : "outline"}>
          {row.original.banned ? "Bloccato" : "Attivo"}
        </Badge>
      ),
    },
    {
      accessorKey: "createdAt",
      header: "Creato",
      size: 160,
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {new Date(row.original.createdAt).toLocaleDateString("it-IT")}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Azioni</span>,
      size: 80,
      minSize: 80,
      maxSize: 100,
      enableResizing: false,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button size="icon-sm" variant="outline" aria-label={`Azioni per ${item.name}`} />
              }
            >
              <MoreHorizontal />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => void setRole(item)}>
                  <Shield />
                  {item.role === "admin" ? "Rimuovi ruolo Admin" : "Rendi Admin"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    if (item.banned) void toggleBan(item);
                    else {
                      setSelectedUser(item);
                      setDialog("ban");
                    }
                  }}
                >
                  {item.banned ? <RotateCcw /> : <Ban />}
                  {item.banned ? "Riabilita" : "Blocca"}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedUser(item);
                    setDialog("password");
                  }}
                >
                  <KeyRound />
                  Imposta password
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={async () => {
                    await authClient.admin.revokeUserSessions({ userId: item.id });
                    toast.success("Sessioni revocate.");
                  }}
                >
                  <RotateCcw />
                  Revoca sessioni
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => void impersonate(item)}>
                  <LogIn />
                  Impersona
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <AlertDialog>
                  <AlertDialogTrigger
                    render={
                      <DropdownMenuItem
                        variant="destructive"
                        onClick={(event) => event.preventDefault()}
                      />
                    }
                  >
                    <Trash2 />
                    Elimina utente
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Eliminare {item.email}?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Account, credenziali e sessioni verranno rimossi definitivamente.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annulla</AlertDialogCancel>
                      <AlertDialogAction variant="destructive" onClick={() => void remove(item)}>
                        Elimina
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  if (section === "create-user") {
    return (
      <div className="flex max-w-4xl flex-col gap-4">
        <header>
          <p className="text-sm font-medium text-muted-foreground">Amministrazione</p>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">Crea utente</h1>
          <p className="text-sm text-muted-foreground">
            Crea credenziali iniziali e assegna soltanto i privilegi necessari.
          </p>
        </header>
        <Card size="sm">
          <CardHeader>
            <CardTitle>Dati del nuovo account</CardTitle>
            <CardDescription>Il ruolo predefinito è Utente.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={(event) => void createUser(event)}>
              <FieldGroup className="grid gap-3 md:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="admin-name">Nome</FieldLabel>
                  <Input id="admin-name" name="name" autoComplete="name" required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="admin-username">Username</FieldLabel>
                  <Input id="admin-username" name="username" autoComplete="username" required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="admin-email">Email</FieldLabel>
                  <Input id="admin-email" name="email" type="email" autoComplete="email" required />
                </Field>
                <Field>
                  <FieldLabel htmlFor="admin-password">Password iniziale</FieldLabel>
                  <Input
                    id="admin-password"
                    name="password"
                    type="password"
                    autoComplete="new-password"
                    required
                  />
                </Field>
                <Field orientation="horizontal">
                  <Checkbox id="admin-role" name="admin" />
                  <FieldLabel htmlFor="admin-role">Assegna ruolo Admin</FieldLabel>
                </Field>
                <Button size="sm" type="submit">
                  <UserPlus data-icon="inline-start" />
                  Crea utente
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (section !== "users") {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Users />
          </EmptyMedia>
          <EmptyTitle>Seleziona una sezione</EmptyTitle>
          <EmptyDescription>Apri la lista utenti o crea un nuovo account.</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <header className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{total} account</p>
          <h1 className="font-heading text-2xl font-semibold tracking-tight">Utenti</h1>
          <p className="text-sm text-muted-foreground">
            Ruoli, accessi, blocchi e credenziali degli account.
          </p>
        </div>
        <Button size="sm" render={<Link to="/dashboard/admin/users/new" />}>
          <UserPlus data-icon="inline-start" />
          Nuovo utente
        </Button>
      </header>

      <Card size="sm">
        <CardContent>
          <form
            className="flex max-w-lg items-end gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              void loadUsers();
            }}
          >
            <Field className="flex-1">
              <FieldLabel htmlFor="user-search">Email</FieldLabel>
              <Input
                id="user-search"
                type="search"
                value={search}
                placeholder="Cerca per email"
                onChange={(event) => setSearch(event.target.value)}
              />
            </Field>
            <Button size="sm" type="submit" variant="outline">
              <Search data-icon="inline-start" />
              Cerca
            </Button>
          </form>
        </CardContent>
      </Card>

      {users.length ? (
        <Card size="sm">
          <CardContent>
            <DashboardDataTable columns={columns} data={users} getRowId={(user) => user.id} />
          </CardContent>
        </Card>
      ) : (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Users />
            </EmptyMedia>
            <EmptyTitle>Nessun utente trovato</EmptyTitle>
            <EmptyDescription>Modifica la ricerca o crea un nuovo account.</EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      <Dialog open={dialog === "ban"} onOpenChange={(open) => !open && setDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Blocca {selectedUser?.email}</DialogTitle>
            <DialogDescription>Indica un motivo utile agli altri amministratori.</DialogDescription>
          </DialogHeader>
          <Field>
            <FieldLabel htmlFor="ban-reason">Motivo</FieldLabel>
            <Input
              id="ban-reason"
              value={banReason}
              onChange={(event) => setBanReason(event.target.value)}
            />
          </Field>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialog(null)}>
              Annulla
            </Button>
            <Button
              variant="destructive"
              disabled={!selectedUser}
              onClick={() => selectedUser && void toggleBan(selectedUser, banReason)}
            >
              Blocca
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={dialog === "password"} onOpenChange={(open) => !open && setDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Imposta nuova password</DialogTitle>
            <DialogDescription>{selectedUser?.email}</DialogDescription>
          </DialogHeader>
          <Field>
            <FieldLabel htmlFor="admin-new-password">Nuova password</FieldLabel>
            <Input
              id="admin-new-password"
              type="password"
              autoComplete="new-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </Field>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialog(null)}>
              Annulla
            </Button>
            <Button disabled={!password} onClick={() => void resetPassword()}>
              Salva password
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
