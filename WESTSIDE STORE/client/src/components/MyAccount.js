import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../assets/styles/MyAccount.css";

const MyAccount = () => {
    const [loginDetail, setLoginDetail] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUserData = async () => {
            // Fetch logged-in user details
            const loginData = JSON.parse(localStorage.getItem("login_detail"));
            setLoginDetail(loginData);

            if (loginData?.email) {
                try {
                    // Fetch orders from backend
                    const response = await fetch(`http://localhost:5000/api/orders/user/${loginData.email}`);
                    const result = await response.json();

                    if (result.status === "success") {
                        setOrders(result.orders);
                    } else {
                        setError("Failed to load orders");
                    }
                } catch (error) {
                    console.error("Error fetching orders:", error);
                    setError("Failed to connect to server");
                }
            }
            setLoading(false);
        };

        fetchUserData();
    }, []);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'delivered':
                return '#28a745';
            case 'processing':
                return '#ffc107';
            case 'shipped':
                return '#17a2b8';
            case 'cancelled':
                return '#dc3545';
            default:
                return '#6c757d';
        }
    };

    // const calculateOrderTotal = (items) => {
    //     return items.reduce((total, item) => total + (item.price * item.quantity), 0);
    // };

    return (
        <div className="myaccount-container">
            {/* Sidebar */}
            <aside className="sidebar">
                <div className="profile-section">
                    <div className="profile-avatar">
                        <div className="avatar-circle">
                            {loginDetail?.name?.charAt(0).toUpperCase() || "G"}
                        </div>
                    </div>
                    <h5>Hello {loginDetail?.name || "Guest"}!</h5>
                    <p className="user-email">{loginDetail?.email}</p>
                    <button className="view-details-btn">View Details</button>
                </div>
                <ul className="menu-list">
                    <li className="nav-item active">
                        <Link className="nav-link" to="/myaccount">🛒 My Orders</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/wishlist">❤️ My Wishlist</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="#">💾 Saved Details</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="#">⚙️ Account Settings</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="#">💳 WestStyleClub</Link>
                    </li>
                    <hr />
                    <li className="nav-item">
                        <Link className="nav-link" to="#">📍 Store Locator</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="/contact">📞 Contact Us</Link>
                    </li>
                    <hr />
                    <li className="nav-item">
                        <Link className="nav-link" to="#">📜 Terms of Use</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="#">ℹ️ About Us</Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link" to="#">🔒 Privacy Policy</Link>
                    </li>
                </ul>
            </aside>

            {/* Orders Section */}
            <main className="orders-section">
                <div className="order-header">
                    <h3>My Orders</h3>
                    <p className="order-subtitle">Track, return, or buy items again</p>
                </div>

                {loading ? (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading your orders...</p>
                    </div>
                ) : error ? (
                    <div className="error-state">
                        <p className="error-message">{error}</p>
                        <button onClick={() => window.location.reload()} className="retry-btn">
                            Retry
                        </button>
                    </div>
                ) : orders.length > 0 ? (
                    <div className="order-list">
                        {orders.map((order) => (
                            <div key={order._id} className="order-card">
                                <div className="order-header-info">
                                    <div className="order-meta">
                                        <h4 className="order-number">Order #{order.orderNumber}</h4>
                                        <p className="order-date">Placed on {formatDate(order.orderDate)}</p>
                                        <p className="order-total">Total: ₹{order.totalAmount}</p>
                                    </div>
                                    <div className="order-status">
                                        <span 
                                            className="status-badge" 
                                            style={{ backgroundColor: getStatusColor(order.status) }}
                                        >
                                            {order.status}
                                        </span>
                                        <p className="payment-method">via {order.paymentMethod}</p>
                                    </div>
                                </div>

                                <div className="order-items">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="order-item">
                                            <div className="item-image">
                                                <img src={item.mainImage} alt={item.imageName} />
                                            </div>
                                            <div className="item-details">
                                                <h5 className="item-name">{item.imageName}</h5>
                                                <p className="item-price">₹{item.price} x {item.quantity}</p>
                                                <p className="item-subtotal">Subtotal: ₹{item.price * item.quantity}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="order-actions">
                                    <div className="delivery-info">
                                        {order.status === 'Delivered' ? (
                                            <p className="delivery-date">
                                                ✅ Delivered on {formatDate(order.deliveryDate)}
                                            </p>
                                        ) : order.status === 'Processing' ? (
                                            <p className="expected-delivery">
                                                📦 Expected delivery: {formatDate(order.deliveryDate)}
                                            </p>
                                        ) : (
                                            <p className="delivery-update">
                                                🚛 Delivery expected: {formatDate(order.deliveryDate)}
                                            </p>
                                        )}
                                        <p className="receiver-info">Receiver: {order.receiverName}</p>
                                    </div>
                                    <div className="action-buttons">
                                        <button className="btn-secondary">Track Order</button>
                                        {order.status === 'Delivered' && (
                                            <>
                                                <button className="btn-primary">Reorder</button>
                                                <button className="btn-outline">Return/Exchange</button>
                                            </>
                                        )}
                                        {order.status === 'Processing' && (
                                            <button className="btn-danger">Cancel Order</button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-orders">
                        <div className="empty-icon">📦</div>
                        <h4>No orders yet!</h4>
                        <p>Looks like you haven't placed any orders yet.</p>
                        <Link to="/" className="btn-primary">Start Shopping</Link>
                    </div>
                )}
            </main>
        </div>
    );
};

export default MyAccount;
