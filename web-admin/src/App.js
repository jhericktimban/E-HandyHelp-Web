import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import Navbar from './components/Navbar';
import AdminSidebar from './components/AdminSidebar';
import ViewReports from './components/ViewReports';
import PendingHandyman from './components/PendingHandyman';
import VerifiedHandyman from './components/VerifiedHandyman';
import RejectedHandyman from './components/RejectedHandyman';
import SuspendedHandyman from './components/SuspendedHandyman';
import PendingUser from './components/PendingUser';
import VerifiedUser from './components/VerifiedUser';
import RejectedUser from './components/RejectedUser';
import SuspendedUser from './components/SuspendedUser';
import ViewFeedbacks from './components/ViewFeedbacks'
import { Container, Row, Col } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import './components/styles.css';
<link
  rel="stylesheet"
  href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css"
  integrity="sha384-DyZvY5g3pH1sm8+jjj5P+GJg6hQTuUSXezGwv5MwbEtFsUBXaCrO5F8FxgBQ6RjO"
  crossorigin="anonymous"
/>


const App = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [reports, setReports] = useState([
        {
            title: 'Handyman Issue Reported',
            description: 'Christian Ragasa reported an issue with a handyman.',
            reportedBy: 'Christian Ragasa'
        },
        {
            title: 'Handyman Bure Gausin Issue',
            description: 'Bure Gausin has a reported issue.',
            reportedBy: 'Bure Gausin'
        },
        // Add more mock reports as needed
    ]);

    const handleLogin = (status) => {
        setIsLoggedIn(status);
    };

    const handleLogout = () => {
        setIsLoggedIn(false);
    };

    return (
        <Router>
            <div className="app-container">
                {isLoggedIn ? (
                    <>
                        <Navbar onLogout={handleLogout} />
                        <Container fluid className="main-content">
                            <Row>
                                <Col md={3}>
                                    <AdminSidebar />
                                </Col>
                                <Col md={9}>
                                    <Routes>
                                        <Route path="/" element={<Navigate to="/dashboard" />} />
                                        <Route path="/dashboard" element={<AdminDashboard />} />
                                        <Route path="/view-reports" element={<ViewReports reports={reports} />} />
                                        <Route path="/handyman/pending" element={<PendingHandyman />} />
                                        <Route path="/handyman/verified" element={<VerifiedHandyman />} />
                                        <Route path="/handyman/rejected" element={<RejectedHandyman />} />
                                        <Route path="/handyman/suspended" element={<SuspendedHandyman />} />
                                        <Route path="/users/pending" element={<PendingUser />} />
                                        <Route path="/users/verified" element={<VerifiedUser />} />
                                        <Route path="/users/rejected" element={<RejectedUser />} />
                                        <Route path="/users/suspended" element={<SuspendedUser />} />
                                        <Route path="/view-feedbacks" element={<ViewFeedbacks />} />
                                    </Routes>
                                </Col>
                            </Row>
                        </Container>
                    </>
                ) : (
                    <AdminLogin onLogin={handleLogin} />
                )}
            </div>
        </Router>
    );
};

export default App;
