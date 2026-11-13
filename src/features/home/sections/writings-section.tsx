import { Fragment } from "react";

/* Landing/showcase artwork: scoped visual styles are permitted by AGENTS.md. */
/* oxlint-disable shadcn/no-unknown-classes, shadcn/no-raw-colors, shadcn/no-inline-styles */
import { GeodeArtwork } from "../artwork/geode-artwork";
import type { HomeArticle } from "../home.types";

export function WritingsSection({ articles }: { articles: HomeArticle[] }) {
  return (
    <section
      id="sedimenti"
      className="layer layer-mantle"
      data-section="Scritti"
      aria-labelledby="sedimenti-title"
    >
      <div className="bands" aria-hidden="true">
        <div className="band" style={{ "--top": "0%", "--c": "#3d211e" }}>
          <svg className="band-edge" viewBox="0 0 1440 90" preserveAspectRatio="none">
            <path d="M0 90L0 24.9C102.9 24.9 102.9 56.4 205.7 56.4C308.6 56.4 308.6 53.1 411.4 53.1C514.3 53.1 514.3 43.7 617.1 43.7C720 43.7 720 28 822.9 28C925.7 28 925.7 62.6 1028.6 62.6C1131.4 62.6 1131.4 63.5 1234.3 63.5C1337.1 63.5 1337.1 45.7 1440 45.7L1440 90Z" />
          </svg>
          <svg className="band-lines" viewBox="0 0 1440 200" preserveAspectRatio="none">
            <path d="M0 70.9C102.9 70.9 102.9 102.4 205.7 102.4C308.6 102.4 308.6 99.1 411.4 99.1C514.3 99.1 514.3 89.7 617.1 89.7C720 89.7 720 74 822.9 74C925.7 74 925.7 108.6 1028.6 108.6C1131.4 108.6 1131.4 109.5 1234.3 109.5C1337.1 109.5 1337.1 91.7 1440 91.7" />
            <path d="M0 104.9C102.9 104.9 102.9 136.4 205.7 136.4C308.6 136.4 308.6 133.1 411.4 133.1C514.3 133.1 514.3 123.7 617.1 123.7C720 123.7 720 108 822.9 108C925.7 108 925.7 142.6 1028.6 142.6C1131.4 142.6 1131.4 143.5 1234.3 143.5C1337.1 143.5 1337.1 125.7 1440 125.7" />
          </svg>
        </div>
        <div className="band" style={{ "--top": "36%", "--c": "#4a2119" }}>
          <svg className="band-edge" viewBox="0 0 1440 90" preserveAspectRatio="none">
            <path d="M0 90L0 72.5C102.9 72.5 102.9 23.4 205.7 23.4C308.6 23.4 308.6 16.4 411.4 16.4C514.3 16.4 514.3 74.9 617.1 74.9C720 74.9 720 26.1 822.9 26.1C925.7 26.1 925.7 22.2 1028.6 22.2C1131.4 22.2 1131.4 54.1 1234.3 54.1C1337.1 54.1 1337.1 35.7 1440 35.7L1440 90Z" />
          </svg>
          <svg className="band-lines" viewBox="0 0 1440 200" preserveAspectRatio="none">
            <path d="M0 118.5C102.9 118.5 102.9 69.4 205.7 69.4C308.6 69.4 308.6 62.4 411.4 62.4C514.3 62.4 514.3 120.9 617.1 120.9C720 120.9 720 72.1 822.9 72.1C925.7 72.1 925.7 68.2 1028.6 68.2C1131.4 68.2 1131.4 100.1 1234.3 100.1C1337.1 100.1 1337.1 81.7 1440 81.7" />
            <path d="M0 152.5C102.9 152.5 102.9 103.4 205.7 103.4C308.6 103.4 308.6 96.4 411.4 96.4C514.3 96.4 514.3 154.9 617.1 154.9C720 154.9 720 106.1 822.9 106.1C925.7 106.1 925.7 102.2 1028.6 102.2C1131.4 102.2 1131.4 134.1 1234.3 134.1C1337.1 134.1 1337.1 115.7 1440 115.7" />
          </svg>
        </div>
        <div className="band" style={{ "--top": "70%", "--c": "#5e2414" }}>
          <svg className="band-edge" viewBox="0 0 1440 90" preserveAspectRatio="none">
            <path d="M0 90L0 70.5C102.9 70.5 102.9 71.9 205.7 71.9C308.6 71.9 308.6 68.5 411.4 68.5C514.3 68.5 514.3 20 617.1 20C720 20 720 50.5 822.9 50.5C925.7 50.5 925.7 40.4 1028.6 40.4C1131.4 40.4 1131.4 46.8 1234.3 46.8C1337.1 46.8 1337.1 22.8 1440 22.8L1440 90Z" />
          </svg>
          <svg className="band-lines" viewBox="0 0 1440 200" preserveAspectRatio="none">
            <path d="M0 116.5C102.9 116.5 102.9 117.9 205.7 117.9C308.6 117.9 308.6 114.5 411.4 114.5C514.3 114.5 514.3 66 617.1 66C720 66 720 96.5 822.9 96.5C925.7 96.5 925.7 86.4 1028.6 86.4C1131.4 86.4 1131.4 92.8 1234.3 92.8C1337.1 92.8 1337.1 68.8 1440 68.8" />
            <path d="M0 150.5C102.9 150.5 102.9 151.9 205.7 151.9C308.6 151.9 308.6 148.5 411.4 148.5C514.3 148.5 514.3 100 617.1 100C720 100 720 130.5 822.9 130.5C925.7 130.5 925.7 120.4 1028.6 120.4C1131.4 120.4 1131.4 126.8 1234.3 126.8C1337.1 126.8 1337.1 102.8 1440 102.8" />
          </svg>
          <svg
            className="lava"
            viewBox="0 0 1440 400"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              style={{ "--l": "0.1s" }}
              d="M348.3 135.9L303.5 168.2L253.7 188.6L313.6 208.1L330.6 234L325 260.9L288.1 296.5L238.8 316.5"
            />
            <path
              className="lava-core"
              d="M348.3 135.9L303.5 168.2L253.7 188.6L313.6 208.1L330.6 234L325 260.9L288.1 296.5L238.8 316.5"
            />
            <path
              style={{ "--l": "1.7s" }}
              d="M402.8 74.8L451.1 98.7L404.7 119.4L463.7 135.1L478.1 158.9L497.4 181.7L520.4 208.6L538.3 246"
            />
            <path
              className="lava-core"
              d="M402.8 74.8L451.1 98.7L404.7 119.4L463.7 135.1L478.1 158.9L497.4 181.7L520.4 208.6L538.3 246"
            />
            <path
              style={{ "--l": "2.1s" }}
              d="M233.3 37.1L286.8 63.8L250.1 102.4L259.6 135.3L305.3 156.8L288.1 193.6L244.3 227.5L196 259.4"
            />
            <path
              className="lava-core"
              d="M233.3 37.1L286.8 63.8L250.1 102.4L259.6 135.3L305.3 156.8L288.1 193.6L244.3 227.5L196 259.4"
            />
            <path
              style={{ "--l": "1.3s" }}
              d="M1332 122.8L1332.4 141.9L1290.5 169.7L1291.6 185.5L1340 212.7L1364.2 232.4L1333.4 246.7L1314.6 267.7"
            />
            <path
              className="lava-core"
              d="M1332 122.8L1332.4 141.9L1290.5 169.7L1291.6 185.5L1340 212.7L1364.2 232.4L1333.4 246.7L1314.6 267.7"
            />
            <path
              style={{ "--l": "0.7s" }}
              d="M552.6 121.8L599.6 140.3L587.1 158.7L606.7 198L570.9 231.9L547 246.3L578.7 269.2L539.1 294.5"
            />
            <path
              className="lava-core"
              d="M552.6 121.8L599.6 140.3L587.1 158.7L606.7 198L570.9 231.9L547 246.3L578.7 269.2L539.1 294.5"
            />
          </svg>
        </div>
      </div>
      <div className="decor" aria-hidden="true">
        <img
          className="crystals crystals-a"
          src="/home/crystals-a.webp"
          srcSet="/home/crystals-a-384.webp 384w, /home/crystals-a.webp 768w"
          sizes="clamp(6.5rem,9vw,8.5rem)"
          width="160"
          height="116"
          alt=""
          loading="lazy"
          decoding="async"
        />
        <img
          className="crystals crystals-b"
          src="/home/crystals-b.webp"
          srcSet="/home/crystals-b-384.webp 384w, /home/crystals-b.webp 768w"
          sizes="clamp(7rem,10vw,9.5rem)"
          width="160"
          height="116"
          alt=""
          loading="lazy"
          decoding="async"
        />
        <img
          className="pebbles pebbles-c"
          src="/home/pebbles-c.webp"
          srcSet="/home/pebbles-c-160.webp 160w, /home/pebbles-c-192.webp 192w, /home/pebbles-c-256.webp 256w, /home/pebbles-c-384.webp 384w, /home/pebbles-c.webp 768w"
          sizes="7rem"
          width="161"
          height="70"
          alt=""
          loading="lazy"
          decoding="async"
        />
      </div>
      <div className="wrap">
        <header className="layer-head">
          <h2 className="h2" id="sedimenti-title" data-reveal="">
            {"Notizie e opinioni "}
            <span className="serif">{"sulla tecnologia."}</span>
          </h2>
          <p className="lead" data-reveal="" style={{ "--i": "1" }}>
            {
              "Quello che si deposita lavorando: riflessioni sul software, esperienze personali e commenti su ciò che succede intorno."
            }
          </p>
        </header>
        <div className="geodes">
          <article className="geode" data-reveal="">
            <div className="geode-visual" data-dig="" aria-hidden="true">
              <GeodeArtwork />
            </div>
            <div className="geode-body">
              {articles.length ? (
                articles.map((article) => (
                  <Fragment key={article.id}>
                    {article.cover ? (
                      <img
                        className="home-content-cover"
                        src={article.cover.url}
                        alt={article.cover.altText ?? ""}
                        loading="lazy"
                        decoding="async"
                        width="768"
                        height="432"
                      />
                    ) : null}
                    <h3>
                      <a href={`/blog/${article.slug}`}>{article.title}</a>
                    </h3>
                    <p>{article.excerpt}</p>
                  </Fragment>
                ))
              ) : (
                <h3>
                  <a href="/blog">Esplora gli scritti</a>
                </h3>
              )}
            </div>
          </article>
        </div>
        <p className="layer-more" data-reveal="">
          <a className="text-link" href="/blog">
            {"Leggi tutti gli scritti "}
            <span aria-hidden="true">{"→"}</span>
          </a>
        </p>
      </div>
    </section>
  );
}
