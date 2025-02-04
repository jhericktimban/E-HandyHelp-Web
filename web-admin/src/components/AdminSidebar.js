import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/ehlogo1.png";
import "../css/sideBar.css"; 
import "font-awesome/css/font-awesome.min.css";

const AdminSidebar = ({ onLogout }) => {
  const [showHandyman, setShowHandyman] = useState(false);
  const [showUsers, setShowUsers] = useState(false);

  // Load saved state from localStorage on component mount
  useEffect(() => {
    const savedShowHandyman = localStorage.getItem("showHandyman") === "true";
    const savedShowUsers = localStorage.getItem("showUsers") === "true";
    setShowHandyman(savedShowHandyman);
    setShowUsers(savedShowUsers);
  }, []);

  const toggleHandyman = () => {
    const newShowHandyman = !showHandyman;
    setShowHandyman(newShowHandyman);
    localStorage.setItem("showHandyman", newShowHandyman);
  };
  
  const toggleUsers = () => {
    const newShowUsers = !showUsers;
    setShowUsers(newShowUsers);
    localStorage.setItem("showUsers", newShowUsers);
  };

  return (
    <div className="admin-sidebar">
      <div className="sidebar-header">
        <img src={logo} alt="E-handyhelp Logo" className="sidebar-logo" />
        <h5 className="sidebar-title">
          <a>E-Handyhelp</a>
        </h5>
      </div>
      <ul>
        <li>
          <Link to="/dashboard">
            <i className="fa fa-tachometer" aria-hidden="true"></i> Dashboard
          </Link>
        </li>
        <li>
          <Link to="/view-reports">
            <i className="fa fa-file-text" aria-hidden="true"></i> Incident Reports
          </Link>
        </li>
        <li>
          <a className="collapsible" onClick={toggleHandyman}>
            <i className="fa fa-wrench" aria-hidden="true"></i> Handyman
            <span className="icon">{showHandyman ? "-" : "+"}</span>
          </a>
          <div
            className={`collapsible-content ${showHandyman ? "active" : ""}`}
            style={{
              maxHeight: showHandyman ? "500px" : "0",
              padding: showHandyman ? "10px 0" : "0",
              transition: "max-height 0.2s ease-out", // Smooth transition
            }}
          >
            <Link to="/handyman/pending">
              <i className="fa fa-clock-o" aria-hidden="true"></i> Pending Handyman
            </Link>
            <Link to="/handyman/verified">
              <i className="fa fa-check-circle" aria-hidden="true"></i> Verified Handyman
            </Link>
            <Link to="/handyman/rejected">
              <i className="fa fa-times-circle" aria-hidden="true"></i> Rejected Handyman
            </Link>
            <Link to="/handyman/suspended">
              <i className="fa fa-ban" aria-hidden="true"></i> Suspended Handyman
            </Link>
          </div>
        </li>
        <li>
          <a className="collapsible" onClick={toggleUsers}>
            <i className="fa fa-users" aria-hidden="true"></i> Users
            <span className="icon">{showUsers ? "-" : "+"}</span>
          </a>
          <div
            className={`collapsible-content ${showUsers ? "active" : ""}`}
            style={{
              maxHeight: showUsers ? "500px" : "0",
              padding: showUsers ? "10px 0" : "0",
              transition: "max-height 0.2s ease-out", // Smooth transition
            }}
          >
            <Link to="/users/pending">
              <i className="fa fa-clock-o" aria-hidden="true"></i> Pending Users
            </Link>
            <Link to="/users/verified">
              <i className="fa fa-check-circle" aria-hidden="true"></i> Verified Users
            </Link>
            <Link to="/users/rejected">
              <i className="fa fa-times-circle" aria-hidden="true"></i> Rejected Users
            </Link>
            <Link to="/users/suspended">
              <i className="fa fa-ban" aria-hidden="true"></i> Suspended Users
            </Link>
          </div>
        </li>
        <li>
          <Link to="/view-feedbacks">
            <i className="fa fa-comments" aria-hidden="true"></i> Feedbacks
          </Link>
        </li>
        <li>
          <Link to="/dashboard" onClick={onLogout} style={{ cursor: "pointer" }}>
            <i className="fa fa-sign-out" aria-hidden="true"></i> Logout
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
