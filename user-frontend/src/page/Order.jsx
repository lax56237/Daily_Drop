import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/Order.css";

function Order() {
  const [name, setName] = useState("");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    checkSessionAndFetchData();
  }, [navigate]);

  const checkSessionAndFetchData = async () => {
    try {
      const sessionResponse = await fetch('http://localhost:5000/user/check-session', {
        credentials: 'include'
      });
      const sessionData = await sessionResponse.json();

      if (sessionData.msg === 'Logged in') {
        await Promise.all([fetchUserAddress(), fetchOrders()]);
      } else {
        navigate('/');
      }
    } catch (err) {
      console.error('Session check error:', err);
      setError('Session expired. Please login again.');
      setTimeout(() => navigate('/'), 2000);
    }
  };

  const fetchUserAddress = async () => {
    try {
      const response = await fetch("http://localhost:5000/user/address", {
        credentials: "include",
      });
      
      if (response.ok) {
        const data = await response.json();
        setName(data.address?.name || "User");
      }
    } catch (err) {
      console.warn("Address fetch failed:", err.message);
      setName("User");
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:5000/user/orders", {
        credentials: "include",
      });
      
      if (response.ok) {
        const data = await response.json();
        setOrders(data.orders || []);
      } else {
        setError("Failed to load orders");
      }
    } catch (err) {
      console.error("Orders fetch error:", err.message);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status) => {
    const configs = {
      ready: { icon: "📦", text: "Ready", color: "ready" },
      ondelivery: { icon: "🚚", text: "On Delivery", color: "ondelivery" },
      delivered: { icon: "✅", text: "Delivered", color: "delivered" },
    };
    return configs[status] || { icon: "📋", text: status, color: "default" };
  };

  const formatOrderDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="order-container">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="order-container">
      <div className="order-header">
        <button
          onClick={() => navigate("/home")}
          className="back-button"
        >
          <span className="btn-icon">←</span>
          Back to Shop
        </button>
        <div className="header-content">
          <h1 className="page-title">Your Orders</h1>
          <p className="welcome-message">Welcome back, {name}!</p>
        </div>
      </div>

      {error && (
        <div className="error-message">
          <span className="error-icon">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="empty-orders">
          <div className="empty-icon">📦</div>
          <h2>No orders yet</h2>
          <p>Start shopping from amazing local businesses</p>
          <button
            onClick={() => navigate("/home")}
            className="continue-shopping"
          >
            <span className="btn-icon">🛍️</span>
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="orders-content">
          <div className="orders-summary">
            <h3 className="section-title">
              <span className="section-icon">📋</span>
              Order History
            </h3>
            <p className="orders-count">{orders.length} orders found</p>
          </div>

          <div className="orders-list">
            {orders.map((order, index) => {
              const statusConfig = getStatusConfig(order.delivery_status);
              return (
                <div key={index} className="order-card">
                  <div className="order-main">
                    <div className="order-header-info">
                      <div className="order-id-section">
                        <h3 className="order-id">
                          Order #{order._id.slice(-6).toUpperCase()}
                        </h3>
                        <span className={`status-badge status-${statusConfig.color}`}>
                          <span className="status-icon">{statusConfig.icon}</span>
                          {statusConfig.text}
                        </span>
                      </div>
                      <div className="order-meta">
                        <div className="order-date">
                          <span className="meta-icon">📅</span>
                          <span>{formatOrderDate(order.orderDate)}</span>
                        </div>
                        <div className="order-total">
                          <span className="meta-icon">💰</span>
                          <span className="price">₹{order.totalPrice}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="order-items">
                    <h4 className="items-title">
                      <span className="items-icon">🛍️</span>
                      Items ({order.items.length})
                    </h4>
                    <div className="items-list">
                      {order.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="item-row">
                          <div className="item-info">
                            <span className="item-name">{item.name}</span>
                            <div className="item-details">
                              <span className="quantity-badge">
                                Qty: {item.quantity}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default Order;