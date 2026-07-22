import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { showSuccess, showError } from "./ToastConfig";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import LoadingSpinner from "./LoadingSpinner";
import SeoHelmet from "./SeoHelmet";
import useAuth from "../hooks/useAuth";
import "../assets/styles/MyAccount.css";

const MyAccount = () => {
    const { login: loginDetail } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!loginDetail?.email) { setLoading(false); return; }
        const fetchOrders = async () => {
            try {
                const response = await fetch(`/api/orders/user/${loginDetail.email}`, {
                    headers: { Authorization: `Bearer ${loginDetail.token}` },
                });
                const result = await response.json();
                if (result.status === "success") setOrders(result.results || []);
                else setError("Failed to load orders");
            } catch { setError("Failed to connect to server"); }
            setLoading(false);
        };
        fetchOrders();
    }, [loginDetail]);

    const formatDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
    const getStatusBadge = (s) => {
        const status = s.toLowerCase();
        const variants = {
            delivered: "success",
            processing: "warning",
            shipped: "info",
            cancelled: "danger",
        };
        return variants[status] || "default";
    };

    const handleDownloadInvoice = async (orderNumber) => {
        try {
            const response = await fetch(`/api/orders/${orderNumber}/invoice`, {
                headers: { Authorization: `Bearer ${loginDetail.token}` },
            });
            if (!response.ok) { showError("Failed to download invoice"); return; }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url; a.download = `invoice-${orderNumber}.pdf`;
            document.body.appendChild(a); a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            showSuccess("Invoice downloaded!");
        } catch { showError("Failed to download invoice"); }
    };

    const handleCancelOrder = async (orderNumber) => {
        if (!window.confirm(`Cancel order #${orderNumber}?`)) return;
        try {
            const response = await fetch(`/api/orders/status/${orderNumber}`, {
                method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${loginDetail.token}` },
                body: JSON.stringify({ status: "Cancelled" }),
            });
            const result = await response.json();
            if (result.status === "success") {
                setOrders(orders.map(o => o.orderNumber === orderNumber ? { ...o, status: "Cancelled" } : o));
                showSuccess("Order cancelled.");
            } else showError("Failed to cancel order");
        } catch { showError("Failed to cancel order"); }
    };

    return (
        <>
            <SeoHelmet title="My Account" description="View your orders, track deliveries, and manage your WestSide Store account." />
            <div className="myaccount-container">
                <aside className="sidebar">
                    <div className="profile-section">
                        <div className="profile-avatar"><div className="avatar-circle">{loginDetail?.name?.charAt(0).toUpperCase() || "G"}</div></div>
                        <h5>Hello {loginDetail?.name || "Guest"}!</h5>
                        <p className="user-email">{loginDetail?.email}</p>
                        <button className="view-details-btn">View Details</button>
                    </div>
                    <ul className="menu-list">
                        <li className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-blue-50 text-blue-700 font-medium transition-colors">
                            <Link className="text-blue-700 no-underline" to="/myaccount">🛒 My Orders</Link>
                        </li>
                        <li className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
                            <Link className="text-gray-600 no-underline hover:text-gray-800" to="/wishlist">❤️ My Wishlist</Link>
                        </li>
                        <hr className="border-gray-200 my-2" />
                        <li className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
                            <Link className="text-gray-600 no-underline hover:text-gray-800" to="/contact">📞 Contact Us</Link>
                        </li>
                    </ul>
                </aside>
                <main className="orders-section">
                    <div className="order-header"><h3>My Orders</h3><p className="order-subtitle">Track, return, or buy items again</p></div>
                    {loading ? <LoadingSpinner text="Loading your orders..." /> : error ? (
                        <div className="error-state"><p className="error-message">{error}</p><button onClick={() => window.location.reload()} className="retry-btn">Retry</button></div>
                    ) : orders.length > 0 ? (
                        <div className="order-list">
                            {orders.map(order => (
                                <div key={order._id} className="order-card">
                                    <div className="order-header-info">
                                        <div className="order-meta">
                                            <h4 className="order-number">Order #{order.orderNumber}</h4>
                                            <p className="order-date">Placed on {formatDate(order.orderDate || order.createdAt)}</p>
                                            <p className="order-total">Total: ₹{order.totalAmount}</p>
                                        </div>
                                        <div className="order-status">
                                            <Badge variant={getStatusBadge(order.status)}>{order.status}</Badge>
                                            <p className="payment-method">via {order.paymentMethod}</p>
                                        </div>
                                    </div>
                                    <div className="order-items">
                                        {order.items.map((item, i) => (
                                            <div key={i} className="order-item">
                                                <div className="item-image"><img src={item.mainImage} alt={item.imageName} loading="lazy" /></div>
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
                                            {order.status === 'Delivered' ? <p className="delivery-date">✅ Delivered on {formatDate(order.deliveryDate)}</p>
                                                : order.status === 'Processing' ? <p className="expected-delivery">📦 Expected: {formatDate(order.deliveryDate)}</p>
                                                : order.status === 'Shipped' ? <p className="delivery-update">🚛 Shipped — {formatDate(order.deliveryDate)}</p>
                                                : <p className="delivery-update">❌ Cancelled</p>}
                                            <p className="receiver-info">Receiver: {order.receiverName}</p>
                                        </div>
                                        <div className="action-buttons">
                                            <Button variant="outline" size="sm" onClick={() => handleDownloadInvoice(order.orderNumber)}>
                                                📄 Download Invoice
                                            </Button>
                                            {order.status === 'Processing' && (
                                                <Button variant="danger" size="sm" onClick={() => handleCancelOrder(order.orderNumber)}>
                                                    Cancel Order
                                                </Button>
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
                            <Link to="/">
                                <Button variant="primary" size="md">Start Shopping</Button>
                            </Link>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
};

export default MyAccount;
