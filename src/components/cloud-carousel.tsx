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
  startProgress: number;
};

type CloudItem = CloudLane & {
  instanceId: number;
};

const CLOUD_TRAVEL_SPEED = 48;
const CLOUD_GAP_MS = 2_000;
const OFFSCREEN_GUTTER = 24;

/*
 * The first frame is intentionally deterministic. The three lanes start at
 * fixed points along the same route, so every visit renders the same
 * composition before the carousel begins rotating.
 */
const cloudLanes: CloudLane[] = [
  { id: 2, top: 54, width: 30, variant: 1, startProgress: 0 },
  { id: 1, top: 25, width: 26, variant: 2, startProgress: 0.35 },
  { id: 3, top: 50, width: 24, variant: 3, startProgress: 0.65 },
];

function createInitialClouds(): CloudItem[] {
  return cloudLanes.map((lane) => ({
    ...lane,
    instanceId: lane.id,
  }));
}

export default function CloudCarousel() {
  const [clouds, setClouds] = useState<CloudItem[]>(createInitialClouds);
  const nextInstanceId = useRef(cloudLanes.length);
  const scheduledTimeouts = useRef<Set<number>>(new Set());
  const scheduledLanes = useRef<Set<number>>(new Set());
  const isVisible = usePageVisible();

  const clearScheduledSpawns = useCallback(() => {
    scheduledTimeouts.current.forEach((timeout) => window.clearTimeout(timeout));
    scheduledTimeouts.current.clear();
    scheduledLanes.current.clear();
  }, []);

  const spawnCloud = useCallback((lane: CloudLane) => {
    scheduledLanes.current.delete(lane.id);
    nextInstanceId.current += 1;
    const instanceId = nextInstanceId.current;

    setClouds((current) => {
      if (current.some((cloud) => cloud.id === lane.id)) {
        return current;
      }

      return [
        ...current,
        {
          ...lane,
          startProgress: 0,
          instanceId,
        },
      ];
    });
  }, []);

  const scheduleSpawn = useCallback(
    (lane: CloudLane, delay: number) => {
      if (scheduledLanes.current.has(lane.id)) {
        return;
      }

      scheduledLanes.current.add(lane.id);
      const timeout = window.setTimeout(() => {
        scheduledTimeouts.current.delete(timeout);
        spawnCloud(lane);
      }, delay);
      scheduledTimeouts.current.add(timeout);
    },
    [spawnCloud],
  );

  useEffect(() => clearScheduledSpawns, [clearScheduledSpawns]);

  const handleComplete = useCallback(
    (laneId: number, completedInstanceId: number) => {
      setClouds((current) => current.filter((cloud) => cloud.instanceId !== completedInstanceId));

      const lane = cloudLanes.find((item) => item.id === laneId);
      if (lane) {
        scheduleSpawn(lane, CLOUD_GAP_MS);
      }
    },
    [scheduleSpawn],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
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
  const x = useMotionValue(0);
  const animationRef = useRef<ReturnType<typeof animate> | null>(null);
  const hasCompleted = useRef(false);
  const isVisibleRef = useRef(isVisible);
  const previousAnchorX = useRef<number | null>(null);

  useEffect(() => {
    isVisibleRef.current = isVisible;
  }, [isVisible]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) {
      return undefined;
    }

    const getMetrics = () => {
      const containerWidth = element.parentElement?.clientWidth ?? window.innerWidth;
      const cloudWidth = element.getBoundingClientRect().width;
      const travelDistance = containerWidth + cloudWidth + OFFSCREEN_GUTTER * 2;
      const anchorX = -cloudWidth - OFFSCREEN_GUTTER + travelDistance * cloud.startProgress;
      const endX = containerWidth + OFFSCREEN_GUTTER;

      return { anchorX, endX };
    };

    const animateFrom = (startOffset: number) => {
      const { anchorX, endX } = getMetrics();
      const endOffset = endX - anchorX;
      animationRef.current?.stop();

      if (endOffset <= startOffset) {
        if (!hasCompleted.current) {
          hasCompleted.current = true;
          onComplete(cloud.id, cloud.instanceId);
        }
        return;
      }

      animationRef.current = animate(x, endOffset, {
        duration: Math.max(0.01, (endOffset - startOffset) / CLOUD_TRAVEL_SPEED),
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

    const { anchorX } = getMetrics();
    previousAnchorX.current = anchorX;
    x.set(0);
    animateFrom(0);

    const resizeObserver = new ResizeObserver(() => {
      if (hasCompleted.current) {
        return;
      }
      const { anchorX: nextAnchorX } = getMetrics();
      const currentAnchorX = previousAnchorX.current ?? nextAnchorX;
      const currentAbsoluteX = currentAnchorX + x.get();
      previousAnchorX.current = nextAnchorX;
      animateFrom(currentAbsoluteX - nextAnchorX);
    });

    if (element.parentElement) {
      resizeObserver.observe(element.parentElement);
    }

    return () => {
      resizeObserver.disconnect();
      animationRef.current?.stop();
    };
  }, [cloud.id, cloud.instanceId, cloud.startProgress, onComplete, x]);

  useEffect(() => {
    if (isVisible) {
      animationRef.current?.play();
    } else {
      animationRef.current?.pause();
    }
  }, [isVisible]);

  return (
    <div
      ref={elementRef}
      className="absolute will-change-transform"
      style={{
        top: cloud.top + "%",
        left: cloud.startProgress * 100 + "%",
        transform:
          "translateX(calc(-" +
          (1 - cloud.startProgress) * 100 +
          "% + " +
          (2 * cloud.startProgress - 1) * OFFSCREEN_GUTTER +
          "px))",
      }}
    >
      <motion.div style={{ x }}>
        <Cloud variant={cloud.variant} style={{ width: cloud.width + "rem" }} />
      </motion.div>
    </div>
  );
}
