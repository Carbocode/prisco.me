import { animate, motion, useMotionValue } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import Cloud from "@/components/cloud";
import usePageVisible from "@/hooks/use-page-visible";

type CloudVariant = 1 | 2 | 3;

type CloudItem = {
	id: number;
	variant: CloudVariant;
	top: number;
	width: number;
	duration: number;
	laneId: number;
	startProgress: number;
};

const cloudConfig = {
	respawnFactor: 0.8,
	duration: 28,
	speed: 1,
	lanes: [
		{
			id: 2,
			top: 54,
			width: 30,
			variant: 1 as CloudVariant,
			startProgress: 0,
		},
		{
			id: 1,
			top: 25,
			width: 26,
			variant: 2 as CloudVariant,
			startProgress: 0.35,
		},
		{
			id: 3,
			top: 50,
			width: 24,
			variant: 3 as CloudVariant,
			startProgress: 0.65,
		},
	],
};

export default function CloudCarousel() {
	const [clouds, setClouds] = useState<CloudItem[]>([]);
	const timers = useRef<number[]>([]);
	const isVisible = usePageVisible();
	const isVisibleRef = useRef(isVisible);

	useEffect(() => {
		isVisibleRef.current = isVisible;
	}, [isVisible]);

	useEffect(() => {
		const spawnCloud = (
			lane: (typeof cloudConfig.lanes)[number],
			startProgress = 0,
		) => {
			if (!isVisibleRef.current) {
				return;
			}
			const id = Date.now() + Math.random();
			const { top, width, variant, id: laneId } = lane;
			const duration = cloudConfig.duration / cloudConfig.speed;

			setClouds((prev) => [
				...prev,
				{ id, variant, top, width, duration, laneId, startProgress },
			]);
		};

		cloudConfig.lanes.forEach((lane) => {
			spawnCloud(lane, lane.startProgress);
			const intervalMs =
				(cloudConfig.duration / cloudConfig.speed) *
				cloudConfig.respawnFactor *
				1000;
			const initialDelayMs =
				(cloudConfig.duration / cloudConfig.speed) *
				(1 - lane.startProgress) *
				cloudConfig.respawnFactor *
				1000;

			const timeout = window.setTimeout(() => {
				spawnCloud(lane);
				const interval = window.setInterval(() => spawnCloud(lane), intervalMs);
				timers.current.push(interval);
			}, initialDelayMs);

			timers.current.push(timeout);
		});

		return () => {
			timers.current.forEach((timer) => {
				clearInterval(timer);
				clearTimeout(timer);
			});
			timers.current = [];
		};
	}, []);

	const removeCloud = useCallback((id: number) => {
		setClouds((prev) => prev.filter((cloud) => cloud.id !== id));
	}, []);

	return (
		<div className="absolute inset-0 pointer-events-none">
			{clouds.map((cloud) => (
				<CloudMotion
					key={cloud.id}
					cloud={cloud}
					isVisible={isVisible}
					onComplete={removeCloud}
				/>
			))}
		</div>
	);
}

function vwToPx(value: number) {
	if (typeof window === "undefined") {
		return 0;
	}
	return (value / 100) * window.innerWidth;
}

function CloudMotion({
	cloud,
	isVisible,
	onComplete,
}: {
	cloud: CloudItem;
	isVisible: boolean;
	onComplete: (id: number) => void;
}) {
	const startVw = -35 + 155 * cloud.startProgress;
	const endVw = 120;
	const x = useMotionValue(vwToPx(startVw));
	const controlsRef = useRef<ReturnType<typeof animate> | null>(null);

	useEffect(() => {
		const startX = vwToPx(startVw);
		const endX = vwToPx(endVw);
		x.set(startX);

		controlsRef.current?.stop();
		controlsRef.current = animate(x, endX, {
			duration: cloud.duration * (1 - cloud.startProgress),
			ease: "linear",
			onComplete: () => onComplete(cloud.id),
		});

		return () => {
			controlsRef.current?.stop();
		};
	}, [cloud.duration, cloud.id, cloud.startProgress, endVw, onComplete, startVw, x]);

	useEffect(() => {
		const controls = controlsRef.current;
		if (!controls) {
			return;
		}
		if (isVisible) {
			controls.play?.();
		} else {
			controls.pause?.();
		}
	}, [isVisible]);

	return (
		<motion.div
			className="absolute"
			style={{ top: `${cloud.top}%`, left: 0, x }}
		>
			<Cloud variant={cloud.variant} style={{ width: `${cloud.width}rem` }} />
		</motion.div>
	);
}
