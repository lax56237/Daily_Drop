import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CreateAcc.css";

function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [enteredOtp, setEnteredOtp] = useState("");
    const [serverOtp, setServerOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);
    const [verified, setVerified] = useState(false);

    const navigate = useNavigate();

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
            alert("OTP verified, you can now create your account");
        } else {
            alert("Invalid OTP");
        }
    };

    const handleSignup = async () => {
        const res = await fetch("http://localhost:5000/user/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (res.ok) {
            sessionStorage.setItem("email", data.email);
            navigate("/home");
        } else {
            alert(data.msg);
        }
    };

    return (
        <div className="signup-wrapper">
            <div className="signup-container">
                <h2>Create Account</h2>
                <h3>Daily Drop</h3>

                <input
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    disabled={otpSent}
                />
                {!otpSent && (
                    <button onClick={sendOtp}>Send OTP</button>
                )}

                {otpSent && !verified && (
                    <>
                        <input
                            placeholder="Enter OTP"
                            value={enteredOtp}
                            onChange={e => setEnteredOtp(e.target.value)}
                        />
                        <button onClick={verifyOtp}>Verify OTP</button>
                    </>
                )}

                {verified && (
                    <>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />
                        <button onClick={handleSignup}>Signup</button>
                    </>
                )}
            </div>
        </div>
    );
}

export default Signup;
