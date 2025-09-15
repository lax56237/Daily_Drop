import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateAcc.css";

function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [enteredOtp, setEnteredOtp] = useState("");
    const [serverOtp, setServerOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [verified, setVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validatePassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        return regex.test(password);
    };

    const sendOtp = async () => {
        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch("http://localhost:5000/user/send-otp-create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            const data = await res.json();
            if (res.ok) {
                setServerOtp(data.otp);
                setOtpSent(true);
                setError("");
            } else {
                setError(data.msg || "Failed to send OTP");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = () => {
        if (!enteredOtp.trim()) {
            setError("Please enter the OTP");
            return;
        }

        if (Number(enteredOtp) === Number(serverOtp)) {
            setVerified(true);
            setError("");
        } else {
            setError("Invalid OTP. Please check and try again.");
        }
    };

    const handleSignup = async () => {
        if (!validatePassword(password)) {
            setError("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch("http://localhost:5000/user/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            if (res.ok) {
                sessionStorage.setItem("email", data.email);
                navigate("/home");
            } else {
                setError(data.msg || "Failed to create account");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = () => {
        setEnteredOtp("");
        setError("");
        sendOtp();
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            if (!otpSent) {
                sendOtp();
            } else if (otpSent && !verified) {
                verifyOtp();
            } else if (verified) {
                handleSignup();
            }
        }
    };

    return (
        <div className="signup-wrapper">
            <div className="signup-container">
                <div className="signup-header">
                    <div className="header-icon">🛍️</div>
                    <h2 className="main-title">Join Daily Drop</h2>
                    <h3 className="sub-title">Create your customer account</h3>
                    <p className="header-description">
                        Start shopping from local businesses today
                    </p>
                </div>

                <div className="progress-bar">
                    <div className={`step ${true ? 'active' : ''}`}>
                        <span className="step-number">1</span>
                        <span className="step-label">Email</span>
                    </div>
                    <div className="step-connector"></div>
                    <div className={`step ${otpSent ? 'active' : ''}`}>
                        <span className="step-number">2</span>
                        <span className="step-label">Verify</span>
                    </div>
                    <div className="step-connector"></div>
                    <div className={`step ${verified ? 'active' : ''}`}>
                        <span className="step-number">3</span>
                        <span className="step-label">Password</span>
                    </div>
                </div>

                <div className="signup-form">
                    {/* Email Step */}
                    {!otpSent && (
                        <div className="form-step active">
                            <div className="input-group">
                                <div className="input-wrapper">
                                    <span className="input-icon">📧</span>
                                    <input
                                        type="email"
                                        placeholder="Enter your email address"
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        disabled={loading}
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
                                        Send Verification Code
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {otpSent && !verified && (
                        <div className="form-step active">
                            <div className="step-info">
                                <p>We've sent a verification code to:</p>
                                <span className="email-display">{email}</span>
                            </div>

                            <div className="input-group">
                                <div className="input-wrapper">
                                    <span className="input-icon">🔢</span>
                                    <input
                                        type="text"
                                        placeholder="Enter 6-digit verification code"
                                        value={enteredOtp}
                                        onChange={e => setEnteredOtp(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        maxLength="6"
                                    />
                                </div>
                            </div>

                            <button
                                className="action-btn primary"
                                onClick={verifyOtp}
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

                    {verified && (
                        <div className="form-step active">
                            <div className="step-info success">
                                <p>✅ Email verified successfully!</p>
                                <span>Create your secure password</span>
                            </div>

                            <div className="input-group">
                                <div className="input-wrapper">
                                    <span className="input-icon">🔒</span>
                                    <input
                                        type="password"
                                        placeholder="Create a strong password"
                                        value={password}
                                        onChange={e => setPassword(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        disabled={loading}
                                    />
                                </div>
                            </div>

                            <div className="password-requirements">
                                <p>Password must include:</p>
                                <ul>
                                    <li className={password.length >= 8 ? 'valid' : ''}>
                                        At least 8 characters
                                    </li>
                                    <li className={/[A-Z]/.test(password) ? 'valid' : ''}>
                                        One uppercase letter
                                    </li>
                                    <li className={/[a-z]/.test(password) ? 'valid' : ''}>
                                        One lowercase letter
                                    </li>
                                    <li className={/\d/.test(password) ? 'valid' : ''}>
                                        One number
                                    </li>
                                    <li className={/[\W_]/.test(password) ? 'valid' : ''}>
                                        One special character
                                    </li>
                                </ul>
                            </div>

                            <button
                                className={`action-btn primary ${loading ? 'loading' : ''}`}
                                onClick={handleSignup}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="loading-spinner"></span>
                                        Creating Account...
                                    </>
                                ) : (
                                    <>
                                        <span className="btn-icon">🎉</span>
                                        Create Account
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {error && (
                        <div className="error-message">
                            <span className="error-icon">⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}
                </div>

                <div className="signup-footer">
                    <p>Already have an account?
                        <button
                            className="link-btn"
                            onClick={() => navigate('/login')}
                        >
                            Sign in here
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Signup;