import axios from "axios";
import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { showSuccess, showError } from "../components/ToastConfig";
import SeoHelmet from "../components/SeoHelmet";
import useAuth from "../hooks/useAuth";
import "../assets/styles/auth.css";

const LOGIN_FIELDS = [
  { name: "emailOrPhone", label: "Email or Phone", type: "text", placeholder: "you@example.com or 9876543210" },
  { name: "password", label: "Password", type: "password", placeholder: "Enter your password" },
];
const REGISTER_FIELDS = [
  { name: "name", label: "Full Name", type: "text", placeholder: "John Doe" },
  { name: "emailOrPhone", label: "Email or Phone", type: "text", placeholder: "you@example.com or 9876543210" },
  { name: "phone", label: "Phone", type: "tel", placeholder: "9876543210" },
  { name: "password", label: "Password", type: "password", placeholder: "At least 6 characters" },
];
const INITIAL_FORM = { name: "", emailOrPhone: "", phone: "", password: "" };
const EMAIL_RE = /\S+@\S+\.\S+/;
const PHONE_RE = /^\d{10}$/;
const PASSWORD_MIN = 6;

const validateLogin = ({ emailOrPhone, password }) => {
  if (!emailOrPhone || !password) return "All fields required.";
  return null;
};

const validateRegister = ({ name, emailOrPhone, phone, password }) => {
  if (!name || !emailOrPhone || !phone || !password) return "All fields required.";
  if (!EMAIL_RE.test(emailOrPhone) && !PHONE_RE.test(emailOrPhone))
    return "Enter a valid email or 10-digit phone.";
  if (!PHONE_RE.test(phone)) return "Phone must be 10 digits.";
  if (password.length < PASSWORD_MIN) return `Password must be at least ${PASSWORD_MIN} characters.`;
  return null;
};

function Auth() {
  const navigate = useNavigate();
  const { persistLogin } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback((e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value })), []);
  const switchMode = useCallback((mode) => { setIsLogin(mode); setError(""); setForm(INITIAL_FORM); }, []);
  const fields = isLogin ? LOGIN_FIELDS : REGISTER_FIELDS;

  const handleLogin = useCallback(async (e) => {
    e.preventDefault();
    setError("");
    const verr = validateLogin(form);
    if (verr) return setError(verr);
    setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/login", { emailOrPhone: form.emailOrPhone, password: form.password });
      if (data.status === "notfound") { setError(data.message || "User not found. Please signup first."); setLoading(false); return; }
      if (data.status !== "success") { setError(data.message || "Invalid email or password."); setLoading(false); return; }
      persistLogin({ token: data.token, name: data.user.name, email: data.user.email });
      showSuccess("Welcome back!");
      setTimeout(() => { navigate("/"); window.location.reload(); }, 300);
    } catch { setError("Server error. Try again."); showError("Server error."); }
    setLoading(false);
  }, [form, navigate, persistLogin]);

  const handleRegister = useCallback(async (e) => {
    e.preventDefault();
    setError("");
    const verr = validateRegister(form);
    if (verr) return setError(verr);
    setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/signup", form);
      if (data.status === "exists") { setError(data.message || "User already exists. Please login."); setLoading(false); return; }
      if (data.status !== "success") { setError(data.message || "Signup failed."); setLoading(false); return; }
      showSuccess("Registered Successfully! Please login.");
      setIsLogin(true); setForm(INITIAL_FORM); setError("");
    } catch { setError("Server error. Try again."); showError("Server error."); }
    setLoading(false);
  }, [form]);

  return (
    <>
      <SeoHelmet title={isLogin ? "Sign In" : "Create Account"} description="Sign in to your WestSide Store account." />
      <div className="apple-auth">
        <div className="apple-auth__card">
          <div className="apple-auth__header">
            <div className="apple-auth__brand">
              <i className="fab fa-apple" />
              <span>WestSide</span>
            </div>
            <h1 className="apple-auth__title">{isLogin ? "Sign In" : "Create Account"}</h1>
            <p className="apple-auth__subtitle">
              {isLogin
                ? "Welcome back! Sign in to your account."
                : "Join WestSide — discover fashion that fits you."}
            </p>
          </div>

          <div className="apple-auth__tabs">
            <button
              className={`apple-auth__tab${isLogin ? " active" : ""}`}
              onClick={() => switchMode(true)}
            >
              Sign In
            </button>
            <button
              className={`apple-auth__tab${!isLogin ? " active" : ""}`}
              onClick={() => switchMode(false)}
            >
              Register
            </button>
          </div>

          <form className="apple-auth__form" onSubmit={isLogin ? handleLogin : handleRegister}>
            {fields.map(({ name, label, type, placeholder }) => (
              <div className="apple-auth__field" key={name}>
                <label className="apple-auth__label" htmlFor={`auth-${name}`}>{label}</label>
                <input
                  id={`auth-${name}`}
                  type={type}
                  className="apple-auth__input"
                  name={name}
                  value={form[name]}
                  onChange={handleChange}
                  placeholder={placeholder}
                  required
                  autoComplete={name === "password" ? (isLogin ? "current-password" : "new-password") : name}
                />
              </div>
            ))}

            {isLogin && (
              <div className="apple-auth__forgot">
                <Link to="/reset-password">Forgot your password?</Link>
              </div>
            )}

            {error && <div className="apple-auth__error">{error}</div>}

            <button
              type="submit"
              className="apple-btn apple-btn--large"
              style={{ width: "100%", marginTop: "8px" }}
              disabled={loading}
            >
              {loading ? (
                <><span className="apple-spinner" style={{ width: 18, height: 18, borderWidth: 2 }} /> Processing...</>
              ) : isLogin ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          <div className="apple-auth__footer">
            {isLogin ? (
              <p>
                Don't have an account?{" "}
                <button className="apple-auth__link-btn" onClick={() => switchMode(false)}>
                  Register
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{" "}
                <button className="apple-auth__link-btn" onClick={() => switchMode(true)}>
                  Sign In
                </button>
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
export default Auth;
