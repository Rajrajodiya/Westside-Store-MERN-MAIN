import { Link } from "react-router-dom";
import SeoHelmet from "../components/SeoHelmet";
import { Button } from "../components/ui/button";

function NotFound() {
  return (
    <>
      <SeoHelmet title="404 - Page Not Found | WestSide Store" description="The page you're looking for doesn't exist." />
      <div className="flex items-center justify-center" style={{ minHeight: "70vh", padding: "40px 20px" }}>
        <div className="text-center max-w-md mx-auto">
          <div
            style={{
              fontSize: "120px",
              fontWeight: "bold",
              lineHeight: 1,
              background: "linear-gradient(135deg, #667eea, #764ba2)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            404
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mt-4">Page Not Found</h2>
          <p className="text-gray-500 mb-6 text-lg">
            Oops! The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link to="/">
              <Button variant="primary" size="lg">
                🏠 Go Home
              </Button>
            </Link>
            <Link to="/contact">
              <Button variant="outline" size="lg">
                📧 Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}

export default NotFound;
