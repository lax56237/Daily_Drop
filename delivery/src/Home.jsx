import { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";
import "./Home.css"

function Home() {
    const [name, setName] = useState('');
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [takingOrder, setTakingOrder] = useState(null);
    const navigate = useNavigate();

    const takeOrder = async (orderId) => {
        setTakingOrder(orderId);
        try {
            await fetch('http://localhost:5000/delivery/take-order', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ orderId })
            });

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
        } finally {
            setTakingOrder(null);
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch name
                const nameRes = await fetch('http://localhost:5000/delivery/check', { credentials: 'include' });
                const nameData = await nameRes.json();
                setName(nameData.name || 'Delivery Partner');

                // Fetch orders
                const ordersRes = await fetch('http://localhost:5000/delivery/orders', { credentials: 'include' });
                const ordersData = await ordersRes.json();
                
                if (ordersData.redirect === 'delivery' || ordersData.status === 'redirect') {
                    navigate('/delivery');
                } else if (Array.isArray(ordersData)) {
                    setOrders(ordersData);
                } else {
                    setOrders([]);
                }
            } catch (error) {
                console.warn('Error fetching data:', error);
                setName('Delivery Partner');
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [navigate]);

    if (loading) {
        return (
            <div className="home-page">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Loading available orders...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="home-page">
            <div className="home-container">
                <header className="page-header">
                    <div className="welcome-section">
                        <div className="delivery-icon">🚚</div>
                        <h1>Welcome, {name}</h1>
                        <p>Ready to deliver orders</p>
                    </div>
                </header>

                <main className="orders-section">
                    <div className="section-header">
                        <h2>Available Orders</h2>
                        <span className="order-count">{orders.length} orders</span>
                    </div>

                    {orders.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📋</div>
                            <h3>No Orders Available</h3>
                            <p>No orders ready for delivery at the moment. Check back later!</p>
                        </div>
                    ) : (
                        <div className="orders-list">
                            {orders.map((order, i) => (
                                <div key={i} className="order-card">
                                    <div className="order-header">
                                        <div className="order-info">
                                            <h3>Order #{order.orderId}</h3>
                                            <span className="order-status">Ready for pickup</span>
                                        </div>
                                        <button 
                                            className={`take-order-btn ${takingOrder === order.orderId ? 'loading' : ''}`}
                                            onClick={() => takeOrder(order.orderId)}
                                            disabled={takingOrder === order.orderId}
                                        >
                                            {takingOrder === order.orderId ? (
                                                <>
                                                    <span className="loading-spinner-btn"></span>
                                                    Taking...
                                                </>
                                            ) : (
                                                <>
                                                    <span className="btn-icon">✓</span>
                                                    Take Order
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    <div className="customer-section">
                                        <h4>Customer Details</h4>
                                        <div className="customer-info">
                                            <div className="info-row">
                                                <span className="icon">👤</span>
                                                <span><strong>Name:</strong> {order.user?.name}</span>
                                            </div>
                                            <div className="info-row">
                                                <span className="icon">📱</span>
                                                <span><strong>Phone:</strong> {order.user?.phone}</span>
                                            </div>
                                            <div className="info-row">
                                                <span className="icon">📍</span>
                                                <span><strong>Address:</strong> {order.user?.address?.street}, {order.user?.address?.city}, {order.user?.address?.pincode}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="items-section">
                                        <h4>Order Items</h4>
                                        <div className="items-list">
                                            {order.items.map((item, j) => (
                                                <div key={j} className="item-card">
                                                    <div className="item-header">
                                                        {item.product?.imageUrl && (
                                                            <div className="item-image">
                                                                <img src={item.product.imageUrl} alt={item.product.name} />
                                                            </div>
                                                        )}
                                                        <div className="item-details">
                                                            <h5>{item.product?.name}</h5>
                                                            <div className="item-meta">
                                                                <span className="quantity">Qty: {item.quantity}</span>
                                                                <span className="price">₹{item.product?.price}</span>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="seller-info">
                                                        <div className="seller-header">
                                                            <h6>Pickup from</h6>
                                                        </div>
                                                        <div className="seller-details">
                                                            <div className="seller-row">
                                                                <span className="icon">🏪</span>
                                                                <span><strong>Shop:</strong> {item.seller?.shopName || 'Unknown Shop'}</span>
                                                            </div>
                                                            <div className="seller-row">
                                                                <span className="icon">📱</span>
                                                                <span><strong>Contact:</strong> {item.seller?.phone || 'N/A'}</span>
                                                            </div>
                                                            <div className="seller-address">
                                                                <span className="icon">📍</span>
                                                                <div className="address-details">
                                                                    <div><strong>Address:</strong></div>
                                                                    <div>{item.seller?.address || 'N/A'}</div>
                                                                    <div>{item.seller?.city || 'N/A'}, {item.seller?.state || 'N/A'} - {item.seller?.pincode || 'N/A'}</div>
                                                                    {item.seller?.landmark && (
                                                                        <div><em>Landmark: {item.seller.landmark}</em></div>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

export default Home;