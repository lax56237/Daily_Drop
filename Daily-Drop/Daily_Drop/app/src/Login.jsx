import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const validateEmail = (email) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    };

    const validatePassword = (password) => {
        const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
        return regex.test(password);
    };

    const handleSignIn = () => {
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

        fetch("http://localhost:5000/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include", 
            body: JSON.stringify({ email, password })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    navigate("/Seller");
                } else {
                    setError(data.message || "Login failed");
                    navigate("/");
                }
            })
            .catch(err => {
                console.error("Login error:", err);
                setError("Something went wrong during login");
            });
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h1>Welcome To Daily Drop</h1>
                <h1>Login Page</h1>

                <input
                    type="text"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {error && <p style={{ color: 'red' }}>{error}</p>}

                <button onClick={handleSignIn}>Sign in</button>
                <button onClick={() => navigate("/CreateAcc")}>Create new account</button>
                <button onClick={() => navigate("/Forgot")}>Forgot password?</button>
            </div>
        </div>
    );
}

export default Login;