import e1 from "./Images/1.webp";
import e2 from "./Images/2.webp";
import e3 from "./Images/3.webp";
import e4 from "./Images/4.webp";
import e5 from "./Images/5.webp";
import e6 from "./Images/6.webp";
import f1 from "./Images/BOYS_1920X900.webp";
import c1 from "./Images/BUILD-YOUR-WARDROBE.webp";
import d3 from "./Images/CASUAL_SHIRTS_1920X900.webp";
import c3 from "./Images/DRESSES_1920X900.webp";
import c6 from "./Images/FOOTWEAR_1920X900.webp";
import c5 from "./Images/GENZ_STORE_1920X900.webp";
import f2 from "./Images/GIRLS_1920X900.webp";
import c4 from "./Images/Loungewear_1920.webp";
import d1 from "./Images/MAN_1920X900.webp";
import d2 from "./Images/UNDERWEAR_1920X900.webp";
import c2 from "./Images/WOMAN_1920X900_1.webp";
import d4 from "./Images/WS_Web_Hero_Banner.webp";
import x2 from "./Images/m13.webp";
import x1 from "./Images/m6.webp";

// ✅ Reusable Carousel Component
const CarouselSection = ({ id, images }) => (
  <div className="container-fluid my-3">
    <div id={id} className="carousel slide" data-bs-ride="carousel">
      <div className="carousel-indicators">
        {images.map((_, index) => (
          <button
            key={index}
            data-bs-target={`#${id}`}
            data-bs-slide-to={index}
            className={index === 0 ? "active" : ""}
            aria-label={`Slide ${index + 1}`}
          ></button>
        ))}
      </div>
      <div className="carousel-inner">
        {images.map((img, index) => (
          <div
            key={index}
            className={`carousel-item ${index === 0 ? "active" : ""}`}
          >
            <img
              src={img}
              alt={`Slide ${index + 1}`}
              className="d-block w-100"
              style={{ height: "500px", objectFit: "cover" }}
            />
          </div>
        ))}
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target={`#${id}`}
        data-bs-slide="prev"
      >
        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Previous</span>
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target={`#${id}`}
        data-bs-slide="next"
      >
        <span className="carousel-control-next-icon" aria-hidden="true"></span>
        <span className="visually-hidden">Next</span>
      </button>
    </div>
  </div>
);

function Home() {
  return (
    <>
      <CarouselSection
        id="carousel1"
        images={[c1, c2, c3, c4, c5, c6]}
      />
      <CarouselSection
        id="carousel2"
        images={[d1, d2, d3]}
      />
      <CarouselSection
        id="carousel3"
        images={[e1, e2, e3, e4, e5, e6]}
      />
      <CarouselSection
        id="carousel4"
        images={[f1, f2]}
      />
      <CarouselSection
        id="carousel5"
        images={[x1, x2]}
      />
      <div className="container-fluid my-3">
        <img
          src={d4}
          alt="Final Banner"
          className="d-block w-100"
          style={{ height: "550px", objectFit: "fill" }}
        />
      </div>
    </>
  );
}

export default Home;
