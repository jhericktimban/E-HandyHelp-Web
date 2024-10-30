import React, { useState } from "react";
import logo from '../assets/ehlogo.png'; // Import the logo image
import "../css/loginstyles.css";
import { FaUserAlt, FaLock, FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons
import { useNavigate } from "react-router-dom"; // Assuming you're using React Router for navigation

const AdminLogin = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const Username = "admin";
    const Password = "123pass";

    // Check if entered credentials match the hardcoded values
    if (username === Username && password === Password) {
      // Redirect to admin dashboard
      onLogin(true);
    } else {
      alert("Invalid username or password.");
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword); // Toggle the visibility state
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
            />
            <FaUserAlt className="icon" />
          </div>
          <div className="input-box">
            <input
              type={showPassword ? "text" : "password"} // Toggle input type
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <FaLock className="icon" />
            <span onClick={togglePasswordVisibility} className="toggle-password">
              {showPassword ? <FaEyeSlash /> : <FaEye />} {/* Toggle icon */}
            </span>
          </div>
          <div className="remember-forgot">
            <a href="#">Forgot password?</a>
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
