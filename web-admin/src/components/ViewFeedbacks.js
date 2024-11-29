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

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get("https://e-handyhelp-web-backend.onrender.com/api/feedback");
      setFeedbacks(response.data);
    } catch (error) {
      console.error("Error fetching feedback:", error);
    }
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
      name: "Actions",
      cell: (row) => (
        <Button 
         onClick={() => handleShowModal(row)}>
          View Details
        </Button>
      ),
    },
  ];

  return (
    <div className="container">
      <h2 className="view-feedbacks-title">Feedbacks</h2>
      <DataTable
        columns={columns}
        data={feedbacks}
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

      {selectedFeedback && (
        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>
              {selectedFeedback.sent_by === "user"
                ? "Feedback for Handyman"
                : "Feedback for User"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              <strong>Feedback Text:</strong> {selectedFeedback.feedbackText}
            </p>
            <p>
              <strong>Feedback By:</strong>{" "}
              {selectedFeedback.sent_by === "user"
                ? `${selectedFeedback.userId?.fname || "N/A"} ${selectedFeedback.userId?.lname || "N/A"}`
                : `${selectedFeedback.handymanId?.fname || "N/A"} ${selectedFeedback.handymanId?.lname || "N/A"}`}
            </p>
            <p>
              <strong>For:</strong>{" "}
              {selectedFeedback.sent_by === "user"
                ? `${selectedFeedback.handymanId?.fname || "N/A"} ${selectedFeedback.handymanId?.lname || "N/A"}`
                : `${selectedFeedback.userId?.fname || "N/A"} ${selectedFeedback.userId?.lname || "N/A"}`}
            </p>
            <p>
              <strong>Rating:</strong> {renderStars(selectedFeedback.rating)}
            </p>
            <p>
              <strong>Date Submitted:</strong>{" "}
              {new Date(selectedFeedback.timestamp).toLocaleString()}
            </p>

            {sentimentResult && (
              <div>
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
            <Button onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default ViewFeedbacks;
