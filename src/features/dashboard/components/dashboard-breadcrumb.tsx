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
import { useSiteLocale } from "@/features/site/client/site-location";
import * as m from "@/paraglide/messages.js";

export function DashboardBreadcrumb({
  pathname,
  pageTitle,
}: {
  pathname: string;
  pageTitle: string;
}) {
  const locale = useSiteLocale();
  const section = dashboardSection(pathname, locale);

  return (
    <Breadcrumb className="min-w-0">
      <BreadcrumbList className="flex-nowrap">
        <BreadcrumbItem>
          <BreadcrumbLink render={<Link to="/" aria-label={m.nav_home({}, { locale })} />}>
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
