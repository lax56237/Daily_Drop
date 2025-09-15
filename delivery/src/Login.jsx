import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (field, value) => {
        if (field === 'name') setName(value);
        else setPassword(value);
        setError(''); // Clear error when user starts typing
    };

    const handleLogin = async () => {
        // Validation
        if (!name.trim() || !password.trim()) {
            setError("Please enter both name and password");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch('http://localhost:5000/delivery/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ name: name.trim(), password })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                navigate('/home');
            } else {
                setError(data.msg || "Login failed. Please check your credentials.");
            }
        } catch (err) {
            console.error("Login error:", err);
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleLogin();
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="delivery-login-wrapper">
            <div className="delivery-login-container">
                <div className="delivery-login-header">
                    <div className="header-icon">🚚</div>
                    <h2 className="main-title">Delivery Portal</h2>
                    <p className="header-description">Sign in to your delivery account</p>
                </div>

                <div className="delivery-login-form">
                    <div className="input-group">
                        <label htmlFor="name">Delivery Partner Name</label>
                        <div className="input-wrapper">
                            <span className="input-icon">👤</span>
                            <input
                                id="name"
                                type="text"
                                placeholder="Enter your name"
                                value={name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-wrapper">
                            <span className="input-icon">🔒</span>
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={loading}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={togglePasswordVisibility}
                                disabled={loading}
                            >
                                {showPassword ? '👁️' : '👁️‍🗨️'}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="error-message">
                            <span className="error-icon">⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <button 
                        className={`delivery-login-btn ${loading ? 'loading' : ''}`}
                        onClick={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="loading-spinner"></span>
                                Signing in...
                            </>
                        ) : (
                            <>
                                <span className="btn-icon">🚚</span>
                                Sign In
                            </>
                        )}
                    </button>

                    <div className="delivery-actions">
                        <div className="create-account-section">
                            <p>Don't have a delivery account?</p>
                            <button 
                                className="create-account-btn"
                                onClick={() => navigate('/CreateAcc')}
                                disabled={loading}
                            >
                                <span className="btn-icon">📝</span>
                                Create Account
                            </button>
                        </div>
                    </div>
                </div>

                <div className="delivery-login-footer">
                    <div className="delivery-info">
                        <h4>Join our delivery network</h4>
                        <ul>
                            <li>🚚 Flexible working hours</li>
                            <li>💰 Competitive earnings</li>
                            <li>📱 Easy-to-use delivery app</li>
                            <li>🤝 Support local businesses</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;