import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { showSuccess, showError } from "../components/ToastConfig";
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
      <div className="container d-flex align-items-center justify-content-center" style={{ minHeight: "70vh", paddingTop: "90px" }}>
        <div className="card p-4 shadow-sm" style={{ maxWidth: "450px", width: "100%" }}>
          <div className="text-center mb-4">
            <h3 className="fw-bold">{step === "forgot" ? "Forgot Password" : "Reset Password"}</h3>
            <p className="text-muted">{step === "forgot" ? "Enter your email and we'll send you a reset link." : "Enter your new password."}</p>
          </div>
          {step === "forgot" && (
            <form onSubmit={handleForgotPassword}>
              <div className="mb-3"><label className="form-label">Email Address</label><input type="email" className="form-control" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" /></div>
              {message && <div className="alert alert-success">{message}</div>}
              {error && <div className="alert alert-danger">{error}</div>}
              <button type="submit" className="btn btn-primary w-100" disabled={loading}>{loading ? "Sending..." : "Send Reset Link"}</button>
              <div className="text-center mt-3"><Link to="/signup" className="text-decoration-none">Back to Login</Link></div>
            </form>
          )}
          {step === "reset" && (
            <form onSubmit={handleResetPassword}>
              <div className="mb-3"><label className="form-label">New Password</label><input type="password" className="form-control" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} placeholder="At least 6 characters" /></div>
              <div className="mb-3"><label className="form-label">Confirm Password</label><input type="password" className="form-control" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required placeholder="Repeat your password" /></div>
              {message && <div className="alert alert-success">{message}</div>}
              {error && <div className="alert alert-danger">{error}</div>}
              <button type="submit" className="btn btn-primary w-100" disabled={loading}>{loading ? "Resetting..." : "Reset Password"}</button>
            </form>
          )}
        </div>
      </div>
    </>
  );
}

export default ResetPassword;
