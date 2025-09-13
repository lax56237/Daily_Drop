import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

function Cart() {
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:5000/user/check-session', {
            credentials: 'include'
        })
        .then(res => {
            console.log('Session check response status:', res.status);
            return res.json();
        })
        .then(data => {
            console.log('Session check result:', data);
            if (data.msg === 'Logged in') {
                fetchCart();
            } else {
                console.error('Not logged in:', data.msg);
                navigate('/');
            }
        })
        .catch(err => {
            console.error('Session check error:', err);
            navigate('/');
        });
    }, [navigate]);

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
                console.error('Failed to fetch cart:', data.msg);
            }
        } catch (error) {
            console.error('Error fetching cart:', error);
        } finally {
            setLoading(false);
        }
    };

    const [showAddressForm, setShowAddressForm] = useState(false);
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
        fetch('http://localhost:5000/user/address', {
            credentials: 'include'
        })
        .then(res => res.json())
        .then(data => {
            if (data.address && data.address.name) {
                setAddress(data.address);
            }
        })
        .catch(err => console.error('Error loading address:', err));
    }, []);

    const handleAddressChange = (field, value) => {
        setAddress(prev => ({ ...prev, [field]: value }));
    };

    const placeOrder = async () => {
        if (cartItems.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        setShowAddressForm(true);
    };

    const confirmOrder = async () => {
        if (!address.name || !address.phone || !address.pincode || !address.street || !address.city || !address.state) {
            alert('Please fill all required address fields');
            return;
        }

        try {
            console.log('Attempting to place order...');
            
            const response = await fetch('http://localhost:5000/user/place-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ address })
            });
            
            console.log('Place order response status:', response.status);
            const data = await response.json();
            console.log('Place order response data:', data);

            if (response.ok) {
                alert('Order placed successfully!');
                setCartItems([]);
                setTotalPrice(0);
                setShowAddressForm(false);
                navigate('/order');
            } else {
                alert(data.msg || 'Failed to place order');
            }
        } catch (error) {
            console.error('Error placing order:', error);
            alert('Failed to place order: ' + error.message);
        }
    };

    if (loading) {
        return <div className="cart-container">Loading cart...</div>;
    }

    return (
        <div className="cart-container">
            <div className="cart-header">
                <button onClick={() => navigate('/home')} className="back-button">← Back to Home</button>
                <h1>Your Cart</h1>
            </div>

            {cartItems.length === 0 ? (
                <div className="empty-cart">
                    <p>Your cart is empty</p>
                    <button onClick={() => navigate('/home')} className="continue-shopping">
                        Continue Shopping
                    </button>
                </div>
            ) : (
                <>
                    <div className="cart-items">
                        {cartItems.map((item, index) => (
                            <div key={index} className="cart-item">
                                <h3>{item.name}</h3>
                                <p>Quantity: {item.quantity}</p>
                            </div>
                        ))}
                    </div>

                    <div className="cart-summary">
                        <h2>Total: ₹{totalPrice}</h2>
                        <button onClick={placeOrder} className="place-order-button">
                            Place Order
                        </button>
                    </div>

                    {showAddressForm && (
                        <div className="address-form-overlay">
                            <div className="address-form">
                                <h3>Delivery Address</h3>
                                <input
                                    type="text"
                                    placeholder="Full Name *"
                                    value={address.name}
                                    onChange={e => handleAddressChange("name", e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Phone Number *"
                                    value={address.phone}
                                    onChange={e => handleAddressChange("phone", e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Pincode *"
                                    value={address.pincode}
                                    onChange={e => handleAddressChange("pincode", e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Area / Street *"
                                    value={address.street}
                                    onChange={e => handleAddressChange("street", e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="City *"
                                    value={address.city}
                                    onChange={e => handleAddressChange("city", e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="State *"
                                    value={address.state}
                                    onChange={e => handleAddressChange("state", e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Landmark (Optional)"
                                    value={address.landmark}
                                    onChange={e => handleAddressChange("landmark", e.target.value)}
                                />
                                <div className="address-form-buttons">
                                    <button onClick={() => setShowAddressForm(false)} className="cancel-button">
                                        Cancel
                                    </button>
                                    <button onClick={confirmOrder} className="confirm-button">
                                        Confirm Order
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