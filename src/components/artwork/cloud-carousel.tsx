import Cloud from "./cloud";

type CloudLane = {
  id: number;
  top: string;
  width: string;
  variant: 1 | 2 | 3;
  duration: string;
  delay: string;
};

const cloudLanes: CloudLane[] = [
  { id: 2, top: "54%", width: "30rem", variant: 1, duration: "38s", delay: "0s" },
  { id: 1, top: "25%", width: "26rem", variant: 2, duration: "35s", delay: "-12.25s" },
  { id: 3, top: "50%", width: "24rem", variant: 3, duration: "33s", delay: "-21.45s" },
];

export default function CloudCarousel() {
  return (
    <div
      className="cloud-carousel pointer-events-none absolute inset-0 z-20 overflow-hidden"
      aria-hidden="true"
    >
      {cloudLanes.map((cloud) => (
        <div
          key={cloud.id}
          className="cloud-carousel-item absolute dynamic-top"
          style={{
            "--dynamic-top": cloud.top,
            "--cloud-duration": cloud.duration,
            "--cloud-delay": cloud.delay,
            "--cloud-width": cloud.width,
          }}
        >
          <Cloud
            variant={cloud.variant}
            className="max-w-none w-(--dynamic-width)"
            style={{
              "--dynamic-width": typeof cloud.width === "number" ? cloud.width + "px" : cloud.width,
            }}
          />
        </div>
      ))}
    </div>
  );
}
