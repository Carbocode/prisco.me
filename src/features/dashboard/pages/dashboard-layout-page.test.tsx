import { cleanup, fireEvent, render } from "@testing-library/react";
import type { ComponentProps, ReactNode } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { TooltipProvider } from "@/components/ui/tooltip";

import { DashboardPage } from "./dashboard-layout-page";

vi.mock("@/hooks/use-mobile", () => ({ useIsMobile: () => false }));
vi.mock("@/features/auth/components/auth-ui", () => ({
  RequireAuth: ({ children }: { children: ReactNode }) => children,
}));
vi.mock("@/components/ui/sonner", () => ({ Toaster: () => null }));
vi.mock("@/features/auth/client/auth-client", () => ({
  authClient: {
    useSession: () => ({
      data: { user: { id: "local", name: "CMS locale", role: "admin", image: null }, session: {} },
    }),
  },
}));
vi.mock("@tanstack/react-router", () => ({
  Link: ({ to, children, ...props }: ComponentProps<"a"> & { to: string }) => (
    <a {...props} href={to}>
      {children}
    </a>
  ),
  Outlet: () => <p>Pagina dashboard</p>,
  useNavigate: () => vi.fn(),
  useRouterState: ({
    select,
  }: {
    select: (state: { location: { pathname: string } }) => unknown;
  }) => select({ location: { pathname: "/dashboard/cms/articles" } }),
}));

afterEach(cleanup);
function sidebar() {
  return document.querySelector('[data-slot="sidebar"][data-state]');
}
function mount() {
  render(
    <TooltipProvider>
      <DashboardPage />
    </TooltipProvider>,
  );
}
describe("desktop sidebar", () => {
  it("closes and reopens from the dashboard trigger", () => {
    mount();
    expect(sidebar()?.getAttribute("data-state")).toBe("expanded");
    const trigger = document.querySelector<HTMLButtonElement>('[data-slot="sidebar-trigger"]');
    if (!trigger) throw new Error("Missing sidebar trigger");
    fireEvent.click(trigger);
    expect(sidebar()?.getAttribute("data-state")).toBe("collapsed");
    expect(sidebar()?.getAttribute("data-collapsible")).toBe("offcanvas");
    fireEvent.click(trigger);
    expect(sidebar()?.getAttribute("data-state")).toBe("expanded");
  });
  it("also responds to the desktop keyboard shortcut", () => {
    mount();
    fireEvent.keyDown(window, { key: "b", ctrlKey: true });
    expect(sidebar()?.getAttribute("data-state")).toBe("collapsed");
  });
});
