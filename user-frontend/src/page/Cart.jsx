import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Cart.css';

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(true);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [orderLoading, setOrderLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [address, setAddress] = useState({
        name: "",
        phone: "",
        pincode: "",
        street: "",
        city: "",
        state: "",
        landmark: ""
    });

    useEffect(() => {
        checkSessionAndFetchCart();
        loadUserAddress();
    }, [navigate]);

    const checkSessionAndFetchCart = async () => {
        try {
            const sessionResponse = await fetch('http://localhost:5000/user/check-session', {
                credentials: 'include'
            });
            const sessionData = await sessionResponse.json();

            if (sessionData.msg === 'Logged in') {
                await fetchCart();
            } else {
                navigate('/');
            }
        } catch (err) {
            console.error('Session check error:', err);
            navigate('/');
        }
    };

    const fetchCart = async () => {
        try {
            const response = await fetch('http://localhost:5000/user/cart', {
                credentials: 'include'
            });
            const data = await response.json();

            if (response.ok) {
                setCartItems(data.items || []);
                setTotalPrice(data.totalPrice || 0);
            } else {
                setError('Failed to load cart items');
            }
        } catch (error) {
            setError('Error loading cart');
        } finally {
            setLoading(false);
        }
    };

    const loadUserAddress = async () => {
        try {
            const response = await fetch('http://localhost:5000/user/address', {
                credentials: 'include'
            });
            const data = await response.json();

            if (data.address && data.address.name) {
                setAddress(data.address);
            }
        } catch (err) {
            console.error('Error loading address:', err);
        }
    };

    const handleAddressChange = (field, value) => {
        setAddress(prev => ({ ...prev, [field]: value }));
        setError('');
    };

    const validateAddress = () => {
        const requiredFields = ['name', 'phone', 'pincode', 'street', 'city', 'state'];
        const emptyFields = requiredFields.filter(field => !address[field]?.trim());

        if (emptyFields.length > 0) {
            setError('Please fill in all required fields');
            return false;
        }

        if (address.phone.length < 10) {
            setError('Please enter a valid phone number');
            return false;
        }

        if (address.pincode.length !== 6) {
            setError('Please enter a valid 6-digit pincode');
            return false;
        }

        return true;
    };

    const placeOrder = () => {
        if (cartItems.length === 0) {
            setError('Your cart is empty!');
            return;
        }
        setShowAddressForm(true);
        setError('');
    };

    const confirmOrder = async () => {
        if (!validateAddress()) return;

        setOrderLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5000/user/place-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ address })
            });

            const data = await response.json();

            if (response.ok) {
                setCartItems([]);
                setTotalPrice(0);
                setShowAddressForm(false);
                navigate('/order');
            } else {
                setError(data.msg || 'Failed to place order');
            }
        } catch (error) {
            setError('Failed to place order: ' + error.message);
        } finally {
            setOrderLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && showAddressForm) {
            confirmOrder();
        }
    };

    if (loading) {
        return (
            <div className="cart-container">
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading your cart...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <div className="cart-header">
                <button
                    onClick={() => navigate('/home')}
                    className="back-button"
                >
                    <span className="btn-icon">←</span>
                    Back to Shop
                </button>
                <div className="header-content">
                    <h1 className="page-title">Your Cart</h1>
                    <p className="cart-count">{cartItems.length} items</p>
                </div>
            </div>

            {error && (
                <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    <span>{error}</span>
                </div>
            )}

            {cartItems.length === 0 ? (
                <div className="empty-cart">
                    <div className="empty-icon">🛒</div>
                    <h2>Your cart is empty</h2>
                    <p>Discover amazing products from local businesses</p>
                    <button
                        onClick={() => navigate('/home')}
                        className="continue-shopping"
                    >
                        <span className="btn-icon">🛍️</span>
                        Start Shopping
                    </button>
                </div>
            ) : (
                <>
                    <div className="cart-content">
                        <div className="cart-items">
                            <h3 className="section-title">
                                <span className="section-icon">📦</span>
                                Order Items
                            </h3>
                            {cartItems.map((item, index) => (
                                <div key={index} className="cart-item">
                                    <div className="item-info">
                                        <h4 className="item-name">{item.name}</h4>
                                        <div className="item-details">
                                            <span className="quantity-badge">
                                                Qty: {item.quantity}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="cart-summary">
                            <h3 className="section-title">
                                <span className="section-icon">💰</span>
                                Order Summary
                            </h3>
                            <div className="summary-details">
                                <div className="summary-row">
                                    <span>Subtotal ({cartItems.length} items)</span>
                                    <span>₹{totalPrice}</span>
                                </div>
                                <div className="summary-row">
                                    <span>Delivery Fee</span>
                                    <span className="free">Free</span>
                                </div>
                                <div className="summary-row total">
                                    <span>Total Amount</span>
                                    <span>₹{totalPrice}</span>
                                </div>
                            </div>
                            <button
                                onClick={placeOrder}
                                className="place-order-button"
                            >
                                <span className="btn-icon">🚀</span>
                                Place Order
                            </button>
                        </div>
                    </div>

                    {showAddressForm && (
                        <div className="address-form-overlay">
                            <div className="address-form">
                                <div className="form-header">
                                    <h3>Delivery Address</h3>
                                    <button
                                        className="close-btn"
                                        onClick={() => setShowAddressForm(false)}
                                    >
                                        ×
                                    </button>
                                </div>

                                <div className="form-body">
                                    <div className="input-row">
                                        <div className="input-group">
                                            <label>Full Name *</label>
                                            <div className="input-wrapper">
                                                <span className="input-icon">👤</span>
                                                <input
                                                    type="text"
                                                    placeholder="Enter your full name"
                                                    value={address.name}
                                                    onChange={e => handleAddressChange("name", e.target.value)}
                                                    onKeyPress={handleKeyPress}
                                                />
                                            </div>
                                        </div>

                                        <div className="input-group">
                                            <label>Phone Number *</label>
                                            <div className="input-wrapper">
                                                <span className="input-icon">📱</span>
                                                <input
                                                    type="tel"
                                                    placeholder="10-digit mobile number"
                                                    value={address.phone}
                                                    onChange={e => handleAddressChange("phone", e.target.value)}
                                                    onKeyPress={handleKeyPress}
                                                    maxLength="10"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="input-group">
                                        <label>Area / Street Address *</label>
                                        <div className="input-wrapper">
                                            <span className="input-icon">🏠</span>
                                            <input
                                                type="text"
                                                placeholder="House no, Building, Street"
                                                value={address.street}
                                                onChange={e => handleAddressChange("street", e.target.value)}
                                                onKeyPress={handleKeyPress}
                                            />
                                        </div>
                                    </div>

                                    <div className="input-row">
                                        <div className="input-group">
                                            <label>City *</label>
                                            <div className="input-wrapper">
                                                <span className="input-icon">🏙️</span>
                                                <input
                                                    type="text"
                                                    placeholder="Enter city"
                                                    value={address.city}
                                                    onChange={e => handleAddressChange("city", e.target.value)}
                                                    onKeyPress={handleKeyPress}
                                                />
                                            </div>
                                        </div>

                                        <div className="input-group">
                                            <label>Pincode *</label>
                                            <div className="input-wrapper">
                                                <span className="input-icon">📮</span>
                                                <input
                                                    type="text"
                                                    placeholder="6-digit pincode"
                                                    value={address.pincode}
                                                    onChange={e => handleAddressChange("pincode", e.target.value)}
                                                    onKeyPress={handleKeyPress}
                                                    maxLength="6"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="input-row">
                                        <div className="input-group">
                                            <label>State *</label>
                                            <div className="input-wrapper">
                                                <span className="input-icon">🗺️</span>
                                                <input
                                                    type="text"
                                                    placeholder="Enter state"
                                                    value={address.state}
                                                    onChange={e => handleAddressChange("state", e.target.value)}
                                                    onKeyPress={handleKeyPress}
                                                />
                                            </div>
                                        </div>

                                        <div className="input-group">
                                            <label>Landmark (Optional)</label>
                                            <div className="input-wrapper">
                                                <span className="input-icon">📌</span>
                                                <input
                                                    type="text"
                                                    placeholder="Nearby landmark"
                                                    value={address.landmark}
                                                    onChange={e => handleAddressChange("landmark", e.target.value)}
                                                    onKeyPress={handleKeyPress}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-footer">
                                    <button
                                        onClick={() => setShowAddressForm(false)}
                                        className="cancel-button"
                                        disabled={orderLoading}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmOrder}
                                        className={`confirm-button ${orderLoading ? 'loading' : ''}`}
                                        disabled={orderLoading}
                                    >
                                        {orderLoading ? (
                                            <>
                                                <span className="loading-spinner"></span>
                                                Placing Order...
                                            </>
                                        ) : (
                                            <>
                                                <span className="btn-icon">✅</span>
                                                Confirm Order
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}

export default Cart;