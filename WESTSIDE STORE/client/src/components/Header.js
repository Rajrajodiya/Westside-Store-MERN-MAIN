import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/Images/logo.png";
import "../assets/styles/Header.css";

function Header() {
    const [loginDetail, setLoginDetail] = useState(null);
    const [open, setOpen] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        const loginData = JSON.parse(localStorage.getItem("login_detail"));
        setLoginDetail(loginData);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("login_detail");
        setLoginDetail(null);
        navigate("/");
        window.location.reload();
    };

    // Handlers for wishlist/cart click
    const handleWishlistClick = (e) => {
        e.preventDefault();
        if (loginDetail) {
            navigate("/wishlist");
        } else {
            navigate("/signup");
        }
    };

    const handleCartClick = (e) => {
        e.preventDefault();
        if (loginDetail) {
            navigate("/cart");
        } else {
            navigate("/signup");
        }
    };

    return (
        <nav className="navbar navbar-expand-lg bg-light fixed-top shadow-sm custom-navbar">
            <div className="container-fluid">
                <Link to="/" className="navbar-brand fw-bold">
                    <img src={logo} alt="Westside" style={{ height: "60px", mixBlendMode: "multiply" }} />
                </Link>

                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav mx-auto">
                        <li className="nav-item"><Link className="nav-link" to="/women">Women</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/men">Men</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/kids">Kids</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/beauty">Beauty</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/jewellery">Fine Jewellery</Link></li>
                        <li className="nav-item"><Link className="nav-link" to="/homedecor">Home</Link></li>
                        <li className="nav-item"><Link className="nav-link disabled" to="#">Brand</Link></li>
                        <li className="nav-item"><Link className="nav-link disabled" to="#">View More</Link></li>
                    </ul>

                    <div className="navbar-icons d-flex align-items-center gap-3">
                        <a href="/wishlist" className="nav-link icon-link" onClick={handleWishlistClick} title="Wishlist">
                            <i className="far fa-heart"></i>
                        </a>
                        <a href="/cart" className="nav-link icon-link" onClick={handleCartClick} title="Cart">
                            <i className="fas fa-shopping-bag"></i>
                        </a>
                        <div className="position-relative">
                            <button
                                className="btn btn-light ms-2"
                                onClick={() => setOpen(!open)}
                            >
                                {loginDetail ? `Hi, ${loginDetail.name}` : "Hi, Guest"}
                            </button>

                            {open && (
                                <div className="dropdown-menu show position-absolute end-0 mt-2 shadow">
                                    {loginDetail ? (
                                        <>
                                            <Link
                                                to="/myaccount"
                                                className="dropdown-item"
                                                onClick={() => setOpen(false)}
                                            >
                                                My Account
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="dropdown-item"
                                            >
                                                Logout
                                            </button>
                                        </>
                                    ) : (
                                        <Link
                                            to="/signup"
                                            className="dropdown-item"
                                            onClick={() => setOpen(false)}
                                        >
                                            Sign In / Login
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Header;
