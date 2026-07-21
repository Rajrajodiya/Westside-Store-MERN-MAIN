import { useCallback, useState } from "react";
import useAuth from "../hooks/useAuth";
import { CartItemRow, EmptyState } from "./Cart";
import "../assets/styles/cart.css";

const getWishlist = key => {
  try {
    const raw = localStorage.getItem("wishlist_" + key);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
};

const saveWishlist = (key, items) =>
  localStorage.setItem("wishlist_" + key, JSON.stringify(items));

export default function Wishlist() {
  const { userKey, isLoggedIn } = useAuth();
  const [wishlist, setWishlist] = useState(() => getWishlist(userKey));
  const handleDelete = useCallback(id => {
    const updated = wishlist.filter(p => p._id !== id);
    setWishlist(updated);
    saveWishlist(userKey, updated);
  }, [wishlist, userKey]);
  if (!isLoggedIn) return <EmptyState message="Please log in to view your wishlist." />;
  if (wishlist.length === 0) return <EmptyState message="Your wishlist is empty." />;
  return (
    <div className="cart-container">
      <h2 className="cart-title">Your Wishlist</h2>
      <h4 className="section-title">Wishlisted Products</h4>
      <div className="cart-products">
        {wishlist.map(prod => (
          <CartItemRow key={prod._id} prod={prod} onDelete={handleDelete} showQty={false} />
        ))}
      </div>
    </div>
  );
}