import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import DataTable from "react-data-table-component";
import "../css/ViewReports.css";

const ViewReports = () => {
  const [reports, setReports] = useState([]);
<<<<<<< HEAD
  const [userReports, setUserReports] = useState([]);
  const [handymanReports, setHandymanReports] = useState([]);
=======
>>>>>>> fa407173ed1d37fa06522cf50e89ca3ddcbf2e4b
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchReports(); // Fetch reports on initial load
  }, []);

  const fetchReports = async () => {
    try {
<<<<<<< HEAD
      const response = await axios.get("http://localhost:8000/api/reports");
      const pendingReports = response.data.filter(
        (report) => report.status === "pending"
      );

      setReports(pendingReports);

      // Separate reports based on who reported them
      setUserReports(
        pendingReports.filter((report) => report.reported_by === "user")
      );
      setHandymanReports(
        pendingReports.filter((report) => report.reported_by === "handyman")
      );
=======
      const response = await axios.get(
        "http://localhost:8000/api/reports"
      );
      const pendingReports = response.data.filter(
        (report) => report.status === "pending"
      );
      setReports(pendingReports);
>>>>>>> fa407173ed1d37fa06522cf50e89ca3ddcbf2e4b
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
        `http://localhost:8000/api/handymen/${handymanId}/suspend`,
        { method: "PUT" }
      );
<<<<<<< HEAD
      await axios.put(`http://localhost:8000/api/reports/${reportId}`, {
        status: "completed",
      });
      alert(
        "Handyman suspended successfully and report status updated to completed."
      );
      fetchReports();
=======
      await axios.put(
        `http://localhost:8000/api/reports/${reportId}`,
        { status: "completed" }
      );
      alert(
        "Handyman suspended successfully and report status updated to completed."
      );
      fetchReports(); // Refresh the reports
>>>>>>> fa407173ed1d37fa06522cf50e89ca3ddcbf2e4b
    } catch (error) {
      console.error("Error suspending handyman:", error);
    }
  };

  const handleSuspendUser = async (userId, reportId) => {
    try {
<<<<<<< HEAD
      await fetch(`http://localhost:8000/api/users/${userId}/suspend`, {
        method: "PUT",
      });
      await axios.put(`http://localhost:8000/api/reports/${reportId}`, {
        status: "completed",
      });
      alert(
        "User suspended successfully and report status updated to completed."
      );
      fetchReports();
=======
      await fetch(
        `http://localhost:8000/api/users/${userId}/suspend`,
        { method: "PUT" }
      );
      await axios.put(
        `http://localhost:8000/api/reports/${reportId}`,
        { status: "completed" }
      );
      alert(
        "User suspended successfully and report status updated to completed."
      );
      fetchReports(); // Refresh the reports
>>>>>>> fa407173ed1d37fa06522cf50e89ca3ddcbf2e4b
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
        "http://localhost:8000/api/notifications",
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
<<<<<<< HEAD
          <Button className="mb-2" onClick={() => handleShowModal(row)}>
            Details
=======
          <Button
            variant="primary"
            className="mb-2"
            onClick={() => handleShowModal(row)}
          >
            View Details
>>>>>>> fa407173ed1d37fa06522cf50e89ca3ddcbf2e4b
          </Button>
          {row.reported_by === "handyman" ? (
            <>
              <Button
<<<<<<< HEAD
=======
                variant="danger"
>>>>>>> fa407173ed1d37fa06522cf50e89ca3ddcbf2e4b
                className="mb-2"
                onClick={() =>
                  handleSuspendHandyman(row.handymanId._id, row._id)
                }
              >
<<<<<<< HEAD
                Suspend
              </Button>
              <Button className="mb-2" onClick={() => handleSendWarning(row)}>
=======
                Suspend Handyman
              </Button>
              <Button
                variant="warning"
                className="mb-2"
                onClick={() => handleSendWarning(row)}
              >
>>>>>>> fa407173ed1d37fa06522cf50e89ca3ddcbf2e4b
                Send Warning
              </Button>
            </>
          ) : (
            <>
              <Button
<<<<<<< HEAD
                className="mb-2"
                onClick={() => handleSuspendUser(row.userId._id, row._id)}
              >
                Suspend
              </Button>
              <Button className="mb-2" onClick={() => handleSendWarning(row)}>
=======
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
>>>>>>> fa407173ed1d37fa06522cf50e89ca3ddcbf2e4b
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
<<<<<<< HEAD
          <h2 className="view-reports-title">Reported Handymen</h2>
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
            />
          </div>
        </div>

        <div className="col-12 mt-4">
          <h2 className="view-reports-title">Reported Resident</h2>
          <div className="table-responsive">
            <DataTable
              columns={columns}
              data={userReports}
=======
          <h2 className="view-reports-title">Pending Reports</h2>
          <div className="table-responsive">
            <DataTable
              columns={columns}
              data={reports}
>>>>>>> fa407173ed1d37fa06522cf50e89ca3ddcbf2e4b
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
<<<<<<< HEAD
              <strong>Reported By:</strong>{" "}
              {selectedReport?.reported_by === "handyman"
                ? `${selectedReport?.handymanId?.fname || "N/A"} ${
                    selectedReport?.handymanId?.lname || ""
                  }`
                : `${selectedReport?.userId?.fname || "N/A"} ${
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
                  ? `${selectedReport?.userId?.fname || "N/A"} ${
                      selectedReport?.userId?.lname || ""
                    }`
                  : `${selectedReport?.handymanId?.fname || "N/A"} ${
                      selectedReport?.handymanId?.lname || ""
                    }`}
              </li>
              <li>
                <strong>Reason:</strong>{" "}
                {selectedReport?.reportReason || "No Reason Provided"}
              </li>
              <li>
                <strong>Date Reported:</strong>{" "}
                {new Date(
                  selectedReport?.additionalInfo?.dateReported
                ).toLocaleString() || "N/A"}
              </li>
            </ul>
=======
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
>>>>>>> fa407173ed1d37fa06522cf50e89ca3ddcbf2e4b
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
