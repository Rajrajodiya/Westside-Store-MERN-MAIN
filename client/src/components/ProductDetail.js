import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { showSuccess, showInfo } from "./ToastConfig";
import LoadingSpinner from "./LoadingSpinner";
import SeoHelmet from "./SeoHelmet";
import "../assets/styles/ProductDetail.css";

export default function ProductDetail() {
    const { category, id } = useParams();
    const navigate = useNavigate();
    const [prod, setProd] = useState(null);
    const [main, setMain] = useState("");
    const [pincode, setPincode] = useState("");
    const [zoom, setZoom] = useState(false);

    useEffect(() => {
        axios.get(`/api/products/${category}/${id}`)
            .then(r => { setProd(r.data); setMain(r.data.mainImage); })
            .catch(console.error);
    }, [category, id]);

    if (!prod) return <LoadingSpinner text="Loading product details..." fullPage />;

    const loginDetail = JSON.parse(localStorage.getItem("login_detail"));
    const userKey = loginDetail ? (loginDetail.email || loginDetail.emailOrPhone || "guest") : "guest";

    const handleAddToCart = () => {
        let cart = JSON.parse(localStorage.getItem(`cart_${userKey}`)) || [];
        if (!cart.find(p => p._id === prod._id)) {
            cart.push(prod);
            localStorage.setItem(`cart_${userKey}`, JSON.stringify(cart));
            window.dispatchEvent(new Event("cartUpdated"));
            showSuccess("Added to cart!");
        } else showInfo("Already in your cart.");
        navigate("/cart");
    };

    const handleWishlist = () => {
        let wishlist = JSON.parse(localStorage.getItem(`wishlist_${userKey}`)) || [];
        if (!wishlist.find(p => p._id === prod._id)) {
            wishlist.push(prod);
            localStorage.setItem(`wishlist_${userKey}`, JSON.stringify(wishlist));
            showSuccess("Added to wishlist!");
        } else showInfo("Already in your wishlist.");
        navigate("/wishlist");
    };

    const allImages = [prod.mainImage, ...(prod.otherImages || [])].filter((v, i, arr) => arr.indexOf(v) === i);

    return (
        <>
            <SeoHelmet title={prod.imageName} description={`${prod.imageName} — ₹${prod.price} at WestSide Store. Shop now!`} />
            <div className="product-detail-container">
                <div className="product-images-section">
                    <img src={main} alt="Main product" loading="lazy" className={`main-image${zoom ? ' zoom' : ''}`} />
                    <div className="thumbnails">
                        {allImages.map((url, i) => (
                            <img key={i} src={url} alt={`Thumbnail ${i + 1}`} loading="lazy" onClick={() => { setMain(url); setZoom(true); setTimeout(() => setZoom(false), 300); }}
                                className={main === url ? "thumbnail active" : "thumbnail"} />
                        ))}
                    </div>
                </div>
                <div className="product-info-section">
                    <h2 className="product-title">{prod.imageName}</h2>
                    <p className="product-brand"><strong>{prod.brand}</strong></p>
                    <p className="product-pricing">
                        <span className="mrp">₹{prod.mrp}</span>
                        <span className="price">₹{prod.price}</span> <span className="tax-info">(INCL. OF ALL TAXES)</span>
                    </p>
                    <div className="sizes">
                        {['S', 'M', 'L', 'XL'].map(s => (<button key={s} className="size-btn">{s}</button>))}
                    </div>
                    <div className="pincode-check">
                        <input className="pincode-input" placeholder="Enter Pincode" value={pincode} onChange={e => setPincode(e.target.value)} />
                        <button className="pincode-btn" onClick={() => {
                            if (pincode.length === 6) showSuccess("Deliverable to this pincode!");
                            else showInfo("Not available for this pincode");
                        }}>Check</button>
                    </div>
                    <button className="addcart" onClick={handleAddToCart}>ADD TO CART</button>
                    <button className="wishlist" onClick={handleWishlist}>♡ Wishlist</button>
                    <p className="delivery-info">Product will be delivered within 3 to 4 days.</p>
                    <p className="product-description">{prod.description}</p>
                </div>
            </div>
        </>
    );
}
