import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import SeoHelmet from "./SeoHelmet";
import "../assets/styles/cart.css";

// ── localStorage helpers (normalization at boundary) ──────────────
const getCart = (key) => {
  try {
    const raw = localStorage.getItem(`cart_${key}`);
    return (raw ? JSON.parse(raw) : []).map((p) => ({ ...p, quantity: p.quantity || 1 }));
  } catch {
    return [];
  }
};

const saveCart = (key, cart) => localStorage.setItem(`cart_${key}`, JSON.stringify(cart));

// ── Shared cart-item row (DRY — used by Cart + Wishlist) ─────────

export function CartItemRow({ prod, onQuantity, onDelete, showQty = true }) {
  return (
    <div className="cart-item">
      <Link to={`/${prod.category}/${prod._id}`}>
        <img src={prod.mainImage} alt={prod.imageName} loading="lazy" className="cart-img" />
      </Link>
      <div className="cart-details">
        <Link to={`/${prod.category}/${prod._id}`} className="cart-name-link">
          <p className="cart-name">{prod.imageName}</p>
        </Link>
        <p className="cart-price">₹{prod.price}</p>
        {showQty && (
          <div className="quantity-controls">
            <button onClick={() => onQuantity(prod._id, -1)} className="qty-btn">−</button>
            <span className="qty-num">{prod.quantity || 1}</span>
            <button onClick={() => onQuantity(prod._id, 1)} className="qty-btn">+</button>
          </div>
        )}
      </div>
      <button className="delete-btn" onClick={() => onDelete(prod._id)}>Delete</button>
    </div>
  );
}

// ── Cart Component ───────────────────────────────────────────────

export default function Cart() {
  const { login, userKey, isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [cart, setCart] = useState(() => getCart(userKey));

  const updateCart = useCallback((updated) => {
    setCart(updated);
    saveCart(userKey, updated);
    window.dispatchEvent(new Event("cartUpdated"));
  }, [userKey]);

  const handleDelete = useCallback((id) => updateCart(cart.filter((p) => p._id !== id)), [cart, updateCart]);
  const handleQty = useCallback((id, delta) => updateCart(
    cart.map((p) => p._id === id ? { ...p, quantity: Math.max(1, (p.quantity || 1) + delta) } : p)
  ), [cart, updateCart]);

  // Early returns for edge cases
  if (!isLoggedIn) return <EmptyState message="Please log in to view your cart." />;
  if (cart.length === 0) return <EmptyState message="Your cart is empty." />;

  return (
    <>
      <SeoHelmet title="Shopping Cart" description="Review items in your WestSide Store shopping cart." />
      <div className="cart-container">
        <h2 className="cart-title">Your Cart</h2>
        <h4 className="section-title">Products in Cart</h4>
        <div className="cart-products">
          {cart.map((prod) => (
            <CartItemRow key={prod._id} prod={prod} onQuantity={handleQty} onDelete={handleDelete} />
          ))}
        </div>
        <button className="proceed-payment" onClick={() => navigate("/payment")}>
          Proceed to Payment
        </button>
      </div>
    </>
  );
}

// ── Shared empty state (DRY) ─────────────────────────────────────

export function EmptyState({ message }) {
  return (
    <div className="cart-empty">
      <h3>{message}</h3>
    </div>
  );
}
