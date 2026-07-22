import { Link } from "@tanstack/react-router";
import { UserRound } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";

export function AuthControls() {
  const session = authClient.useSession();
  if (session.isPending) return <Skeleton className="h-8 w-44" />;
  if (session.data)
    return (
      <Link className={buttonVariants()} to="/dashboard/profile">
        <UserRound size={16} /> Profilo
      </Link>
    );
  return (
    <div className="flex items-center gap-2">
      <Link className={buttonVariants({ variant: "ghost" })} to="/login" search={{ mode: "login" }}>
        Accedi
      </Link>
      <Link className={buttonVariants()} to="/login" search={{ mode: "register" }}>
        Registrati
      </Link>
    </div>
  );
}
