import React, { useState } from "react";
import logo from "../assets/ehlogo.png";
import "../css/loginstyles.css";
import { FaUserAlt, FaLock, FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const AdminLogin = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
  
    const Username = "admin";
    const Password = "123pass";
  
    setTimeout(async () => {
      if (username === Username && password === Password) {
        onLogin(true);
        
  
        // Log the activity
        await fetch("https://e-handyhelp-web-backend.onrender.com/api/activity-logs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username,
            action: "Login",
            description: `${username} logged into the admin panel.`,
          }),
        });
      } else {
        alert("Invalid username or password.");
      }
      setLoading(false);
    }, 2000);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-bg">
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <div className="logo-container">
            <img src={logo} alt="Logo" className="logo" />
          </div>
          <div className="input-box">
            <input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              disabled={loading}
            />
            <FaUserAlt className="icon" />
          </div>
          <div className="input-box">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
            <FaLock className="icon" />
            <span onClick={togglePasswordVisibility} className="toggle-password">
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>
          <div className="remember-forgot">
            <a href="#">Forgot password?</a>
          </div>
          <button type="submit" disabled={loading}>
            {loading ? <FaSpinner className="spinner" /> : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
