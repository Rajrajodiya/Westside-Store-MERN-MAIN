import SeoHelmet from "../components/SeoHelmet";
import "../assets/styles/About.css";

function About() {
  return (
    <>
      <SeoHelmet
        title="About Us"
        description="Learn about WestSide Store, Trent Ltd., and our brands — Westside, Zudio, Misbu, and Star Bazaar."
      />
      <div className="apple-section">
        <div className="apple-container">
          <nav className="apple-breadcrumb">
            <a href="/">Home</a> / <span>About Us</span>
          </nav>

          <h1 className="apple-about__title">About Us</h1>

          <div className="apple-about__tabs">
            <div className="apple-about__tab active" data-tab="trent">
              <h3>About Trent</h3>
              <p className="apple-about__lead">
                Established in 1998 as part of the Tata Group, Trent Ltd. operates Westside, one of
                India's largest and fastest-growing chains of retail stores.
              </p>
              <p>
                Our vision is to design and deliver fashion & lifestyle brands while keeping it fresh. We are
                young, agile, and risk-takers who love including everyone in this exhilarating journey.
                With over 200 outlets across Westside, Zudio, Misbu, and Star Bazaar, we bring a modern retail
                experience to India.
              </p>
              <p>
                At Trent, we are excited about fashion, food, beauty, home, and technology. We believe in fast,
                clean, and innovative retail while ensuring sustainability and mindful business practices.
              </p>

              <h4 className="apple-about__subtitle">Our Brands</h4>
              <div className="apple-about__brands">
                <div className="apple-about__brand-card">
                  <h5>Westside</h5>
                  <p>A leading fashion brand with over 22 in-house labels covering women's wear, menswear, kidswear, footwear, cosmetics, perfumes, and home decor.</p>
                </div>
                <div className="apple-about__brand-card">
                  <h5>Zudio</h5>
                  <p>Bringing irresistible fashion at unmatched prices while keeping it trendy and affordable.</p>
                </div>
                <div className="apple-about__brand-card">
                  <h5>Misbu</h5>
                  <p>A space for beauty and fashion accessories for those who love to embellish the ordinary.</p>
                </div>
                <div className="apple-about__brand-card">
                  <h5>Star Bazaar</h5>
                  <p>Entered the hypermarket business in 2004, making daily grocery and household shopping effortless.</p>
                </div>
              </div>
            </div>

            <div className="apple-about__tab">
              <h3>About Westside</h3>
              <p className="apple-about__lead">
                First Price. Right Price.
              </p>
              <p>
                Our Customer Promise is — First Price. Right Price. With a collection that's self-assisted,
                curated with fashion solutions highlighting incredible value and edited monthly launches. We are
                famous for Our Point of View as it comes alive through our backwalls & 'See It Buy It'. The
                tables drive Seasonal Statement Lines that excite with style and value. Our service is
                efficient, our space is easy to navigate and our returns policy is simple and customer friendly.
              </p>
              <p>
                Our stores are designed to be a destination for fashion, style, and value. We are confident,
                optimistic, colourful and have a youthful spirit.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default About;
