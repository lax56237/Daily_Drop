import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../style/Products.css';

function Products() {
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const searchName = queryParams.get('name');
    
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showCartPopup, setShowCartPopup] = useState(false);
    const [cart, setCart] = useState([]);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [orderLoading, setOrderLoading] = useState(false);
    const [cartLoading, setCartLoading] = useState(false);
    
    const [address, setAddress] = useState({
        name: "",
        phone: "",
        pincode: "",
        street: "",
        city: "",
        state: "",
        landmark: ""
    });
    
    const userEmail = sessionStorage.getItem("email");
    
    const [position, setPosition] = useState({ x: window.innerWidth - 370, y: 100 });
    const [dragging, setDragging] = useState(false);
    const offset = useRef({ x: 0, y: 0 });
    const popupRef = useRef(null);

    useEffect(() => {
        checkSessionAndFetchProducts();
        loadUserAddress();
    }, [searchName, navigate]);

    const checkSessionAndFetchProducts = async () => {
        try {
            const sessionResponse = await fetch('http://localhost:5000/user/check-session', {
                credentials: 'include'
            });
            const sessionData = await sessionResponse.json();

            if (sessionData.msg === 'Logged in') {
                await fetchProducts();
            } else {
                navigate('/');
            }
        } catch (err) {
            console.error('Session check error:', err);
            setError('Session expired. Please login again.');
            setTimeout(() => navigate('/'), 2000);
        }
    };

    const fetchProducts = async () => {
        if (!searchName) {
            setProducts([]);
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/products/search-full?q=${searchName}`);
            const data = await response.json();
            
            if (response.ok) {
                setProducts(data || []);
            } else {
                setError('Failed to load products');
                setProducts([]);
            }
        } catch (err) {
            setError('Network error. Please try again.');
            setProducts([]);
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

    const fetchCartFromDatabase = async () => {
        setCartLoading(true);
        try {
            const response = await fetch('http://localhost:5000/user/cart', {
                credentials: 'include'
            });
            const data = await response.json();
            
            if (response.ok && data.items) {
                const cartItems = data.items.map(item => {
                    const product = products.find(p => p.name === item.name);
                    return product ? { ...product, quantity: item.quantity } : null;
                }).filter(Boolean);
                setCart(cartItems);
            } else {
                setCart([]);
            }
        } catch (error) {
            console.error('Error fetching cart from database:', error);
            setCart([]);
        } finally {
            setCartLoading(false);
        }
    };

    useEffect(() => {
        if (products.length > 0) {
            fetchCartFromDatabase();
        }
    }, [products]);

    const startDrag = (e) => {
        setDragging(true);
        const clientX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchstart' ? e.touches[0].clientY : e.clientY;
        const rect = popupRef.current.getBoundingClientRect();
        offset.current = {
            x: clientX - rect.left,
            y: clientY - rect.top,
        };
    };

    const stopDrag = () => setDragging(false);

    const onDrag = (e) => {
        if (!dragging) return;
        const clientX = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
        const clientY = e.type === 'touchmove' ? e.touches[0].clientY : e.clientY;
        setPosition({
            x: clientX - offset.current.x,
            y: clientY - offset.current.y,
        });
    };

    useEffect(() => {
        document.addEventListener('mousemove', onDrag);
        document.addEventListener('mouseup', stopDrag);
        document.addEventListener('touchmove', onDrag);
        document.addEventListener('touchend', stopDrag);
        return () => {
            document.removeEventListener('mousemove', onDrag);
            document.removeEventListener('mouseup', stopDrag);
            document.removeEventListener('touchmove', onDrag);
            document.removeEventListener('touchend', stopDrag);
        };
    }, [dragging]);

    const addToCart = async (product) => {
        try {
            const response = await fetch(`http://localhost:5000/user/cart/add`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    email: userEmail,
                    items: [{ name: product.name, quantity: 1 }],
                    totalPrice: product.price
                })
            });

            if (response.ok) {
                await fetchCartFromDatabase();
                setShowCartPopup(true);
            } else {
                setError('Failed to add item to cart');
            }
        } catch (error) {
            setError('Error adding to cart: ' + error.message);
        }
    };

    const updateQuantity = async (id, delta) => {
        const updatedCart = cart
            .map(item =>
                item._id === id ? { ...item, quantity: item.quantity + delta } : item
            )
            .filter(item => item.quantity > 0);
        
        setCart(updatedCart);

        if (updatedCart.length > 0) {
            const total = updatedCart.reduce((sum, item) => sum + item.price * item.quantity, 0);
            try {
                await fetch(`http://localhost:5000/user/cart/add`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        email: userEmail,
                        items: updatedCart.map(c => ({ name: c.name, quantity: c.quantity })),
                        totalPrice: total
                    })
                });
                await fetchCartFromDatabase();
            } catch (error) {
                console.error('Error updating cart in database:', error);
            }
        } else {
            setCart([]);
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

    const handleOrder = () => {
        if (cart.length === 0) {
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
                setCart([]);
                setShowCartPopup(false);
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

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (loading) {
        return (
            <div className="products-container">
                <div className="loading-state">
                    <div className="loading-spinner"></div>
                    <p>Loading products...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="products-container">
            <div className="products-header">
                <button onClick={() => navigate('/home')} className="back-button">
                    <span className="btn-icon">←</span>
                    Back to Shop
                </button>
                <div className="header-content">
                    <h1 className="page-title">Search Results</h1>
                    <p className="search-info">
                        {searchName ? `Results for "${searchName}" (${products.length} found)` : 'No search query'}
                    </p>
                </div>
                <button 
                    className="cart-button"
                    onClick={() => {
                        fetchCartFromDatabase();
                        setShowCartPopup(true);
                    }}
                >
                    <span className="btn-icon">🛒</span>
                    Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                </button>
            </div>

            {error && (
                <div className="error-message">
                    <span className="error-icon">⚠️</span>
                    <span>{error}</span>
                </div>
            )}

            {products.length === 0 ? (
                <div className="empty-products">
                    <div className="empty-icon">🔍</div>
                    <h2>No products found</h2>
                    <p>{searchName ? `No results for "${searchName}"` : 'Try searching for something specific'}</p>
                    <button onClick={() => navigate('/home')} className="continue-shopping">
                        <span className="btn-icon">🛍️</span>
                        Browse All Products
                    </button>
                </div>
            ) : (
                <div className="products-content">
                    <div className="product-grid">
                        {products.map((product, index) => (
                            <div className="product-card" key={index}>
                                <div className="product-image-container">
                                    <img src={product.imageUrl} className="product-image" alt={product.name} />
                                </div>
                                <div className="product-info">
                                    <h3 className="product-name">{product.name}</h3>
                                    {product.description && (
                                        <p className="product-description">{product.description}</p>
                                    )}
                                    <div className="product-details">
                                        <div className="product-weight">
                                            <span className="detail-icon">⚖️</span>
                                            <span>{product.weight}</span>
                                        </div>
                                        <div className="product-price">
                                            <span className="price">₹{product.price}</span>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    className="add-to-cart-btn"
                                    onClick={() => addToCart(product)}
                                >
                                    <span className="btn-icon">🛒</span>
                                    Add to Cart
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {showCartPopup && (
                <div
                    className="cart-popup"
                    style={{ top: position.y, left: position.x }}
                    ref={popupRef}
                >
                    <div
                        className="cart-drag-handle"
                        onMouseDown={startDrag}
                        onTouchStart={startDrag}
                    >
                        <div className="drag-indicator"></div>
                        <span className="drag-text">Drag to move</span>
                    </div>
                    
                    <div className="cart-popup-content">
                        <div className="cart-header">
                            <h3 className="cart-title">
                                <span className="cart-icon">🛒</span>
                                Your Cart
                            </h3>
                            <button 
                                className="close-cart-btn"
                                onClick={() => setShowCartPopup(false)}
                            >
                                ×
                            </button>
                        </div>

                        {cartLoading ? (
                            <div className="cart-loading">
                                <div className="loading-spinner-small"></div>
                                <p>Loading cart...</p>
                            </div>
                        ) : cart.length === 0 ? (
                            <div className="empty-cart-popup">
                                <div className="empty-cart-icon">🛒</div>
                                <p>Your cart is empty</p>
                            </div>
                        ) : (
                            <>
                                <div className="cart-items">
                                    {cart.map(item => (
                                        <div key={item._id} className="cart-item">
                                            <img src={item.imageUrl} className="cart-item-image" alt={item.name} />
                                            <div className="cart-item-details">
                                                <h4 className="cart-item-name">{item.name}</h4>
                                                <p className="cart-item-price">₹{item.price} × {item.quantity}</p>
                                                <div className="quantity-controls">
                                                    <button 
                                                        className="quantity-btn decrease"
                                                        onClick={() => updateQuantity(item._id, -1)}
                                                    >
                                                        −
                                                    </button>
                                                    <span className="quantity-display">{item.quantity}</span>
                                                    <button 
                                                        className="quantity-btn increase"
                                                        onClick={() => updateQuantity(item._id, 1)}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="cart-summary">
                                    <div className="cart-total">
                                        <span className="total-label">Total Amount:</span>
                                        <span className="total-price">₹{total}</span>
                                    </div>
                                    <button className="place-order-btn" onClick={handleOrder}>
                                        <span className="btn-icon">🚀</span>
                                        Place Order
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}

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
        </div>
    );
}

export default Products;