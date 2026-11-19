import { Link } from "@tanstack/react-router";
import { House } from "lucide-react";
import { Fragment } from "react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { localizedPath } from "@/config/site";
import { type ContentCrumb } from "@/features/content/domain/public-content";
import { useSiteLocale } from "@/features/site/client/site-location";
import { cn } from "@/lib/utils";
import * as m from "@/paraglide/messages.js";

export function ContentBreadcrumb({ items }: { items: ContentCrumb[] }) {
  const locale = useSiteLocale();
  return (
    <Breadcrumb className="w-full min-w-0 overflow-hidden">
      <BreadcrumbList className="min-w-0 flex-nowrap overflow-hidden">
        <BreadcrumbItem className="shrink-0">
          <BreadcrumbLink render={<Link to="/" aria-label={m.nav_home({}, { locale })} />}>
            <House />
          </BreadcrumbLink>
        </BreadcrumbItem>
        {items.map((item, index) => {
          const isCurrentPage = index === items.length - 1;

          return (
            <Fragment key={item.url}>
              <BreadcrumbSeparator className={cn(!isCurrentPage && "hidden sm:list-item")} />
              <BreadcrumbItem
                className={cn(
                  "min-w-0",
                  isCurrentPage ? "flex-1" : "hidden shrink-0 sm:inline-flex",
                )}
              >
                {isCurrentPage ? (
                  <BreadcrumbPage className="block min-w-0">{item.name}</BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    render={<a href={localizedPath(item.url, locale)} aria-label={item.name} />}
                  >
                    {item.name}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
