import React, { useEffect, useState } from 'react';
import './Orders.css';

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
                <p>No orders yet.</p>
            ) : (
                orders.map((order, i) => (
                    <div key={i} className="order-card">
                        <p><strong>Customer:</strong> {order.customer.name}</p>
                        <p><strong>Item:</strong> {order.itemName}</p>
                        <p><strong>Quantity:</strong> {order.quantity}</p>
                        <p><strong>Address:</strong></p>
                        <ul>
                            <li>{order.customer.address.street}</li>
                            <li>{order.customer.address.city}, {order.customer.address.state} - {order.customer.address.pincode}</li>
                            <li><em>Landmark:</em> {order.customer.address.landmark}</li>
                        </ul>
                    </div>
                ))
            )}
        </div>
    );
};

export default Orders;
