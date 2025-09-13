import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await fetch("http://localhost:5000/user/login", {
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
    <div className="login-wrapper">
      <div className="login-container">
        <h2>Login</h2>
        <input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
        <p onClick={() => navigate("/forgot")}>Forgot Password?</p>
        <p onClick={() => navigate("/create")}>Create Account</p>
      </div>
    </div>
  );

}

export default Login;
