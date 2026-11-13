/* Landing/showcase artwork: scoped visual styles are permitted by AGENTS.md. */
/* oxlint-disable shadcn/no-unknown-classes, shadcn/no-raw-colors, shadcn/no-inline-styles */
import type { Project } from "@/features/portfolio/domain/portfolio";

import { AmmonitePit, TrilobitePit } from "../artwork/fossil-pits";

export function ProjectsSection({ projects }: { projects: Project[] }) {
  return (
    <section
      id="reperti"
      className="layer layer-crust"
      data-section="Progetti"
      aria-labelledby="reperti-title"
    >
      <div className="bands" aria-hidden="true">
        <div className="band" style={{ "--top": "0%", "--c": "#74493f" }}>
          <svg className="band-edge" viewBox="0 0 1440 90" preserveAspectRatio="none">
            <path d="M0 90L0 42.1C102.9 42.1 102.9 48.6 205.7 48.6C308.6 48.6 308.6 70.5 411.4 70.5C514.3 70.5 514.3 42.9 617.1 42.9C720 42.9 720 45.5 822.9 45.5C925.7 45.5 925.7 50.2 1028.6 50.2C1131.4 50.2 1131.4 26.1 1234.3 26.1C1337.1 26.1 1337.1 45.7 1440 45.7L1440 90Z" />
          </svg>
          <svg className="band-lines" viewBox="0 0 1440 200" preserveAspectRatio="none">
            <path d="M0 88.1C102.9 88.1 102.9 94.6 205.7 94.6C308.6 94.6 308.6 116.5 411.4 116.5C514.3 116.5 514.3 88.9 617.1 88.9C720 88.9 720 91.5 822.9 91.5C925.7 91.5 925.7 96.2 1028.6 96.2C1131.4 96.2 1131.4 72.1 1234.3 72.1C1337.1 72.1 1337.1 91.7 1440 91.7" />
            <path d="M0 122.1C102.9 122.1 102.9 128.6 205.7 128.6C308.6 128.6 308.6 150.5 411.4 150.5C514.3 150.5 514.3 122.9 617.1 122.9C720 122.9 720 125.5 822.9 125.5C925.7 125.5 925.7 130.2 1028.6 130.2C1131.4 130.2 1131.4 106.1 1234.3 106.1C1337.1 106.1 1337.1 125.7 1440 125.7" />
          </svg>
        </div>
        <div className="band" style={{ "--top": "24%", "--c": "#663f3a" }}>
          <svg className="band-edge" viewBox="0 0 1440 90" preserveAspectRatio="none">
            <path d="M0 90L0 43.5C102.9 43.5 102.9 54.4 205.7 54.4C308.6 54.4 308.6 55 411.4 55C514.3 55 514.3 23.6 617.1 23.6C720 23.6 720 15.7 822.9 15.7C925.7 15.7 925.7 37.5 1028.6 37.5C1131.4 37.5 1131.4 31.4 1234.3 31.4C1337.1 31.4 1337.1 63.6 1440 63.6L1440 90Z" />
          </svg>
          <svg className="band-lines" viewBox="0 0 1440 200" preserveAspectRatio="none">
            <path d="M0 89.5C102.9 89.5 102.9 100.4 205.7 100.4C308.6 100.4 308.6 101 411.4 101C514.3 101 514.3 69.6 617.1 69.6C720 69.6 720 61.7 822.9 61.7C925.7 61.7 925.7 83.5 1028.6 83.5C1131.4 83.5 1131.4 77.4 1234.3 77.4C1337.1 77.4 1337.1 109.6 1440 109.6" />
            <path d="M0 123.5C102.9 123.5 102.9 134.4 205.7 134.4C308.6 134.4 308.6 135 411.4 135C514.3 135 514.3 103.6 617.1 103.6C720 103.6 720 95.7 822.9 95.7C925.7 95.7 925.7 117.5 1028.6 117.5C1131.4 117.5 1131.4 111.4 1234.3 111.4C1337.1 111.4 1337.1 143.6 1440 143.6" />
          </svg>
        </div>
        <div className="band" style={{ "--top": "50%", "--c": "#563432" }}>
          <svg className="band-edge" viewBox="0 0 1440 90" preserveAspectRatio="none">
            <path d="M0 90L0 30.5C102.9 30.5 102.9 56.1 205.7 56.1C308.6 56.1 308.6 56 411.4 56C514.3 56 514.3 66 617.1 66C720 66 720 26.1 822.9 26.1C925.7 26.1 925.7 28.8 1028.6 28.8C1131.4 28.8 1131.4 23.8 1234.3 23.8C1337.1 23.8 1337.1 28.5 1440 28.5L1440 90Z" />
          </svg>
          <svg className="band-lines" viewBox="0 0 1440 200" preserveAspectRatio="none">
            <path d="M0 76.5C102.9 76.5 102.9 102.1 205.7 102.1C308.6 102.1 308.6 102 411.4 102C514.3 102 514.3 112 617.1 112C720 112 720 72.1 822.9 72.1C925.7 72.1 925.7 74.8 1028.6 74.8C1131.4 74.8 1131.4 69.8 1234.3 69.8C1337.1 69.8 1337.1 74.5 1440 74.5" />
            <path d="M0 110.5C102.9 110.5 102.9 136.1 205.7 136.1C308.6 136.1 308.6 136 411.4 136C514.3 136 514.3 146 617.1 146C720 146 720 106.1 822.9 106.1C925.7 106.1 925.7 108.8 1028.6 108.8C1131.4 108.8 1131.4 103.8 1234.3 103.8C1337.1 103.8 1337.1 108.5 1440 108.5" />
          </svg>
        </div>
        <div className="band" style={{ "--top": "76%", "--c": "#462a29" }}>
          <svg className="band-edge" viewBox="0 0 1440 90" preserveAspectRatio="none">
            <path d="M0 90L0 21.4C102.9 21.4 102.9 57.2 205.7 57.2C308.6 57.2 308.6 54.1 411.4 54.1C514.3 54.1 514.3 71.4 617.1 71.4C720 71.4 720 31.3 822.9 31.3C925.7 31.3 925.7 30.3 1028.6 30.3C1131.4 30.3 1131.4 59 1234.3 59C1337.1 59 1337.1 54.5 1440 54.5L1440 90Z" />
          </svg>
          <svg className="band-lines" viewBox="0 0 1440 200" preserveAspectRatio="none">
            <path d="M0 67.4C102.9 67.4 102.9 103.2 205.7 103.2C308.6 103.2 308.6 100.1 411.4 100.1C514.3 100.1 514.3 117.4 617.1 117.4C720 117.4 720 77.3 822.9 77.3C925.7 77.3 925.7 76.3 1028.6 76.3C1131.4 76.3 1131.4 105 1234.3 105C1337.1 105 1337.1 100.5 1440 100.5" />
            <path d="M0 101.4C102.9 101.4 102.9 137.2 205.7 137.2C308.6 137.2 308.6 134.1 411.4 134.1C514.3 134.1 514.3 151.4 617.1 151.4C720 151.4 720 111.3 822.9 111.3C925.7 111.3 925.7 110.3 1028.6 110.3C1131.4 110.3 1131.4 139 1234.3 139C1337.1 139 1337.1 134.5 1440 134.5" />
          </svg>
        </div>
      </div>
      <div className="decor" aria-hidden="true">
        <img
          className="roots roots-a"
          src="/home/roots-a.webp"
          srcSet="/home/roots-a-160.webp 160w, /home/roots-a-192.webp 192w, /home/roots-a-256.webp 256w, /home/roots-a-384.webp 384w, /home/roots-a.webp 768w"
          sizes="clamp(8rem,13vw,12rem)"
          width="180"
          height="287"
          alt=""
          loading="lazy"
          decoding="async"
        />
        <img
          className="roots roots-b"
          src="/home/roots-b.webp"
          srcSet="/home/roots-b-160.webp 160w, /home/roots-b-192.webp 192w, /home/roots-b-256.webp 256w, /home/roots-b-384.webp 384w, /home/roots-b.webp 768w"
          sizes="clamp(7rem,11vw,10rem)"
          width="180"
          height="237"
          alt=""
          loading="lazy"
          decoding="async"
        />
        <img
          className="roots roots-c"
          src="/home/roots-c.webp"
          srcSet="/home/roots-c-160.webp 160w, /home/roots-c-192.webp 192w, /home/roots-c-256.webp 256w, /home/roots-c-384.webp 384w, /home/roots-c.webp 768w"
          sizes="7.5rem"
          width="180"
          height="175"
          alt=""
          loading="lazy"
          decoding="async"
        />
        <img
          className="pebbles pebbles-a"
          src="/home/pebbles-a.webp"
          srcSet="/home/pebbles-a-160.webp 160w, /home/pebbles-a-192.webp 192w, /home/pebbles-a-256.webp 256w, /home/pebbles-a-384.webp 384w, /home/pebbles-a.webp 768w"
          sizes="clamp(7rem,10vw,9rem)"
          width="184"
          height="70"
          alt=""
          loading="lazy"
          decoding="async"
        />
        <img
          className="pebbles pebbles-b"
          src="/home/pebbles-b.webp"
          srcSet="/home/pebbles-b-160.webp 160w, /home/pebbles-b-192.webp 192w, /home/pebbles-b-256.webp 256w, /home/pebbles-b-384.webp 384w, /home/pebbles-b.webp 768w"
          sizes="clamp(6rem,8vw,7.5rem)"
          width="166"
          height="70"
          alt=""
          loading="lazy"
          decoding="async"
        />
        <img
          className="bone"
          src="/home/bone.webp"
          srcSet="/home/bone-160.webp 160w, /home/bone-192.webp 192w, /home/bone-256.webp 256w, /home/bone-384.webp 384w, /home/bone.webp 768w"
          sizes="clamp(6.5rem,9vw,8.5rem)"
          width="180"
          height="90"
          alt=""
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="wrap">
        <header className="layer-head">
          <h2 className="h2" id="reperti-title" data-reveal="">
            {"Il valore di un’idea. "}
            <span className="serif">{"È ciò che rende possibile."}</span>
          </h2>
          <p className="lead" data-reveal="" style={{ "--i": "1" }}>
            {"La cura conta quando rende più semplice ciò che prima non lo era."}
          </p>
        </header>
        <div className="finds">
          {projects.map((project, index) => (
            <article className="find" data-reveal="" key={project.id}>
              <div className="find-pit" data-dig="" aria-hidden="true">
                {index % 2 === 0 ? <AmmonitePit /> : <TrilobitePit />}
              </div>
              <div className="find-body">
                {project.image ? (
                  <img
                    className="home-content-cover"
                    src={project.image}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    width="768"
                    height="432"
                  />
                ) : null}
                <p className="find-meta">
                  {project.company} · {project.role}
                </p>
                <h3>
                  <a href={`/progetti/${project.slug}`}>{project.title}</a>
                </h3>
                <p>{project.summary}</p>
                <div className="tags">
                  {project.skills.map((skill) => (
                    <span key={skill.id}>{skill.name}</span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
        <p className="layer-more" data-reveal="">
          <a className="text-link" href="/progetti">
            {"Tutti i progetti consegnati "}
            <span aria-hidden="true">{"→"}</span>
          </a>
        </p>
      </div>
    </section>
  );
}
