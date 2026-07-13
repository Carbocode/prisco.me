import { animate, motion, useMotionValue } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";

import Cloud from "@/components/cloud";
import usePageVisible from "@/hooks/use-page-visible";

type CloudVariant = 1 | 2 | 3;

type CloudLane = {
  id: number;
  top: number;
  width: number;
  variant: CloudVariant;
  initialDelay: number;
};

type CloudItem = Omit<CloudLane, "initialDelay"> & {
  instanceId: number;
};

const CLOUD_TRAVEL_SPEED = 48;
const CLOUD_GAP_MS = 2_000;
const OFFSCREEN_GUTTER = 24;

const cloudLanes: CloudLane[] = [
  { id: 1, top: 25, width: 26, variant: 2, initialDelay: 6_000 },
  { id: 2, top: 54, width: 30, variant: 1, initialDelay: 0 },
  { id: 3, top: 50, width: 24, variant: 3, initialDelay: 11_000 },
];

export default function CloudCarousel() {
  const [clouds, setClouds] = useState<CloudItem[]>([]);
  const timeouts = useRef<number[]>([]);
  const instanceId = useRef(0);
  const isVisible = usePageVisible();
  const isVisibleRef = useRef(isVisible);

  useEffect(() => {
    isVisibleRef.current = isVisible;
  }, [isVisible]);

  const clearScheduledSpawns = useCallback(() => {
    timeouts.current.forEach((timeout) => window.clearTimeout(timeout));
    timeouts.current = [];
  }, []);

  const spawnCloud = useCallback((lane: CloudLane) => {
    if (!isVisibleRef.current) {
      return;
    }

    instanceId.current += 1;
    setClouds((current) => [
      ...current.filter((cloud) => cloud.id !== lane.id),
      {
        id: lane.id,
        top: lane.top,
        width: lane.width,
        variant: lane.variant,
        instanceId: instanceId.current,
      },
    ]);
  }, []);

  const scheduleSpawn = useCallback(
    (lane: CloudLane, delay: number) => {
      const timeout = window.setTimeout(() => {
        timeouts.current = timeouts.current.filter((item) => item !== timeout);
        spawnCloud(lane);
      }, delay);
      timeouts.current.push(timeout);
    },
    [spawnCloud],
  );

  useEffect(() => {
    clearScheduledSpawns();

    if (!isVisible) {
      setClouds([]);
      return undefined;
    }

    cloudLanes.forEach((lane) => scheduleSpawn(lane, lane.initialDelay));
    return clearScheduledSpawns;
  }, [clearScheduledSpawns, isVisible, scheduleSpawn]);

  const handleComplete = useCallback(
    (laneId: number, completedInstanceId: number) => {
      setClouds((current) => current.filter((cloud) => cloud.instanceId !== completedInstanceId));

      const lane = cloudLanes.find((item) => item.id === laneId);
      if (lane && isVisibleRef.current) {
        scheduleSpawn(lane, CLOUD_GAP_MS);
      }
    },
    [scheduleSpawn],
  );

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {clouds.map((cloud) => (
        <CloudMotion
          key={cloud.instanceId}
          cloud={cloud}
          isVisible={isVisible}
          onComplete={handleComplete}
        />
      ))}
    </div>
  );
}

function CloudMotion({
  cloud,
  isVisible,
  onComplete,
}: {
  cloud: CloudItem;
  isVisible: boolean;
  onComplete: (laneId: number, instanceId: number) => void;
}) {
  const elementRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(-10_000);
  const animationRef = useRef<ReturnType<typeof animate> | null>(null);
  const hasCompleted = useRef(false);
  const hasStarted = useRef(false);
  const isVisibleRef = useRef(isVisible);

  useEffect(() => {
    isVisibleRef.current = isVisible;
  }, [isVisible]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) {
      return undefined;
    }

    const getEndX = () => {
      const containerWidth = element.parentElement?.clientWidth ?? window.innerWidth;
      return containerWidth + OFFSCREEN_GUTTER;
    };

    const animateFrom = (startX: number) => {
      const endX = getEndX();
      animationRef.current?.stop();

      if (endX <= startX) {
        if (!hasCompleted.current) {
          hasCompleted.current = true;
          onComplete(cloud.id, cloud.instanceId);
        }
        return;
      }

      animationRef.current = animate(x, endX, {
        duration: Math.max(0.01, (endX - startX) / CLOUD_TRAVEL_SPEED),
        ease: "linear",
        onComplete: () => {
          if (!hasCompleted.current) {
            hasCompleted.current = true;
            onComplete(cloud.id, cloud.instanceId);
          }
        },
      });

      if (!isVisibleRef.current) {
        animationRef.current.pause();
      }
    };

    const cloudWidth = element.getBoundingClientRect().width;
    const startX = -cloudWidth - OFFSCREEN_GUTTER;
    x.set(startX);
    hasStarted.current = true;
    animateFrom(startX);

    const resizeObserver = new ResizeObserver(() => {
      if (!hasStarted.current || hasCompleted.current) {
        return;
      }
      animateFrom(x.get());
    });
    if (element.parentElement) {
      resizeObserver.observe(element.parentElement);
    }

    return () => {
      resizeObserver.disconnect();
      animationRef.current?.stop();
    };
  }, [cloud.id, cloud.instanceId, onComplete, x]);

  useEffect(() => {
    if (isVisible) {
      animationRef.current?.play();
    } else {
      animationRef.current?.pause();
    }
  }, [isVisible]);

  return (
    <motion.div
      ref={elementRef}
      className="absolute left-0 will-change-transform"
      style={{ top: `${cloud.top}%`, x }}
    >
      <Cloud variant={cloud.variant} style={{ width: `${cloud.width}rem` }} />
    </motion.div>
  );
}
