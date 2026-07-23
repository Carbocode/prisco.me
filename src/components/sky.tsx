import type { CSSProperties, HTMLAttributes, PropsWithChildren } from "react";

type SkyProps = PropsWithChildren<HTMLAttributes<HTMLDivElement>>;

type ShootingStar = {
  top: string;
  right: string;
  distance: string;
  duration: string;
  delay: string;
};

const shootingStars: ShootingStar[] = [
  { top: "8%", right: "82%", distance: "13.2rem", duration: "1.7s", delay: "1.8s" },
  { top: "16%", right: "57%", distance: "17.5rem", duration: "2s", delay: "4.2s" },
  { top: "5%", right: "34%", distance: "10.3rem", duration: "1.45s", delay: "6.6s" },
  { top: "22%", right: "70%", distance: "15.3rem", duration: "1.85s", delay: "9s" },
];

export default function Sky({ className, children, ...props }: SkyProps) {
  const classes = ["background", "relative", className].filter(Boolean).join(" ");

  return (
    <div className={classes} {...props}>
      <div className="absolute inset-y-0 left-1/2 w-full min-w-[48rem] -translate-x-1/2 md:inset-0 md:min-w-0 md:translate-x-0">
        <img
          src="/home/small-stars.svg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        <div className="shooting-stars" aria-hidden="true">
          {shootingStars.map((star) => (
            <span
              key={`${star.top}-${star.right}`}
              className="shooting-star-runner"
              style={
                {
                  top: star.top,
                  right: star.right,
                  "--shooting-star-distance": star.distance,
                  "--shooting-star-duration": star.duration,
                  "--shooting-star-delay": star.delay,
                } as CSSProperties
              }
            />
          ))}
        </div>
      </div>
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
