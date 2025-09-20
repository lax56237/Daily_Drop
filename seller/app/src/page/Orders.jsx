import React, { useEffect, useState } from 'react';
import '../style/Orders.css';

const Orders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/seller/get-orders', {
            credentials: 'include'
        })
            .then(res => res.json())
            .then(data => setOrders(data.orders || []))
            .catch(err => console.error('Order fetch error:', err));
    }, []);

    return (
        <div className="orders-page">
            <h2>Seller Orders</h2>
            {orders.length === 0 ? (
                <div className="empty">
                    <div className="empty-icon">📋</div>
                    <p>No orders yet.</p>
                    <span className="empty-subtitle">Orders will appear here when customers make purchases</span>
                </div>
            ) : (
                <div className="orders-list">
                    {orders.map((order, i) => (
                        <div key={i} className="order-card">
                            <div className="order-header">
                                <div className="order-number">Order #{i + 1}</div>
                                <div className="order-status">New</div>
                            </div>

                            <div className="order-content">
                                <div className="customer-section">
                                    <h4>Customer Details</h4>
                                    <div className="customer-info">
                                        <div className="customer-name">
                                            <span className="icon">👤</span>
                                            <span>{order.customer.name}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="item-section">
                                    <h4>Order Details</h4>
                                    <div className="item-info">
                                        <div className="item-row">
                                            <span className="label">Item:</span>
                                            <span className="value">{order.itemName}</span>
                                        </div>
                                        <div className="item-row">
                                            <span className="label">Quantity:</span>
                                            <span className="value quantity-badge">{order.quantity}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="address-section">
                                    <h4>Delivery Address</h4>
                                    <div className="address-info">
                                        <div className="address-line">
                                            <span className="icon">📍</span>
                                            <div className="address-text">
                                                <div>{order.customer.address.street}</div>
                                                <div>{order.customer.address.city}, {order.customer.address.state} - {order.customer.address.pincode}</div>
                                                {order.customer.address.landmark && (
                                                    <div className="landmark">
                                                        <em>Landmark: {order.customer.address.landmark}</em>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Orders;