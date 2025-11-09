import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // LOGIN
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        emailOrPhone,
        password,
      });
      if (res.data.status === "notfound") {
        setError("Please signup first.");
      } else if (res.data.status === "success") {
        setIsLoggedIn(true);
        setError("");
        navigate("/outlet"); // redirect to Outlet page
      } else {
        setError("Invalid credentials.");
      }
    } catch (err) {
      setError("Server error. Try again.");
    }
  };

  // SIGNUP
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    if (!name || !emailOrPhone || !phone || !password) {
      setError("All fields required.");
      return;
    }
    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", {
        name,
        emailOrPhone,
        phone,
        password,
      });
      if (res.data.status === "exists") {
        setError("User already exists. Please login.");
      } else if (res.data.status === "success") {
        alert("Registered Successfully!");
        setIsLogin(true); // switch to login after register
        setName("");
        setPhone("");
        setPassword("");
        setEmailOrPhone("");
        setError("");
      } else {
        setError("Signup failed.");
      }
    } catch (err) {
      setError("Server error. Try again.");
    }
  };

  // LOGOUT
  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmailOrPhone("");
    setPassword("");
    setName("");
    setPhone("");
    setError("");
    navigate("/");
  };

  if (isLoggedIn) {
    return (
      <main className="container mt-5 mb-5">
        <div className="text-center p-5 bg-light rounded shadow">
          <h3 className="mb-3">Welcome!</h3>
          <button className="btn btn-danger" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="container p-5 m-5" style={{ maxHeight: "750px" }}>
      <div className="d-flex justify-content-center mb-4">
        <button
          className={`btn me-2 ${isLogin ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setIsLogin(true)}
        >
          Login
        </button>
        <button
          className={`btn ${!isLogin ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => setIsLogin(false)}
        >
          Register
        </button>
      </div>

      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card p-4 shadow-sm">
            {isLogin ? (
              <>
                <h4 className="text-center mb-3">Login</h4>
                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label className="form-label">Email or Phone</label>
                    <input
                      type="text"
                      className="form-control"
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  {error && <div className="alert alert-danger">{error}</div>}
                  <button type="submit" className="btn btn-success w-100">
                    Login
                  </button>
                </form>
              </>
            ) : (
              <>
                <h4 className="text-center mb-3">Register</h4>
                <form onSubmit={handleRegister}>
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email or Phone</label>
                    <input
                      type="text"
                      className="form-control"
                      value={emailOrPhone}
                      onChange={(e) => setEmailOrPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Phone</label>
                    <input
                      type="text"
                      className="form-control"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                  {error && <div className="alert alert-danger">{error}</div>}
                  <button type="submit" className="btn btn-primary w-100">
                    Register
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default AuthForm;
