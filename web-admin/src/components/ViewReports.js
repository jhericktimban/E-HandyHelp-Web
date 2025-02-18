import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import DataTable from "react-data-table-component";
import "../css/ViewReports.css";

const ViewReports = () => {
  const [reports, setReports] = useState([]);
  const [userReports, setUserReports] = useState([]);
  const [handymanReports, setHandymanReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports(); // Fetch reports on initial load
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://e-handyhelp-web-backend.onrender.com/api/reports"
      );
      const pendingReports = response.data.filter(
        (report) => report.status === "pending"
      );

      // Separate reports based on who reported them
      const userReports = pendingReports.filter(
        (report) => report.reported_by === "user"
      );
      const handymanReports = pendingReports.filter(
        (report) => report.reported_by === "handyman"
      );

      setReports(pendingReports);
      setUserReports(userReports);
      setHandymanReports(handymanReports);
    } catch (error) {
      console.error("Error fetching reports:", error);
    }
    finally {
      setLoading(false);
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

  const handleSuspendUser = async (userId, reportId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to suspend this resident?"
    );

    if (!isConfirmed) return; // If not confirmed, exit the function

    try {
      await fetch(
        `https://e-handyhelp-web-backend.onrender.com/api/users/${userId}/suspend`,
        {
          method: "PUT",
        }
      );
      await axios.put(
        `https://e-handyhelp-web-backend.onrender.com/api/reports/${reportId}`,
        {
          status: "completed",
        }
      );
      alert(
        "User suspended successfully and report status updated to completed."
      );
      fetchReports();
    } catch (error) {
      console.error("Error suspending user:", error);
    }
  };

  const handleSuspendHandyman = async (handymanId, reportId) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to suspend this handyman?"
    );

    if (!isConfirmed) return; // If not confirmed, exit the function

    try {
      await fetch(
        `https://e-handyhelp-web-backend.onrender.com/api/handymen/${handymanId}/suspend`,
        { method: "PUT" }
      );
      await axios.put(
        `https://e-handyhelp-web-backend.onrender.com/api/reports/${reportId}`,
        {
          status: "completed",
        }
      );
      alert(
        "Handyman suspended successfully and report status updated to completed."
      );
      fetchReports();
    } catch (error) {
      console.error("Error suspending handyman:", error);
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
        "https://e-handyhelp-web-backend.onrender.com/api/notifications",
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
      cell: (row) => row?.reportReason || "No Reason Provided",
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
      name: "Date Reported",
      selector: "dateReported",
      cell: (row) =>
        row?.additionalInfo?.dateReported
          ? new Date(row.additionalInfo.dateReported).toLocaleString()
          : "N/A",
    },

    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex flex-column">
          <Button
            className="custom-btn details mb-2"
            onClick={() => handleShowModal(row)}
          >
            Details
          </Button>
          {row.reported_by === "handyman" ? (
            <>
              <Button
                className="custom-btn suspend mb-2"
                onClick={() => handleSuspendUser(row.userId._id, row._id)}
              >
                Suspend
              </Button>
              <Button
                className="custom-btn warning mb-2"
                onClick={() => handleSendWarning(row)}
              >
                Send Warning
              </Button>
            </>
          ) : (
            <>
              <Button
                className="custom-btn suspend mb-2"
                onClick={() =>
                  handleSuspendHandyman(row.handymanId._id, row._id)
                }
              >
                Suspend
              </Button>
              <Button
                className="custom-btn warning mb-2"
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
          <h2 className="view-reports-title">Reported by Handymen</h2>
          <div className="table-responsive">
            <DataTable
              columns={columns}
              data={handymanReports}
              pagination
              highlightOnHover
              customStyles={{
                table: {
                  style: {
                    width: "100%",
                  },
                },
              }}
              progressPending={loading} 

            />
          </div>
        </div>

        <div className="col-12 mt-4">
          <h2 className="view-reports-title">Reported by Resident</h2>
          <div className="table-responsive">
            <DataTable
              columns={columns}
              data={userReports}
              pagination
              highlightOnHover
              customStyles={{
                table: {
                  style: {
                    width: "100%",
                  },
                },
              }}
              progressPending={loading}
            />
          </div>
        </div>
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
            <Button onClick={handleCloseModal}>Close</Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default ViewReports;
