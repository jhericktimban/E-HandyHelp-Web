import React, { useEffect, useState } from "react";
import { Card, Button, Modal } from "react-bootstrap";
import axios from "axios";
import "../css/feedback.css"; // Custom styles if any
import { FaStar } from "react-icons/fa"; // For rendering star icons
import Sentiment from "sentiment"; // Import Sentiment.js

const sentimentAnalyzer = new Sentiment(); // Create an instance of Sentiment

const ViewFeedbacks = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [sentimentResult, setSentimentResult] = useState(null); // State for storing sentiment result

  useEffect(() => {
    // Fetch feedback data from the API
    axios
      .get(
        "http://localhost:8000/api/feedback"
      ) // Replace with your backend URL
      .then((response) => {
        setFeedbacks(response.data); // Set the fetched feedback in state
      })
      .catch((error) => {
        console.error("Error fetching feedback:", error);
      });
  }, []);

  const handleShowModal = (feedback) => {
    setSelectedFeedback(feedback);
    // Perform sentiment analysis on feedback text
    const result = sentimentAnalyzer.analyze(feedback.feedbackText);
    setSentimentResult(result); // Set sentiment result (score and other data)
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedFeedback(null);
    setSentimentResult(null); // Reset sentiment result when modal is closed
  };

  // Helper function to render star ratings
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar key={i} color={i <= rating ? "#ffc107" : "#e4e5e9"} />
      );
    }
    return stars;
  };

  return (
    <div className="view-feedbacks-container">
      <h2 className="view-feedbacks-title">Feedbacks</h2>
      <div className="feedbacks-list">
        {feedbacks.map((feedback, index) => {
          const title =
            feedback.sent_by === "user"
              ? "Feedback for User"
              : "Feedback for Handyman";
          const feedbackByName =
            feedback.sent_by === "user"
              ? `${feedback.userId?.fname || "N/A"} ${
                  feedback.userId?.lname || "N/A"
                }`
              : `${feedback.handymanId?.fname || "N/A"} ${
                  feedback.handymanId?.lname || "N/A"
                }`;

          return (
            <Card key={index} className="feedback-card">
              <Card.Body>
                <Card.Title>{title}</Card.Title>
                <Card.Text>
                  <strong>Feedback By:</strong> {feedbackByName} <br />
                  <strong>
                    {feedback.sent_by === "user" ? "Handyman" : "User"}:
                  </strong>
                  {feedback.sent_by === "user"
                    ? `${feedback.handymanId?.fname || "N/A"} ${
                        feedback.handymanId?.lname || "N/A"
                      }`
                    : `${feedback.userId?.fname || "N/A"} ${
                        feedback.userId?.lname || "N/A"
                      }`}
                  <br />
                  <strong>Rating:</strong> {renderStars(feedback.rating)}{" "}
                  {/* Display star icons */}
                </Card.Text>
                <Button
                  variant="primary"
                  onClick={() => handleShowModal(feedback)}
                >
                  View Details
                </Button>
              </Card.Body>
            </Card>
          );
        })}
      </div>

      {selectedFeedback && (
        <Modal show={showModal} onHide={handleCloseModal}>
          <Modal.Header closeButton>
            <Modal.Title>
              {selectedFeedback.sent_by === "user"
                ? "Feedback for User"
                : "Feedback for Handyman"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
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
              <strong>
                {selectedFeedback.sent_by === "user" ? "Handyman" : "User"}:
              </strong>
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

            {/* Display sentiment analysis result */}
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
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default ViewFeedbacks;
