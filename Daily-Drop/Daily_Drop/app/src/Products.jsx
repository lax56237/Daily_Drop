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
        fetch("http://localhost:5000/products/mine", { credentials: 'include' })
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(() => setProducts([]));
    }, []);

    const handleAdd = async () => {
        await fetch("http://localhost:5000/products/add", {
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

        const res = await fetch("http://localhost:5000/products/mine", { credentials: 'include' });
        const data = await res.json();
        setProducts(data);
    };

    return (
        <div className="products-page">
            <h2>Your Products</h2>
            {products.length === 0 ? (
                <p className="empty">Empty Inventory</p>
            ) : (
                    products.map((p) => (
                        <li key={p._id}>
                            {p.imageUrl && (
                                <img
                                    src={p.imageUrl}
                                    alt="product"
                                    style={{ width: "200px", height: "200px", objectFit: "cover" }}
                                />
                            )}
                            <div>{p.name} - {p.category} - ₹{p.price}</div>
                        </li>
                    ))
            )}

            <button className="add-btn" onClick={() => setShowForm(true)}>+</button>

            {showForm && (
                <div className="popup-form">
                    <div className="form-content">
                        <h3>Add Product</h3>
                        <input placeholder="Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                        <input placeholder="Category" value={formData.category} onChange={e => setFormData({ ...formData, category: e.target.value })} />
                        <input placeholder="Weight" value={formData.weight} onChange={e => setFormData({ ...formData, weight: e.target.value })} />
                        <input placeholder="Price" type="number" value={formData.price} onChange={e => setFormData({ ...formData, price: e.target.value })} />
                        <input placeholder="Quantity" type="number" value={formData.quantity} onChange={e => setFormData({ ...formData, quantity: e.target.value })} />
                        <textarea placeholder="Description (optional)" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} />
                        <input
                            placeholder="Image URL"
                            value={formData.imageUrl}
                            onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                        />
                        <button onClick={handleAdd}>Add Product</button>
                        <button onClick={() => setShowForm(false)}>Cancel</button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Products;