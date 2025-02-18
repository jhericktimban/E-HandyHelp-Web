import React, { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";
import DataTable from "react-data-table-component";
import { FaStar } from "react-icons/fa";
import Sentiment from "sentiment";
import "../css/feedback.css";

const sentimentAnalyzer = new Sentiment();

const ViewFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [sentimentResult, setSentimentResult] = useState(null);
  const [loading, setLoading] = useState(true);

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
        return (
          new Date(b.createdAt || b.updatedAt) -
          new Date(a.createdAt || a.updatedAt)
        );
      });

      setFeedbacks(sortedFeedbacks); // Set the sorted feedbacks
    } catch (error) {
      console.error("Error fetching feedback:", error);
    } finally {
      setLoading(false);
    }
  };

  const customStyles = {
    table: {
      style: {
        width: "100%",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)", // Table shadow added
        borderRadius: "10px",
      },
    },

    headCells: {
      style: {
        fontWeight: "bold",
        fontSize: "16px",
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
          : `${row.handymanId?.fname || "N/A"} ${
              row.handymanId?.lname || "N/A"
            }`,
    },
    {
      name: "For",
      selector: (row) =>
        row.sent_by === "user"
          ? `${row.handymanId?.fname || "N/A"} ${
              row.handymanId?.lname || "N/A"
            }`
          : `${row.userId?.fname || "N/A"} ${row.userId?.lname || "N/A"}`,
    },
    {
      name: "Rating",
      selector: (row) => renderStars(row.rating),
      cell: (row) => <div>{renderStars(row.rating)}</div>,
    },
    {
      name: "Actions",
      cell: (row) => (
        <Button
          className="view-details-btn"
          onClick={() => handleShowModal(row)}
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div className="feedbacks-container">
      <h2 className="feedbacks-title">Feedbacks</h2>
      <div className="feedbacks-table-container">
        <DataTable
          columns={columns}
          data={feedbacks}
          pagination
          highlightOnHover
          customStyles={customStyles}
          progressPending={loading}
        />
      </div>

      {selectedFeedback && (
        <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
          <Modal.Header className="modal-header" closeButton>
            <Modal.Title>
              {selectedFeedback.sent_by === "user"
                ? "Feedback for Handyman"
                : "Feedback for User"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body className="modal-body">
            <p>
              <strong>Feedback Text:</strong> {selectedFeedback.feedbackText}
            </p>
            <p>
              <strong>Feedback By:</strong>{" "}
              {selectedFeedback.sent_by === "user"
                ? `${selectedFeedback.userId?.fname || "N/A"} ${
                    selectedFeedback.userId?.lname || "N/A"
                  }`
                : `${selectedFeedback.handymanId?.fname || "N/A"} ${
                    selectedFeedback.handymanId?.lname || "N/A"
                  }`}
            </p>
            <p>
              <strong>For:</strong>{" "}
              {selectedFeedback.sent_by === "user"
                ? `${selectedFeedback.handymanId?.fname || "N/A"} ${
                    selectedFeedback.handymanId?.lname || "N/A"
                  }`
                : `${selectedFeedback.userId?.fname || "N/A"} ${
                    selectedFeedback.userId?.lname || "N/A"
                  }`}
            </p>
            <p>
              <strong>Rating:</strong> {renderStars(selectedFeedback.rating)}
            </p>
            <p>
              <strong>Date Submitted:</strong>{" "}
              {new Date(selectedFeedback.timestamp).toLocaleString()}
            </p>

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
            <Button className="close-modal-btn" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default ViewFeedbacks;
