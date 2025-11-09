import { useState } from "react";
import "../assets/styles/Payment.css";

export default function Payment() {
  // Get current user key
  const loginDetail = JSON.parse(localStorage.getItem("login_detail"));
  const userKey = loginDetail ? loginDetail.emailOrPhone : "guest";
  const [card, setCard] = useState({ number: "", expiryMM: "", expiryYY: "", cvv: "", save: false });
  const [receiver, setReceiver] = useState("");
  const [showThankYou, setShowThankYou] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [method, setMethod] = useState("card");
  const [upi, setUpi] = useState("");
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // Get all products from cart for this user
  const cart = JSON.parse(localStorage.getItem(`cart_${userKey}`)) || [];

  // Calculate totals
  const bagTotal = cart.reduce((sum, p) => sum + (p.mrp || p.price || 0) * (p.quantity || 1), 0);
  const subTotal = cart.reduce((sum, p) => sum + (p.price || 0) * (p.quantity || 1), 0);
  const bagDiscount = bagTotal - subTotal;
  const shipping = subTotal > 0 ? 0 : 0;
  const grandTotal = subTotal + shipping;

  const handlePay = async (e) => {
    e.preventDefault();
    setError("");
    setIsProcessing(true);

    if (!receiver) {
      setError("Please enter the receiver's name.");
      setIsProcessing(false);
      return;
    }
    
    if (method === "card") {
      if (!/^\d{16}$/.test(card.number)) {
        setError("Enter a valid 16-digit card number.");
        setIsProcessing(false);
        return;
      }
      if (!/^\d{2}$/.test(card.expiryMM) || !/^\d{4}$/.test(card.expiryYY)) {
        setError("Enter a valid expiry date (MM/YYYY).");
        setIsProcessing(false);
        return;
      }
      if (!/^\d{3}$/.test(card.cvv)) {
        setError("Enter a valid 3-digit CVV.");
        setIsProcessing(false);
        return;
      }
    }
    
    if (method === "upi" && !upi) {
      setError("Please enter your UPI ID or number.");
      setIsProcessing(false);
      return;
    }

    try {
      // Save order to backend
      const orderData = {
        userEmail: loginDetail.email,
        items: cart,
        totalAmount: grandTotal,
        paymentMethod: method === "card" ? "Credit/Debit Card" : method === "upi" ? "UPI" : "Cash On Delivery",
        receiverName: receiver
      };

      const response = await fetch("http://localhost:5000/api/orders/place", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(orderData)
      });

      const result = await response.json();

      if (result.status === "success") {
        setOrderNumber(result.orderNumber);
        setShowThankYou(true);
        // Clear cart after successful order
        localStorage.removeItem(`cart_${userKey}`);
      } else {
        setError("Failed to place order. Please try again.");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setError("Payment processing failed. Please try again.");
    }

    setIsProcessing(false);
  };

  const closeModal = () => {
    setShowThankYou(false);
    window.location.href = "/";
  };

  if (showThankYou) {
    return (
      <div className="payment-thankyou" onClick={closeModal}>
        <div className="thankyou-card" onClick={(e) => e.stopPropagation()}>
          <div className="success-icon">🎉</div>
          <h2>Order Placed Successfully!</h2>
          <p className="order-number">Order Number: <strong>{orderNumber}</strong></p>
          <p>Thank you for choosing WestSide Store!<br />Your payment has been processed successfully.</p>
          <div className="delivery-info">
            📦 Your order will be delivered within 5-7 business days
          </div>
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/" className="btn btn-primary">Continue Shopping</a>
            <a href="/myaccount" className="btn btn-secondary">Track Your Order</a>
          </div>
          <div style={{ marginTop: '20px', fontSize: '14px', color: '#718096' }}>
            Click anywhere outside this card to close
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-outer">
      <div className="payment-container">
        <div className="payment-left">
          <form className="payment-form" onSubmit={handlePay}>
            <h2 className="mb-4">💳 Payment Details</h2>
            <div className="payment-methods mb-3">
              <label className={method === "card" ? "active" : ""}>
                <input type="radio" name="method" value="card" checked={method === "card"} onChange={() => setMethod("card")} />
                <span>💳 Credit/Debit Card</span>
              </label>
              <label className={method === "upi" ? "active" : ""}>
                <input type="radio" name="method" value="upi" checked={method === "upi"} onChange={() => setMethod("upi")} />
                <span>📱 UPI</span>
              </label>
              <label className={method === "cod" ? "active" : ""}>
                <input type="radio" name="method" value="cod" checked={method === "cod"} onChange={() => setMethod("cod")} />
                <span>💰 Cash On Delivery</span>
              </label>
            </div>

            {method === "card" && (
              <div className="card-details">
                <label>Card Number
                  <input type="text" maxLength={16} required value={card.number} onChange={e => setCard({ ...card, number: e.target.value.replace(/\D/g, "") })} placeholder="1234 5678 9012 3456" />
                </label>
                <div className="expiry-cvv-row">
                  <label>Expiry Month
                    <input type="text" maxLength={2} required value={card.expiryMM} onChange={e => setCard({ ...card, expiryMM: e.target.value.replace(/\D/g, "") })} placeholder="MM" className="expiry-input" />
                  </label>
                  <label>Expiry Year
                    <input type="text" maxLength={4} required value={card.expiryYY} onChange={e => setCard({ ...card, expiryYY: e.target.value.replace(/\D/g, "") })} placeholder="YYYY" className="expiry-input" />
                  </label>
                  <label>CVV
                    <input type="password" maxLength={3} required value={card.cvv} onChange={e => setCard({ ...card, cvv: e.target.value.replace(/\D/g, "") })} placeholder="123" className="cvv-input" />
                  </label>
                </div>
                <label className="save-card">
                  Save this card for future   <input type="checkbox" checked={card.save} onChange={e => setCard({ ...card, save: e.target.checked })} />
                </label>
              </div>
            )}

            {method === "upi" && (
              <div className="upi-details">
                <label>UPI ID or Number
                  <input type="text" required value={upi} onChange={e => setUpi(e.target.value)} placeholder="yourname@upi or 9876543210" />
                </label>
              </div>
            )}

            {method === "cod" && (
              <div className="cod-details">
                <p className="cod-info">Cash On Delivery selected. Please confirm your shipping details below.</p>
              </div>
            )}

            <div className="shipping-details mt-3">
              <label>Name Of Receiver
                <input type="text" required value={receiver} onChange={e => setReceiver(e.target.value)} placeholder="Name Of Receiver" />
              </label>
              <p className="address-info">LJ Campus, LJ College Rd, near Sanand - Sarkhej Road, Sarkhej-Okaf, Gujarat 382210</p>
            </div>

            {error && <div className="alert alert-danger mt-2">{error}</div>}

            <button type="submit" className="pay-btn mt-3" disabled={isProcessing}>
              {isProcessing ? "Processing..." : "PAY NOW"}
            </button>
          </form>
        </div>
        <div className="payment-right">
          <div className="payment-summary">
            <h2>Order Summary</h2>
            <div className="summary-row"><span>Bag Total:</span><span>₹{bagTotal}</span></div>
            <div className="summary-row"><span>Sub Total:</span><span>₹{subTotal}</span></div>
            <div className="summary-row"><span>Bag Discount:</span><span>-₹{bagDiscount}</span></div>
            <div className="summary-row"><span>Shipping:</span><span>₹{shipping}</span></div>
            <div className="summary-row grand"><span>Grand Total:</span><span>₹{grandTotal}</span></div>
            <h3 className="mt-4">Products</h3>
            <div className="payment-products">
              {cart.map(prod => (
                <div key={prod._id} className="payment-product-item">
                  <img src={prod.mainImage} alt="" />
                  <span>{prod.imageName}</span>
                  <span>₹{prod.price} x {prod.quantity || 1}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


