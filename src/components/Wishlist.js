import { useCallback, useState } from "react";
import useAuth from "../hooks/useAuth";
import { CartItemRow, EmptyState } from "./Cart";
import { getWishlist, saveWishlist } from "../lib/storage";
import "../assets/styles/cart.css";

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