import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../assets/styles/cart.css";

export default function Cart() {
  const navigate = useNavigate();
  const loginDetail = JSON.parse(localStorage.getItem("login_detail"));
  const userKey = loginDetail ? loginDetail.emailOrPhone : "guest";
  const [cart, setCart] = useState(
    JSON.parse(localStorage.getItem(`cart_${userKey}`))?.map(p => ({ ...p, quantity: p.quantity || 1 })) || []
  );

  // Update cart in localStorage
  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem(`cart_${userKey}`, JSON.stringify(updatedCart));
  };

  // Delete product from cart
  const handleDeleteCart = (id) => {
    const updatedCart = cart.filter(prod => prod._id !== id);
    updateCart(updatedCart);
  };

  // Change quantity
  const handleQuantity = (id, delta) => {
    const updatedCart = cart.map(prod =>
      prod._id === id
        ? { ...prod, quantity: Math.max(1, (prod.quantity || 1) + delta) }
        : prod
    );
    updateCart(updatedCart);
  };

  if (!loginDetail) {
    return (
      <div className="cart-empty">
        <h3>Please log in to view your cart.</h3>
      </div>
    );
  }

  if (cart.length === 0){
    return (
      <div className="cart-empty">
        <h3>Your cart is empty.</h3>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2 className="cart-title">Your Cart</h2>
      <h4 className="section-title">Products in Cart</h4>
      <div className="cart-products">
        {cart.map(prod => (
          <div key={prod._id} className="cart-item">
            <Link to={`/${prod.category}/${prod._id}`}>
              <img src={prod.mainImage} alt={prod.imageName} className="cart-img" />
            </Link>
            <div className="cart-details">
              <Link to={`/${prod.category}/${prod._id}`} className="cart-name-link">
                <p className="cart-name">{prod.imageName}</p>
              </Link>
              <p className="cart-price">₹{prod.price}</p>
              <div className="quantity-controls">
                <button onClick={() => handleQuantity(prod._id, -1)} className="qty-btn">-</button>
                <span className="qty-num">{prod.quantity || 1}</span>
                <button onClick={() => handleQuantity(prod._id, 1)} className="qty-btn">+</button>
              </div>
            </div>
            <button className="delete-btn" onClick={() => handleDeleteCart(prod._id)}>Delete</button>
          </div>
        ))}
      </div>
      <button className="proceed-payment" onClick={() => navigate("/payment")}>
        Proceed to Payment
      </button>
    </div>
  );
}
