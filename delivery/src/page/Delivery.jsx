import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import "../style/Delivery.css"

function Delivery() {
    const navigate = useNavigate();
    const [orderSheet, setOrderSheet] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchOrderSheet();
    }, [navigate]);

    const fetchOrderSheet = async () => {
        try {
            const response = await fetch('http://localhost:5000/delivery/get-ordersheet', { 
                credentials: 'include' 
            });
            
            if (response.status === 404) {
                const data = await response.json();
                if (data.redirect === 'home' || data.msg === 'No ordersheet found') {
                    navigate('/home');
                    return;
                }
                throw new Error('No ordersheet found');
            }
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            if (data && data.orderId) {
                setOrderSheet(data);
            } else {
                setError('Invalid order data received');
            }
        } catch (err) {
            console.error('Error fetching ordersheet:', err);
            setError(err.message || 'Failed to load order details');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="delivery-container">
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading delivery details...</p>
                </div>
            </div>
        );
    }

    if (!orderSheet || error) {
        return (
            <div className="delivery-container">
                <div className="error-state">
                    <div className="error-icon">📦</div>
                    <h2>No delivery details found</h2>
                    <p>{error || 'Unable to load order information'}</p>
                    <button 
                        onClick={() => navigate('/home')}
                        className="back-home-btn"
                    >
                        <span className="btn-icon">🏠</span>
                        Back to Home
                    </button>
                </div>
            </div>
        );
    }

    const { user, items } = orderSheet;

    return (
        <div className="delivery-container">
            <div className="delivery-header">
                <div className="header-content">
                    <h1 className="page-title">Delivery Assignment</h1>
                    <p className="page-subtitle">Order #{orderSheet.orderId?.slice(-6)?.toUpperCase() || 'N/A'}</p>
                </div>
                <button 
                    onClick={() => navigate('/verify')}
                    className="delivery-complete-btn"
                >
                    <span className="btn-icon">✅</span>
                    Reached Customer
                </button>
            </div>

            <div className="delivery-content">
                <div className="info-section">
                    <div className="section-header">
                        <h3 className="section-title">
                            <span className="section-icon">👤</span>
                            Customer Information
                        </h3>
                    </div>
                    
                    <div className="customer-card">
                        <div className="customer-main">
                            <div className="customer-details">
                                <div className="detail-row">
                                    <span className="detail-icon">📧</span>
                                    <div className="detail-content">
                                        <span className="detail-label">Email</span>
                                        <span className="detail-value">{user.email || 'N/A'}</span>
                                    </div>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-icon">🏷️</span>
                                    <div className="detail-content">
                                        <span className="detail-label">Name</span>
                                        <span className="detail-value">{user.address?.name || 'N/A'}</span>
                                    </div>
                                </div>
                                <div className="detail-row">
                                    <span className="detail-icon">📱</span>
                                    <div className="detail-content">
                                        <span className="detail-label">Phone</span>
                                        <span className="detail-value">{user.address?.phone || 'N/A'}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="address-section">
                            <h4 className="address-title">
                                <span className="address-icon">📍</span>
                                Delivery Address
                            </h4>
                            <div className="address-details">
                                <p className="address-line">
                                    <strong>Street:</strong> {user.address?.street || 'N/A'}
                                </p>
                                <p className="address-line">
                                    <strong>City:</strong> {user.address?.city || 'N/A'}
                                </p>
                                <p className="address-line">
                                    <strong>State:</strong> {user.address?.state || 'N/A'}
                                </p>
                                <p className="address-line">
                                    <strong>Pincode:</strong> {user.address?.pincode || 'N/A'}
                                </p>
                                {user.address?.landmark && (
                                    <p className="address-line">
                                        <strong>Landmark:</strong> {user.address.landmark}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="info-section">
                    <div className="section-header">
                        <h3 className="section-title">
                            <span className="section-icon">📦</span>
                            Items to Collect & Deliver
                        </h3>
                        <span className="items-count">{items.length} items</span>
                    </div>
                    
                    <div className="items-grid">
                        {items.map((item, index) => (
                            <div key={index} className="item-card">
                                <div className="item-header">
                                    <div className="item-image">
                                        <img 
                                            src={item.product.imageUrl} 
                                            alt={item.product.name}
                                            className="product-image"
                                        />
                                    </div>
                                    <div className="item-info">
                                        <h4 className="item-name">{item.product.name}</h4>
                                        <div className="item-meta">
                                            <span className="item-price">₹{item.product.price}</span>
                                            <span className="item-quantity">Qty: {item.quantity || 1}</span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="seller-info">
                                    <h5 className="seller-title">
                                        <span className="seller-icon">🏪</span>
                                        Pickup Location
                                    </h5>
                                    
                                    <div className="seller-details">
                                        <div className="seller-main">
                                            <div className="seller-contact">
                                                <p className="seller-shop">
                                                    <span className="contact-icon">🏬</span>
                                                    <strong>{item.seller?.shopName || 'Unknown Shop'}</strong>
                                                </p>
                                                <p className="seller-phone">
                                                    <span className="contact-icon">📞</span>
                                                    {item.seller?.phone || 'N/A'}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        <div className="seller-address">
                                            <div className="address-compact">
                                                <span className="address-icon-mini">📍</span>
                                                <div className="address-text">
                                                    <p>{item.seller?.address || 'N/A'}</p>
                                                    <p>{item.seller?.city || 'N/A'}, {item.seller?.state || 'N/A'} - {item.seller?.pincode || 'N/A'}</p>
                                                    {item.seller?.landmark && (
                                                        <p className="landmark">Near: {item.seller.landmark}</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Delivery;