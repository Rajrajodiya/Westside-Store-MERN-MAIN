import { memo, useEffect, useState } from "react";
import SeoHelmet from "../components/SeoHelmet";
import "../assets/styles/Home.css";

import e1 from "../assets/Images/1.webp";
import e2 from "../assets/Images/2.webp";
import e3 from "../assets/Images/3.webp";
import e4 from "../assets/Images/4.webp";
import e5 from "../assets/Images/5.webp";
import e6 from "../assets/Images/6.webp";
import f1 from "../assets/Images/BOYS_1920X900.webp";
import c1 from "../assets/Images/BUILD-YOUR-WARDROBE.webp";
import d3 from "../assets/Images/CASUAL_SHIRTS_1920X900.webp";
import c3 from "../assets/Images/DRESSES_1920X900.webp";
import c6 from "../assets/Images/FOOTWEAR_1920X900.webp";
import c5 from "../assets/Images/GENZ_STORE_1920X900.webp";
import f2 from "../assets/Images/GIRLS_1920X900.webp";
import c4 from "../assets/Images/Loungewear_1920.webp";
import d1 from "../assets/Images/MAN_1920X900.webp";
import d2 from "../assets/Images/UNDERWEAR_1920X900.webp";
import c2 from "../assets/Images/WOMAN_1920X900_1.webp";
import d4 from "../assets/Images/WS_Web_Hero_Banner.webp";
import x2 from "../assets/Images/m13.webp";
import x1 from "../assets/Images/m6.webp";

const CAROUSEL_SECTIONS = [
  { id: "carousel1", images: [c1, c2, c3, c4, c5, c6] },
  { id: "carousel2", images: [d1, d2, d3] },
  { id: "carousel3", images: [e1, e2, e3, e4, e5, e6] },
  { id: "carousel4", images: [f1, f2] },
  { id: "carousel5", images: [x1, x2] },
];

// ── Reusable Carousel Sub-component ──────────────────────────────
const CarouselSection = memo(({ id, images }) => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  // Autoplay every 4 seconds, pause on hover
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setCurrent((p) => (p === images.length - 1 ? 0 : p + 1));
    }, 4000);
    return () => clearInterval(timer);
  }, [images.length, paused]);

  const prev = () => { setCurrent((p) => (p === 0 ? images.length - 1 : p - 1)); };
  const next = () => { setCurrent((p) => (p === images.length - 1 ? 0 : p + 1)); };

  return (
    <div className="apple-carousel" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className="apple-carousel__viewport">
        <div
          className="apple-carousel__track"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {images.map((img, i) => (
            <div key={i} className="apple-carousel__slide">
              <img src={img} alt={`Slide ${i + 1}`} loading={i === 0 ? "eager" : "lazy"} />
            </div>
          ))}
        </div>

        <button className="apple-carousel__btn apple-carousel__btn--prev" onClick={prev} aria-label="Previous">
          <i className="fas fa-chevron-left" />
        </button>
        <button className="apple-carousel__btn apple-carousel__btn--next" onClick={next} aria-label="Next">
          <i className="fas fa-chevron-right" />
        </button>

        {/* Pause indicator */}
        {paused && <div className="apple-carousel__pause-badge"><i className="fas fa-pause" /></div>}

        <div className="apple-carousel__dots">
          {images.map((_, i) => (
            <button
              key={i}
              className={`apple-carousel__dot${i === current ? " active" : ""}`}
              onClick={() => setCurrent(i)}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

function Home() {
  return (
    <>
      <SeoHelmet
        title="Home"
        description="Shop the latest fashion trends for women, men, kids, beauty, and home at WestSide Store."
      />
      <div className="apple-home">
        {CAROUSEL_SECTIONS.map(({ id, images }) => (
          <CarouselSection key={id} id={id} images={images} />
        ))}
        <div className="apple-home__banner">
          <img src={d4} alt="Final Banner" loading="lazy" />
        </div>
      </div>
    </>
  );
}

export default Home;
