import { createFileRoute } from "@tanstack/react-router";
import CloudCarousel from "@/components/cloud-carousel";
import Header from "@/components/header";
import Jupiter from "@/components/jupiter";
import Moon from "@/components/moon";
import Sky from "@/components/sky";
import Star from "@/components/star";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="relative min-h-dvh w-dvw overflow-hidden">
			<Sky className="h-[70dvh] w-dvw">
				<Header />

				<section className="absolute inset-0 z-10 flex items-center justify-center px-6">
					<div className="flex max-w-2xl flex-col items-center gap-4 text-center">
						<Badge variant="outline">Nuova esperienza digitale</Badge>
						<h1 className="display-font text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl text-white">
							Un cielo di idee per il tuo prossimo progetto
						</h1>
						<p className="max-w-xl text-base text-white/75 sm:text-lg">
							Costruiamo identita visive, siti leggeri e interazioni chiare che
							accompagnano ogni brand con precisione e calore.
						</p>
						<div className="flex flex-wrap items-center justify-center gap-3 pt-2">
							<Button size="lg">Scopri lo studio</Button>
							<Button variant="outline" size="lg">
								Parliamone
							</Button>
						</div>
					</div>
				</section>

				<Moon className="absolute left-[12%] top-[10%] w-45" />
				<Jupiter className="absolute right-[14%] top-[12%] w-42" />

				<CloudCarousel />

				<Star size="sm" className="absolute left-[8%] top-[12%]" />
				<Star size="md" className="absolute left-[18%] top-[8%]" />
				<Star size="md" className="absolute left-[30%] top-[14%]" />
				<Star size="sm" className="absolute left-[40%] top-[6%]" />
				<Star size="md" className="absolute left-[52%] top-[12%]" />
				<Star size="lg" className="absolute left-[60%] top-[8%]" />
				<Star size="sm" className="absolute right-[22%] top-[22%]" />
				<Star size="md" className="absolute right-[30%] top-[36%]" />
				<Star size="md" className="absolute left-[36%] top-[30%]" />
				<Star size="sm" className="absolute left-[12%] top-[32%]" />
				<Star size="md" className="absolute right-[12%] top-[34%]" />
				<Star size="lg" className="absolute left-[50%] top-[44%]" />
				<Star size="sm" className="absolute right-[8%] top-[48%]" />
			</Sky>

			<div className="horizon  inset-x-0 bottom-0 h-[30dvh] z-10" />
		</div>
	);
}
