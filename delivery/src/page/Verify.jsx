import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../style/Verify.css"

function Verify() {
    const [email, setEmail] = useState('');
    const [showOtp, setShowOtp] = useState(false);
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const sendOtp = async () => {
        if (!email.trim()) {
            setError('Please enter your email address');
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email address');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5000/delivery/send-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email })
            });

            const data = await response.json();
            
            if (response.ok && data) {
                setShowOtp(true);
                setError('');
            } else {
                setError(data.msg || 'Failed to send OTP');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async () => {
        if (!otp.trim()) {
            setError('Please enter the OTP');
            return;
        }

        if (otp.length !== 4) {
            setError('OTP must be 4 digits');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('http://localhost:5000/delivery/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ enteredOtp: otp })
            });

            const data = await response.json();
            
            if (data.success) {
                await fetch('http://localhost:5000/delivery/success_delivery', {
                    method: 'POST',
                    credentials: 'include'
                });
                navigate('/home');
            } else {
                setError(data.msg || 'Invalid OTP. Please try again.');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            if (!showOtp) {
                sendOtp();
            } else {
                verifyOtp();
            }
        }
    };

    const resendOtp = () => {
        setOtp('');
        setError('');
        sendOtp();
    };

    return (
        <div className="verify-wrapper">
            <div className="verify-container">
                <div className="verify-header">
                    <div className="header-icon">🔐</div>
                    <h2 className="main-title">Verify Delivery</h2>
                    <p className="header-description">
                        Confirm delivery completion with OTP verification
                    </p>
                </div>

                <div className="progress-indicator">
                    <div className={`step ${true ? 'active' : ''}`}>
                        <span className="step-number">1</span>
                        <span className="step-label">Email</span>
                    </div>
                    <div className="step-connector"></div>
                    <div className={`step ${showOtp ? 'active' : ''}`}>
                        <span className="step-number">2</span>
                        <span className="step-label">Verify</span>
                    </div>
                </div>

                <div className="verify-form">
                    {!showOtp ? (
                        <div className="form-step active">
                            <div className="input-group">
                                <label>Customer Email Address</label>
                                <div className="input-wrapper">
                                    <span className="input-icon">📧</span>
                                    <input
                                        type="email"
                                        placeholder="Enter customer's email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        disabled={loading}
                                        className="verify-input"
                                    />
                                </div>
                            </div>

                            <button
                                className={`action-btn primary ${loading ? 'loading' : ''}`}
                                onClick={sendOtp}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="loading-spinner"></span>
                                        Sending OTP...
                                    </>
                                ) : (
                                    <>
                                        <span className="btn-icon">📤</span>
                                        Send OTP to Customer
                                    </>
                                )}
                            </button>
                        </div>
                    ) : (
                        <div className="form-step active">
                            <div className="step-info">
                                <p>OTP sent to customer at:</p>
                                <span className="email-display">{email}</span>
                                <span className="info-text">Ask customer to provide the 4-digit code</span>
                            </div>

                            <div className="input-group">
                                <label>Enter OTP from Customer</label>
                                <div className="input-wrapper">
                                    <span className="input-icon">🔢</span>
                                    <input
                                        type="text"
                                        placeholder="Enter 4-digit OTP"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 4))}
                                        onKeyPress={handleKeyPress}
                                        disabled={loading}
                                        className="verify-input otp-input"
                                        maxLength="4"
                                    />
                                </div>
                            </div>

                            <button
                                className={`action-btn primary ${loading ? 'loading' : ''}`}
                                onClick={verifyOtp}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="loading-spinner"></span>
                                        Verifying...
                                    </>
                                ) : (
                                    <>
                                        <span className="btn-icon">✅</span>
                                        Complete Delivery
                                    </>
                                )}
                            </button>

                            <div className="resend-section">
                                <p>Customer didn't receive the OTP?</p>
                                <button
                                    className="resend-btn"
                                    onClick={resendOtp}
                                    disabled={loading}
                                >
                                    Resend OTP
                                </button>
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="error-message">
                            <span className="error-icon">⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}
                </div>

                <div className="verify-footer">
                    <p>Need help?</p>
                    <button
                        className="help-btn"
                        onClick={() => navigate('/home')}
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Verify;