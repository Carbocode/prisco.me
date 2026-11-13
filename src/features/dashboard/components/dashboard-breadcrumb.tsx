import { Link } from "@tanstack/react-router";
import { House } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { dashboardSection } from "@/features/dashboard/navigation";

export function DashboardBreadcrumb({
  pathname,
  pageTitle,
}: {
  pathname: string;
  pageTitle: string;
}) {
  const section = dashboardSection(pathname);

  return (
    <Breadcrumb className="min-w-0">
      <BreadcrumbList className="flex-nowrap">
        <BreadcrumbItem>
          <BreadcrumbLink render={<Link to="/" aria-label="Torna alla home" />}>
            <House />
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem className="hidden sm:inline-flex">
          <BreadcrumbLink render={<Link to="/dashboard" />}>Dashboard</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className="hidden sm:list-item" />
        {section ? (
          <>
            <BreadcrumbItem className="hidden md:inline-flex">
              <BreadcrumbLink render={<Link to={section.to} />}>{section.label}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:list-item" />
          </>
        ) : null}
        <BreadcrumbItem className="min-w-0">
          <BreadcrumbPage>{pageTitle}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
