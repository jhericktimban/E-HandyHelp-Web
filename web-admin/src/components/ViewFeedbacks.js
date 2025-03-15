import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import axios from "axios";
import DataTable from "react-data-table-component";
import { FaStar, FaSync, FaTrash, FaEye } from "react-icons/fa";
import Sentiment from "sentiment";
import Swal from "sweetalert2";
import "../css/feedback.css";

const sentimentAnalyzer = new Sentiment();

const ViewFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [filteredFeedbacks, setFilteredFeedbacks] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [sentimentResult, setSentimentResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://e-handyhelp-web-backend.onrender.com/api/feedback"
      );

      const sortedFeedbacks = response.data.sort((a, b) => {
        return new Date(b.createdAt || b.updatedAt) -
               new Date(a.createdAt || a.updatedAt);
      });

      setFeedbacks(sortedFeedbacks);
      setFilteredFeedbacks(sortedFeedbacks); // Initially display all data
    } catch (error) {
      console.error("Error fetching feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFeedback = async (feedback) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to delete feedback from ${feedback.userId?.fname || "N/A"} ${feedback.userId?.lname || "N/A"} to ${feedback.handymanId?.fname || "N/A"} ${feedback.handymanId?.lname || "N/A"}. This action cannot be undone.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      customClass: { confirmButton: "custom-confirm-btn" },
    });
  
    if (!result.isConfirmed) return;
  
    Swal.fire({
      title: "Deleting...",
      text: "Please wait while we delete the feedback.",
      allowEscapeKey: false,
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading(),
    });
  
    try {
      await axios.delete(
        `https://e-handyhelp-web-backend.onrender.com/api/feedback/${feedback._id}`
      );
  
      setFeedbacks((prevFeedbacks) =>
        prevFeedbacks.filter((f) => f._id !== feedback._id)
      );
      setFilteredFeedbacks((prevFeedbacks) =>
        prevFeedbacks.filter((f) => f._id !== feedback._id)
      );
  
      Swal.fire({
        title: "Deleted!",
        text: "Feedback deleted successfully.",
        icon: "success",
        showConfirmButton: true,
      });
    } catch (error) {
      console.error("Error deleting feedback:", error);
  
      Swal.fire({
        title: "Error",
        text: "Failed to delete feedback. Please try again.",
        icon: "error",
      });
    }
  };
  
  

  const handleSearch = (term) => {
    setSearchTerm(term);
    const filteredData = feedbacks.filter((feedback) => {
      const feedbackBy = `${feedback.userId?.fname || ""} ${feedback.userId?.lname || ""}`;
      const feedbackFor = `${feedback.handymanId?.fname || ""} ${feedback.handymanId?.lname || ""}`;
      return (
        feedbackBy.toLowerCase().includes(term.toLowerCase()) ||
        feedbackFor.toLowerCase().includes(term.toLowerCase())
      );
    });
    setFilteredFeedbacks(filteredData);
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

  const handleShowModal = (feedback) => {
    setSelectedFeedback(feedback);
    const result = sentimentAnalyzer.analyze(feedback.feedbackText);
    setSentimentResult(result);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFeedback(null);
    setSentimentResult(null);
  };

  const renderStars = (rating) => {
    return (
      <>
        {[...Array(5)].map((_, i) => (
          <FaStar key={i} color={i < rating ? "#ffc107" : "#e4e5e9"} />
        ))}
      </>
    );
  };

  const columns = [
    {
      name: "Feedback By",
      selector: (row) =>
        row.sent_by === "user"
          ? `${row.userId?.fname || "N/A"} ${row.userId?.lname || "N/A"}`
          : `${row.handymanId?.fname || "N/A"} ${row.handymanId?.lname || "N/A"}`,
    },
    {
      name: "For",
      selector: (row) =>
        row.sent_by === "user"
          ? `${row.handymanId?.fname || "N/A"} ${row.handymanId?.lname || "N/A"}`
          : `${row.userId?.fname || "N/A"} ${row.userId?.lname || "N/A"}`,
    },
    {
      name: "Rating",
      selector: (row) => renderStars(row.rating),
      cell: (row) => <div>{renderStars(row.rating)}</div>,
    },
    {
      name: "Date",
      selector: (row) =>
        new Date(row.createdAt || row.updatedAt).toLocaleString(),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Button
            className="view-details-btn"
            onClick={() => handleShowModal(row)}
            title="Details"
          >
            <FaEye />
          </Button>
          <Button
            className="delete-btn"
            onClick={() => handleDeleteFeedback(row)} 
            title="Delete"
          >
            <FaTrash />
          </Button>
        </div>
      ),
    }    
  ];

  return (
    <div className="feedbacks-container">
      <div className="header-container">
        <h2 className="feedbacks-title">Feedbacks</h2>
        <Form.Control
          type="text"
          placeholder="Search feedbacks..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="mb-3"
        />
       <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
        <Button
          className="refresh-btn"
          onClick={fetchFeedbacks}
          style={{
            backgroundColor: "#1960b2",
            borderColor: "#1960b2",
          }}
        >
          <FaSync /> Refresh
        </Button>
      </div>
      </div>

      <div className="feedbacks-table-container">
        <DataTable
          columns={columns}
          data={filteredFeedbacks}
          pagination
          highlightOnHover
          striped
          responsive
          customStyles={customStyles}
          progressPending={loading}
        />
      </div>

      {selectedFeedback && (
        <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
          <Modal.Header className="modal-header">
            <Modal.Title>Feedback Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Feedback By:</strong> {selectedFeedback.userId?.fname} {selectedFeedback.userId?.lname}</p>
            <p><strong>For:</strong> {selectedFeedback.handymanId?.fname} {selectedFeedback.handymanId?.lname}</p>
            <p><strong>Rating:</strong> {renderStars(selectedFeedback.rating)}</p>
            <p><strong>Feedback Text:</strong> {selectedFeedback.feedbackText}</p>
            {sentimentResult && (
                <div className="sentiment-result">
                  <p>
                    <strong>Sentiment Score:</strong> {sentimentResult.score}
                  </p>
                  <p>
                    <strong>Sentiment:</strong>{" "}
                    {sentimentResult.score > 0
                      ? "Positive"
                      : sentimentResult.score < 0
                      ? "Negative"
                      : "Neutral"}
                  </p>
                </div>
              )}
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={handleCloseModal}
            >
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default ViewFeedbacks;
