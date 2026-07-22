import { Link } from "react-router-dom";
import SeoHelmet from "../components/SeoHelmet";

function NotFound() {
  return (
    <>
      <SeoHelmet title="404 - Page Not Found | WestSide Store" description="The page you're looking for doesn't exist." />
      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: "70vh", padding: "40px 20px" }}>
        <div className="text-center">
          <div style={{ fontSize: "120px", fontWeight: "bold", lineHeight: 1, background: "linear-gradient(135deg, #667eea, #764ba2)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
            404
          </div>
          <h2 className="mt-3 fw-bold">Page Not Found</h2>
          <p className="text-muted mb-4" style={{ fontSize: "1.1rem" }}>
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            <Link to="/" className="btn btn-primary btn-lg px-4">🏠 Go Home</Link>
            <Link to="/contact" className="btn btn-outline-secondary btn-lg px-4">📧 Contact Us</Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default NotFound;
