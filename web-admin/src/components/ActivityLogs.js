import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import { Modal, Button } from "react-bootstrap";
import "../css/activitylogs.css";
import Swal from "sweetalert2";
import { FaSync, FaTrash } from "react-icons/fa";

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

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

  const handleRowSelect = ({ selectedRows }) => {
    setSelectedRows(selectedRows);
  };



  const handleClearSelected = async () => {
      if (selectedRows.length === 0) {
          Swal.fire({
              title: "No Logs Selected",
              text: "Please select logs to delete.",
              icon: "info",
              confirmButtonText: "OK",
          });
          return;
      }
  
      const result = await Swal.fire({
          title: "Are you sure?",
          text: "This will permanently delete the selected logs.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, delete!",
          cancelButtonText: "Cancel",
          customClass: { confirmButton: "custom-confirm-btn" },
      });
  
      if (!result.isConfirmed) return;
  
      Swal.fire({
          title: "Deleting...",
          text: "Please wait while we delete the selected logs.",
          allowOutsideClick: false,
          allowEscapeKey: false,
          didOpen: () => {
              Swal.showLoading();
          },
      });
  
      try {
          const response = await fetch(
              "https://e-handyhelp-web-backend.onrender.com/api/delete-logs",
              {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ logIds: selectedRows.map((log) => log._id) }),
              }
          );
  
          if (response.ok) {
              Swal.fire("Deleted!", "Selected logs deleted successfully.", "success");
              fetchLogs(); // Refresh the logs after deletion
              setSelectedRows([]); // Clear selected rows
          } else {
              Swal.fire("Failed", "Failed to delete logs. Please try again.", "error");
          }
      } catch (error) {
          console.error("Error deleting logs:", error);
          Swal.fire("Error", "An error occurred while deleting logs.", "error");
      }
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
      wrap: true,
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
        "&:nth-of-type(odd)": {
          backgroundColor: "#e9ecef",
        },
        cursor: "pointer",
      },
    },
  };

  return (
    <div className="activity-logs-container">
      <h2 className="activity-logs-title">Activity Logs</h2>

      <div className="action-buttons">
        <Button
          onClick={fetchLogs}
          style={{
            backgroundColor: "#1960b2",
            borderColor: "#1960b2",
            marginRight: "10px",
          }}
        >
          <FaSync /> Refresh
        </Button>

        <Button
          onClick={handleClearSelected}
          style={{
            backgroundColor: "#dc3545",
            borderColor: "#dc3545",
          }}
          disabled={selectedRows.length === 0} // Disable if no rows are selected
        >
          <FaTrash /> Clear Selected
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
          selectableRows
          onSelectedRowsChange={handleRowSelect}
          progressPending={loading}
          customStyles={customStyles}
          onRowClicked={handleRowClick}
        />
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header
          closeButton
          style={{ backgroundColor: "#007bff", color: "#fff" }}
        >
          <Modal.Title>Log Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedLog && (
            <div className="log-details">
              <p>
                <strong>Username:</strong> {selectedLog.username}
              </p>
              <p>
                <strong>Action:</strong> {selectedLog.action}
              </p>
              <p>
                <strong>Description:</strong> {selectedLog.description}
              </p>
              <p>
                <strong>Timestamp:</strong>{" "}
                {new Date(selectedLog.timestamp).toLocaleString()}
              </p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ActivityLogs;
