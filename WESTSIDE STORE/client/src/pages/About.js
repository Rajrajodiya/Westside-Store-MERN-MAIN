function About() {
    return (
        <div className="main-content">
            <div class="container-fluid">

                <nav class="breadcrumb-container">
                    <div class="container-fluid mt-5 mb-5">
                        <p class="breadcrumb-text">Home / <span class="active">About Us</span></p>
                    </div>
                </nav>

                <div class="container-fluid m-5">
                    <h2 class="fw-bold">ABOUT US</h2>

                    <ul class="nav nav-tabs mt-3">
                        <li class="nav-item">
                            <a class="nav-link active" data-bs-toggle="tab" href="#aboutTrent">ABOUT TRENT</a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" data-bs-toggle="tab" href="#aboutWestside">ABOUT WESTSIDE</a>
                        </li>
                        <li class="nav-item disabled">
                            <a class="nav-link" data-bs-toggle="tab" href="#mission">MISSION STATEMENT</a>
                        </li>
                        <li class="nav-item disabled">
                            <a class="nav-link" data-bs-toggle="tab" href="#community">COMMUNITY</a>
                        </li>
                    </ul>

                    {/* <!-- Tab Content --> */}
                    <div class="tab-content mt-4">
                        <div id="aboutTrent" class="tab-pane fade show active">
                            <h4><strong>Established in 1998 as part of the Tata Group, Trent Ltd. operates Westside, one of
                                India's largest and fastest-growing chains of retail stores.</strong></h4>
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
                            <h5><strong>About our Brands</strong></h5>
                            <p><strong>WESTSIDE:</strong> A leading fashion brand with over 22 in-house labels covering women's
                                wear, menswear, kidswear, footwear, cosmetics, perfumes, and home decor.</p>
                            <p><strong>ZUDIO:</strong> Bringing irresistible fashion at unmatched prices while keeping it trendy
                                and affordable.</p>
                            <p><strong>MISBU:</strong> A space for beauty and fashion accessories for those who love to
                                embellish the ordinary.</p>
                            <p><strong>STAR BAZAAR:</strong> Entered the hypermarket business in 2004, making daily grocery and
                                household shopping effortless.</p>
                        </div>

                        <div id="aboutWestside" class="tab-pane fade">
                            <p>Our vision is to design & deliver fashion brands.</p>
                            <p>
                                Our Customer Promise is - First Price. Right Price. With a collection that's self-assisted,
                                curated with fashion solutions highlighting incredible value and edited monthly launches. We are
                                famous for Our Point of View as it comes alive through our backwalls & 'See It Buy It'. The
                                tables drive Seasonal Statement Lines that excite with style and value. Our service is
                                efficient, our space is easy to navigate and our returns policy is simple and customer friendly.
                            </p>
                            <p>Our stores are designed to be a destination for fashion, style, and value. We are confident,
                                optimistic, colourful and have a youthful spirit.</p>
                        </div>

                        <div id="mission" class="tab-pane fade disabled">
                            <p></p>
                        </div>

                        <div id="community" class="tab-pane fade" disabled>
                            <p></p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
}
export default About;