import { SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";
import { RequireAuth } from "@/features/auth/components/auth-ui";
import { DashboardShell } from "@/features/dashboard/components/dashboard-shell";

export function DashboardPage() {
  return (
    <>
      <RequireAuth>
        <DashboardLayout />
      </RequireAuth>
      <Toaster theme="dark" />
    </>
  );
}

function DashboardLayout() {
  return (
    <SidebarProvider open>
      <DashboardShell />
    </SidebarProvider>
  );
}
