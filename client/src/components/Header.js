import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import "../assets/styles/Header.css";

// ── Data-driven nav links (declarative, DRY) ──────────────────────
const NAV_LINKS = [
  { to: "/women", label: "Women" },
  { to: "/men", label: "Men" },
  { to: "/kids", label: "Kids" },
  { to: "/beauty", label: "Beauty" },
  { to: "/jewellery", label: "Fine Jewellery" },
  { to: "/homedecor", label: "Home" },
];

function Header() {
  const { login, isLoggedIn, cartCount, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const debounceTimer = useRef(null);
  const abortController = useRef(null);

  // Cleanup on unmount
  useEffect(() => () => abortController.current?.abort(), []);

  // ── Search (debounced, with cancellation) ────────────────────────
  const handleSearchChange = useCallback((e) => {
    const q = e.target.value;
    setSearchQuery(q);
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    abortController.current?.abort();

    if (q.trim().length < 2) {
      setSearchResults([]);
      setShowSearch(false);
      return;
    }

    debounceTimer.current = setTimeout(async () => {
      abortController.current = new AbortController();
      setSearchLoading(true);
      try {
        const res = await fetch(`/api/products/search?q=${encodeURIComponent(q)}`, {
          signal: abortController.current.signal,
        });
        const data = await res.json();
        if (data.status === "success") {
          setSearchResults(data.results.slice(0, 6));
          setShowSearch(true);
        }
      } catch { /* aborted — silently ignore */ }
      setSearchLoading(false);
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

  // ── Navigation helpers ───────────────────────────────────────────
  const guardNavigate = useCallback((path, authRequired) => (e) => {
    e.preventDefault();
    navigate(authRequired && !isLoggedIn ? "/signup" : path);
  }, [navigate, isLoggedIn]);

  return (
    <>
      {/* ── Global Nav ──────────────────────────────────────────── */}
      <nav className="apple-global-nav">
        <div className="apple-global-nav__left">
          <button className="apple-hamburger" onClick={() => setMobileOpen((p) => !p)} aria-label="Menu">
            <i className={`fas fa-${mobileOpen ? "times" : "bars"}`} />
          </button>
          <Link to="/" className="apple-global-nav__logo">
            <i className="fab fa-apple" style={{ fontSize: 20, marginRight: 6 }} />
            WestSide
          </Link>
          <ul className={`apple-global-nav__links${mobileOpen ? " apple-global-nav__links--open" : ""}`}>
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link className="apple-global-nav__link" to={to} onClick={() => setMobileOpen(false)}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="apple-global-nav__right">
          {/* Search */}
          <div className="apple-search">
            <i className="fas fa-search apple-search__icon" />
            <form onSubmit={handleSearchSubmit}>
              <input
                type="text"
                className="apple-search__input"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchResults.length > 0 && setShowSearch(true)}
                onBlur={() => setTimeout(() => setShowSearch(false), 200)}
              />
            </form>
            {showSearch && searchResults.length > 0 && !searchLoading && (
              <div className="apple-search__results">
                {searchResults.map((p) => (
                  <div key={p._id} className="apple-search__result" onMouseDown={() => handleSearchSelect(p)}>
                    <img src={p.mainImage} alt="" loading="lazy" />
                    <div className="apple-search__result-info">
                      <span className="apple-search__result-name">{p.imageName}</span>
                      <span className="apple-search__result-price">₹{p.price}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

            {/* Search loading indicator */}
            {searchLoading && (
              <div className="apple-search__results" style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
                <div className="apple-spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
              </div>
            )}

          {/* Wishlist */}
          <a href="/wishlist" className="apple-global-nav__action"
            onClick={guardNavigate("/wishlist", true)} title="Wishlist">
            <i className="far fa-heart" />
          </a>

          {/* Cart */}
          <a href="/cart" className="apple-global-nav__action"
            onClick={guardNavigate("/cart", true)} title="Cart">
            <i className="fas fa-shopping-bag" />
            {cartCount > 0 && <span className="apple-global-nav__badge">{cartCount}</span>}
          </a>

          {/* User */}
          <div className="apple-global-nav__user-wrap">
            <div className="apple-global-nav__user" onClick={() => setOpen((p) => !p)}>
              <i className="far fa-user-circle" />
              <span>{isLoggedIn ? login.name : "Guest"}</span>
            </div>
            {open && (
              <div className="apple-dropdown">
                {isLoggedIn ? (
                  <>
                    <Link to="/myaccount" className="apple-dropdown__item" onClick={() => setOpen(false)}>
                      My Account
                    </Link>
                    <button onClick={() => { setOpen(false); logout(); }} className="apple-dropdown__item">
                      Logout
                    </button>
                  </>
                ) : (
                  <Link to="/signup" className="apple-dropdown__item" onClick={() => setOpen(false)}>
                    Sign In / Login
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
}

export default memo(Header);
