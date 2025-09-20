import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../style/Login.css";

function Login() {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        setError(''); 
    };

    const handleLogin = async () => {
        const { email, password } = formData;

        if (!email || !password) {
            setError("Please enter both email and password");
            return;
        }

        if (!validateEmail(email)) {
            setError("Please enter a valid email address");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch("http://localhost:5000/user/login", {
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
        <div className="login-wrapper">
            <div className="login-container">
                <div className="login-header">
                    <div className="header-icon">🛒</div>
                    <h2 className="main-title">Welcome Back</h2>
                    <p className="header-description">Sign in to your Daily Drop account</p>
                </div>

                <div className="login-form">
                    <div className="input-group">
                        <div className="input-wrapper">
                            <input
                                type="email"
                                placeholder="Enter your email address"
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <div className="input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={loading}
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={togglePasswordVisibility}
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
                        className={`login-btn ${loading ? 'loading' : ''}`}
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
                                <span className="btn-icon">🚀</span>
                                Sign In
                            </>
                        )}
                    </button>
                </div>

                <div className="login-actions">
                    <div className="forgot-link">
                        <button 
                            className="link-btn"
                            onClick={() => navigate("/forgot")}
                            disabled={loading}
                        >
                            Forgot Password?
                        </button>
                    </div>

                    <div className="create-account-section">
                        <p>Don't have an account?</p>
                        <button 
                            className="create-account-btn"
                            onClick={() => navigate("/create")}
                            disabled={loading}
                        >
                            <span className="btn-icon">👤</span>
                            Create Account
                        </button>
                    </div>
                </div>

                <div className="login-footer">
                    <div className="app-features">
                        <h4>Why choose Daily Drop?</h4>
                        <ul>
                            <li>🛍️ Wide variety of local products</li>
                            <li>🚚 Fast delivery service</li>
                            <li>💰 Best prices guaranteed</li>
                            <li>🏪 Support local businesses</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;