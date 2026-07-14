import { Link } from "@tanstack/react-router";
import { Menu } from "lucide-react";

import { AuthControls } from "@/components/auth-controls";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const links = [
  { to: "/" as const, label: "Home" },
  { to: "/carriera" as const, label: "Carriera" },
  { to: "/progetti" as const, label: "Progetti" },
  { to: "/blog" as const, label: "Blog" },
  { to: "/contatti" as const, label: "Contatti" },
];

export default function Header({ overlay = false }: { overlay?: boolean }) {
  return (
    <header
      className={
        overlay
          ? "absolute inset-x-0 top-0 z-30 text-white"
          : "relative z-20 border-b border-white/10 bg-slate-950/80 text-white backdrop-blur-md"
      }
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4 lg:px-8">
        <Link to="/" className="flex items-center gap-3" aria-label="Torna alla home">
          <img src="/favicon/favicon.svg" alt="" className="h-9 w-9" />
          <p className="leading-tight display-font text-lg font-semibold">Vincenzo Prisco</p>
        </Link>

        <NavigationMenu aria-label="Navigazione principale" className="hidden md:flex">
          <NavigationMenuList>
            {links.map((item) => (
              <NavigationMenuItem key={item.to}>
                <NavigationMenuLink render={<Link to={item.to} />}>{item.label}</NavigationMenuLink>
              </NavigationMenuItem>
            ))}
            <NavigationMenuItem>
              <AuthControls />
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <Sheet>
          <SheetTrigger render={<Button variant="outline" size="icon" className="md:hidden" />}>
            <Menu />
            <span className="sr-only">Apri menu</span>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Navigazione</SheetTitle>
              <SheetDescription>Sezioni del sito e account.</SheetDescription>
            </SheetHeader>
            <nav aria-label="Navigazione mobile" className="grid gap-2 p-4">
              {links.map((item) => (
                <Button key={item.to} variant="ghost" render={<Link to={item.to} />}>
                  {item.label}
                </Button>
              ))}
              <AuthControls />
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
