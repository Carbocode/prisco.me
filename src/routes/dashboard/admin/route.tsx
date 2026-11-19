import { createFileRoute, Outlet } from "@tanstack/react-router";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { authClient } from "@/features/auth/client/auth-client";
import { useSiteLocale } from "@/features/site/client/site-location";
import * as m from "@/paraglide/messages.js";

export const Route = createFileRoute("/dashboard/admin")({
  head: ({
    match: {
      context: { locale },
    },
  }) => ({
    meta: [
      { title: m.dashboard_admin_seo({}, { locale }) },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminContent,
});

function AdminContent() {
  const locale = useSiteLocale();
  const role = authClient.useSession().data?.user.role;
  if (role !== "admin") {
    return (
      <Alert variant="destructive">
        <AlertTitle>{m.deny_restricted_access({}, { locale })}</AlertTitle>
        <AlertDescription>
          {m.deny_this_section_is_available_only_to({}, { locale })}
        </AlertDescription>
      </Alert>
    );
  }
  return <Outlet />;
}
