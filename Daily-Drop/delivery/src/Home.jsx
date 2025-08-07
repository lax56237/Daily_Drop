import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import "./Home.css"

function Home() {
    const [name, setName] = useState('');
    const [orders, setOrders] = useState([]);
    const navigate = useNavigate();

    const takeOrder = async (orderId) => {
        try {
          
            await fetch('http://localhost:5000/delivery/take-order', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ orderId })
            });

            // Store ordersheet in delivery boy model
            const storeResponse = await fetch('http://localhost:5000/delivery/store-ordersheet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ orderId })
            });

            if (storeResponse.ok) {
                navigate('/delivery');
            } else {
                console.error('Failed to store ordersheet');
            }
        } catch (error) {
            console.error('Error taking order:', error);
        }
    };

    useEffect(() => {
        fetch('http://localhost:5000/delivery/check', { credentials: 'include' })
            .then(res => res.json())
            .then(data => setName(data.name))
            .catch(() => setName(''));

        fetch('http://localhost:5000/delivery/orders', { credentials: 'include' })
            .then(res => res.json())
            .then(data => {
                if (data.redirect === 'delivery' || data.status === 'redirect') {
                    navigate('/delivery');
                } else if (Array.isArray(data)) {
                    setOrders(data);
                } else {
                    setOrders([]);
                }
            })
            .catch(console.warn);
    }, []);

    return (
        <div className="home-container">
            <h2>Welcome, {name || 'Loading...'}</h2>
            <h3>Available Orders</h3>
            {orders.length === 0 ? (
                <p className="no-orders">No orders ready for delivery.</p>
            ) : (
                orders.map((order, i) => (
                    <div key={i} className="order-card">
                        <button onClick={() => takeOrder(order.orderId)}>Take Order {order.orderId}</button>
                        <h3>Customer: {order.user?.name}</h3>
                        <p>Phone: {order.user?.phone}</p>
                        <p>Address: {order.user?.address?.street}, {order.user?.address?.city}, {order.user?.address?.pincode}</p>
                        <hr /><hr />
                        <br /><br />
                        {order.items.map((item, j) => (
                            <div key={j} className="item-card">
                                <p><strong>Item:</strong> {item.product?.name}</p>
                                <img src={item.product?.imageUrl} alt={item.product?.name} />
                                <p><strong>Qty:</strong> {item.quantity}</p>
                                <p><strong>Price:</strong> ₹{item.product?.price}</p>

                                <div className="seller-info">
                                    <p><strong>Shop:</strong> {item.seller?.shopName || 'Unknown Shop'}</p>
                                    <p><strong>Seller Contact:</strong> {item.seller?.phone || 'N/A'}</p>
                                    <p><strong>Seller Address:</strong></p>
                                    <ul>
                                        <li><strong>Street:</strong> {item.seller?.address || 'N/A'}</li>
                                        <li><strong>City:</strong> {item.seller?.city || 'N/A'}</li>
                                        <li><strong>State:</strong> {item.seller?.state || 'N/A'}</li>
                                        <li><strong>Pincode:</strong> {item.seller?.pincode || 'N/A'}</li>
                                        <li><strong>Landmark:</strong> {item.seller?.landmark || 'N/A'}</li>
                                    </ul>
                                    <br />
                                </div>
                            </div>
                        ))}
                        <hr />
                    </div>
                ))
            )}
        </div>

    );
}

export default Home;