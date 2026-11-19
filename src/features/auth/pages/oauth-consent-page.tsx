import { useNavigate } from "@tanstack/react-router";
import { getRouteApi } from "@tanstack/react-router";
import { useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Item, ItemContent, ItemDescription, ItemTitle } from "@/components/ui/item";
import { authClient } from "@/features/auth/client/auth-client";
import { AuthPage, RequireAuth } from "@/features/auth/components/auth-ui";
import { useSiteLocale } from "@/features/site/client/site-location";
import * as m from "@/paraglide/messages.js";

const routeApi = getRouteApi("/oauth/consent");

export function ConsentRoute() {
  const locale = useSiteLocale();
  return (
    <AuthPage
      title={m.oauth_authorize_the_application({}, { locale })}
      description={m.oauth_review_the_requested_permissions_before_sharing({}, { locale })}
    >
      <RequireAuth>
        <Consent />
      </RequireAuth>
    </AuthPage>
  );
}

function Consent() {
  const locale = useSiteLocale();
  const search = routeApi.useSearch();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  async function decide(accept: boolean) {
    const result = await authClient.oauth2.consent({ accept, scope: search.scope });
    if (result.error) setError(result.error.message ?? m.oauth_failed({}, { locale }));
    else if (result.data?.url) window.location.assign(result.data.url);
    else void navigate({ to: "/dashboard/profile" });
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>{search.client_id}</CardTitle>
        <CardDescription>{m.oauth_this_application_requests({}, { locale })}</CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          {search.scope
            .split(" ")
            .filter(Boolean)
            .map((scope) => (
              <Item key={scope}>
                <ItemContent>
                  <ItemTitle>
                    <Badge variant="secondary">{scope}</Badge>
                  </ItemTitle>
                  <ItemDescription>
                    {scope === "openid" && m.oauth_identify({}, { locale })}
                    {scope === "profile" && m.oauth_profile_scope({}, { locale })}
                    {scope === "email" && m.oauth_email_scope({}, { locale })}
                  </ItemDescription>
                </ItemContent>
              </Item>
            ))}
        </div>
        <div className="mt-6 flex gap-3">
          <Button variant="outline" onClick={() => void decide(false)}>
            {m.oauth_deny({}, { locale })}{" "}
          </Button>
          <Button onClick={() => void decide(true)}>{m.oauth_authorize({}, { locale })}</Button>
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}
