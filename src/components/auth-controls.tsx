import { Link } from "@tanstack/react-router";
import { UserRound } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";

export function AuthControls() {
  const session = authClient.useSession();
  if (session.isPending) return <Skeleton className="h-9 w-24" />;
  if (session.data)
    return (
      <Button render={<Link to="/profilo" />}>
        <UserRound size={16} /> Profilo
      </Button>
    );
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" render={<Link to="/accedi" search={{ mode: "login" }} />}>
        Accedi
      </Button>
      <Button render={<Link to="/accedi" search={{ mode: "register" }} />}>Registrati</Button>
    </div>
  );
}
