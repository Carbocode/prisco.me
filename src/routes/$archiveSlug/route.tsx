import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/$archiveSlug")({
  component: ArchiveLayout,
});

function ArchiveLayout() {
  return <Outlet />;
}
