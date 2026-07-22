import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import "../assets/styles/Header.css";

import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "./ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  useDropdown,
} from "./ui/dropdown-menu";

// ── Data-driven nav links ─────────────────────────────────────────
const NAV_LINKS = [
  { to: "/products/women", label: "Women" },
  { to: "/products/men", label: "Men" },
  { to: "/products/kids", label: "Kids" },
  { to: "/products/beauty", label: "Beauty" },
  { to: "/products/jewellery", label: "Fine Jewellery" },
  { to: "/products/homedecor", label: "Home" },
];

function Header() {
  const { login, isLoggedIn, cartCount, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const { open: userOpen, setOpen: setUserOpen, ref: userRef } = useDropdown();
  const debounceTimer = useRef(null);
  const abortController = useRef(null);
  const searchRef = useRef(null);

  // Cleanup on unmount
  useEffect(() => () => abortController.current?.abort(), []);

  // Close mobile menu on resize past breakpoint
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth > 834) setMobileOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

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
      navigate(`/products/men?search=${encodeURIComponent(searchQuery)}`);
    }
  }, [searchQuery, navigate]);

  const handleSearchSelect = useCallback((product) => {
    setShowSearch(false);
    setSearchQuery("");
    navigate(`/products/${product.category}/${product._id}`);
  }, [navigate]);

  // ── Navigation helpers ───────────────────────────────────────────
  const guardNavigate = useCallback((path, authRequired) => (e) => {
    e.preventDefault();
    navigate(authRequired && !isLoggedIn ? "/signup" : path);
  }, [navigate, isLoggedIn]);

  return (
    <>
      {/* ── Global Nav Bar ─────────────────────────────────────── */}
      <nav className="apple-global-nav">
        <div className="apple-global-nav__left">
          {/* Hamburger */}
          <button
            className="apple-hamburger"
            onClick={() => setMobileOpen((p) => !p)}
            aria-label="Menu"
          >
            <i className={`fas fa-${mobileOpen ? "times" : "bars"}`} />
          </button>

          {/* Logo */}
          <Link to="/" className="apple-global-nav__logo">
            <i className="fab fa-apple" style={{ fontSize: 20, marginRight: 6 }} />
            WestSide
          </Link>

          {/* Desktop Nav — shadcn NavigationMenu */}
          <div className="apple-global-nav__desktop-nav">
            <NavigationMenu>
              <NavigationMenuList>
                {NAV_LINKS.map(({ to, label }) => (
                  <NavigationMenuItem key={to}>
                    <NavigationMenuLink
                      href={to}
                      onClick={(e) => { e.preventDefault(); navigate(to); }}
                      className="apple-nav-link"
                    >
                      {label}
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Mobile Nav */}
          <ul
            className={`apple-global-nav__links${mobileOpen ? " apple-global-nav__links--open" : ""}`}
          >
            {NAV_LINKS.map(({ to, label }) => (
              <li key={to}>
                <Link
                  className="apple-global-nav__link"
                  to={to}
                  onClick={() => setMobileOpen(false)}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="apple-global-nav__right">
          {/* Search */}
          <div className="apple-search" ref={searchRef}>
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

            {/* Search loading */}
            {searchLoading && (
              <div className="apple-search__results" style={{ display: "flex", justifyContent: "center", padding: "20px" }}>
                <div className="apple-spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
              </div>
            )}

            {/* Search results */}
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

          {/* Wishlist */}
          <a
            href="/wishlist"
            className="apple-global-nav__action"
            onClick={guardNavigate("/wishlist", true)}
            title="Wishlist"
          >
            <i className="far fa-heart" />
          </a>

          {/* Cart */}
          <a
            href="/cart"
            className="apple-global-nav__action"
            onClick={guardNavigate("/cart", true)}
            title="Cart"
          >
            <i className="fas fa-shopping-bag" />
            {cartCount > 0 && <span className="apple-global-nav__badge">{cartCount}</span>}
          </a>

          {/* User Dropdown — shadcn DropdownMenu */}
          <div ref={userRef}>
            <DropdownMenu open={userOpen} onOpenChange={setUserOpen}>
              <DropdownMenuTrigger onClick={() => setUserOpen((p) => !p)}>
                <i className="far fa-user-circle mr-1" />
                <span className="hidden sm:inline ml-1">{isLoggedIn ? login.name : "Guest"}</span>
              </DropdownMenuTrigger>
              {userOpen && (
                <DropdownMenuContent>
                  {isLoggedIn ? (
                    <>
                      <div className="px-3 py-2 text-xs text-white/50 border-b border-white/10">
                        Signed in as <span className="text-white/80 font-medium">{login.email}</span>
                      </div>
                      <DropdownMenuItem asChild>
                        <Link to="/myaccount" onClick={() => setUserOpen(false)}>
                          <i className="far fa-user w-4" />
                          My Account
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/orders" onClick={() => setUserOpen(false)}>
                          <i className="fas fa-box w-4" />
                          My Orders
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => { setUserOpen(false); logout(); }}
                        className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      >
                        <i className="fas fa-sign-out-alt w-4" />
                        Logout
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/signup" onClick={() => setUserOpen(false)}>
                          <i className="fas fa-sign-in-alt w-4" />
                          Sign In
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/signup?mode=signup" onClick={() => setUserOpen(false)}>
                          <i className="fas fa-user-plus w-4" />
                          Create Account
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              )}
            </DropdownMenu>
          </div>
        </div>
      </nav>
    </>
  );
}

export default memo(Header);
