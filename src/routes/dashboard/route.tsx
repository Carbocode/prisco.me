import { createFileRoute, Link, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  ArrowLeft,
  BriefcaseBusiness,
  FileText,
  Image,
  KeyRound,
  LayoutDashboard,
  LogOut,
  ShieldCheck,
  Tags,
  TriangleAlert,
  UserCog,
  UserPlus,
  UserRound,
  Users,
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
  { to: "/dashboard/profile", label: "Profilo", icon: UserRound },
  { to: "/dashboard/profile/authentication", label: "Autenticazione", icon: KeyRound },
  { to: "/dashboard/profile/authorizations", label: "Autorizzazioni", icon: ShieldCheck },
] as const;

export const Route = createFileRoute("/dashboard")({
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
                        pathname === item.to ||
                        (item.to === "/dashboard/profile" && pathname === "/dashboard/profile/")
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
          {user.role === "admin" && (
            <SidebarGroup>
              <SidebarGroupLabel>Amministrazione</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      title="Crea utente"
                      isActive={pathname === "/dashboard/admin/users/new"}
                      render={
                        <Link
                          to="/dashboard/admin/users/new"
                          onClick={() => setOpenMobile(false)}
                        />
                      }
                    >
                      <UserPlus />
                      <span>Crea utente</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      title="Lista utenti"
                      isActive={
                        pathname === "/dashboard/admin/users" ||
                        pathname === "/dashboard/admin/users/"
                      }
                      render={
                        <Link to="/dashboard/admin/users" onClick={() => setOpenMobile(false)} />
                      }
                    >
                      <Users />
                      <span>Lista utenti</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
          {(user.role === "admin" || user.role === "editor" || user.role === "author") && (
            <SidebarGroup>
              <SidebarGroupLabel>Blog</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      title="Dashboard CMS"
                      isActive={pathname === "/dashboard/cms" || pathname === "/dashboard/cms/"}
                      render={<Link to="/dashboard/cms" onClick={() => setOpenMobile(false)} />}
                    >
                      <LayoutDashboard />
                      <span>Dashboard CMS</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      title="Articoli"
                      isActive={pathname.startsWith("/dashboard/cms/articles")}
                      render={
                        <Link
                          to="/dashboard/cms/articles"
                          search={{ page: 1 }}
                          onClick={() => setOpenMobile(false)}
                        />
                      }
                    >
                      <FileText />
                      <span>Articoli</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  {(user.role === "admin" || user.role === "editor") && (
                    <SidebarMenuItem>
                      <SidebarMenuButton
                        title="Servizi"
                        isActive={pathname.startsWith("/dashboard/cms/services")}
                        render={
                          <Link to="/dashboard/cms/services" onClick={() => setOpenMobile(false)} />
                        }
                      >
                        <BriefcaseBusiness />
                        <span>Servizi</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      title="Categorie"
                      isActive={pathname.startsWith("/dashboard/cms/categories")}
                      render={
                        <Link to="/dashboard/cms/categories" onClick={() => setOpenMobile(false)} />
                      }
                    >
                      <Tags />
                      <span>Categorie</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      title="Media"
                      isActive={pathname.startsWith("/dashboard/cms/media")}
                      render={
                        <Link to="/dashboard/cms/media" onClick={() => setOpenMobile(false)} />
                      }
                    >
                      <Image />
                      <span>Media</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          )}
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                title="Elimina account"
                isActive={pathname === "/dashboard/profile/danger"}
                render={
                  <Link to="/dashboard/profile/danger" onClick={() => setOpenMobile(false)} />
                }
              >
                <TriangleAlert className="text-destructive" />
                <span className="text-destructive">Elimina account</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
            {session.data?.session.impersonatedBy && (
              <SidebarMenuItem>
                <SidebarMenuButton
                  tooltip="Termina impersonificazione"
                  onClick={async () => {
                    await authClient.admin.stopImpersonating();
                    window.location.assign("/dashboard/admin/users");
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
          <span className="text-sm font-medium">Dashboard</span>
        </header>
        <div className="mx-auto w-full max-w-5xl flex-1 p-4 md:p-8">
          <Outlet />
        </div>
      </SidebarInset>
    </>
  );
}
