import axios from "axios";
import { useState } from "react";
import SeoHelmet from "../components/SeoHelmet";
import "../assets/styles/contact.css";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);
    try {
      const res = await axios.post("/api/contact", form);
      if (res.data.status === "success") {
        setSuccess(true);
        setForm({ name: "", email: "", message: "" });
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch (err) {
      setError("Server error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <>
      <SeoHelmet title="Contact Us" description="Get in touch with WestSide Store. We're here to help." />
      <div className="apple-contact">
        <div className="apple-contact__hero">
          <h1 className="apple-contact__title">Contact Us</h1>
          <p className="apple-contact__subtitle">We're here to help. Drop us a message.</p>
        </div>

        <div className="apple-contact__grid">
          <div className="apple-contact__form-card">
            <h2 className="apple-contact__form-title">Send a Message</h2>
            <form onSubmit={handleSubmit}>
              <div className="apple-contact__field">
                <label htmlFor="contact-name">Name</label>
                <input
                  id="contact-name"
                  type="text"
                  className="apple-input"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="apple-contact__field">
                <label htmlFor="contact-email">Email</label>
                <input
                  id="contact-email"
                  type="email"
                  className="apple-input"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </div>
              <div className="apple-contact__field">
                <label htmlFor="contact-message">Message</label>
                <textarea
                  id="contact-message"
                  className="apple-contact__textarea"
                  name="message"
                  rows="5"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="How can we help you?"
                  required
                ></textarea>
              </div>
              {success && <div className="apple-contact__success">Message sent! We will get back to you soon.</div>}
              {error && <div className="apple-contact__error">{error}</div>}
              <button type="submit" className="apple-btn apple-btn--large" style={{ width: "100%" }} disabled={loading}>
                {loading ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>

          <div className="apple-contact__info-card">
            <h2 className="apple-contact__form-title">Contact Information</h2>
            <div className="apple-contact__info-list">
              <div className="apple-contact__info-item">
                <div className="apple-contact__info-icon"><i className="fas fa-map-marker-alt" /></div>
                <div>
                  <h4>Address</h4>
                  <p>Westside Store, Bombay House,<br />24 Homi Modi Street,<br />Mumbai - 400001.</p>
                </div>
              </div>
              <div className="apple-contact__info-item">
                <div className="apple-contact__info-icon"><i className="fas fa-phone-alt" /></div>
                <div>
                  <h4>Phone</h4>
                  <p>022 6665 8282</p>
                </div>
              </div>
              <div className="apple-contact__info-item">
                <div className="apple-contact__info-icon"><i className="fas fa-envelope" /></div>
                <div>
                  <h4>Email</h4>
                  <p>westside@trent-tata.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="apple-contact__map-section">
          <h2 className="apple-contact__map-title">Our Location</h2>
          <div className="apple-contact__map">
            <img
              src="/Images/map.png"
              alt="WestSide Store Location Map"
              loading="lazy"
            />
          </div>
          <a
            href="https://www.google.com/maps/dir//Trent+Limited,+24,+Homi+Modi+St,+Kala+Ghoda,+Fort,+Mumbai,+Maharashtra+400001/@18.9314136,72.832444,17.5z/data=!4m12!1m2!2m1!1sTrent+near+Bombay+House,+Homi+Modi+Street,+Kala+Ghoda,+Fort,+Mumbai,+Maharashtra!4m8!1m0!1m5!1m1!1s0x3be7d1dcb469493d:0x632a93b0ec425c1b!2m2!1d72.8326444!2d18.9316401!3e3?entry=ttu&g_ep=EgoyMDI1MDIxOS4xIKXMDSoASAFQAw%3D%3D"
            className="apple-btn apple-btn--secondary"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fas fa-directions" /> Get Directions
          </a>
        </div>
      </div>
    </>
  );
}

export default Contact;
