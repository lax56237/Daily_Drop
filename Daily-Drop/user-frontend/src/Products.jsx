import React, { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import './Products.css';
import { useNavigate } from 'react-router-dom';

function Products() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const searchName = queryParams.get('name');
    const [products, setProducts] = useState([]);
    const [showCartPopup, setShowCartPopup] = useState(false);
    const [cart, setCart] = useState([]);
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
    const userEmail = sessionStorage.getItem("email");
    const navigate = useNavigate();

    const [position, setPosition] = useState({ x: 1000, y: 100 });
    const [dragging, setDragging] = useState(false);
    const offset = useRef({ x: 0, y: 0 });
    const popupRef = useRef(null);

    useEffect(() => {
        if (searchName) {
            fetch(`http://localhost:5000/products/search-full?q=${searchName}`)
                .then(res => res.json())
                .then(data => setProducts(data))
                .catch(() => setProducts([]));
        }

    }, [searchName]);

    // Function to fetch cart from database
    const fetchCartFromDatabase = async () => {
        try {
            const response = await fetch('http://localhost:5000/user/cart', {
                credentials: 'include'
            });
            const data = await response.json();
            
            if (response.ok && data.items) {
                // Convert database cart items to match local cart format
                const cartItems = data.items.map(item => {
                    // Find the product details for this item
                    const product = products.find(p => p.name === item.name);
                    return product ? { ...product, quantity: item.quantity } : null;
                }).filter(Boolean);
                setCart(cartItems);
                console.log('Cart loaded from database:', cartItems);
            } else {
                setCart([]);
                console.log('No items in cart or error loading cart');
            }
        } catch (error) {
            console.error('Error fetching cart from database:', error);
            setCart([]);
        }
    };

    // Load cart from database when products are loaded
    useEffect(() => {
        if (products.length > 0) {
            fetchCartFromDatabase();
        }
    }, [products]);

    // Load existing address when component mounts
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
            // Immediately save to database when add to cart is clicked
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
                // Refresh cart from database to show complete cart
                await fetchCartFromDatabase();
                setShowCartPopup(true);
            } else {
                console.error('Failed to add item to cart');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    const updateQuantity = async (id, delta) => {
        const updatedCart = cart
            .map(item =>
                item._id === id ? { ...item, quantity: item.quantity + delta } : item
            )
            .filter(item => item.quantity > 0);
        
        setCart(updatedCart);

        // Update database cart
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
                // Refresh cart from database to ensure consistency
                await fetchCartFromDatabase();
            } catch (error) {
                console.error('Error updating cart in database:', error);
            }
        } else {
            // If cart is empty, clear it
            setCart([]);
        }
    };

    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const handleAddressChange = (field, value) => {
        setAddress(prev => ({ ...prev, [field]: value }));
    };

    const handleOrder = async () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }

        // Always show address form first
        setShowAddressForm(true);
    };

    const confirmOrder = async () => {
        // Check if all required address fields are filled
        if (!address.name || !address.phone || !address.pincode || !address.street || !address.city || !address.state) {
            alert('Please fill all required address fields');
            return;
        }

        try {
            console.log('Attempting to place order from Products page...');
            
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
                setCart([]);
                setShowCartPopup(false);
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


    return (
        <>
            <div className="products-header">
                <button onClick={() => navigate('/home')} className="back-button">← Back to Home</button>
                <button onClick={() => {
                    fetchCartFromDatabase();
                    setShowCartPopup(true);
                }}>View Cart</button>
            </div>
            <div className="product-grid">
                {products.map((p, i) => (
                    <div className="product-card" key={i}>
                        <img src={p.imageUrl} className="product-img" alt={p.name} />
                        <h3>{p.name}</h3>
                        <p>{p.description || ""}</p>
                        <p><strong>Weight:</strong> {p.weight}</p>
                        <p><strong>Price:</strong> ₹{p.price}</p>
                        <button onClick={() => addToCart(p)}>Add to Cart</button>
                    </div>
                ))}

                {showCartPopup && (
                    <div
                        className="cart-popup"
                        style={{ top: position.y, left: position.x }}
                        ref={popupRef}
                    >
                        <div
                            className="cart-drag-bar"
                            onMouseDown={startDrag}
                            onTouchStart={startDrag}
                        ></div>
                        <div className="cart-popup-content">
                            <h2>Cart</h2>
                            {cart.length === 0 ? (
                                <p>Cart is empty</p>
                            ) : (
                                <>
                                    {cart.map(item => (
                                        <div key={item._id} className="cart-item">
                                            <img src={item.imageUrl} className="cart-img" alt={item.name} />
                                            <div className="cart-details">
                                                <h4>{item.name}</h4>
                                                <p>₹{item.price} × {item.quantity}</p>
                                                <div>
                                                    <button onClick={() => updateQuantity(item._id, -1)}>-</button>
                                                    <span style={{ margin: '0 8px' }}>{item.quantity}</span>
                                                    <button onClick={() => updateQuantity(item._id, 1)}>+</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                    <hr />
                                    <h3>Total: ₹{total}</h3>
                                    <button className="order-btn" onClick={handleOrder}>Order</button>
                                </>
                            )}
                            <button onClick={() => setShowCartPopup(false)}>Close</button>
                        </div>
                    </div>
                )}

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
            </div>
        </>

    );
}

export default Products;
