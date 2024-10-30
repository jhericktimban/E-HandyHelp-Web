import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import DataTable from "react-data-table-component";
import "../css/ViewReports.css";

const ViewReports = () => {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchReports(); // Fetch reports on initial load
  }, []);

  const fetchReports = async () => {
    try {
      const response = await axios.get(
        "https://661be00c-d2b2-45f7-95e7-954b7c9ba16b-00-1lrnb460qojsa.pike.replit.dev/api/reports"
      );
      const pendingReports = response.data.filter(
        (report) => report.status === "pending"
      );
      setReports(pendingReports);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
  };

  const handleShowModal = (report) => {
    setSelectedReport(report);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedReport(null);
  };

  const handleSuspendHandyman = async (handymanId, reportId) => {
    try {
      await fetch(
        `https://661be00c-d2b2-45f7-95e7-954b7c9ba16b-00-1lrnb460qojsa.pike.replit.dev/api/handymen/${handymanId}/suspend`,
        { method: "PUT" }
      );
      await axios.put(
        `https://661be00c-d2b2-45f7-95e7-954b7c9ba16b-00-1lrnb460qojsa.pike.replit.dev/api/reports/${reportId}`,
        { status: "completed" }
      );
      alert(
        "Handyman suspended successfully and report status updated to completed."
      );
      fetchReports(); // Refresh the reports
    } catch (error) {
      console.error("Error suspending handyman:", error);
    }
  };

  const handleSuspendUser = async (userId, reportId) => {
    try {
      await fetch(
        `https://661be00c-d2b2-45f7-95e7-954b7c9ba16b-00-1lrnb460qojsa.pike.replit.dev/api/users/${userId}/suspend`,
        { method: "PUT" }
      );
      await axios.put(
        `https://661be00c-d2b2-45f7-95e7-954b7c9ba16b-00-1lrnb460qojsa.pike.replit.dev/api/reports/${reportId}`,
        { status: "completed" }
      );
      alert(
        "User suspended successfully and report status updated to completed."
      );
      fetchReports(); // Refresh the reports
    } catch (error) {
      console.error("Error suspending user:", error);
    }
  };

  const handleSendWarning = async (report) => {
    const notificationContent =
      "Your account is subjected for suspension. Please email us your NTE to avoid account suspension.";
    const notification = {
      handymanId: report.handymanId?._id,
      userId: report.userId?._id,
      notification_content: notificationContent,
      notif_for: report.reported_by === "handyman" ? "handyman" : "user",
      date_sent: new Date().toISOString(),
    };

    try {
      await axios.post(
        "https://661be00c-d2b2-45f7-95e7-954b7c9ba16b-00-1lrnb460qojsa.pike.replit.dev/api/notifications",
        notification
      );
      alert("Warning sent successfully.");
    } catch (error) {
      console.error("Error sending warning:", error);
    }
  };

  const columns = [
    {
      name: "Report Reason",
      selector: "reportReason",
      cell: (row) => row.reportReason || "No Reason Provided",
    },
    {
      name: "Reported By",
      selector: "reportedBy",
      cell: (row) =>
        row.reported_by === "handyman"
          ? `${row.handymanId.fname || "N/A"} ${row.handymanId.lname || ""}`
          : `${row.userId.fname || "N/A"} ${row.userId.lname || ""}`,
    },
    {
      name: "Date Reported",
      selector: "dateReported",
      cell: (row) =>
        new Date(row.additionalInfo.dateReported).toLocaleString() || "N/A",
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex flex-column">
          <Button
            variant="primary"
            className="mb-2"
            onClick={() => handleShowModal(row)}
          >
            View Details
          </Button>
          {row.reported_by === "handyman" ? (
            <>
              <Button
                variant="danger"
                className="mb-2"
                onClick={() =>
                  handleSuspendHandyman(row.handymanId._id, row._id)
                }
              >
                Suspend Handyman
              </Button>
              <Button
                variant="warning"
                className="mb-2"
                onClick={() => handleSendWarning(row)}
              >
                Send Warning
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="danger"
                className="mb-2"
                onClick={() => handleSuspendUser(row.userId._id, row._id)}
              >
                Suspend User
              </Button>
              <Button
                variant="warning"
                className="mb-2"
                onClick={() => handleSendWarning(row)}
              >
                Send Warning
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <h2 className="view-reports-title">Pending Reports</h2>
          <div className="table-responsive">
            <DataTable
              columns={columns}
              data={reports}
              pagination
              highlightOnHover
              customStyles={{
                table: {
                  style: {
                    width: "100%",
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {selectedReport && (
        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              {selectedReport?.reportReason || "No Reason Provided"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              <strong>Description:</strong>{" "}
              {selectedReport?.additionalInfo?.workDescription || "N/A"}
            </p>
            <p>
              <strong>Reported By:</strong>{" "}
              {selectedReport?.userId?.fname || "N/A"}{" "}
              {selectedReport?.userId?.lname || ""}
            </p>
            <p>
              <strong>Date Reported:</strong>{" "}
              {new Date(
                selectedReport?.additionalInfo?.dateReported
              ).toLocaleString() || "N/A"}
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default ViewReports;
