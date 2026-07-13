import { animate, motion, useMotionValue } from "framer-motion";
import type { HTMLAttributes, PropsWithChildren } from "react";
import { useCallback, useEffect, useRef, useState } from "react";

import usePageVisible from "@/hooks/use-page-visible";

type SkyProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>;

type ShootingStarConfig = {
  top: number;
  right: number;
  duration: number;
  speed: number;
  fadeDuration: number;
};

type ShootingStarItem = {
  id: number;
  config: ShootingStarConfig;
};

const MAX_ACTIVE_SHOOTING_STARS = 3;
const INITIAL_STAR_DELAY_MS = 1_800;
const STAR_RESPAWN_DELAY_MS = 2_400;

/*
 * A fixed sequence avoids random bursts and makes the first few cycles
 * reproducible. The cap is enforced before every spawn.
 */
const shootingStarSequence: ShootingStarConfig[] = [
  { top: 8, right: 82, duration: 0.9, speed: 235, fadeDuration: 0.8 },
  { top: 16, right: 57, duration: 1.1, speed: 255, fadeDuration: 0.9 },
  { top: 5, right: 34, duration: 0.75, speed: 220, fadeDuration: 0.7 },
  { top: 22, right: 70, duration: 1, speed: 245, fadeDuration: 0.85 },
];

function ShootingStar({
  item,
  isVisible,
  onComplete,
}: {
  item: ShootingStarItem;
  isVisible: boolean;
  onComplete: (id: number) => void;
}) {
  const dotX = useMotionValue(0);
  const dotOpacity = useMotionValue(0);
  const trailWidth = useMotionValue(0);
  const trailOpacity = useMotionValue(0);
  const animationRef = useRef<ReturnType<typeof animate>[]>([]);
  const isVisibleRef = useRef(isVisible);
  const hasCompleted = useRef(false);

  const { duration, fadeDuration, speed } = item.config;
  const distance = speed * duration;
  const totalDuration = duration + fadeDuration;
  const fadeStart = duration / totalDuration;

  useEffect(() => {
    isVisibleRef.current = isVisible;
    if (isVisible) {
      animationRef.current.forEach((animation) => animation.play());
    } else {
      animationRef.current.forEach((animation) => animation.pause());
    }
  }, [isVisible]);

  useEffect(() => {
    const dotAnimation = animate(dotX, distance, {
      duration,
      ease: "linear",
    });
    const dotOpacityAnimation = animate(dotOpacity, [0, 1, 1, 0], {
      duration,
      ease: "linear",
      times: [0, 0.08, 0.95, 1],
    });
    const trailWidthAnimation = animate(trailWidth, distance, {
      duration,
      ease: "linear",
    });
    const trailOpacityAnimation = animate(trailOpacity, [0, 1, 1, 0], {
      duration: totalDuration,
      ease: "linear",
      times: [0, 0.08, fadeStart, 1],
      onComplete: () => {
        if (!hasCompleted.current) {
          hasCompleted.current = true;
          onComplete(item.id);
        }
      },
    });

    animationRef.current = [
      dotAnimation,
      dotOpacityAnimation,
      trailWidthAnimation,
      trailOpacityAnimation,
    ];

    if (!isVisibleRef.current) {
      animationRef.current.forEach((animation) => animation.pause());
    }

    return () => {
      animationRef.current.forEach((animation) => animation.stop());
      animationRef.current = [];
    };
  }, [
    distance,
    dotOpacity,
    dotX,
    duration,
    fadeStart,
    fadeDuration,
    item.id,
    onComplete,
    trailOpacity,
    trailWidth,
    totalDuration,
  ]);

  return (
    <div
      style={{
        position: "absolute",
        top: item.config.top + "%",
        right: item.config.right + "%",
        transform: "rotate(135deg)",
      }}
    >
      <div style={{ position: "relative" }}>
        <motion.span className="shooting-star" style={{ left: 0, x: dotX, opacity: dotOpacity }} />
        <motion.span
          className="shooting-star-trail"
          style={{ width: trailWidth, opacity: trailOpacity }}
        />
      </div>
    </div>
  );
}

export default function Sky({ className, children, ...props }: SkyProps) {
  const classes = ["background", "relative", className].filter(Boolean).join(" ");
  const [stars, setStars] = useState<ShootingStarItem[]>([]);
  const spawnTimeout = useRef<number | null>(null);
  const nextStarId = useRef(0);
  const isVisible = usePageVisible();
  const isVisibleRef = useRef(isVisible);

  useEffect(() => {
    isVisibleRef.current = isVisible;
  }, [isVisible]);

  const clearSpawnTimeout = useCallback(() => {
    if (spawnTimeout.current !== null) {
      window.clearTimeout(spawnTimeout.current);
      spawnTimeout.current = null;
    }
  }, []);

  const scheduleNextStar = useCallback(
    (delay: number) => {
      clearSpawnTimeout();
      spawnTimeout.current = window.setTimeout(() => {
        spawnTimeout.current = null;

        if (!isVisibleRef.current) {
          return;
        }

        nextStarId.current += 1;
        const sequenceIndex = (nextStarId.current - 1) % shootingStarSequence.length;
        setStars((current) => {
          if (current.length >= MAX_ACTIVE_SHOOTING_STARS) {
            return current;
          }

          return [
            ...current,
            {
              id: nextStarId.current,
              config: shootingStarSequence[sequenceIndex],
            },
          ];
        });
        scheduleNextStar(STAR_RESPAWN_DELAY_MS);
      }, delay);
    },
    [clearSpawnTimeout],
  );

  useEffect(() => {
    clearSpawnTimeout();

    if (isVisible) {
      scheduleNextStar(INITIAL_STAR_DELAY_MS);
    }

    return clearSpawnTimeout;
  }, [clearSpawnTimeout, isVisible, scheduleNextStar]);

  const removeStar = useCallback((id: number) => {
    setStars((current) => current.filter((star) => star.id !== id));
  }, []);

  return (
    <div className={classes} {...props}>
      <img
        src="/home/small-stars.svg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="shooting-stars" aria-hidden="true">
        {stars.map((item) => (
          <ShootingStar key={item.id} item={item} isVisible={isVisible} onComplete={removeStar} />
        ))}
      </div>
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
