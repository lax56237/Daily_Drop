import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./CreateAcc.css";

function CreateAcc() {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const validateInputs = () => {
        if (!name.trim()) {
            setError("Please enter your full name");
            return false;
        }

        if (!phone.trim()) {
            setError("Please enter your phone number");
            return false;
        }

        if (phone.length < 10) {
            setError("Please enter a valid 10-digit phone number");
            return false;
        }

        if (!password.trim()) {
            setError("Please enter a password");
            return false;
        }

        if (password.length < 6) {
            setError("Password must be at least 6 characters long");
            return false;
        }

        return true;
    };

    const handleInputChange = (field, value) => {
        if (field === 'name') setName(value);
        else if (field === 'phone') {
            // Only allow numeric input for phone
            if (value === '' || /^\d{0,10}$/.test(value)) {
                setPhone(value);
            }
        } else if (field === 'password') setPassword(value);
        
        setError(''); // Clear error when user starts typing
    };

    const handleSignup = async () => {
        if (!validateInputs()) return;

        setLoading(true);
        setError("");

        try {
            const response = await fetch('http://localhost:5000/delivery/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ 
                    name: name.trim(), 
                    password, 
                    phone: phone.trim() 
                })
            });
            
            const data = await response.json();
            
            if (response.ok) {
                navigate('/home');
            } else {
                setError(data.msg || "Failed to create account. Please try again.");
            }
        } catch (err) {
            console.error("Signup error:", err);
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSignup();
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="delivery-signup-wrapper">
            <div className="delivery-signup-container">
                <div className="delivery-signup-header">
                    <div className="header-icon">🚚</div>
                    <h2 className="main-title">Join Our Delivery Team</h2>
                    <p className="header-description">Create your delivery partner account</p>
                </div>

                <div className="delivery-signup-form">
                    <div className="input-group">
                        <label htmlFor="name">Full Name</label>
                        <div className="input-wrapper">
                            <span className="input-icon">👤</span>
                            <input
                                id="name"
                                type="text"
                                placeholder="Enter your full name"
                                value={name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label htmlFor="phone">Phone Number</label>
                        <div className="input-wrapper">
                            <span className="input-icon">📱</span>
                            <input
                                id="phone"
                                type="tel"
                                placeholder="Enter 10-digit mobile number"
                                value={phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={loading}
                                maxLength="10"
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
                                placeholder="Create a secure password"
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

                    <div className="password-requirements">
                        <p>Password requirements:</p>
                        <ul>
                            <li className={password.length >= 6 ? 'valid' : ''}>
                                At least 6 characters
                            </li>
                            <li className={name && phone && password ? 'valid' : ''}>
                                All fields completed
                            </li>
                        </ul>
                    </div>

                    {error && (
                        <div className="error-message">
                            <span className="error-icon">⚠️</span>
                            <span>{error}</span>
                        </div>
                    )}

                    <button 
                        className={`delivery-signup-btn ${loading ? 'loading' : ''}`}
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
                                <span className="btn-icon">🚚</span>
                                Create Delivery Account
                            </>
                        )}
                    </button>
                </div>

                <div className="delivery-signup-footer">
                    <p>Already have a delivery account?
                        <button
                            className="link-btn"
                            onClick={() => navigate('/login')}
                            disabled={loading}
                        >
                            Sign in here
                        </button>
                    </p>
                </div>

                <div className="delivery-benefits">
                    <h4>Why join our delivery network?</h4>
                    <ul>
                        <li>🚚 Flexible working hours</li>
                        <li>💰 Competitive earnings per delivery</li>
                        <li>📱 Easy-to-use delivery management app</li>
                        <li>🤝 Support local businesses in your area</li>
                        <li>⚡ Quick weekly payments</li>
                        <li>🎯 Choose your delivery zones</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default CreateAcc;