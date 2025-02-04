import React, { useState, useEffect } from 'react';
import '../css/dashboardstyles.css';

const AdminDashboard = () => {
    const [handymanTotal, setHandymanTotal] = useState(0);
    const [usersTotal, setUsersTotal] = useState(0);
    const [pendingHandymenTotal, setPendingHandymenTotal] = useState(0);
    const [pendingUsersTotal, setPendingUsersTotal] = useState(0);
    const [suspendedHandymenTotal, setSuspendedHandymenTotal] = useState(0);
    const [suspendedUsersTotal, setSuspendedUsersTotal] = useState(0);
    const [activeHandymen, setActiveHandymen] = useState(0);
    const [activeUsers, setActiveUsers] = useState(0);

    useEffect(() => {
        const fetchTotals = async () => {
            try {
                const response = await fetch('https://e-handyhelp-web-backend.onrender.com/api/dashboard/totals');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setHandymanTotal(data.handymanTotal);
                setUsersTotal(data.usersTotal);
                setPendingHandymenTotal(data.pendingHandymenTotal);
                setPendingUsersTotal(data.pendingUsersTotal);
                setSuspendedHandymenTotal(data.suspendedHandymenTotal);
                setSuspendedUsersTotal(data.suspendedUsersTotal);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            }
        };

        const fetchActiveUsers = async () => {
            try {
                const response = await fetch('https://e-handyhelp-web-backend.onrender.com/api/dashboard/active-users');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setActiveHandymen(data.activeHandymen);
                setActiveUsers(data.activeUsers);
            } catch (error) {
                console.error('Error fetching active users:', error);
            }
        };

        fetchTotals();
        fetchActiveUsers();

        const interval = setInterval(fetchActiveUsers, 30000); // Poll every 30 seconds

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    return (
        <div className='body'>
            <div className="dashboard">
                <h1>Dashboard</h1>
                <div className="dashboard-stats">
                    <div className="stat-box">
                        <h3>Total Handymen</h3>
                        <p>{handymanTotal}</p>
                    </div>
                    <div className="stat-box">
                        <h3>Total Users</h3>
                        <p>{usersTotal}</p>
                    </div>
                    <div className="stat-box">
                        <h3>Pending Handymen Accounts</h3>
                        <p>{pendingHandymenTotal}</p>
                    </div>
                    <div className="stat-box">
                        <h3>Pending User Accounts</h3>
                        <p>{pendingUsersTotal}</p>
                    </div>
                    <div className="stat-box">
                        <h3>Suspended Handymen Accounts</h3>
                        <p>{suspendedHandymenTotal}</p>
                    </div>
                    <div className="stat-box">
                        <h3>Suspended User Accounts</h3>
                        <p>{suspendedUsersTotal}</p>
                    </div>
                    <div className="stat-box active">
                        <h3>Active Handymen</h3>
                        <p>{activeHandymen}</p>
                    </div>
                    <div className="stat-box active">
                        <h3>Active Users</h3>
                        <p>{activeUsers}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
