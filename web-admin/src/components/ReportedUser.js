import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import DataTable from "react-data-table-component";
import Swal from "sweetalert2";
import {
  FaEye,
  FaBan,
  FaSync,
  FaExclamationTriangle,
  FaInfoCircle,
  FaTrash,
} from "react-icons/fa";
import "../css/viewhandymanreports.css";

const ViewUserReports = () => {
    
  const [userReports, setUserReports] = useState([]);
  const [handymanReports, setHandymanReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://e-handyhelp-web-backend.onrender.com/api/reports"
      );
  
      const pendingReports = response.data
        .filter((report) => report.status === "pending")
        .sort((a, b) => 
          new Date(b?.additionalInfo?.dateReported) - 
          new Date(a?.additionalInfo?.dateReported)
        );
  
      const userReports = pendingReports.filter(
        (report) => report.reported_by === "user"
      );
      const handymanReports = pendingReports.filter(
        (report) => report.reported_by === "handyman"
      );
  
      
      setUserReports(userReports);
      setHandymanReports(handymanReports);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };
  

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

  const handleShowModal = (report) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedReport(null);
  };

  const handleRowSelect = ({ selectedRows }) => {
    setSelectedRows(selectedRows);
};

const handleClearSelected = async () => {
  if (selectedRows.length === 0) {
      Swal.fire({
          title: "No Reports Selected",
          text: "Please select reports to delete.",
          icon: "info",
          confirmButtonText: "OK",
      });
      return;
  }

  const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will permanently delete the selected reports.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete!",
      cancelButtonText: "Cancel",
      customClass: { confirmButton: "custom-confirm-btn" },
  });

  if (!result.isConfirmed) return;

  Swal.fire({
      title: "Deleting...",
      text: "Please wait while we delete the selected reports.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
          Swal.showLoading();
      },
  });

  try {
      const reportIds = selectedRows.map((report) => report._id);

      const response = await axios.delete(
          "https://e-handyhelp-web-backend.onrender.com/api/reports",
          { data: { reportIds } }
      );

      if (response.status === 200) {
          Swal.fire("Deleted!", "Selected reports deleted successfully.", "success");

          // ✅ Log the activity for each deleted report
          await Promise.all(
              selectedRows.map((report) =>
                  logActivity("Deleted Report", {
                      fname: report.reportedBy || "Unknown", // Handle missing names gracefully
                      lname: "",
                  })
              )
          );

          fetchReports(); // Refresh the table after deletion
          setSelectedRows([]); // Clear selected rows
      } else {
          Swal.fire("Failed", "Failed to delete reports. Please try again.", "error");
      }
  } catch (error) {
      console.error("Error deleting reports:", error);

      if (error.response && error.response.data.message) {
          Swal.fire("Error", error.response.data.message, "error");
      } else {
          Swal.fire("Error", "An error occurred while deleting reports.", "error");
      }
  }
};


  const logActivity = async (action, user) => {
    try {
      await fetch("https://e-handyhelp-web-backend.onrender.com/api/activityLogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "Admin", // Replace with dynamic admin username if available
          action: action,
          description: `Admin ${action.toLowerCase()}: ${user.fname} ${user.lname}`,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error("Error logging activity:", error);
    }
  };

  const logActivitywarning = async (action, reportedUserName) => {
    try {
      await fetch("https://e-handyhelp-web-backend.onrender.com/api/activityLogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "Admin", // Replace with dynamic admin username if available
          action: action,
          description: `Admin ${action.toLowerCase()} to user: ${reportedUserName}`,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error("Error logging activity:", error);
    }
  };
  


  const handleSuspendUser = async (userId, reportId, user) => {
    const result = await Swal.fire({
        title: "Are you sure?",
        text: "This will suspend the user.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes",
        cancelButtonText: "Cancel",
        customClass: { confirmButton: "custom-confirm-btn" },
    });

    if (!result.isConfirmed) return;

    Swal.fire({
        title: "Suspending...",
        text: "Please wait while we suspend the user.",
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
            Swal.showLoading();
        },
    });

    try {
        const response = await fetch(
            `https://e-handyhelp-web-backend.onrender.com/api/users/${userId}/suspend`,
            { method: "PUT" }
        );

        const data = await response.json();

        if (response.status === 400 && data.message === 'This user is already suspended.') {
            Swal.fire("Already Suspended", "This user is already suspended.", "info");
            return;
        }

        await logActivity("Suspended User", user);
        Swal.fire("Suspended!", "User suspended successfully.", "success");

        fetchReports();
    } catch (error) {
        console.error("Error suspending user:", error);
        Swal.fire("Error", "Failed to suspend user. Please try again.", "error");
    }
};

 


const handleSendWarning = async (report) => {
  const result = await Swal.fire({
    title: "Are you sure?",
    text: "Do you want to send a warning to this account?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "Cancel",
    customClass: { confirmButton: "custom-confirm-btn" }
  });

  if (!result.isConfirmed) return;

  Swal.fire({
    title: "Sending a warning...",
    text: "Please wait while we send the warning.",
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    const response = await axios.post(
      "https://e-handyhelp-web-backend.onrender.com/api/notifications/send-warning",
      {
        handymanId: report.handymanId?._id,
        userId: report.userId?._id,
        reported_by: report.reported_by
      }
    );

    // Extract reported user's name for activity log
    const reportedUserName = report.userId
      ? `${report.userId.fname} ${report.userId.lname}`
      : `${report.handymanId.fname} ${report.handymanId.lname}`;

    await logActivitywarning("Sent Warning", reportedUserName);

    Swal.fire("Warning Sent", "Warning has been successfully sent.", "success");
  } catch (error) {
    console.error("Error sending warning:", error);
    Swal.fire("Error", "Failed to send warning. Please try again.", "error");
  }
};



  const columns = [
    {
      name: "Report Reason",
      selector: "reportReason",
      cell: (row) => row?.reportReason || "No Reason Provided",
    },
    {
      name: "Date Reported",
      selector: "dateReported",
      cell: (row) =>
        row?.additionalInfo?.dateReported
          ? new Date(row.additionalInfo.dateReported).toLocaleString()
          : "N/A",
    },

    {
      name: "Reported By",
      selector: "reportedBy",
      cell: (row) =>
        row?.reported_by === "handyman"
          ? `${row?.handymanId?.fname || "Unknown"} ${
              row?.handymanId?.lname || ""
            }`
          : `${row?.userId?.fname || "Unknown"} ${row?.userId?.lname || ""}`,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex gap-2">
          <Button
            className="view-details-btn"
            onClick={() => handleShowModal(row)}
            title="Details"
          >
            <FaEye />
          </Button>
          <Button
            
            onClick={() => handleSuspendUser(row.userId._id, row._id, row.userId)}

            
            title="Suspend"
          >
            <FaBan />
          </Button>
          <Button
            onClick={() => handleSendWarning(row)}
            title="Send Warning"
          >
            <FaExclamationTriangle />
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="view-reports-container">
      <h2 className="view-reports-title">Reported User</h2>

      <div className="action-buttons">
                    <Button
                      onClick={fetchReports}
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
          data={userReports}
          pagination
          highlightOnHover
          customStyles={customStyles}
          progressPending={loading}
          selectableRows
          onSelectedRowsChange={handleRowSelect} // Track selected rows
        />

        </div>

      {selectedReport && (
        <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
          <Modal.Header style={{ backgroundColor: "#1960b2" }} closeButton>
            <Modal.Title>{"Incident Report Details"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              <strong>Reported By:</strong>{" "}
              {selectedReport?.reported_by === "handyman"
                ? `${selectedReport?.handymanId?.fname || "Unknown"} ${
                    selectedReport?.handymanId?.lname || ""
                  }`
                : `${selectedReport?.userId?.fname || "Unknown"} ${
                    selectedReport?.userId?.lname || ""
                  }`}
            </p>

            <p>
              <strong>Details of Reported Person:</strong>
            </p>
            <ul>
              <li>
                <strong>Name:</strong>{" "}
                {selectedReport?.reported_by === "handyman"
                  ? `${selectedReport?.userId?.fname || "Unknown"} ${
                      selectedReport?.userId?.lname || ""
                    }`
                  : `${selectedReport?.handymanId?.fname || "Unknown"} ${
                      selectedReport?.handymanId?.lname || ""
                    }`}
              </li>
              <li>
                <strong>Reason:</strong>{" "}
                {selectedReport?.reportReason || "No Reason Provided"}
              </li>
              <li>
                <strong>Date Reported:</strong>{" "}
                {selectedReport?.additionalInfo?.dateReported
                  ? new Date(
                      selectedReport?.additionalInfo?.dateReported
                    ).toLocaleString()
                  : "N/A"}
              </li>
            </ul>
          </Modal.Body>
          <Modal.Footer>
            <Button style={{ backgroundColor: "#727475", borderColor: "#727475", color: "#fff" }}
            onClick={handleCloseModal}>Close</Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default ViewUserReports;
