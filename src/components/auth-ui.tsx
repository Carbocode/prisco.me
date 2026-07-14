import { Link, useNavigate } from "@tanstack/react-router";
import type { FormEvent, PropsWithChildren } from "react";
import { useEffect } from "react";

import { authClient } from "@/lib/auth-client";

export function AuthPage({
  title,
  description,
  children,
}: PropsWithChildren<{ title: string; description: string }>) {
  return (
    <div className="min-h-dvh bg-slate-950 px-6 py-12 text-slate-100">
      <div className="mx-auto w-full max-w-5xl">
        <Link to="/blog" className="text-sm text-sky-300 hover:text-sky-200">
          ← Torna al blog
        </Link>
        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">
            Prisco.me account
          </p>
          <h1 className="display-font mt-3 text-4xl font-semibold sm:text-5xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-slate-400">{description}</p>
        </div>
        <div className="mt-10">{children}</div>
      </div>
    </div>
  );
}

export function formValues(event: FormEvent<HTMLFormElement>) {
  event.preventDefault();
  return new FormData(event.currentTarget);
}

export function formString(data: FormData, name: string) {
  const value = data.get(name);
  return typeof value === "string" ? value : "";
}

export function RequireAuth({ admin = false, children }: PropsWithChildren<{ admin?: boolean }>) {
  const session = authClient.useSession();
  const navigate = useNavigate();
  const role = session.data?.user.role;
  useEffect(() => {
    if (!session.isPending && !session.data)
      void navigate({ to: "/accedi", search: { mode: "login" } });
    else if (!session.isPending && admin && role !== "admin") void navigate({ to: "/profilo" });
  }, [admin, navigate, role, session.data, session.isPending]);
  if (session.isPending || !session.data || (admin && role !== "admin"))
    return <p className="text-slate-400">Verifica della sessione…</p>;
  return children;
}
