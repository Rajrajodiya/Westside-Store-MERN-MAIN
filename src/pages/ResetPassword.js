import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { showSuccess, showError } from "../components/ToastConfig";
import { Button } from "../components/ui/button";
import { Alert } from "../components/ui/alert";
import SeoHelmet from "../components/SeoHelmet";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [step] = useState(token ? "reset" : "forgot");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setError(""); setMessage(""); setLoading(true);
    try {
      const res = await axios.post("/api/auth/forgot-password", { email });
      setMessage(res.data.message);
      showSuccess(res.data.message);
      setEmail("");
    } catch { setError("Server error."); showError("Server error."); }
    setLoading(false);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError(""); setMessage("");
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    setLoading(true);
    try {
      const res = await axios.post("/api/auth/reset-password", { token, password });
      if (res.data.status === "success") {
        showSuccess("Password reset successfully! Redirecting to login...");
        setTimeout(() => navigate("/signup"), 2000);
      } else setError(res.data.message || "Reset failed.");
    } catch (err) { setError(err.response?.data?.message || "Server error."); showError("Reset failed."); }
    setLoading(false);
  };

  return (
    <>
      <SeoHelmet title="Reset Password" description="Reset your WestSide Store account password." />
      <div className="flex items-center justify-center" style={{ minHeight: "70vh", paddingTop: "90px" }}>
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8" style={{ maxWidth: "450px", width: "100%" }}>
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">{step === "forgot" ? "Forgot Password" : "Reset Password"}</h3>
            <p className="text-gray-500 mt-2">{step === "forgot" ? "Enter your email and we'll send you a reset link." : "Enter your new password."}</p>
          </div>
          {step === "forgot" && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  className="apple-input"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                />
              </div>
              {message && <Alert variant="success">{message}</Alert>}
              {error && <Alert variant="error">{error}</Alert>}
              <Button type="submit" variant="primary" size="md" className="w-full" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </Button>
              <div className="text-center mt-4">
                <Link to="/signup" className="text-sm text-blue-600 hover:text-blue-700 hover:underline">
                  Back to Login
                </Link>
              </div>
            </form>
          )}
          {step === "reset" && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                <input
                  type="password"
                  className="apple-input"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="At least 6 characters"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                <input
                  type="password"
                  className="apple-input"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  placeholder="Repeat your password"
                />
              </div>
              {message && <Alert variant="success">{message}</Alert>}
              {error && <Alert variant="error">{error}</Alert>}
              <Button type="submit" variant="primary" size="md" className="w-full" disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

export default ResetPassword;
