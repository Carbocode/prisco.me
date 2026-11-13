import { createFileRoute } from "@tanstack/react-router";

import { ProfilePage } from "@/features/account/pages/profile-page";

export const Route = createFileRoute("/dashboard/profile/")({
  head: () => ({ meta: [{ title: "Profilo | Prisco.me" }] }),
  component: ProfilePage,
});
