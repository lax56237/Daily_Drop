import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Verification.css';

const Verification = () => {
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleVerify = async () => {
        if (!phone.trim()) {
            setError('Please enter a phone number');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch(`http://localhost:5000/seller/verify-delivery`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ phone })
            });

            const data = await res.json();
            if (data.success) {
                navigate('/seller');
            } else {
                setError(data.message || 'Verification failed');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleVerify();
        }
    };

    return (
        <div className="verification-page">
            <div className="verification-container">
                <div className="verification-header">
                    <div className="header-icon">🚚</div>
                    <h2>Verify Delivery Partner</h2>
                    <p className="header-subtitle">Enter the delivery partner's phone number to verify their credentials</p>
                </div>

                <div className="verification-form">
                    <div className="form-group">
                        <label htmlFor="phone">Delivery Partner Phone Number</label>
                        <div className="input-wrapper">
                            <span className="input-icon">📱</span>
                            <input
                                id="phone"
                                type="tel"
                                placeholder="Enter phone number (e.g., +91 9876543210)"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="error-message">
                            <span className="error-icon">⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <button 
                        className={`verify-btn ${loading ? 'loading' : ''}`}
                        onClick={handleVerify}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="loading-spinner"></span>
                                Verifying...
                            </>
                        ) : (
                            <>
                                <span className="btn-icon">✓</span>
                                Verify Partner
                            </>
                        )}
                    </button>
                </div>

                <div className="info-section">
                    <div className="info-card">
                        <h3>Why Verify?</h3>
                        <ul>
                            <li>Ensures reliable delivery service</li>
                            <li>Maintains quality standards</li>
                            <li>Builds customer trust</li>
                            <li>Tracks delivery performance</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Verification;