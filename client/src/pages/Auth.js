import axios from "axios";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { showSuccess, showError } from "../components/ToastConfig";
import SeoHelmet from "../components/SeoHelmet";
import "../assets/styles/auth.css";

const LOGIN_FIELDS = [
  { name: "email", label: "Email", type: "text" },
  { name: "password", label: "Password", type: "password" },
];
const REGISTER_FIELDS = [
  { name: "name", label: "Full Name", type: "text" },
  { name: "email", label: "Email", type: "text" },
  { name: "phone", label: "Phone", type: "text" },
  { name: "password", label: "Password", type: "password" },
];
const INITIAL_FORM = { name: "", email: "", phone: "", password: "" };
const EMAIL_RE = /\S+@\S+\.\S+/;
const PHONE_RE = /^\d{10}$/;
const PASSWORD_MIN = 6;

const validateLogin = ({ email, password }) => {
  if (!email || !password) return "All fields required.";
  if (!EMAIL_RE.test(email)) return "Enter a valid email.";
  return null;
};

const validateRegister = ({ name, email, phone, password }) => {
  if (!name || !email || !phone || !password) return "All fields required.";
  if (!EMAIL_RE.test(email)) return "Enter a valid email.";
  if (!PHONE_RE.test(phone)) return "Phone must be 10 digits.";
  if (password.length < PASSWORD_MIN) return "Password must be at least " + PASSWORD_MIN + " characters.";
  return null;
};

function Auth() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState(INITIAL_FORM);
  const [error, setError] = useState("");
  const handleChange = useCallback(e =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value })), []);
  const switchMode = useCallback(mode => { setIsLogin(mode); setError(""); setForm(INITIAL_FORM); }, []);
  const fields = isLogin ? LOGIN_FIELDS : REGISTER_FIELDS;

  const handleLogin = useCallback(async e => {
    e.preventDefault();
    setError("");
    const verr = validateLogin(form);
    if (verr) return setError(verr);
    try {
      const { data } = await axios.post("/api/auth/login", { email: form.email, password: form.password });
      if (data.status === "notfound") return setError("Please signup first.");
      if (data.status !== "success") return setError("Invalid credentials.");
      localStorage.setItem("login_detail", JSON.stringify({ token: data.token, name: data.user.name, email: data.user.email }));
      navigate("/");
      window.location.reload();
    } catch { setError("Server error. Try again."); showError("Server error. Try again."); }
  }, [form, navigate]);

  const handleRegister = useCallback(async e => {
    e.preventDefault();
    setError("");
    const verr = validateRegister(form);
    if (verr) return setError(verr);
    try {
      const { data } = await axios.post("/api/auth/signup", form);
      if (data.status === "exists") return setError("User already exists. Please login.");
      if (data.status !== "success") return setError("Signup failed.");
      showSuccess("Registered Successfully! Please login.");
      setIsLogin(true); setForm(INITIAL_FORM); setError("");
    } catch { setError("Server error. Try again."); showError("Server error. Try again."); }
  }, [form]);

  return (
    <>
      <SeoHelmet title={isLogin ? "Sign In" : "Create Account"} description="Sign in to your WestSide Store account." />
      <main className="container p-5" style={{ maxWidth: 500, margin: "auto" }}>
        <div className="card p-4 shadow-sm">
          <div className="d-flex justify-content-center mb-4">
            <button className={"btn me-2 " + (isLogin ? "btn-primary" : "btn-outline-primary")} onClick={() => switchMode(true)}>Login</button>
            <button className={"btn " + (!isLogin ? "btn-primary" : "btn-outline-primary")} onClick={() => switchMode(false)}>Register</button>
          </div>
          <form onSubmit={isLogin ? handleLogin : handleRegister}>
            {fields.map(({ name, label, type }) => (
              <div className="mb-3" key={name}>
                <label className="form-label">{label}</label>
                <input type={type} className="form-control" name={name} value={form[name]} onChange={handleChange} required />
              </div>
            ))}
            {error && <div className="alert alert-danger">{error}</div>}
            <button type="submit" className={"btn " + (isLogin ? "btn-success" : "btn-primary") + " w-100"}>{isLogin ? "Login" : "Register"}</button>
          </form>
        </div>
      </main>
    </>
  );
}
export default Auth;