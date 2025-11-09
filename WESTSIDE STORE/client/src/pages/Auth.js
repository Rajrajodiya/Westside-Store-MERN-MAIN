import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../assets/styles/auth.css";


function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Validation helpers
  const validateemail = (val) => /\S+@\S+\.\S+/.test(val);
  const validatePhone = (val) => /^\d{10}$/.test(val);

  // Handle input
  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.email || !form.password) {
      setError("All fields required.");
      return;
    }
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email: form.email,
        password: form.password,
      });
      if (res.data.status === "notfound") {
        setError("Please signup first.")
      }
      else if (res.data.status === "success") {
        localStorage.setItem("login_detail", JSON.stringify(res.data.user));
        navigate("/");
        window.location.reload(); // To update header
      } else {
        setError("Invalid credentials.");
      }
    } catch {
      setError("Server error. Try again.");
    }
  };

  // Register
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.name || !form.email || !form.phone || !form.password) {
      setError("All fields required.");
      return;
    }
    if (!validateemail(form.email)) {
      setError("Enter a valid email.");
      return;
    }
    if (!validatePhone(form.phone)) {
      setError("Phone must be 10 digits.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", form);
      if (res.data.status === "exists") { setError("User already exists. Please login.") }
      else if (res.data.status === "success") {
        alert("Registered Successfully! Please login.");
        setIsLogin(true);
        setForm({ name: "", email: "", phone: "", password: "" });
        setError("");
      } else {
        setError("Signup failed.");
      }
    } catch {
      setError("Server error. Try again.");
    }
  };

  return (
    <main className="container p-5" style={{ width: "1000px", margin: "auto" }}>
      <div className="card p-4 shadow-sm">
        <div className="d-flex justify-content-center mb-4">
          <button className={`btn me-2 ${isLogin ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setIsLogin(true)}>Login</button>
          <button className={`btn ${!isLogin ? "btn-primary" : "btn-outline-primary"}`} onClick={() => setIsLogin(false)}>Register</button>
        </div>
        {isLogin ? (
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="text" className="form-control" name="email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" name="password" value={form.password} onChange={handleChange} required />
            </div>
            {error && <div className="alert alert-body">{error}</div>}
            <button type="submit" className="btn btn-success w-100">Login</button>
          </form>
        ) : (
          <form onSubmit={handleRegister}>
            <div className="mb-3">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-control" name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Email</label>
              <input type="text" className="form-control" name="email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Phone</label>
              <input type="text" className="form-control" name="phone" value={form.phone} onChange={handleChange} required />
            </div>
            <div className="mb-3">
              <label className="form-label">Password</label>
              <input type="password" className="form-control" name="password" value={form.password} onChange={handleChange} required />
            </div>
            {error && <div className="alert alert-body">{error}</div>}
            <button type="submit" className="btn btn-primary w-100">Register</button>
          </form>
        )}
      </div>
    </main>
  );
}

export default Auth;