import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
    const navigate = useNavigate();
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validatePassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        return regex.test(password);
    };

    const handleSignIn = async () => {
        if (!email || !password) {
            setError("Both email and password are required.");
            return;
        }

        if (!validateEmail(email)) {
            setError("Invalid email format.");
            return;
        }

        if (!validatePassword(password)) {
            setError("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
            return;
        }
        
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`http://localhost:5000/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            
            if (data.success) {
                navigate("/Seller");
            } else {
                setError(data.message || "Login failed");
                navigate("/");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Something went wrong during login");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSignIn();
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="login-header">
                    <div className="header-icon">🏪</div>
                    <h1 className="welcome-title">Welcome to Daily Drop</h1>
                    <h2 className="login-subtitle">Seller Login Portal</h2>
                </div>

                <div className="login-form">
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

                    <div className="input-group">
                        <div className="input-wrapper">
                            <input
                                type="password"
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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
                        className={`login-btn ${loading ? 'loading' : ''}`}
                        onClick={handleSignIn}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="loading-spinner"></span>
                                Signing in...
                            </>
                        ) : (
                            <>
                                <span className="btn-icon">🚀</span>
                                Sign In
                            </>
                        )}
                    </button>
                </div>

                <div className="login-actions">
                    <button 
                        className="action-btn create-account"
                        onClick={() => navigate("/CreateAcc")}
                        disabled={loading}
                    >
                        <span className="btn-icon">👤</span>
                        Create New Account
                    </button>
                    
                    <button 
                        className="action-btn forgot-password"
                        onClick={() => navigate("/Forgot")}
                        disabled={loading}
                    >
                        <span className="btn-icon">🔑</span>
                        Forgot Password?
                    </button>
                </div>

                <div className="login-footer">
                    <p>Join thousands of sellers growing their business with Daily Drop</p>
                </div>
            </div>
        </div>
    );
}

export default Login;