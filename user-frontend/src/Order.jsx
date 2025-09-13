import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Order.css";

function Order() {
  const [name, setName] = useState("");
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://localhost:5000/user/address", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        setName(data.address.name || "");
      })
      .catch((err) => {
        console.warn("Address fetch failed:", err.message);
      });

    fetch("http://localhost:5000/user/orders", {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Orders fetch failed");
        return res.json();
      })
      .then((data) => setOrders(data.orders || []))
      .catch((err) => console.error("Orders fetch error:", err.message));
  }, []);

  return (
    <div className="order-container">
      <div className="order-header">
        <button onClick={() => navigate('/home')} className="back-button">← Back to Home</button>
        <h2>Your Orders, {name || "User"}!</h2>
      </div>
      
      {orders.length === 0 ? (
        <div className="no-orders">
          <p>No orders found.</p>
          <button onClick={() => navigate('/home')} className="continue-shopping">
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order, index) => (
            <div key={index} className="order-card">
              <div className="order-info">
                <h3>Order #{order._id.slice(-6)}</h3>
                <p>Status: <span className={`status-${order.delivery_status}`}>{order.delivery_status}</span></p>
                <p>Total: ₹{order.totalPrice}</p>
                <p>Date: {new Date(order.orderDate).toLocaleDateString()}</p>
              </div>
              <div className="order-items">
                <h4>Items:</h4>
                <ul>
                  {order.items.map((item, itemIndex) => (
                    <li key={itemIndex}>
                      {item.name} × {item.quantity}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Order;
