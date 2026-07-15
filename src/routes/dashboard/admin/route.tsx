import { createFileRoute, Outlet } from "@tanstack/react-router";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { authClient } from "@/lib/auth-client";

export const Route = createFileRoute("/dashboard/admin")({
  head: () => ({
    meta: [{ title: "Area admin | Prisco.me" }, { name: "robots", content: "noindex" }],
  }),
  component: AdminContent,
});

function AdminContent() {
  const role = authClient.useSession().data?.user.role;
  if (role !== "admin") {
    return (
      <Alert variant="destructive">
        <AlertTitle>Accesso riservato</AlertTitle>
        <AlertDescription>Questa sezione è disponibile solo agli amministratori.</AlertDescription>
      </Alert>
    );
  }
  return <Outlet />;
}
