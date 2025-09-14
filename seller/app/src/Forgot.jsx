import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import './Forgot.css';

function Forgot() {
    const [email, setEmail] = useState("");
    const [actualOtp, setActualOtp] = useState(null);
    const [userOtp, setUserOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleEmailSubmit = async () => {
        if (!email.trim()) {
            setError("Please enter your email address");
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch("http://localhost:5000/otp/method", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ name: email })
            });

            const data = await response.json();

            if (response.ok) {
                console.log(data.message);
                setActualOtp(data.otp);
                setOtpSent(true);
                setError("");
            } else {
                setError(data.message || "Failed to send OTP");
            }
        } catch (err) {
            console.error("API call failed:", err);
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleOtpSubmit = () => {
        if (!userOtp.trim()) {
            setError("Please enter the OTP");
            return;
        }

        if (userOtp === String(actualOtp)) {
            navigate("/ChangePass");
        } else {
            setError("Invalid OTP. Please check and try again.");
        }
    };

    const handleResendOtp = () => {
        setUserOtp("");
        setError("");
        handleEmailSubmit();
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            if (!otpSent) {
                handleEmailSubmit();
            } else {
                handleOtpSubmit();
            }
        }
    };

    useEffect(() => {
        if (actualOtp) {
            console.log("Latest OTP:", actualOtp);
        }
    }, [actualOtp]);

    return (
        <div className="forgot-container">
            <div className="forgot-box">
                <div className="forgot-header">
                    <div className="header-icon">🔐</div>
                    <h1 className="main-title">Forgot Password?</h1>
                    <p className="header-description">
                        {!otpSent
                            ? "Enter your email to receive a password reset code"
                            : "Enter the verification code sent to your email"
                        }
                    </p>
                </div>

                <div className="progress-indicator">
                    <div className={`step ${true ? 'active' : ''}`}>
                        <span className="step-number">1</span>
                        <span className="step-label">Email</span>
                    </div>
                    <div className="step-connector"></div>
                    <div className={`step ${otpSent ? 'active' : ''}`}>
                        <span className="step-number">2</span>
                        <span className="step-label">Verify</span>
                    </div>
                </div>

                <div className="forgot-form">
                    {!otpSent ? (
                        <div className="form-step active">
                            <div className="input-group">
                                <div className="input-wrapper">
                                    <input
                                        type="email"
                                        placeholder="Enter your email address"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <button
                                className={`action-btn primary ${loading ? 'loading' : ''}`}
                                onClick={handleEmailSubmit}
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
                                        Send Reset Code
                                    </>
                                )}
                            </button>
                        </div>
                    ) : (
                        <div className="form-step active">
                            <div className="step-info">
                                <p>We've sent a verification code to:</p>
                                <span className="email-display">{email}</span>
                            </div>

                            <div className="input-group">
                                <div className="input-wrapper">
                                    <input
                                        type="text"
                                        placeholder="Enter 6-digit verification code"
                                        value={userOtp}
                                        onChange={(e) => setUserOtp(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        maxLength="6"
                                    />
                                </div>
                            </div>

                            <button
                                className="action-btn primary"
                                onClick={handleOtpSubmit}
                            >
                                <span className="btn-icon">✅</span>
                                Verify Code
                            </button>

                            <div className="resend-section">
                                <p>Didn't receive the code?</p>
                                <button
                                    className="resend-btn"
                                    onClick={handleResendOtp}
                                    disabled={loading}
                                >
                                    Resend Code
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

                <div className="forgot-footer">
                    <p>Remember your password?
                        <button
                            className="link-btn"
                            onClick={() => navigate('/')}
                        >
                            Back to Login
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Forgot;