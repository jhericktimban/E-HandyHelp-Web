import React, { useState } from "react";
import logo from "../assets/ehlogo.png";
import "../css/loginstyles.css";
import { FaUserAlt, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { FaSpinner } from "react-icons/fa"; // Import spinner icon

const AdminLogin = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
  
    const Username = "admin";
    const Password = "123pass";
  
    setTimeout(async () => {
      if (username === Username && password === Password) {
        onLogin(true);
  
        // Log the successful login attempt
        try {
          await fetch("https://e-handyhelp-web-backend.onrender.com/api/activityLogs", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: username,
              action: "Login",
              description: "Admin successfully logged in.",
              timestamp: new Date().toISOString(),
            }),
          });
        } catch (error) {
          console.error("Error logging activity:", error);
        }
        setLoading(false); // Stop loading after success
      } else {
        alert("Invalid username or password.");
        setLoading(false); // Stop loading immediately for failed login
  
        // Log the failed login attempt
        try {
          await fetch("https://e-handyhelp-web-backend.onrender.com/api/activityLogs", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: username || "Unknown",
              action: "Failed Login",
              description: "Invalid admin login attempt.",
              timestamp: new Date().toISOString(),
            }),
          });
        } catch (error) {
          console.error("Error logging activity:", error);
        }
      }
    }, 2000); // Simulate 2 seconds delay for valid login only
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
              disabled={loading} // Disable input when loading
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
              disabled={loading} // Disable input when loading
            />
            <FaLock className="icon" />
            <span
              onClick={togglePasswordVisibility}
              className="toggle-password"
            >
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
