import axios from "axios";
import { useState } from "react";

function Contact() {
    const [form, setForm] = useState({ name: "", email: "", message: "" });
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess(false);
        try {
            const res = await axios.post("http://localhost:5000/api/contact", form);
            if (res.data.status === "success") {
                setSuccess(true);
                setForm({ name: "", email: "", message: "" });
            } else {
                setError("Something went wrong. Please try again.");
            }
        } catch (err) {
            setError("Server error. Please try again.");
        }
    };

    return (
        <>
            <div className="contact-hero">
                <div className="container" style={{ paddingTop: "20 px", paddingBottom: "50px" }}>
                    <div className="row">
                        <h1 className="display-4" style={{ textAlign: "center", fontSize: "2.5rem", fontWeight: "bold", paddingBottom: "65px" }}>Contact Us</h1>
                        <div className="col-md-6 mb-4">
                            <h2>Get in Touch</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="message" className="form-label">Message</label>
                                    <textarea
                                        className="form-control"
                                        id="message"
                                        name="message"
                                        rows="5"
                                        value={form.message}
                                        onChange={handleChange}
                                        required
                                    ></textarea>
                                </div>
                                {success && <div className="alert alert-success">Message sent!</div>}
                                {error && <div className="alert alert-danger">{error}</div>}
                                <button type="submit" className="btn btn-primary">Send Message</button>
                            </form>
                        </div>
                        <div className="col-md-6 contact-info">
                            <h2>Contact Information</h2>
                            <div className="d-flex align-items-center mb-3">
                                <i className="bi bi-geo-alt me-3"></i>
                                <div>
                                    <h5>Address</h5>
                                    <p>Westside Store, Bombay House, 24 Homi Modi Street, Mumbai - 400001.</p>
                                </div>
                            </div>
                            <div className="d-flex align-items-center mb-3">
                                <i className="bi bi-telephone me-3"></i>
                                <div>
                                    <h5>Phone</h5>
                                    <p>022 6665 8282</p>
                                </div>
                            </div>
                            <div className="d-flex align-items-center">
                                <i className="bi bi-envelope me-3"></i>
                                <div>
                                    <h5>Email</h5>
                                    <p>westside@trent-tata.com</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <section className=" bg-light">
                    <div className="container">
                        <div className="row">
                            <h2 className="text-center mb-4">Our Location</h2>
                            <div className="col-12">
                                <div className="map-container shadow rounded overflow-hidden">
                                    <img src="/Images/map.png" alt="Our Location Map" className="img-fluid w-100"
                                        style={{ height: "400px", objectFit: "cover" }} />
                                </div>
                                <div className="text-center mt-4">
                                    <h4>Main Office</h4>
                                    <p>Westside Store, Bombay House, 24 Homi Modi Street, Mumbai - 400001.</p>
                                    <a href="https://www.google.com/maps/dir//Trent+Limited,+24,+Homi+Modi+St,+Kala+Ghoda,+Fort,+Mumbai,+Maharashtra+400001/@18.9314136,72.832444,17.5z/data=!4m12!1m2!2m1!1sTrent+near+Bombay+House,+Homi+Modi+Street,+Kala+Ghoda,+Fort,+Mumbai,+Maharashtra!4m8!1m0!1m5!1m1!1s0x3be7d1dcb469493d:0x632a93b0ec425c1b!2m2!1d72.8326444!2d18.9316401!3e3?entry=ttu&g_ep=EgoyMDI1MDIxOS4xIKXMDSoASAFQAw%3D%3D"
                                        className="btn btn-primary" target="_blank" rel="noopener noreferrer">Get Directions</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div >
        </>
    );
}

export default Contact;