import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './CreateAcc.css';

function CreateAcc() {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [enteredOtp, setEnteredOtp] = useState('');
    const [serverOtp, setServerOtp] = useState('');
    const [verified, setVerified] = useState(false);

    const sendOtp = async () => {
        if (!email.includes("@") || !email.includes(".")) {
            alert("Enter a valid email");
            return;
        }

        const res = await fetch("http://localhost:5000/user/send-otp-create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });

        const data = await res.json();
        if (res.ok) {
            console.log(data.otp)
            setServerOtp(data.otp);
            setOtpSent(true);
            alert("OTP sent to your email");
        } else {
            alert(data.msg || "Failed to send OTP");
        }
    };

    const verifyOtp = () => {
        if (Number(enteredOtp) === Number(serverOtp)) {
            setVerified(true);
            alert("OTP verified. You can now set your password.");
        } else {
            alert("Invalid OTP");
        }
    };

    const handleCreateAccount = async () => {
        const res = await fetch("http://localhost:5000/seller/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ username: email, password })
        });

        const data = await res.json();
        if (res.ok) {
            localStorage.setItem("sellerId", data._id);
            navigate("/CreateSeller");
        } else {
            alert(data.msg || "Failed to create account");
        }
    };

    return (
        <form className="signup-wrapper">
            <h1>Create Your Seller Account with Daily Drop</h1>

            <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={otpSent}
            />
            <br />

            {!otpSent && (
                <button type="button" onClick={sendOtp}>
                    Send OTP
                </button>
            )}

            {otpSent && !verified && (
                <>
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        value={enteredOtp}
                        onChange={(e) => setEnteredOtp(e.target.value)}
                    />
                    <br />
                    <button type="button" onClick={verifyOtp}>
                        Verify OTP
                    </button>
                </>
            )}

            {verified && (
                <>
                    <input
                        type="password"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <br />
                    <button type="button" onClick={handleCreateAccount}>
                        Create Account
                    </button>
                </>
            )}
        </form>
    );
}

export default CreateAcc;
