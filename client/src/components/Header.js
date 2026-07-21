import "bootstrap/dist/css/bootstrap.min.css";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/Images/logo.png";
import "../assets/styles/Header.css";

function Header() {
    const [loginDetail, setLoginDetail] = useState(null);
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [showSearch, setShowSearch] = useState(false);
    const [cartCount, setCartCount] = useState(0);

    const navigate = useNavigate();
    const debounceTimer = useRef(null);
    const abortController = useRef(null);

    useEffect(() => {
        const loginData = JSON.parse(localStorage.getItem("login_detail"));
        setLoginDetail(loginData);
        if (loginData) {
            const userKey = loginData.email || loginData.emailOrPhone || "guest";
            const cart = JSON.parse(localStorage.getItem(`cart_${userKey}`));
            setCartCount(cart?.length || 0);
        }
        const updateCartCount = () => {
            const data = JSON.parse(localStorage.getItem("login_detail"));
            if (data) {
                const key = data.email || data.emailOrPhone || "guest";
                const cart = JSON.parse(localStorage.getItem(`cart_${key}`));
                setCartCount(cart?.length || 0);
            }
        };
        window.addEventListener("storage", updateCartCount);
        window.addEventListener("cartUpdated", updateCartCount);
        return () => {
            window.removeEventListener("storage", updateCartCount);
            window.removeEventListener("cartUpdated", updateCartCount);
            // Abort any in-flight search request on unmount
            if (abortController.current) abortController.current.abort();
        };
    }, []);

    const handleLogout = useCallback(() => {
        localStorage.removeItem("login_detail");
        setLoginDetail(null);
        navigate("/");
        window.location.reload();
    }, [navigate]);

    const handleWishlistClick = useCallback((e) => {
        e.preventDefault();
        navigate(loginDetail ? "/wishlist" : "/signup");
    }, [loginDetail, navigate]);

    const handleCartClick = useCallback((e) => {
        e.preventDefault();
        navigate(loginDetail ? "/cart" : "/signup");
    }, [loginDetail, navigate]);

    // Debounced search — 300ms delay, cancels previous request
    const handleSearchChange = useCallback((e) => {
        const q = e.target.value;
        setSearchQuery(q);

        // Clear previous debounce
        if (debounceTimer.current) clearTimeout(debounceTimer.current);
        // Abort previous in-flight request
        if (abortController.current) abortController.current.abort();

        if (q.trim().length < 2) {
            setSearchResults([]);
            setShowSearch(false);
            return;
        }

        debounceTimer.current = setTimeout(async () => {
            abortController.current = new AbortController();
            try {
                const res = await fetch(`/api/products/search?q=${encodeURIComponent(q)}`, {
                    signal: abortController.current.signal,
                });
                const data = await res.json();
                if (data.status === "success") {
                    setSearchResults(data.results.slice(0, 6));
                    setShowSearch(true);
                }
            } catch {
                // Silently fail (aborted requests throw)
            }
        }, 300);
    }, []);

    const handleSearchSubmit = useCallback((e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setShowSearch(false);
            navigate(`/men?search=${encodeURIComponent(searchQuery)}`);
        }
    }, [searchQuery, navigate]);

    const handleSearchSelect = useCallback((product) => {
        setShowSearch(false);
        setSearchQuery("");
        navigate(`/${product.category}/${product._id}`);
    }, [navigate]);

    const handleOpenToggle = useCallback(() => setOpen(prev => !prev), []);

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
                    </ul>

                    <div className="navbar-icons d-flex align-items-center gap-3">
                        {/* Search */}
                        <div className="position-relative">
                            <form onSubmit={handleSearchSubmit} className="d-flex">
                                <input
                                    type="text"
                                    className="form-control form-control-sm search-input"
                                    placeholder="Search products..."
                                    value={searchQuery}
                                    onChange={handleSearchChange}
                                    onFocus={() => searchResults.length > 0 && setShowSearch(true)}
                                    onBlur={() => setTimeout(() => setShowSearch(false), 200)}
                                    style={{ width: "180px", borderRadius: "8px" }}
                                />
                                <button type="submit" className="btn btn-sm btn-outline-secondary ms-1">
                                    <i className="fas fa-search"></i>
                                </button>
                            </form>

                            {showSearch && searchResults.length > 0 && (
                                <div className="position-absolute mt-1 bg-white shadow-lg rounded"
                                    style={{ width: "300px", zIndex: 1050, right: 0, maxHeight: "400px", overflowY: "auto" }}>
                                    {searchResults.map((p) => (
                                        <div
                                            key={p._id}
                                            className="d-flex align-items-center p-2 border-bottom"
                                            style={{ cursor: "pointer" }}
                                            onMouseDown={() => handleSearchSelect(p)}
                                        >
                                            <img src={p.mainImage} alt="" loading="lazy" style={{ width: "40px", height: "40px", objectFit: "cover", borderRadius: "4px" }} />
                                            <div className="ms-2" style={{ lineHeight: 1.2 }}>
                                                <small className="d-block fw-semibold">{p.imageName}</small>
                                                <small className="text-success">₹{p.price}</small>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <a href="/wishlist" className="nav-link icon-link" onClick={handleWishlistClick} title="Wishlist">
                            <i className="far fa-heart"></i>
                        </a>
                        <a href="/cart" className="nav-link icon-link position-relative" onClick={handleCartClick} title="Cart">
                            <i className="fas fa-shopping-bag"></i>
                            {cartCount > 0 && (
                                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                    style={{ fontSize: "10px", minWidth: "18px", height: "18px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    {cartCount}
                                </span>
                            )}
                        </a>
                        <div className="position-relative">
                            <button className="btn btn-light ms-2" onClick={handleOpenToggle}>
                                {loginDetail ? `Hi, ${loginDetail.name}` : "Hi, Guest"}
                            </button>

                            {open && (
                                <div className="dropdown-menu show position-absolute end-0 mt-2 shadow">
                                    {loginDetail ? (
                                        <>
                                            <Link to="/myaccount" className="dropdown-item" onClick={() => setOpen(false)}>
                                                My Account
                                            </Link>
                                            <button onClick={handleLogout} className="dropdown-item">Logout</button>
                                        </>
                                    ) : (
                                        <Link to="/signup" className="dropdown-item" onClick={() => setOpen(false)}>
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

export default memo(Header);
