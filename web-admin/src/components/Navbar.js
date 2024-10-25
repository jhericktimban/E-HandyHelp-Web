import React, { useState } from 'react';
import './styles.css';

const Navbar = ({ onLogout }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen(prev => !prev);
    };

    return (
        <div className="navbar">
            <div className="navbar-left">
               
            </div>
            <div className="navbar-right">
                <div className="notification-button" onClick={toggleDropdown}>
                    🔔
                    {dropdownOpen && (
                        <div className="notification-dropdown">
                            <a href="#" className="new-notification">Christian Ragasa: Handyman Issue Reported</a>
                            <a href="#">Handyman Bure Gausin: Reported Issue</a>
                            <a href="#">Ced Sabarisa: Pending Handyman Account</a>
                            <a href="#">Clyde Reno: Pending User Account</a>
                            <a href="#">Paulo Balais: Reported User Love Mae for Non-Payment</a>
                        </div>
                    )}
                </div>
                <button className="logout-button" onClick={onLogout}>Logout</button>
            </div>
        </div>
    );
}

export default Navbar;
