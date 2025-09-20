import { useState, useEffect } from "react";
import "../style/Forgot.css";

function Forgot() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [sentOtp, setSentOtp] = useState(null);
    const [step, setStep] = useState("send");
    const [newPass, setNewPass] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [timeLeft, setTimeLeft] = useState(0);

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validatePassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        return regex.test(password);
    };

    const handleSendOtp = async () => {
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
            const res = await fetch("http://localhost:5000/user/send-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });
            
            const data = await res.json();
            
            if (res.ok) {
                setSentOtp(data.otp);
                setStep("verify");
                setTimeLeft(120); 
            } else {
                setError(data.message || "Failed to send OTP");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOtp = () => {
        if (!otp.trim()) {
            setError("Please enter the OTP");
            return;
        }

        if (Number(otp) === Number(sentOtp)) {
            setStep("reset");
            setError("");
        } else {
            setError("Invalid OTP. Please check and try again.");
        }
    };

    const handleResetPassword = async () => {
        if (!newPass.trim()) {
            setError("Please enter a new password");
            return;
        }

        if (!validatePassword(newPass)) {
            setError("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch("http://localhost:5000/user/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, newPassword: newPass })
            });
            
            const data = await res.json();
            
            if (res.ok) {
                setStep("success");
            } else {
                setError(data.message || "Failed to reset password");
            }
        } catch (err) {
            setError("Network error. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = () => {
        setOtp("");
        setError("");
        setSentOtp(null);
        setTimeLeft(0);
        handleSendOtp();
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !loading) {
            if (step === "send") handleSendOtp();
            else if (step === "verify") handleVerifyOtp();
            else if (step === "reset") handleResetPassword();
        }
    };

    const resetForm = () => {
        setEmail("");
        setOtp("");
        setNewPass("");
        setSentOtp(null);
        setStep("send");
        setError("");
        setTimeLeft(0);
    };

    useEffect(() => {
        let timer;
        if (timeLeft > 0) {
            timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
        } else if (timeLeft === 0 && sentOtp) {
            setSentOtp(null);
            setError("OTP expired. Please request again.");
            setStep("send");
        }
        return () => clearTimeout(timer);
    }, [timeLeft, sentOtp]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="forgot-wrapper">
            <div className="forgot-container">
                <div className="forgot-header">
                    <div className="header-icon">🔐</div>
                    <h2 className="main-title">Reset Password</h2>
                    <p className="header-description">
                        {step === "send" && "Enter your email to receive a reset code"}
                        {step === "verify" && "Enter the verification code sent to your email"}
                        {step === "reset" && "Create a new secure password"}
                        {step === "success" && "Password reset successful!"}
                    </p>
                </div>

                <div className="progress-indicator">
                    <div className={`step ${step !== "send" ? 'completed' : 'active'}`}>
                        <span className="step-number">1</span>
                        <span className="step-label">Email</span>
                    </div>
                    <div className="step-connector"></div>
                    <div className={`step ${step === "verify" ? 'active' : step === "reset" || step === "success" ? 'completed' : ''}`}>
                        <span className="step-number">2</span>
                        <span className="step-label">Verify</span>
                    </div>
                    <div className="step-connector"></div>
                    <div className={`step ${step === "reset" ? 'active' : step === "success" ? 'completed' : ''}`}>
                        <span className="step-number">3</span>
                        <span className="step-label">Reset</span>
                    </div>
                </div>

                <div className="forgot-form">
                    {step === "send" && (
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
                                onClick={handleSendOtp}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="loading-spinner"></span>
                                        Sending Code...
                                    </>
                                ) : (
                                    <>
                                        <span className="btn-icon">📤</span>
                                        Send Reset Code
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {step === "verify" && (
                        <div className="form-step active">
                            <div className="step-info">
                                <p>Code sent to:</p>
                                <span className="email-display">{email}</span>
                                {timeLeft > 0 && (
                                    <div className="timer">
                                        <span className="timer-icon">⏰</span>
                                        <span>Expires in {formatTime(timeLeft)}</span>
                                    </div>
                                )}
                            </div>

                            <div className="input-group">
                                <div className="input-wrapper">
                                    <span className="input-icon">🔢</span>
                                    <input
                                        type="text"
                                        placeholder="Enter 6-digit verification code"
                                        value={otp}
                                        onChange={e => setOtp(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        maxLength="6"
                                    />
                                </div>
                            </div>

                            <button 
                                className="action-btn primary"
                                onClick={handleVerifyOtp}
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

                    {step === "reset" && (
                        <div className="form-step active">
                            <div className="step-info success">
                                <p>✅ Email verified successfully!</p>
                                <span>Create your new password</span>
                            </div>

                            <div className="input-group">
                                <div className="input-wrapper">
                                    <span className="input-icon">🔒</span>
                                    <input
                                        type="password"
                                        placeholder="Enter new secure password"
                                        value={newPass}
                                        onChange={e => setNewPass(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        disabled={loading}
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
                                className={`action-btn primary ${loading ? 'loading' : ''}`}
                                onClick={handleResetPassword}
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="loading-spinner"></span>
                                        Resetting Password...
                                    </>
                                ) : (
                                    <>
                                        <span className="btn-icon">🔄</span>
                                        Reset Password
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    {step === "success" && (
                        <div className="form-step active">
                            <div className="success-message">
                                <div className="success-icon">🎉</div>
                                <h3>Password Reset Complete!</h3>
                                <p>Your password has been successfully updated. You can now log in with your new password.</p>
                            </div>

                            <button 
                                className="action-btn primary"
                                onClick={() => window.location.href = '/'}
                            >
                                <span className="btn-icon">🚀</span>
                                Go to Login
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

                <div className="forgot-footer">
                    <p>Remember your password? 
                        <button 
                            className="link-btn"
                            onClick={() => window.location.href = '/'}
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