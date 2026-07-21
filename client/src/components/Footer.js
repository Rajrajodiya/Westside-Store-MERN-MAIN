import "bootstrap/dist/css/bootstrap.min.css";
import I1 from "../assets/Images/1.svg";
import I2 from "../assets/Images/2.svg";
import "../assets/styles/Footer.css";

function Footer() {
  return (
    <footer className="bg-light text-dark pt-5 mt-auto">
      <div className="container-fluid px-5">
        <div className="row">
          {/* Download the App */}
          <div className="col-md-3 mb-4">
            <h5>DOWNLOAD THE APP</h5>
            <a href="https://play.google.com/store/apps"  target="_blank" rel="noopener noreferrer">
              <img src={I1} className="img-fluid mb-2" alt="Google Play" />
            </a>
            <a href="https://www.apple.com/" target="_blank" rel="noopener noreferrer">
              <img src={I2} className="img-fluid" alt="App Store" />
            </a>
          </div>

          {/* Shop Links */}
          <div className="col-md-3 mb-4">
            <h5>SHOP</h5>
            <ul className="list-unstyled">
              <li><a href="/women">WOMAN</a></li>
              <li><a href="/men">MAN</a></li>
              <li><a href="/kids">KIDS</a></li>
              <li><a href="/beauty">BEAUTY</a></li>
              <li><a href="/homedecor">HOME</a></li>
            </ul>
          </div>

          {/* Site & Stores */}
          <div className="col-md-3 mb-4">
            <h5>SITES & STORES</h5>
            <ul className="list-unstyled">
              <li><a href="/about">ABOUT US</a></li>
              <li><a href="/contact">CONTACT US</a></li>
              <li><a href="https://www.trentlimited.com/store-locator/" target="_blank" rel="noopener noreferrer">STORE LOCATOR</a></li>
            </ul>
          </div>

          {/* Newsletter Subscription */}
          <div className="col-md-3 mb-4">
            <h5>JOIN OUR NEWSLETTER</h5>
            <p>Get the latest updates from our stores</p>
            <form>
              <input type="email" className="form-control mb-2" placeholder="Email Id" required />
              <button type="submit" className="btn btn-dark w-100">SUBSCRIBE</button>
            </form>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="row border-top pt-3 text-center">
          <div className="col-md-12">
            <a href="https://www.westside.com/pages/terms-conditions" target="_blank" rel="noopener noreferrer">TERMS & CONDITIONS</a> |
            <a href="https://www.westside.com/pages/privacy-policy" target="_blank" rel="noopener noreferrer"> PRIVACY POLICY</a> |
            <a href="https://www.westside.com/pages/return-policy" target="_blank" rel="noopener noreferrer"> RETURN POLICY</a>
          </div>
        </div>

        {/* Social Icons */}
        <div className="row text-center pt-3">
          <div className="col-md-12">
            <a href="https://www.facebook.com/westsidefanpage/" target="_blank" rel="noopener noreferrer" className="social-icon mx-2"><i className="fab fa-facebook fa-lg"></i></a>
            <a href="https://www.instagram.com/westsidestores/" target="_blank" rel="noopener noreferrer" className="social-icon mx-2"><i className="fab fa-instagram fa-lg"></i></a>
            <a href="https://www.youtube.com/user/WestsideStores" target="_blank" rel="noopener noreferrer" className="social-icon mx-2"><i className="fab fa-youtube fa-lg"></i></a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
