import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { showSuccess, showInfo } from "./ToastConfig";
import useAuth from "../hooks/useAuth";
import LoadingSpinner from "./LoadingSpinner";
import SeoHelmet from "./SeoHelmet";
import "../assets/styles/ProductDetail.css";

// ── Constants (data-driven, DRY) ──────────────────────────────────
const SIZES = ["S", "M", "L", "XL"];
const DELIVERY_MSG = "Product will be delivered within 3 to 4 days.";

// ── localStorage helpers (normalization at boundary) ──────────────
const getList = (key) => {
  try { return JSON.parse(localStorage.getItem(key)) || []; }
  catch { return []; }
};

const saveList = (key, items) =>
  localStorage.setItem(key, JSON.stringify(items));

const toggleItem = (key, item) => {
  const list = getList(key);
  const exists = list.find((p) => p._id === item._id);
  if (exists) return false;
  list.push(item);
  saveList(key, list);
  return true;
};

// ── Child: Image Gallery ─────────────────────────────────────────
function ImageGallery({ images, main, onSelect, zoom }) {
  return (
    <div className="product-images-section">
      <img
        src={main}
        alt="Product"
        loading="lazy"
        className={`main-image${zoom ? " zoom" : ""}`}
      />
      <div className="thumbnails">
        {images.map((url, i) => (
          <img
            key={i}
            src={url}
            alt={`Thumbnail ${i + 1}`}
            loading="lazy"
            onClick={() => onSelect(url)}
            className={main === url ? "thumbnail active" : "thumbnail"}
          />
        ))}
      </div>
    </div>
  );
}

// ── Child: Pincode Check ─────────────────────────────────────────
function PincodeCheck() {
  const [pincode, setPincode] = useState("");
  const handleCheck = useCallback(() => {
    if (pincode.length === 6) showSuccess("Deliverable to this pincode!");
    else showInfo("Not available for this pincode");
  }, [pincode]);

  return (
    <div className="pincode-check">
      <input
        className="pincode-input"
        placeholder="Enter Pincode"
        value={pincode}
        onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
      />
      <button className="pincode-btn" onClick={handleCheck}>Check</button>
    </div>
  );
}

// ── Main Component ───────────────────────────────────────────────
export default function ProductDetail() {
  const { category, id } = useParams();
  const navigate = useNavigate();
  const { userKey } = useAuth();
  const [prod, setProd] = useState(null);
  const [main, setMain] = useState("");
  const [zoom, setZoom] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`/api/products/${category}/${id}`)
      .then((r) => { setProd(r.data); setMain(r.data.mainImage); })
      .catch(() => setError("Failed to load product"));
  }, [category, id]);

  // ── Handlers (BEFORE early returns — Rules of Hooks) ─────────────
  const handleImageSelect = useCallback((url) => {
    setMain(url);
    setZoom(true);
    setTimeout(() => setZoom(false), 300);
  }, []);

  const handleAddToCart = useCallback(() => {
    const key = `cart_${userKey}`;
    const added = toggleItem(key, prod);
    if (added) {
      window.dispatchEvent(new Event("cartUpdated"));
      showSuccess("Added to cart!");
    } else showInfo("Already in your cart.");
    navigate("/cart");
  }, [userKey, prod, navigate]);

  const handleWishlist = useCallback(() => {
    const key = `wishlist_${userKey}`;
    const added = toggleItem(key, prod);
    if (added) showSuccess("Added to wishlist!");
    else showInfo("Already in your wishlist.");
    navigate("/wishlist");
  }, [userKey, prod, navigate]);

  // Early returns for edge cases
  if (error) return <LoadingSpinner text={error} fullPage />;
  if (!prod) return <LoadingSpinner text="Loading product details..." fullPage />;

  const allImages = [prod.mainImage, ...(prod.otherImages || [])]
    .filter((v, i, arr) => arr.indexOf(v) === i);

  return (
    <>
      <SeoHelmet
        title={prod.imageName}
        description={`${prod.imageName} — ₹${prod.price} at WestSide Store. Shop now!`}
      />
      <div className="product-detail-container">
        <ImageGallery
          images={allImages}
          main={main}
          onSelect={handleImageSelect}
          zoom={zoom}
        />
        <div className="product-info-section">
          <h2 className="product-title">{prod.imageName}</h2>
          <p className="product-brand"><strong>{prod.brand}</strong></p>
          <p className="product-pricing">
            <span className="mrp">₹{prod.mrp}</span>
            <span className="price">₹{prod.price}</span>
            <span className="tax-info">(INCL. OF ALL TAXES)</span>
          </p>

          <div className="sizes">
            {SIZES.map((s) => (
              <button key={s} className="size-btn">{s}</button>
            ))}
          </div>

          <PincodeCheck />

          <button className="addcart" onClick={handleAddToCart}>
            ADD TO CART
          </button>
          <button className="wishlist" onClick={handleWishlist}>
            ♡ Wishlist
          </button>

          <p className="delivery-info">{DELIVERY_MSG}</p>
          <p className="product-description">{prod.description}</p>
        </div>
      </div>
    </>
  );
}
