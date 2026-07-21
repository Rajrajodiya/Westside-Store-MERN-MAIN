import "../assets/styles/Footer.css";

const FOOTER_LINKS = {
  Shop: [
    { to: "/women", label: "Women" },
    { to: "/men", label: "Men" },
    { to: "/kids", label: "Kids" },
    { to: "/beauty", label: "Beauty" },
    { to: "/homedecor", label: "Home" },
  ],
  Connect: [
    { to: "/about", label: "About Us" },
    { to: "/contact", label: "Contact Us" },
    { to: "https://www.trentlimited.com/store-locator/", label: "Store Locator", external: true },
  ],
  Policies: [
    { to: "https://www.westside.com/pages/terms-conditions", label: "Terms", external: true },
    { to: "https://www.westside.com/pages/privacy-policy", label: "Privacy", external: true },
    { to: "https://www.westside.com/pages/return-policy", label: "Returns", external: true },
  ],
};

function Footer() {
  return (
    <footer className="apple-footer">
      <div className="apple-footer__inner">
        <div className="apple-footer__grid">
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading} className="apple-footer__col">
              <h5 className="apple-footer__heading">{heading}</h5>
              <ul className="apple-footer__links">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.external ? (
                      <a href={link.to} target="_blank" rel="noopener noreferrer" className="apple-footer__link">
                        {link.label}
                      </a>
                    ) : (
                      <a href={link.to} className="apple-footer__link">{link.label}</a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="apple-footer__col">
            <h5 className="apple-footer__heading">Stay Connected</h5>
            <div className="apple-footer__social">
              <a href="https://www.facebook.com/westsidefanpage/" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <i className="fab fa-facebook-f" />
              </a>
              <a href="https://www.instagram.com/westsidestores/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <i className="fab fa-instagram" />
              </a>
              <a href="https://www.youtube.com/user/WestsideStores" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <i className="fab fa-youtube" />
              </a>
            </div>
            <p className="apple-footer__tagline">
              First Price. Right Price.
            </p>
          </div>
        </div>
        <div className="apple-footer__bottom">
          <span className="apple-footer__copy">
            © {new Date().getFullYear()} WestSide Store — Trent Ltd. All rights reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
