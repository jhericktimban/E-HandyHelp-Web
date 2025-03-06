import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import DataTable from "react-data-table-component";
import axios from "axios";
import "../css/rejectedhandyman.css";

const RejectedHandyman = () => {
  const [showModal, setShowModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [selectedHandyman, setSelectedHandyman] = useState(null);
  const [rejectedHandyman, setRejectedHandyman] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [alert, setAlert] = useState(null);

  const [showImageModal, setShowImageModal] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  const [loading, setLoading] = useState(true);

  // Fetch Rejected handyman from the backend
  useEffect(() => {
    const fetchRejectedHandyman = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://e-handyhelp-web-backend.onrender.com/api/handymen/rejected"
        );

        const sortedHandyman = response.data.sort((a, b) => {
          return (
            new Date(b.rejectedAt || b.updatedAt || b.createdAt) -
            new Date(a.rejectedAt || a.updatedAt || a.createdAt)
          );
        });
        setRejectedHandyman(sortedHandyman);
      } catch (error) {
        console.error("Error fetching Handymen:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRejectedHandyman();
  }, []);

  const customStyles = {
    headCells: {
      style: {
        fontWeight: "bold",
        fontSize: "16px",
      },
    },
  };

  const handleOpenModal = (handyman) => {
    setSelectedHandyman(handyman);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedHandyman(null);
  };

  const logActivity = async (action, handyman) => {
    try {
      await fetch("https://e-handyhelp-web-backend.onrender.com/api/activityLogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "Admin", // Replace with dynamic admin username if available
          action: action,
          description: `Admin ${action.toLowerCase()}: ${handyman.fname} ${handyman.lname}`,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error("Error logging activity:", error);
    }
  };

  const handleDeleteHandyman = async () => {
    if (selectedHandyman) {
      try {
        await fetch(`https://e-handyhelp-web-backend.onrender.com/api/handymen/${selectedHandyman._id}`, {
          method: "DELETE",
        });
  
        setRejectedHandyman(rejectedHandyman.filter((handyman) => handyman._id !== selectedHandyman._id));
        setAlert({ message: "Handyman deleted successfully."});
  
        // Log Activity
        await logActivity("Deleted Rejected Handyman", selectedHandyman);
      } catch (error) {
        console.error("Error deleting handyman:", error);
        setAlert({ message: "Failed to delete handyman."});
      } finally {
        setShowConfirmDelete(false);
        setSelectedHandyman(null);
      }
    }
  };

  const columns = [
    {
      name: "Name",
      selector: (row) => `${row.fname} ${row.lname}`,
    },
    {
      name: "Username",
      selector: (row) => row.username,
    },
    {
      name: "Account Status",
      selector: (row) => row.account_status || "Rejected",
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="button-group">
          <Button onClick={() => handleOpenModal(row)}>Details</Button>
          <Button
            onClick={() => {
              setSelectedHandyman(row);
              setShowConfirmDelete(true);
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const filteredHandyman = rejectedHandyman.filter((handyman) => {
    const fullName = `${handyman?.fname || ""} ${handyman?.lname || ""}`;
    return (
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (handyman?.username &&
        handyman.username.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="content-container rejected-handyman">
      <h2>Rejected Handyman</h2>
      <Form.Control
        type="text"
        placeholder="Search by name or username..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-3"
      />
      <DataTable
        columns={columns}
        data={filteredHandyman}
        pagination
        highlightOnHover
        striped
        responsive
        progressPending={loading}
        customStyles={customStyles}
      />

      {/* Alert for success or error messages */}
      {alert && (
        <Alert variant={alert.type} onClose={() => setAlert(null)} dismissible>
          {alert.message}
        </Alert>
      )}

      {/* Modal for Handyman details */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header style={{ backgroundColor: "#1960b2" }} closeButton>
          <Modal.Title>Handyman Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedHandyman && (
            <>
              <h5>
                Name: {selectedHandyman.fname} {selectedHandyman.lname}
              </h5>
              <p>Address: {selectedHandyman.address}</p>
              <p>Email: {selectedHandyman.email}</p>
              <p>Username: {selectedHandyman.username}</p>
              <p>Contact: {selectedHandyman.contact}</p>
              <p>
                Specialization:{" "}
                {Array.isArray(selectedHandyman.specialization)
                  ? selectedHandyman.specialization.join(", ")
                  : selectedHandyman.specialization}
              </p>

              <p>
                Date of Birth:{" "}
                {new Date(selectedHandyman.dateOfBirth).toLocaleDateString()}
              </p>
              {selectedHandyman.images && selectedHandyman.images.length > 0 ? (
                <>
                  <strong>Valid ID:</strong>
                  <div className="image-carousel-handyman">
                    <button
                      className="carousel-btn-handyman left"
                      onClick={() =>
                        setImageIndex((prev) =>
                          prev > 0
                            ? prev - 1
                            : selectedHandyman.images.length - 1
                        )
                      }
                    >
                      &#10094;
                    </button>
                    <img
                      src={
                        selectedHandyman.images[imageIndex].startsWith(
                          "data:image"
                        )
                          ? selectedHandyman.images[imageIndex]
                          : `data:image/png;base64,${selectedHandyman.images[imageIndex]}`
                      }
                      alt={`Valid ID ${imageIndex + 1}`}
                      className="carousel-image-handyman fixed-size"
                      onClick={() => setShowImageModal(true)}
                    />
                    <button
                      className="carousel-btn-handyman right"
                      onClick={() =>
                        setImageIndex((prev) =>
                          prev < selectedHandyman.images.length - 1
                            ? prev + 1
                            : 0
                        )
                      }
                    >
                      &#10095;
                    </button>
                  </div>

                  {/* Image Modal for Full-Size View */}
                  {showImageModal && (
                    <div
                      className="image-modal-handyman"
                      onClick={() => setShowImageModal(false)}
                    >
                      <div className="modal-content-handyman">
                        <img
                          src={
                            selectedHandyman.images[imageIndex].startsWith(
                              "data:image"
                            )
                              ? selectedHandyman.images[imageIndex]
                              : `data:image/png;base64,${selectedHandyman.images[imageIndex]}`
                          }
                          alt={`Valid ID ${imageIndex + 1}`}
                          className="full-size-image-handyman"
                        />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p>
                  <strong>Valid ID:</strong> <em>No ID provided</em>
                </p>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCloseModal}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Confirmation Modal for Deletion */}
      <Modal
        show={showConfirmDelete}
        onHide={() => setShowConfirmDelete(false)}
        centered
      >
        <Modal.Header style={{ backgroundColor: "#1960b2" }} closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete {selectedHandyman?.fname}{" "}
          {selectedHandyman?.lname}?
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowConfirmDelete(false)}>Cancel</Button>
          <Button onClick={handleDeleteHandyman}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RejectedHandyman;
