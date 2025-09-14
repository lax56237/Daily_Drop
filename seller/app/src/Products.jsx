import React, { useEffect, useState } from 'react';
import './Products.css';

function Products() {
    const [products, setProducts] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        weight: '',
        price: '',
        quantity: '',
        description: '',
        imageUrl: '',
    });

    useEffect(() => {
        fetch(`http://localhost:5000/products/mine`, { credentials: 'include' })
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(() => setProducts([]));
    }, []);

    const handleAdd = async () => {
        await fetch(`http://localhost:5000/products/add`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(formData)
        });

        setShowForm(false);
        setFormData({
            name: '',
            category: '',
            weight: '',
            price: '',
            quantity: '',
            description: '',
            imageUrl: ''
        });

        const res = await fetch(`http://localhost:5000/products/mine`, { credentials: 'include' });
        const data = await res.json();
        setProducts(data);
    };

    return (
        <div className="products-page">
            {/* Header */}
            <header className="page-header">
                <div className="header-content">
                    <h1>Your Products</h1>
                    <p>Manage your inventory</p>
                </div>
            </header>

            {/* Main Content */}
            <main className="main-content">
                {products.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">📦</div>
                        <h3>No Products Yet</h3>
                        <p>Start by adding your first product</p>
                        <button
                            className="empty-add-btn"
                            onClick={() => setShowForm(true)}
                        >
                            Add First Product
                        </button>
                    </div>
                ) : (
                    <div className="products-grid">
                        {products.map((product) => (
                            <div key={product._id} className="product-card">
                                {product.imageUrl && (
                                    <div className="product-image">
                                        <img src={product.imageUrl} alt={product.name} />
                                    </div>
                                )}
                                <div className="product-info">
                                    <h3>{product.name}</h3>
                                    <span className="category">{product.category}</span>
                                    <div className="product-meta">
                                        <span className="price">₹{product.price}</span>
                                        {product.weight && <span className="weight">{product.weight}</span>}
                                        <span className="quantity">Qty: {product.quantity}</span>
                                    </div>
                                    {product.description && (
                                        <p className="description">{product.description}</p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Floating Add Button */}
            {products.length > 0 && (
                <button
                    className="fab"
                    onClick={() => setShowForm(true)}
                >
                    +
                </button>
            )}

            {/* Popup Form */}
            {showForm && (
                <div className="modal-overlay" onClick={() => setShowForm(false)}>
                    <div className="modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>Add New Product</h2>
                            <button className="close-btn" onClick={() => setShowForm(false)}>
                                ×
                            </button>
                        </div>

                        <div className="modal-body">
                            <div className="input-group">
                                <label>Product Name</label>
                                <input
                                    type="text"
                                    placeholder="Enter product name"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="input-group">
                                <label>Category</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Electronics, Food, Clothing"
                                    value={formData.category}
                                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                                />
                            </div>

                            <div className="input-row">
                                <div className="input-group">
                                    <label>Weight</label>
                                    <input
                                        type="text"
                                        placeholder="1kg, 500g, etc."
                                        value={formData.weight}
                                        onChange={e => setFormData({ ...formData, weight: e.target.value })}
                                    />
                                </div>
                                <div className="input-group">
                                    <label>Price (₹)</label>
                                    <input
                                        type="number"
                                        placeholder="0"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Quantity</label>
                                <input
                                    type="number"
                                    placeholder="Available quantity"
                                    value={formData.quantity}
                                    onChange={e => setFormData({ ...formData, quantity: e.target.value })}
                                />
                            </div>

                            <div className="input-group">
                                <label>Description (Optional)</label>
                                <textarea
                                    placeholder="Product description..."
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                />
                            </div>

                            <div className="input-group">
                                <label>Image URL (Optional)</label>
                                <input
                                    type="url"
                                    placeholder="https://example.com/image.jpg"
                                    value={formData.imageUrl}
                                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="btn-cancel" onClick={() => setShowForm(false)}>
                                Cancel
                            </button>
                            <button className="btn-add" onClick={handleAdd}>
                                Add Product
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Products;