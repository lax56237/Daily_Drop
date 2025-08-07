import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./Verify.css"

function Verify() {
    const [email, setEmail] = useState('');
    const [showOtp, setShowOtp] = useState(false);
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const sendOtp = async () => {
        const res = await fetch('http://localhost:5000/delivery/send-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ email })
        });
        const data = await res.json();
        if (data) {
            setShowOtp(true);
            setError('');
        } else {
            setError('Failed to send OTP');
        }
    };

    const verifyOtp = async () => {
        const res = await fetch('http://localhost:5000/delivery/verify-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ enteredOtp: otp })
        });
        const data = await res.json();
        if (data.success) {
            await fetch('http://localhost:5000/delivery/success_delivery', {
                method: 'POST',
                credentials: 'include'
            });
            navigate('/home');
        } else {
            setError(data.msg || 'Wrong OTP');
        }
    };

    return (
        <div className="verify-container">
            <h2>Verify Delivery</h2>
            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ marginBottom: '10px' }}
            />
            <button onClick={sendOtp}>Send OTP</button>

            {showOtp && (
                <div style={{ marginTop: '20px' }}>
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                    <button onClick={verifyOtp}>Submit</button>
                </div>
            )}
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
    );
}

export default Verify;
