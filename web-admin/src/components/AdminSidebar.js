import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/ehlogo1.png";
import "../css/sideBar.css";
import "font-awesome/css/font-awesome.min.css";

const AdminSidebar = ({ onLogout }) => {
  const [showHandyman, setShowHandyman] = useState(false);
  const [showUsers, setShowUsers] = useState(false);
  const [showReports, setShowReports] = useState(false); // Added for reports dropdown
  const [activeLink, setActiveLink] = useState("");

  const location = useLocation();

  useEffect(() => {
    const savedShowHandyman = localStorage.getItem("showHandyman") === "true";
    const savedShowUsers = localStorage.getItem("showUsers") === "true";
    const savedShowReports = localStorage.getItem("showReports") === "true";
    
    setShowHandyman(savedShowHandyman);
    setShowUsers(savedShowUsers);
    setShowReports(savedShowReports);

    setActiveLink(location.pathname);
  }, [location.pathname]);

  const toggleHandyman = (e) => {
    e.preventDefault();
    const newShowHandyman = !showHandyman;
    setShowHandyman(newShowHandyman);
    localStorage.setItem("showHandyman", newShowHandyman);
  };

  const toggleUsers = (e) => {
    e.preventDefault();
    const newShowUsers = !showUsers;
    setShowUsers(newShowUsers);
    localStorage.setItem("showUsers", newShowUsers);
  };

  const toggleReports = (e) => {
    e.preventDefault();
    const newShowReports = !showReports;
    setShowReports(newShowReports);
    localStorage.setItem("showReports", newShowReports);
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
          <Link to="/dashboard" className={activeLink === "/dashboard" ? "active" : ""}>
            <i className="fa fa-tachometer" aria-hidden="true"></i> Dashboard
          </Link>
        </li>
        <li>
          <a className="collapsible" onClick={toggleReports}>
            <i className="fa fa-file-text" aria-hidden="true"></i> Incident Reports
            <span className="icon">{showReports ? "-" : "+"}</span>
          </a>
          <div className={`collapsible-content ${showReports ? "active" : ""}`}>
            <Link to="/reports/handyman" className={activeLink === "/reports/handyman" ? "active" : ""}>
              <i className="fa fa-wrench" aria-hidden="true"></i> Reported by Handyman
            </Link>
            <Link to="/reports/users" className={activeLink === "/reports/users" ? "active" : ""}>
              <i className="fa fa-users" aria-hidden="true"></i> Reported by Users
            </Link>
          </div>
        </li>
        <li>
          <a className="collapsible" onClick={toggleHandyman}>
            <i className="fa fa-wrench" aria-hidden="true"></i> Handyman
            <span className="icon">{showHandyman ? "-" : "+"}</span>
          </a>
          <div className={`collapsible-content ${showHandyman ? "active" : ""}`}>
            <Link to="/handyman/pending" className={activeLink === "/handyman/pending" ? "active" : ""}>
              <i className="fa fa-clock-o" aria-hidden="true"></i> Pending Handyman
            </Link>
            <Link to="/handyman/verified" className={activeLink === "/handyman/verified" ? "active" : ""}>
              <i className="fa fa-check-circle" aria-hidden="true"></i> Verified Handyman
            </Link>
            <Link to="/handyman/rejected" className={activeLink === "/handyman/rejected" ? "active" : ""}>
              <i className="fa fa-times-circle" aria-hidden="true"></i> Rejected Handyman
            </Link>
            <Link to="/handyman/suspended" className={activeLink === "/handyman/suspended" ? "active" : ""}>
              <i className="fa fa-ban" aria-hidden="true"></i> Suspended Handyman
            </Link>
          </div>
        </li>
        <li>
          <a className="collapsible" onClick={toggleUsers}>
            <i className="fa fa-users" aria-hidden="true"></i> Users
            <span className="icon">{showUsers ? "-" : "+"}</span>
          </a>
          <div className={`collapsible-content ${showUsers ? "active" : ""}`}>
            <Link to="/users/pending" className={activeLink === "/users/pending" ? "active" : ""}>
              <i className="fa fa-clock-o" aria-hidden="true"></i> Pending Users
            </Link>
            <Link to="/users/verified" className={activeLink === "/users/verified" ? "active" : ""}>
              <i className="fa fa-check-circle" aria-hidden="true"></i> Verified Users
            </Link>
            <Link to="/users/rejected" className={activeLink === "/users/rejected" ? "active" : ""}>
              <i className="fa fa-times-circle" aria-hidden="true"></i> Rejected Users
            </Link>
            <Link to="/users/suspended" className={activeLink === "/users/suspended" ? "active" : ""}>
              <i className="fa fa-ban" aria-hidden="true"></i> Suspended Users
            </Link>
          </div>
        </li>
        <li>
          <Link to="/view-feedbacks" className={activeLink === "/view-feedbacks" ? "active" : ""}>
            <i className="fa fa-comments" aria-hidden="true"></i> Feedbacks
          </Link>
        </li>
        <li>
          <Link to="/activity-logs" className={activeLink === "/activity-logs" ? "active" : ""}>
            <i className="fa fa-history" aria-hidden="true"></i> Activity Logs
          </Link>
        </li>
        <li>
          <Link to="/" onClick={onLogout} style={{ cursor: "pointer" }}>
            <i className="fa fa-sign-out" aria-hidden="true"></i> Logout
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default AdminSidebar;
