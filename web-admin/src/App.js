import React, { useState, useEffect } from "react";
import { injectSpeedInsights } from '@vercel/speed-insights';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import AdminSidebar from "./components/AdminSidebar";
import PendingHandyman from "./components/PendingHandyman";
import VerifiedHandyman from "./components/VerifiedHandyman";
import RejectedHandyman from "./components/RejectedHandyman";
import SuspendedHandyman from "./components/SuspendedHandyman";
import PendingUser from "./components/PendingUser";
import VerifiedUser from "./components/VerifiedUser";
import RejectedUser from "./components/RejectedUser";
import SuspendedUser from "./components/SuspendedUser";
import ViewFeedbacks from "./components/ViewFeedbacks";
import ActivityLogs from "./components/ActivityLogs"; 
import ViewHandymanReports from "./components/ReportedUser";
import ViewUserReports from "./components/ReportedHandy";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../src/css/styles.css";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [reports] = useState([]);

  // Check localStorage for login status on mount
  useEffect(() => {
    const loggedInStatus = localStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedInStatus);
  }, []);

  const handleLogin = (status) => {
    setIsLoggedIn(status);
    localStorage.setItem("isLoggedIn", status);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.setItem("isLoggedIn", false);
  };

  return (
    <Router>
      <div className="app-container">
        {isLoggedIn ? (
          <>
            <Container className="main-content">
              <Row>
                <Col md={3}>
                  <AdminSidebar onLogout={handleLogout} />
                </Col>
                <Col md={9}>
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                    <Route path="/dashboard" element={<AdminDashboard />} />
                    <Route path="/handyman/pending" element={<PendingHandyman />} />
                    <Route path="/handyman/verified" element={<VerifiedHandyman />} />
                    <Route path="/handyman/rejected" element={<RejectedHandyman />} />
                    <Route path="/handyman/suspended" element={<SuspendedHandyman />} />
                    <Route path="/users/pending" element={<PendingUser />} />
                    <Route path="/users/verified" element={<VerifiedUser />} />
                    <Route path="/users/rejected" element={<RejectedUser />} />
                    <Route path="/users/suspended" element={<SuspendedUser />} />
                    <Route path="/view-feedbacks" element={<ViewFeedbacks />} />
                    <Route path="/activity-logs" element={<ActivityLogs />} />  
                    <Route path="/reports/handyman" element={<ViewHandymanReports />} />
                    <Route path="/reports/users" element={<ViewUserReports />} />

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

injectSpeedInsights();
export default App;
