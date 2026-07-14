import { oauthProviderClient } from "@better-auth/oauth-provider/client";
import { passkeyClient } from "@better-auth/passkey/client";
import { adminClient, twoFactorClient, usernameClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";

import { cmsAccessControl, cmsRoles } from "@/lib/cms-permissions";

export const authClient = createAuthClient({
  plugins: [
    adminClient({ ac: cmsAccessControl, roles: cmsRoles }),
    usernameClient(),
    twoFactorClient({ twoFactorPage: "/verify-2fa" }),
    passkeyClient(),
    oauthProviderClient(),
  ],
});
