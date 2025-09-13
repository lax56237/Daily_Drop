import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./CreateAcc.css"

function CreateAcc() {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSignup = async () => {
        const res = await fetch('http://localhost:5000/delivery/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ name, password, phone })
        });
        const data = await res.json();
        if (res.ok) navigate('/home');
        else alert(data.msg);
    };

    return (
        <div className="create-account-container">
            <h2>Create Delivery Account</h2>

            <div className="input-group">
                <label>Name</label>
                <input
                    placeholder="Name"
                    value={name}
                    onChange={e => setName(e.target.value)}
                />
            </div>

            <div className="input-group">
                <label>Phone</label>
                <input
                    placeholder="Phone"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                />
            </div>

            <div className="input-group">
                <label>Password</label>
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />
            </div>

            <button onClick={handleSignup}>Create Account</button>
        </div>

    );
}

export default CreateAcc;
