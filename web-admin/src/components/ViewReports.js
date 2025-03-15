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
} from "react-icons/fa";
import "../css/ViewReports.css";

const ViewReports = () => {
  
  const [userReports, setUserReports] = useState([]);
  const [handymanReports, setHandymanReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);

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
    table: {
      style: { width: "100%" },
    },
    headCells: {
      style: { fontWeight: "bold", fontSize: "16px" },
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

 
    
const handleSuspendHandyman = async (handymanId, reportId, handyman) => {
  const result = await Swal.fire({
      title: "Are you sure?",
      text: "This will suspend the handyman.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
      customClass: { confirmButton: "custom-confirm-btn" },
  });

  if (!result.isConfirmed) return;

  Swal.fire({
      title: "Suspending...",
      text: "Please wait while we suspend the handyman.",
      allowOutsideClick: false,
      allowEscapeKey: false,
      didOpen: () => {
          Swal.showLoading();
      },
  });

  try {
      const response = await fetch(
          `https://e-handyhelp-web-backend.onrender.com/api/handymen/${handymanId}/suspend`,
          { method: "PUT" }
      );

      const data = await response.json();

      if (response.status === 400 && data.message === 'This handyman is already suspended.') {
          Swal.fire("Already Suspended", "This handyman is already suspended.", "info");
          return;
      }

      await logActivity("Suspended Handyman", handyman);

      Swal.fire("Suspended!", "Handyman suspended successfully.", "success");

      fetchReports();
  } catch (error) {
      console.error("Error suspending handyman:", error);
      Swal.fire("Error", "Failed to suspend handyman. Please try again.", "error");
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
  {
    try {
      await axios.post(
        "https://e-handyhelp-web-backend.onrender.com/api/notifications/send-warning",
        {
          handymanId: report.handymanId?._id,
          userId: report.userId?._id,
          reported_by: report.reported_by
        }
      );

      await logActivity("Sent Warning", report);

      Swal.fire("Warning Sent", "Warning has been successfully sent.", "success");
    } catch (error) {
      console.error("Error sending warning:", error);
      Swal.fire("Error", "Failed to send warning. Please try again.", "error");
    }
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
            style={{ backgroundColor: "#007bff", borderColor: "#007bff" }}
            onClick={() => handleShowModal(row)}
            title="Details"
          >
            <FaEye />
          </Button>
          <Button
            style={{ backgroundColor: "#007bff", borderColor: "#007bff" }}
            onClick={() =>
              row.reported_by === "handyman"
                ? handleSuspendUser(row.userId._id, row._id)
                : handleSuspendHandyman(row.handymanId._id, row._id)
                
            }
            
            title="Suspend"
          >
            <FaBan />
          </Button>
          <Button
            style={{ backgroundColor: "#007bff", borderColor: "#007bff" }}
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
    <div className="container">
      <h2 className="view-reports-title">Reported by Handymen</h2>
      <div className="table-responsive">
        <DataTable
          columns={columns}
          data={handymanReports}
          pagination
          highlightOnHover
          customStyles={customStyles}
          progressPending={loading}
        />
      </div>

      <h2 className="view-reports-title mt-15">Reported by Resident</h2>
      <div className="table-responsive">
        <DataTable
          columns={columns}
          data={userReports}
          pagination
          highlightOnHover
          customStyles={customStyles}
          progressPending={loading}
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

export default ViewReports;
