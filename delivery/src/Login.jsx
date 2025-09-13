import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import './Login.css'

function Login() {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        const res = await fetch('http://localhost:5000/delivery/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ name, password })
        });
        const data = await res.json();
        if (res.ok) navigate('/home');
        else alert(data.msg);
    };

    return (
        <div className="login-container">
            <h2>Delivery Login</h2>

            <div className="input-group">
                <label>Name</label>
                <input
                    type="text"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div className="input-group">
                <label>Password</label>
                <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <button onClick={handleLogin}>Login</button>
            <button onClick={() => navigate('/CreateAcc')}>Create Account</button>
        </div>

    );

}

export default Login;
