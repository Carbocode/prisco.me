import { Link, useNavigate } from "@tanstack/react-router";
import type { FormEvent, PropsWithChildren } from "react";
import { useEffect } from "react";

import { authClient } from "../client/auth-client";

export function AuthPage({
  title,
  description,
  children,
}: PropsWithChildren<{ title: string; description: string }>) {
  return (
    <div className="min-h-dvh bg-canvas px-6 py-12 text-ink-inverse">
      <div className="mx-auto w-full max-w-5xl">
        <Link to="/" className="text-sm text-link hover:text-link-hover">
          ← Torna alla home
        </Link>
        <div className="mt-10">
          <p className="text-xs font-semibold uppercase tracking-overline-wide text-link">
            Prisco.me account
          </p>
          <h1 className="display-font mt-3 text-4xl font-semibold sm:text-5xl">{title}</h1>
          <p className="mt-4 max-w-2xl text-ink-subtle">{description}</p>
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

export function RequireAuth({
  admin = false,
  cms = false,
  children,
}: PropsWithChildren<{ admin?: boolean; cms?: boolean }>) {
  const session = authClient.useSession();
  const navigate = useNavigate();
  const role = session.data?.user.role;
  useEffect(() => {
    if (!session.isPending && !session.data)
      void navigate({ to: "/login", search: { mode: "login" } });
    else if (!session.isPending && admin && role !== "admin")
      void navigate({ to: "/dashboard/profile" });
    else if (!session.isPending && cms && !["admin", "editor", "author"].includes(role ?? ""))
      void navigate({ to: "/dashboard/profile" });
  }, [admin, cms, navigate, role, session.data, session.isPending]);
  if (
    session.isPending ||
    !session.data ||
    (admin && role !== "admin") ||
    (cms && !["admin", "editor", "author"].includes(role ?? ""))
  )
    return <p className="text-ink-subtle">Verifica della sessione…</p>;
  return children;
}
