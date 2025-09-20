import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../style/CreateAcc.css';

function CreateAcc() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [enteredOtp, setEnteredOtp] = useState('');
    const [serverOtp, setServerOtp] = useState('');
    const [verified, setVerified] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
        setError('');

        try {
            const res = await fetch(`http://localhost:5000/user/send-otp-create`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });

            const data = await res.json();
            if (res.ok) {
                console.log(data.otp);
                setServerOtp(data.otp);
                setOtpSent(true);
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
            setError('');
        } else {
            setError("Invalid OTP. Please check and try again.");
        }
    };

    const handleCreateAccount = async () => {
        if (!validatePassword(password)) {
            setError("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
            return;
        }

        setLoading(true);
        setError('');

        try {
            const res = await fetch(`http://localhost:5000/seller/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ username: email, password })
            });

            const data = await res.json();
            if (res.ok) {
                localStorage.setItem("sellerId", data._id);
                navigate("/CreateSeller");
            } else {
                setError(data.msg || "Failed to create account");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            if (!otpSent) {
                sendOtp();
            } else if (otpSent && !verified) {
                verifyOtp();
            } else if (verified) {
                handleCreateAccount();
            }
        }
    };

    return (
        <div className="create-account-container">
            <div className="create-account-box">
                <div className="account-header">
                    <div className="header-icon">🚀</div>
                    <h1 className="main-title">Join Daily Drop</h1>
                    <h2 className="sub-title">Create Your Seller Account</h2>
                    <p className="header-description">Start your journey as a seller today</p>
                </div>

                <div className="progress-bar">
                    <div className={`step ${true ? 'active' : ''}`}>
                        <span className="step-number">1</span>
                        <span className="step-label">Email</span>
                    </div>
                    <div className={`step ${otpSent ? 'active' : ''}`}>
                        <span className="step-number">2</span>
                        <span className="step-label">Verify</span>
                    </div>
                    <div className={`step ${verified ? 'active' : ''}`}>
                        <span className="step-number">3</span>
                        <span className="step-label">Password</span>
                    </div>
                </div>

                <div className="account-form">
                    <div className={`form-step ${!otpSent ? 'active' : 'completed'}`}>
                        <div className="input-group">
                            <div className="input-wrapper">
                                <input
                                    type="email"
                                    placeholder="Enter your email address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    disabled={otpSent || loading}
                                />
                            </div>
                        </div>

                        {!otpSent && (
                            <button
                                type="button"
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
                                        Send OTP
                                    </>
                                )}
                            </button>
                        )}
                    </div>

                    {otpSent && !verified && (
                        <div className="form-step active">
                            <div className="step-info">
                                <p>We've sent a verification code to your email</p>
                                <span className="email-display">{email}</span>
                            </div>

                            <div className="input-group">
                                <div className="input-wrapper">
                                    <input
                                        type="text"
                                        placeholder="Enter 6-digit OTP"
                                        value={enteredOtp}
                                        onChange={(e) => setEnteredOtp(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        maxLength="6"
                                    />
                                </div>
                            </div>

                            <button
                                type="button"
                                className="action-btn primary"
                                onClick={verifyOtp}
                            >
                                <span className="btn-icon">✅</span>
                                Verify OTP
                            </button>
                        </div>
                    )}

                    {verified && (
                        <div className="form-step active">
                            <div className="step-info success">
                                <p>✅ Email verified successfully!</p>
                                <span>Now set your secure password</span>
                            </div>

                            <div className="input-group">
                                <div className="input-wrapper">
                                    <input
                                        type="password"
                                        placeholder="Create a strong password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                    />
                                </div>
                            </div>

                            <div className="password-requirements">
                                <p>Password must include:</p>
                                <ul>
                                    <li>At least 8 characters</li>
                                    <li>Uppercase & lowercase letters</li>
                                    <li>Numbers and special characters</li>
                                </ul>
                            </div>

                            <button
                                type="button"
                                className={`action-btn primary ${loading ? 'loading' : ''}`}
                                onClick={handleCreateAccount}
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

                <div className="account-footer">
                    <p>Already have an account?
                        <button
                            className="link-btn"
                            onClick={() => navigate('/')}
                        >
                            Sign in here
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default CreateAcc;