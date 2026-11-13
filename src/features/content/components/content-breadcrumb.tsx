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
import { type ContentCrumb } from "@/features/content/domain/public-content";
import { cn } from "@/lib/utils";

export function ContentBreadcrumb({
  items,
  className,
}: {
  items: ContentCrumb[];
  className?: string;
}) {
  return (
    <Breadcrumb className={cn("min-w-0 overflow-hidden", className)}>
      <BreadcrumbList className="min-w-0 flex-nowrap overflow-hidden">
        <BreadcrumbItem className="shrink-0">
          <BreadcrumbLink render={<Link to="/" aria-label="Torna alla home" />}>
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
                  <BreadcrumbLink render={<a href={item.url} aria-label={item.name} />}>
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
