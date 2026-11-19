import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";
import type { HTMLAttributes } from "react";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { SiteLocale } from "@/config/site";
import { useSiteLocale } from "@/features/site/client/site-location";
import * as m from "@/paraglide/messages.js";

function navigationLinks(locale: SiteLocale) {
  return [
    { kind: "static", to: "/", label: "Home" },
    { kind: "static", to: "/career", label: m.nav_career({}, { locale }) },
    { kind: "archive", archiveSlug: "progetti", label: m.nav_projects({}, { locale }) },
    { kind: "archive", archiveSlug: "blog", label: m.nav_blog({}, { locale }) },
    { kind: "static", to: "/contact", label: m.nav_contact({}, { locale }) },
  ] as const;
}

export default function Header({ className, ...props }: HTMLAttributes<HTMLElement>) {
  const locale = useSiteLocale();
  const links = navigationLinks(locale);
  const classes = ["absolute inset-x-0 top-0 z-30 text-white", className].filter(Boolean).join(" ");

  return (
    <header className={classes} {...props}>
      <div className="relative mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 drop-shadow-floating-glyph lg:px-8">
        <Link to="/" className="flex items-center gap-3" aria-label={m.nav_home({}, { locale })}>
          <img src="/favicon/favicon.svg" alt="" className="h-9 w-9" />
          <p className="display-font text-2xl leading-tight font-semibold">Vincenzo Prisco</p>
        </Link>

        <NavigationMenu aria-label={m.nav_main({}, { locale })} className="ml-auto hidden md:flex">
          <NavigationMenuList>
            {links.map((item) => (
              <NavigationMenuItem key={item.label}>
                <NavigationMenuLink
                  render={
                    item.kind === "archive" ? (
                      <Link to="/$archiveSlug" params={{ archiveSlug: item.archiveSlug }} />
                    ) : (
                      <Link to={item.to} />
                    )
                  }
                >
                  {item.label}
                </NavigationMenuLink>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
        </NavigationMenu>

        <Sheet>
          <SheetTrigger render={<Button variant="outline" size="icon" className="md:hidden" />}>
            <Menu />
            <span className="sr-only">{m.nav_open({}, { locale })}</span>
          </SheetTrigger>
          <SheetContent>
            <SheetTitle className="sr-only">{m.nav_title({}, { locale })}</SheetTitle>
            <nav aria-label={m.nav_mobile({}, { locale })} className="grid gap-2 p-4 pt-16">
              {links.map((item) =>
                item.kind === "archive" ? (
                  <Link
                    key={item.label}
                    className={buttonVariants({ variant: "ghost" })}
                    to="/$archiveSlug"
                    params={{ archiveSlug: item.archiveSlug }}
                  >
                    {item.label}
                  </Link>
                ) : (
                  <Link
                    key={item.label}
                    className={buttonVariants({ variant: "ghost" })}
                    to={item.to}
                  >
                    {item.label}
                  </Link>
                ),
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
