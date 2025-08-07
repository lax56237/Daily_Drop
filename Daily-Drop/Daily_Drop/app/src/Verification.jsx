import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Verification.css';

const Verification = () => {
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleVerify = async () => {
        const res = await fetch('http://localhost:5000/seller/verify-delivery', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ phone })
        });

        const data = await res.json();
        if (data.success) {
            navigate('/seller');
        } else {
            setError(data.message || 'Verification failed');
        }
    };

    return (
        <div className="verification-page">
            <h2>Verify Delivery Partner</h2>
            <input
                type="text"
                placeholder="Enter delivery boy phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />
            <button onClick={handleVerify}>Verify</button>
            {error && <p className="error-msg">{error}</p>}
        </div>
    );
};

export default Verification;
