import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Modal, Button } from "react-bootstrap";
import "../css/activitylogs.css";
import {
  FaSync,
} from "react-icons/fa";

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);
  const [showModal, setShowModal] = useState(false);

  
    const fetchLogs = async () => {
      try {
        setLoading(true);
        const response = await fetch("https://e-handyhelp-web-backend.onrender.com/api/activityLogs");
        const data = await response.json();
        console.log("Fetched Logs:", data);
        setLogs(data);
      } catch (error) {
        console.error("Error fetching logs:", error);
      } finally {
        setLoading(false);
      }
    };
    useEffect(() => {
    fetchLogs();
  }, []);

  const handleRowClick = (row) => {
    setSelectedLog(row);
    setShowModal(true);
  };

  const columns = [
    {
      name: "Username",
      selector: (row) => row.username,
      
    },
    {
      name: "Action",
      selector: (row) => row.action,
     
    },
    {
      name: "Description",
      selector: (row) => row.description,
      wrap: true, // Wrap long text for better readability
    },
    {
      name: "Timestamp",
      selector: (row) => new Date(row.timestamp).toLocaleString(),
      
    },
  ];

  const customStyles = {
    headCells: {
      style: {
        fontWeight: "bold",
        fontSize: "16px",
        backgroundColor: "#1960b2",
        color: "#fff",
        textAlign: "center",
      },
    },
    rows: {
      style: {
        fontSize: "14px",
        backgroundColor: "#f8f9fa",
        '&:nth-of-type(odd)': {
          backgroundColor: "#e9ecef", // Alternating row color
        },
        cursor: "pointer",
      },
    },
  };

  return (
    <div className="activity-logs-container">
      <h2 className="activity-logs-title">Activity Logs</h2>
      <div className="refresh-btn">
              <Button
                onClick={fetchLogs}
                style={{
                  backgroundColor: "#1960b2",
                  borderColor: "#1960b2",
                }}
              >
                <FaSync /> Refresh
              </Button>
      </div>
      <div className="table-responsive">
        <DataTable
          columns={columns}
          data={logs}
          pagination
          highlightOnHover
          striped
          responsive
          progressPending={loading}
          customStyles={customStyles}
          onRowClicked={handleRowClick}
        />
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: "#007bff", color: "#fff" }}>
          <Modal.Title>Log Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLog && (
            <div className="log-details">
              <p><strong>Username:</strong> {selectedLog.username}</p>
              <p><strong>Action:</strong> {selectedLog.action}</p>
              <p><strong>Description:</strong> {selectedLog.description}</p>
              <p><strong>Timestamp:</strong> {new Date(selectedLog.timestamp).toLocaleString()}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ActivityLogs;
