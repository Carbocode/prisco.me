import { motion } from "framer-motion";
import type { HTMLAttributes, PropsWithChildren } from "react";
import { useEffect, useRef, useState } from "react";

import usePageVisible from "@/hooks/use-page-visible";

type SkyProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>;

const MAX_ACTIVE_SHOOTING_STARS = 3;
const MIN_STAR_DELAY_MS = 1_200;
const STAR_DELAY_VARIATION_MS = 1_800;

function ShootingStar({ id, onComplete }: { id: number; onComplete: (id: number) => void }) {
  const initialParams = useRef({
    top: Math.random() * 20,
    right: Math.random() * 100,
    duration: 0.5 + Math.random() * 1.4,
    speed: 200 + Math.random() * 100,
    fadeDuration: 0.5 + Math.random() * 1.5,
  }).current;
  const distance = initialParams.speed * initialParams.duration;
  const totalDuration = initialParams.duration + initialParams.fadeDuration;
  const fadeStart = initialParams.duration / totalDuration;
  const angleDeg = 135;

  return (
    <div
      style={{
        position: "absolute",
        top: `${initialParams.top}%`,
        right: `${initialParams.right}%`,
        transform: `rotate(${angleDeg}deg)`,
      }}
    >
      <motion.div
        style={{ position: "relative" }}
        animate={{
          transition: { staggerChildren: 0 },
        }}
      >
        {/* Dot: Moves left, draws the path */}
        <motion.span
          className="shooting-star"
          style={{ left: 0 }}
          initial={{ x: 0, opacity: 0 }}
          animate={{ x: distance, opacity: [0, 1, 1, 0] }}
          transition={{
            duration: initialParams.duration,
            ease: "linear",
            times: [0, 0.08, 0.95, 1],
          }}
        />
        {/* Trail: Grows from origin to follow the dot */}
        <motion.span
          className="shooting-star-trail"
          initial={{ width: 0, opacity: 0 }}
          animate={{
            width: distance,
            opacity: [0, 1, 1, 0],
          }}
          transition={{
            width: { duration: initialParams.duration, ease: "linear" },
            opacity: {
              duration: totalDuration,
              times: [0, 0.08, fadeStart, 1],
              ease: "linear",
            },
          }}
          onAnimationComplete={() => onComplete(id)}
        />
      </motion.div>
    </div>
  );
}

export default function Sky({ className, children, ...props }: SkyProps) {
  const classes = ["background", "relative", className].filter(Boolean).join(" ");
  const [stars, setStars] = useState<number[]>([]);
  const spawnTimeout = useRef<number | null>(null);
  const nextStarId = useRef(0);
  const isVisible = usePageVisible();

  useEffect(() => {
    const clearSpawnTimeout = () => {
      if (spawnTimeout.current !== null) {
        window.clearTimeout(spawnTimeout.current);
        spawnTimeout.current = null;
      }
    };

    if (!isVisible) {
      clearSpawnTimeout();
      setStars([]);
      return undefined;
    }

    const scheduleNextStar = () => {
      const delay = MIN_STAR_DELAY_MS + Math.random() * STAR_DELAY_VARIATION_MS;
      spawnTimeout.current = window.setTimeout(() => {
        nextStarId.current += 1;
        setStars((current) => {
          if (current.length >= MAX_ACTIVE_SHOOTING_STARS) {
            return current;
          }
          return [...current, nextStarId.current];
        });
        scheduleNextStar();
      }, delay);
    };

    scheduleNextStar();
    return clearSpawnTimeout;
  }, [isVisible]);

  const removeStar = (id: number) => {
    setStars((prev) => prev.filter((starId) => starId !== id));
  };

  return (
    <div className={classes} {...props}>
      <img
        src="/home/small-stars.svg"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="shooting-stars" aria-hidden="true">
        {stars.map((id) => (
          <ShootingStar key={id} id={id} onComplete={removeStar} />
        ))}
      </div>
      <div className="relative h-full z-10">{children}</div>
    </div>
  );
}
