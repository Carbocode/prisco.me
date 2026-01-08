import logo from "@/logo.svg";
import { Button } from "@/components/ui/button";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "@/components/ui/navigation-menu";

export default function Header() {
	return (
		<header className="absolute inset-x-0 top-0 z-20">
			<div className="mx-auto flex w-full items-center justify-between px-6 py-5 lg:px-12">
				<div className="flex items-center gap-3 text-white">
					<img src={logo} alt="Prisco" className="h-10 w-10" />
					<div className="leading-tight">
						<p className="text-[10px] uppercase tracking-[0.4em] text-white/70">
							Studio
						</p>
						<p className="display-font text-lg font-semibold">Prisco</p>
					</div>
				</div>

				<nav aria-label="Primary" className="hidden items-center md:flex">
					<NavigationMenu>
						<NavigationMenuList className="gap-1">
							<NavigationMenuItem>
								<NavigationMenuLink className="text-white/80 hover:bg-white/10 hover:text-white">
									Home
								</NavigationMenuLink>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavigationMenuLink className="text-white/80 hover:bg-white/10 hover:text-white">
									Servizi
								</NavigationMenuLink>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavigationMenuLink className="text-white/80 hover:bg-white/10 hover:text-white">
									Progetti
								</NavigationMenuLink>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavigationMenuLink
									href="/blog"
									className="text-white/80 hover:bg-white/10 hover:text-white"
								>
									Blog
								</NavigationMenuLink>
							</NavigationMenuItem>
							<NavigationMenuItem>
								<NavigationMenuLink className="text-white/80 hover:bg-white/10 hover:text-white">
									Contatti
								</NavigationMenuLink>
							</NavigationMenuItem>
						</NavigationMenuList>
					</NavigationMenu>
				</nav>

				<div className="flex items-center gap-2 md:hidden">
					<Button
						variant="ghost"
						size="sm"
						className="text-white/80 hover:bg-white/10 hover:text-white"
					>
						Menu
					</Button>
				</div>
			</div>
		</header>
	);
}
