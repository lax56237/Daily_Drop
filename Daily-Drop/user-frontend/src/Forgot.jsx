import { useState } from "react";
import "./Forgot.css"

function Forgot() {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [sentOtp, setSentOtp] = useState(null);
    const [step, setStep] = useState("send");
    const [newPass, setNewPass] = useState("");

    const handleSendOtp = async () => {
        const res = await fetch("http://localhost:5000/user/send-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email })
        });
        const data = await res.json();
        if (res.ok) {
            setSentOtp(data.otp);
            setStep("verify");
            setTimeout(() => {
                setSentOtp(null);
                alert("OTP expired. Please request again.");
                setStep("send");
            }, 120000);
        } else alert(data.message);
    };

    const handleVerifyOtp = () => {
        if (Number(otp) === Number(sentOtp)) setStep("reset");
        else alert("Wrong OTP");
    };

    const handleResetPassword = async () => {
        const res = await fetch("http://localhost:5000/user/reset-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, newPassword: newPass })
        });
        const data = await res.json();
        if (res.ok) {
            alert("Password reset successful");
            setStep("send");
        } else alert(data.message);
    };

    return (
        <div className="forgot-wrapper">
            <div className="forgot-container">
                <h2>Forgot Password</h2>

                {step === "send" && (
                    <>
                        <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
                        <button onClick={handleSendOtp}>Send OTP</button>
                    </>
                )}

                {step === "verify" && (
                    <>
                        <input placeholder="Enter OTP" value={otp} onChange={e => setOtp(e.target.value)} />
                        <button onClick={handleVerifyOtp}>Verify OTP</button>
                    </>
                )}

                {step === "reset" && (
                    <>
                        <input type="password" placeholder="New Password" value={newPass} onChange={e => setNewPass(e.target.value)} />
                        <button onClick={handleResetPassword}>Reset Password</button>
                    </>
                )}
            </div>
        </div>
    );

}

export default Forgot;
