import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/ehlogo.png'; // Adjust the path as necessary
import './styles.css';
import 'font-awesome/css/font-awesome.min.css'; // Import Font Awesome

const AdminSidebar = () => {
    // State variables for handling collapsible sections
    const [showHandyman, setShowHandyman] = useState(false);
    const [showUsers, setShowUsers] = useState(false);

    // Toggle functions for collapsible sections
    const toggleHandyman = () => setShowHandyman(!showHandyman);
    const toggleUsers = () => setShowUsers(!showUsers);

    return (
        <div className="admin-sidebar">
            <div className="sidebar-header">
                <img src={logo} alt="E-handyhelp Logo" className="sidebar-logo" />
                <h5 className="sidebar-title"><b>E-handyhelp</b></h5>
            </div>
            <ul>
                <li>
                    <Link to="/dashboard">
                        <i className="fa fa-tachometer" aria-hidden="true"></i> Dashboard
                    </Link>
                </li>
                <li>
                    <Link to="/view-reports">
                        <i className="fa fa-file-text" aria-hidden="true"></i> View Reports
                    </Link>
                </li>
                <li>
                    <a href="#" className="collapsible" onClick={toggleHandyman}>
                        <i className="fa fa-wrench" aria-hidden="true"></i> Handyman
                        <span className="icon">{showHandyman ? '-' : '+'}</span>
                    </a>
                    {showHandyman && (
                        <div className="collapsible-content">
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
                    )}
                </li>
                <li>
                    <a href="#" className="collapsible" onClick={toggleUsers}>
                        <i className="fa fa-users" aria-hidden="true"></i> Users
                        <span className="icon">{showUsers ? '-' : '+'}</span>
                    </a>
                    {showUsers && (
                        <div className="collapsible-content">
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
                    )}
                </li>
                <li>
                    <Link to="/view-feedbacks">
                        <i className="fa fa-comments" aria-hidden="true"></i> Feedbacks
                    </Link>
                </li>
            </ul>
        </div>
    );
}

export default AdminSidebar;
