import { useState } from "react";
import { Link } from "react-router-dom";
import "../assets/styles/cart.css";

export default function Wishlist() {
  const loginDetail = JSON.parse(localStorage.getItem("login_detail"));
  const userKey = loginDetail ? (loginDetail.email || loginDetail.emailOrPhone || "guest") : "guest";
  const [wishlist, setWishlist] = useState(JSON.parse(localStorage.getItem(`wishlist_${userKey}`)) || []);

  // Delete product from wishlist
  const handleDeleteWishlist = (id) => {
    const updatedWishlist = wishlist.filter(prod => prod._id !== id);
    setWishlist(updatedWishlist);
    localStorage.setItem(`wishlist_${userKey}`, JSON.stringify(updatedWishlist));
  };

  if (!loginDetail) {
    return (
      <div className="cart-empty">
        <h3>Please log in to view your wishlist.</h3>
      </div>
    );
  }

  if (wishlist.length === 0){
    return (
      <div className="cart-empty">
        <h3>Your wishlist is empty.</h3>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2 className="cart-title">Your Wishlist</h2>
      <h4 className="section-title">Wishlisted Products</h4>
      <div className="cart-products">
        {wishlist.map(prod => (
          <div key={prod._id} className="cart-item">
            <Link to={`/${prod.category}/${prod._id}`}>
              <img src={prod.mainImage} alt={prod.imageName} loading="lazy" className="cart-img" />
            </Link>
            <div className="cart-details">
              <Link to={`/${prod.category}/${prod._id}`} className="cart-name-link">
                <p className="cart-name">{prod.imageName}</p>
              </Link>
              <p className="cart-price">₹{prod.price}</p>
            </div>
            <button className="delete-btn" onClick={() => handleDeleteWishlist(prod._id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}