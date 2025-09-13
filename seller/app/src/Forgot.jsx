import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import './Forgot.css';

function Forgot() {
    const [name, setName] = useState("");
    const [actualOtp, setActualOtp] = useState(null); 
    const [userOtp, setUserOtp] = useState(""); 
    const navigate = useNavigate();

    const handleSubmit = () => {
        fetch("http://localhost:5000/otp/method", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data.message);
                setActualOtp(data.otp); 
                alert("OTP sent to your email");
            })
            .catch(err => {
                console.error("API call failed:", err);
            });
    };

    const handleOtpSubmit = () => {
        if (userOtp === String(actualOtp)) {
            navigate("/ChangePass");
        } else {
            alert("Wrong OTP");
        }
    };

    useEffect(() => {
        if (actualOtp) {
            console.log("Latest OTP:", actualOtp);
        }
    }, [actualOtp]);

    return (
        <div className="forgot-container">
            <div className="forgot-box">
                <h1>Forgot Password Page</h1>

                <input
                    type="text"
                    placeholder="Enter your email"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <button onClick={handleSubmit}>Submit email</button>

                <input
                    type="number"
                    placeholder="Enter OTP"
                    value={userOtp}
                    onChange={(e) => setUserOtp(e.target.value)}
                />
                <button onClick={handleOtpSubmit}>Enter OTP</button>
            </div>
        </div>
    );
}

export default Forgot;