import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Seller.css';

function Seller() {
    const navigate = useNavigate();
    const [details, setDetails] = useState(null);

    useEffect(() => {
        fetch("http://localhost:5000/seller/details", {
            method: "GET",
            credentials: "include"
        })
            .then(res => {
                if (!res.ok) throw new Error("Not Authenticated");
                return res.json();
            })
            .then(data => setDetails(data.details))
            .catch(() => navigate("/"));
    }, [navigate]);

    return (
        <div className="seller-dashboard">
            <header className="top-bar">
                <div className="container">
                    <h1 className="logo">Seller Dashboard</h1>
                    <button
                        className="edit-profile-btn"
                        onClick={() => navigate("/EditProfile")}
                    >
                        Edit Profile
                    </button>
                </div>
            </header>

            <main className="main-content">
                <div className="container">
                    <section className="welcome-section">
                        <h2 className="welcome-title">Welcome to Your Shop</h2>
                        <p className="welcome-subtitle">Manage your business efficiently</p>
                    </section>

                    <section className="actions-section">
                        <div className="action-grid">
                            <div className="action-card" onClick={() => navigate("/Products")}>
                                <div className="card-icon">📦</div>
                                <h3>Products</h3>
                                <p>Manage inventory</p>
                            </div>

                            <div className="action-card" onClick={() => navigate("/orders")}>
                                <div className="card-icon">📋</div>
                                <h3>Orders</h3>
                                <p>View & track orders</p>
                            </div>

                            <div className="action-card" onClick={() => navigate("/verification")}>
                                <div className="card-icon">✓</div>
                                <h3>Verification</h3>
                                <p>Complete verification</p>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default Seller;