import { createFileRoute } from "@tanstack/react-router";

import { ProfilePage } from "@/features/account/pages/profile-page";
import * as m from "@/paraglide/messages.js";

export const Route = createFileRoute("/dashboard/profile/")({
  head: ({
    match: {
      context: { locale },
    },
  }) => ({ meta: [{ title: m.profile_seo({}, { locale }) }] }),
  component: ProfilePage,
});
