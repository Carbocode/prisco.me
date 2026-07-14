import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  ArrowLeft,
  KeyRound,
  LogOut,
  ShieldCheck,
  TriangleAlert,
  UserCog,
  UserRound,
} from "lucide-react";

import { RequireAuth } from "@/components/auth-ui";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth-client";

const profileNavigation = [
  { to: "/profile", label: "Profilo", icon: UserRound },
  { to: "/profile/authentication", label: "Autenticazione", icon: KeyRound },
  { to: "/profile/authorizations", label: "Autorizzazioni", icon: ShieldCheck },
] as const;

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [{ title: "Profilo e sicurezza | Prisco.me" }, { name: "robots", content: "noindex" }],
  }),
  component: ProfileRoute,
});

function ProfileRoute() {
  return (
    <RequireAuth>
      <ProfileLayout />
    </RequireAuth>
  );
}

function ProfileLayout() {
  return (
    <SidebarProvider open>
      <ProfileShell />
    </SidebarProvider>
  );
}

function ProfileShell() {
  const session = authClient.useSession();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const { isMobile, setOpenMobile } = useSidebar();
  const user = session.data!.user;

  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <Button size="lg" render={<Link to="/" onClick={() => setOpenMobile(false)} />}>
            <ArrowLeft />
            Torna a Prisco.me
          </Button>
          <Separator />
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Profilo</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {profileNavigation.map((item) => (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton
                      title={item.label}
                      isActive={
                        pathname === item.to || (item.to === "/profile" && pathname === "/profile/")
                      }
                      render={<Link to={item.to} onClick={() => setOpenMobile(false)} />}
                    >
                      <item.icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                title="Elimina account"
                isActive={pathname === "/profile/danger"}
                render={<Link to="/profile/danger" onClick={() => setOpenMobile(false)} />}
              >
                <TriangleAlert className="text-destructive" />
                <span className="text-destructive">Elimina account</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {user.role === "admin" && (
              <SidebarMenuItem>
                <SidebarMenuButton
                  title="Area admin"
                  render={<Link to="/admin" onClick={() => setOpenMobile(false)} />}
                >
                  <UserCog />
                  <span>Area admin</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            {session.data?.session.impersonatedBy && (
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Termina impersonificazione"
                  onClick={async () => {
                    await authClient.admin.stopImpersonating();
                    window.location.assign("/admin");
                  }}
                >
                  <UserCog />
                  <span>Termina impersonificazione</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
            <SidebarMenuItem>
              <SidebarMenuButton
                tooltip="Esci"
                onClick={() =>
                  void authClient.signOut({
                    fetchOptions: { onSuccess: () => void navigate({ to: "/" }) },
                  })
                }
              >
                <LogOut />
                <span>Esci</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
          {isMobile && (
            <>
              <SidebarTrigger />
              <Separator orientation="vertical" />
            </>
          )}
          <span className="text-sm font-medium">Profilo e sicurezza</span>
        </header>
        <div className="mx-auto w-full max-w-5xl flex-1 p-4 md:p-8">
          <Outlet />
        </div>
      </SidebarInset>
    </>
  );
}
