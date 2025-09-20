import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import '../style/ChangePass.css';

function ChangePass() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        newPassword: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const validatePassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        return regex.test(password);
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        setError(''); 
    };

    const handleChangePassword = async () => {
        const { newPassword, confirmPassword } = formData;

        if (!newPassword || !confirmPassword) {
            setError('Please fill in both password fields');
            return;
        }

        if (!validatePassword(newPassword)) {
            setError('Password must be at least 8 characters long and include uppercase, lowercase, number, and special character');
            return;
        }

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await new Promise(resolve => setTimeout(resolve, 1500));

            navigate("/");
        } catch (err) {
            console.error('Password change error:', err);
            setError('Failed to change password. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleChangePassword();
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <div className="changepass-container">
            <div className="changepass-box">
                <div className="changepass-header">
                    <div className="header-icon">🔑</div>
                    <h1 className="main-title">Change Password</h1>
                    <p className="header-description">Create a new secure password for your account</p>
                </div>

                <div className="changepass-form">
                    <div className="input-group">
                        <label htmlFor="newPassword">New Password</label>
                        <div className="input-wrapper">
                            <input
                                id="newPassword"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter new password"
                                value={formData.newPassword}
                                onChange={e => handleInputChange('newPassword', e.target.value)}
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

                    <div className="input-group">
                        <label htmlFor="confirmPassword">Confirm New Password</label>
                        <div className="input-wrapper">
                            <input
                                id="confirmPassword"
                                type={showPassword ? "text" : "password"}
                                placeholder="Confirm new password"
                                value={formData.confirmPassword}
                                onChange={e => handleInputChange('confirmPassword', e.target.value)}
                                onKeyPress={handleKeyPress}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div className="password-requirements">
                        <h4>Password must include:</h4>
                        <ul>
                            <li className={formData.newPassword.length >= 8 ? 'valid' : ''}>
                                At least 8 characters
                            </li>
                            <li className={/[A-Z]/.test(formData.newPassword) ? 'valid' : ''}>
                                One uppercase letter
                            </li>
                            <li className={/[a-z]/.test(formData.newPassword) ? 'valid' : ''}>
                                One lowercase letter
                            </li>
                            <li className={/\d/.test(formData.newPassword) ? 'valid' : ''}>
                                One number
                            </li>
                            <li className={/[\W_]/.test(formData.newPassword) ? 'valid' : ''}>
                                One special character
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
                        type="button"
                        className={`change-btn ${loading ? 'loading' : ''}`}
                        onClick={handleChangePassword}
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="loading-spinner"></span>
                                Changing Password...
                            </>
                        ) : (
                            <>
                                <span className="btn-icon">✅</span>
                                Change Password
                            </>
                        )}
                    </button>
                </div>

                <div className="changepass-footer">
                    <div className="security-info">
                        <h4>🛡️ Security Tips:</h4>
                        <ul>
                            <li>Use a unique password you haven't used before</li>
                            <li>Don't share your password with anyone</li>
                            <li>Consider using a password manager</li>
                        </ul>
                    </div>

                    <p>
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

export default ChangePass;