import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Modal, Button } from "react-bootstrap";
import "../css/activitylogs.css";

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null); // State to store selected log
  const [showModal, setShowModal] = useState(false); // State to control modal visibility

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch("https://e-handyhelp-web-backend.onrender.com/api/activityLogs");
        const data = await response.json();
        console.log("Fetched Logs:", data); // Debugging line
        setLogs(data);
      } catch (error) {
        console.error("Error fetching logs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, []);

  // Handle row click to show modal
  const handleRowClick = (row) => {
    setSelectedLog(row);
    setShowModal(true);
  };

  // Define columns for DataTable
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
    },
    {
      name: "Timestamp",
      selector: (row) => new Date(row.timestamp).toLocaleString(),
    },
  ];

  // Custom styles for DataTable
  const customStyles = {
    headCells: {
      style: {
        fontWeight: "bold",
        fontSize: "16px",
        backgroundColor: "#007bff",
        color: "#fff",
      },
    },
    rows: {
      style: {
        fontSize: "14px",
        cursor: "pointer", // Indicate clickable rows
      },
    },
  };

  return (
    <div className="activity-logs-container">
      <h2 className="activity-logs-title">Activity Logs</h2>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={logs}
        pagination
        highlightOnHover
        striped
        responsive
        progressPending={loading}
        customStyles={customStyles}
        onRowClicked={handleRowClick} // Handle row click
      />

      {/* Modal for Activity Log Details */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton style={{ backgroundColor: "#007bff", color: "#fff" }}>
          <Modal.Title>Log Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLog && (
            <>
              <p><strong>Username:</strong> {selectedLog.username}</p>
              <p><strong>Action:</strong> {selectedLog.action}</p>
              <p><strong>Description:</strong> {selectedLog.description}</p>
              <p><strong>Timestamp:</strong> {new Date(selectedLog.timestamp).toLocaleString()}</p>
            </>
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
