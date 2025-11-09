import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../assets/styles/ProductDetail.css";

export default function ProductDetail() {
    const { category, id } = useParams();
    const navigate = useNavigate();
    const [prod, setProd] = useState(null);
    const [main, setMain] = useState("");
    const [pincode, setPincode] = useState("");
    const [zoom, setZoom] = useState(false);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/products/${category}/${id}`)
            .then(r => {
                setProd(r.data);
                setMain(r.data.mainImage);
            })
            .catch(console.error);
    }, [category, id]);

    if (!prod) {return <>Loading...</>};

    // Get current user key
    const loginDetail = JSON.parse(localStorage.getItem("login_detail"));
    const userKey = loginDetail ? loginDetail.emailOrPhone : "guest";

    // Add product to localStorage cart (per user)
    const handleAddToCart = () => {
        let cart = JSON.parse(localStorage.getItem(`cart_${userKey}`)) || [];
        if (!cart.find(p => p._id === prod._id)) {
            cart.push(prod);
            localStorage.setItem(`cart_${userKey}`, JSON.stringify(cart));
        }
        navigate("/cart");
    };

    // Add product to localStorage wishlist (per user)
    const handleWishlist = () => {
        let wishlist = JSON.parse(localStorage.getItem(`wishlist_${userKey}`)) || [];
        if (!wishlist.find(p => p._id === prod._id)) {
            wishlist.push(prod);
            localStorage.setItem(`wishlist_${userKey}`, JSON.stringify(wishlist));
        }
        navigate("/wishlist");
    };

    // Get unique images for thumbnails
    const allImages = [prod.mainImage, ...prod.otherImage].filter((v, i, arr) => arr.indexOf(v) === i);

    const handleThumbnailClick = (url) => {
        setMain(url);
        setZoom(true);
        setTimeout(() => setZoom(false), 300);
    };

    return (
        <div className="product-detail-container">
            <div className="product-images-section">
                <img src={main} alt="Main product" className={`main-image${zoom ? ' zoom' : ''}`} />
                <div className="thumbnails">
                    {allImages.map((url, i) => (
                        <img
                            key={i}
                            src={url}
                            alt={`Thumbnail ${i + 1}`}
                            onClick={() => handleThumbnailClick(url)}
                            className={main === url ? "thumbnail active" : "thumbnail"}
                        />
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
                    {['S', 'M', 'L', 'XL'].map(s => (
                        <button key={s} className="size-btn">{s}</button>
                    ))}
                </div>

                <div className="pincode-check">
                    <input
                        className="pincode-input"
                        placeholder="Enter Pincode"
                        value={pincode}
                        onChange={e => setPincode(e.target.value)}
                    />
                    <button
                        className="pincode-btn"
                        onClick={() =>
                            alert(pincode.length === 6 ? "Deliverable" : "Not available")
                        }
                    >
                        Check
                    </button>
                </div>

                <button className="addcart" onClick={handleAddToCart}>
                    ADD TO CART
                </button>

                <button className="wishlist" onClick={handleWishlist}>♡ Wishlist</button>

                <div className="share">
                    <span>Share:</span>
                    {["F", "T", "P", "W"].map((c, i) => (
                        <button key={i} className="share-btn">{c}</button>
                    ))}
                </div>

                <p className="delivery-info">Product will be delivered within 3 to 4 days.</p>
                <p className="product-description">{prod.description}</p>
            </div>
        </div>
    );
}
