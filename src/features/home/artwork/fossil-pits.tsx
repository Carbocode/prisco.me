/* Landing/showcase artwork: scoped visual styles are permitted by AGENTS.md. */
/* oxlint-disable shadcn/no-unknown-classes, shadcn/no-raw-colors, shadcn/no-inline-styles */
export function AmmonitePit() {
  return (
    <>
      <img
        className="pit"
        src="/home/ammonite-pit.webp"
        srcSet="/home/ammonite-pit-384.webp 384w, /home/ammonite-pit-480.webp 480w, /home/ammonite-pit-640.webp 640w, /home/ammonite-pit-960.webp 960w, /home/ammonite-pit.webp 1280w"
        sizes="clamp(18rem,38vw,27rem)"
        width="320"
        height="300"
        alt=""
        loading="lazy"
        decoding="async"
      />
      <div className="find-fossil" data-fy="0.04">
        <img
          className="fossil-art"
          src="/home/ammonite-fossil-art.webp"
          srcSet="/home/ammonite-fossil-art-256.webp 256w, /home/ammonite-fossil-art-320.webp 320w, /home/ammonite-fossil-art-384.webp 384w, /home/ammonite-fossil-art-640.webp 640w, /home/ammonite-fossil-art-768.webp 768w, /home/ammonite-fossil-art.webp 1280w"
          sizes="clamp(201.6px,26.6vw,302.4px)"
          width="240"
          height="240"
          alt=""
          loading="lazy"
          decoding="async"
        />
      </div>
    </>
  );
}

export function TrilobitePit() {
  return (
    <>
      <img
        className="pit"
        src="/home/trilobite-pit.webp"
        srcSet="/home/trilobite-pit-384.webp 384w, /home/trilobite-pit-480.webp 480w, /home/trilobite-pit-640.webp 640w, /home/trilobite-pit-960.webp 960w, /home/trilobite-pit.webp 1280w"
        sizes="clamp(18rem,38vw,27rem)"
        width="320"
        height="300"
        alt=""
        loading="lazy"
        decoding="async"
      />
      <div className="find-fossil" data-fy="0.04">
        <img
          className="fossil-art"
          src="/home/trilobite-fossil-art.webp"
          srcSet="/home/trilobite-fossil-art-256.webp 256w, /home/trilobite-fossil-art-320.webp 320w, /home/trilobite-fossil-art-384.webp 384w, /home/trilobite-fossil-art-640.webp 640w, /home/trilobite-fossil-art-768.webp 768w, /home/trilobite-fossil-art.webp 1280w"
          sizes="clamp(201.6px,26.6vw,302.4px)"
          width="220"
          height="260"
          alt=""
          loading="lazy"
          decoding="async"
        />
      </div>
    </>
  );
}
