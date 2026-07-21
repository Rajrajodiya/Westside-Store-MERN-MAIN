import { useCallback, useMemo, useState } from "react";
import SeoHelmet from "../components/SeoHelmet";
import useAuth from "../hooks/useAuth";
import "../assets/styles/Payment.css";

// ── Data-driven payment methods (declarative, DRY) ────────────────
const PAYMENT_METHODS = [
  { id: "card", label: "💳 Credit/Debit Card" },
  { id: "upi",  label: "📱 UPI" },
  { id: "cod",  label: "💰 Cash On Delivery" },
];

const METHOD_LABELS = {
  card: "Credit/Debit Card (Stripe)",
  upi: "UPI",
  cod: "Cash On Delivery",
};

// ── Cart computation (pure function, easy to test) ────────────────
const computeCartTotals = (cart) => {
  const bagTotal  = cart.reduce((s, p) => s + (p.mrp || p.price || 0) * (p.quantity || 1), 0);
  const subTotal  = cart.reduce((s, p) => s + (p.price || 0) * (p.quantity || 1), 0);
  const discount  = bagTotal - subTotal;
  const shipping  = subTotal > 0 ? 0 : 0;
  return { bagTotal, subTotal, discount, shipping, grandTotal: subTotal + shipping };
};

// ── Child: Credit/Debit Card Form ────────────────────────────────
function CreditCardForm({ card, onChange }) {
  const setField = (field) => (e) =>
    onChange({ ...card, [field]: e.target.value.replace(/\D/g, "") });

  return (
    <div className="card-details">
      <label>
        Card Number
        <input type="text" maxLength={16} required value={card.number}
          onChange={setField("number")} placeholder="1234 5678 9012 3456" />
      </label>
      <div className="expiry-cvv-row">
        <label>Expiry Month
          <input type="text" maxLength={2} required value={card.expiryMM}
            onChange={setField("expiryMM")} placeholder="MM" className="expiry-input" />
        </label>
        <label>Expiry Year
          <input type="text" maxLength={4} required value={card.expiryYY}
            onChange={setField("expiryYY")} placeholder="YYYY" className="expiry-input" />
        </label>
        <label>CVV
          <input type="password" maxLength={3} required value={card.cvv}
            onChange={setField("cvv")} placeholder="123" className="cvv-input" />
        </label>
      </div>
      <label className="save-card">
        <input type="checkbox" checked={card.save}
          onChange={(e) => onChange({ ...card, save: e.target.checked })} />
        Save this card for future
      </label>
      <p className="text-muted small mt-2">🔒 Secured by Stripe</p>
    </div>
  );
}

// ── Child: Order Summary ─────────────────────────────────────────
function OrderSummary({ totals, cart }) {
  return (
    <div className="payment-summary">
      <h2>Order Summary</h2>
      <div className="summary-row"><span>Bag Total:</span><span>₹{totals.bagTotal}</span></div>
      <div className="summary-row"><span>Sub Total:</span><span>₹{totals.subTotal}</span></div>
      <div className="summary-row"><span>Bag Discount:</span><span>-₹{totals.discount}</span></div>
      <div className="summary-row"><span>Shipping:</span><span>₹{totals.shipping}</span></div>
      <div className="summary-row grand"><span>Grand Total:</span><span>₹{totals.grandTotal}</span></div>
      <h3 className="mt-4">Products</h3>
      <div className="payment-products">
        {cart.map((prod) => (
          <div key={prod._id} className="payment-product-item">
            <img src={prod.mainImage} alt="" loading="lazy" />
            <span>{prod.imageName}</span>
            <span>₹{prod.price} × {prod.quantity || 1}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Child: Thank You Screen ──────────────────────────────────────
function ThankYou({ orderNumber, onClose }) {
  return (
    <div className="payment-thankyou" onClick={onClose}>
      <div className="thankyou-card" onClick={(e) => e.stopPropagation()}>
        <div className="success-icon">🎉</div>
        <h2>Order Placed Successfully!</h2>
        <p className="order-number">Order Number: <strong>{orderNumber}</strong></p>
        <p>Thank you for choosing WestSide Store!<br />A confirmation email has been sent.</p>
        <div className="delivery-info">📦 Your order will be delivered within 5-7 business days</div>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          <a href="/" className="btn btn-primary">Continue Shopping</a>
          <a href="/myaccount" className="btn btn-secondary">Track Your Order</a>
        </div>
      </div>
    </div>
  );
}

// ── Validation helpers (fail-fast) ────────────────────────────────
const validateCard = (card) => {
  if (!/^\d{16}$/.test(card.number)) return "Enter a valid 16-digit card number.";
  if (!/^\d{2}$/.test(card.expiryMM) || !/^\d{4}$/.test(card.expiryYY))
    return "Enter a valid expiry date (MM/YYYY).";
  if (!/^\d{3}$/.test(card.cvv)) return "Enter a valid 3-digit CVV.";
  return null;
};

// ── Main Component ───────────────────────────────────────────────
export default function Payment() {
  const { login, userKey, isLoggedIn } = useAuth();
  const [method, setMethod] = useState("card");
  const [card, setCard] = useState({ number: "", expiryMM: "", expiryYY: "", cvv: "", save: false });
  const [upi, setUpi] = useState("");
  const [receiver, setReceiver] = useState("");
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");

  // Read cart (lazy initializer)
  const [cart] = useState(() => {
    try { return JSON.parse(localStorage.getItem(`cart_${userKey}`)) || []; }
    catch { return []; }
  });

  const totals = useMemo(() => computeCartTotals(cart), [cart]);

  // ── Handlers (BEFORE early returns — Rules of Hooks) ──────────────
  const handlePay = useCallback(async (e) => {
    e.preventDefault();
    setError("");
    setIsProcessing(true);

    // Fail-fast validation
    if (!receiver) { setError("Please enter the receiver's name."); setIsProcessing(false); return; }
    if (method === "card") {
      const cardErr = validateCard(card);
      if (cardErr) { setError(cardErr); setIsProcessing(false); return; }
    }
    if (method === "upi" && !upi) { setError("Please enter your UPI ID or number."); setIsProcessing(false); return; }

    try {
      if (method === "card") {
        const paymentRes = await fetch("/api/payment/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${login.token}` },
          body: JSON.stringify({ amount: totals.grandTotal, currency: "inr" }),
        });
        const paymentData = await paymentRes.json();
        if (paymentData.status !== "success") { setError("Payment processing failed."); setIsProcessing(false); return; }
      }

      const response = await fetch("/api/orders/place", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${login.token}` },
        body: JSON.stringify({
          userEmail: login.email,
          items: cart,
          totalAmount: totals.grandTotal,
          paymentMethod: METHOD_LABELS[method],
          receiverName: receiver,
        }),
      });

      const result = await response.json();
      if (result.status !== "success") { setError("Failed to place order."); setIsProcessing(false); return; }

      setOrderNumber(result.orderNumber);
      setShowThankYou(true);
      localStorage.removeItem(`cart_${userKey}`);
    } catch { setError("Payment processing failed."); }
    setIsProcessing(false);
  }, [method, card, upi, receiver, login, cart, totals, userKey]);

  // Early return: not logged in
  if (!isLoggedIn) {
    return (
      <div className="cart-empty">
        <h3>Please log in to checkout.</h3>
      </div>
    );
  }

  // Early return: empty cart
  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <h3>Your cart is empty.</h3>
      </div>
    );
  }

  // Early return: thank you screen
  if (showThankYou) {
    return <ThankYou orderNumber={orderNumber} onClose={() => { setShowThankYou(false); window.location.href = "/"; }} />;
  }

  const paymentForm = method === "card" ? <CreditCardForm card={card} onChange={setCard} />
    : method === "upi" ? (
      <div className="upi-details">
        <label>UPI ID or Number
          <input type="text" required value={upi}
            onChange={(e) => setUpi(e.target.value)} placeholder="yourname@upi" />
        </label>
      </div>
    ) : (
      <div className="cod-details">
        <p className="cod-info">Cash On Delivery selected.</p>
      </div>
    );

  return (
    <>
      <SeoHelmet title="Checkout" description="Complete your purchase at WestSide Store." />
      <div className="payment-outer">
        <div className="payment-container">
          <div className="payment-left">
            <form className="payment-form" onSubmit={handlePay}>
              <h2 className="mb-4">💳 Payment Details</h2>

              <div className="payment-methods mb-3">
                {PAYMENT_METHODS.map(({ id, label }) => (
                  <label key={id} className={method === id ? "active" : ""}>
                    <input type="radio" name="method" value={id}
                      checked={method === id} onChange={() => setMethod(id)} />
                    <span>{label}</span>
                  </label>
                ))}
              </div>

              {paymentForm}

              <div className="shipping-details mt-3">
                <label>Name Of Receiver
                  <input type="text" required value={receiver}
                    onChange={(e) => setReceiver(e.target.value)} placeholder="Name Of Receiver" />
                </label>
                <p className="address-info">
                  Shivan Avenue, near Dabholi Char Rasta, Surat, Gujarat 395004
                </p>
              </div>

              {error && <div className="alert alert-danger mt-2">{error}</div>}
              <button type="submit" className="pay-btn mt-3" disabled={isProcessing}>
                {isProcessing ? "Processing..." : `PAY ₹${totals.grandTotal}`}
              </button>
            </form>
          </div>

          <div className="payment-right">
            <OrderSummary totals={totals} cart={cart} />
          </div>
        </div>
      </div>
    </>
  );
}
