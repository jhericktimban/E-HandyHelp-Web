import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import DataTable from "react-data-table-component";
import axios from "axios";
import "../css/verifiedhandyman.css";
import Swal from "sweetalert2";
import {
  FaEye,
  FaBan,
  FaTrash,
} from "react-icons/fa";

const VerifiedHandyman = () => {
  const [showModal, setShowModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [selectedHandyman, setSelectedHandyman] = useState(null);
  const [verifiedHandymen, setVerifiedHandymen] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [alert, setAlert] = useState(null);

  const [showImageModal, setShowImageModal] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  const [loading, setLoading] = useState(true);

  // Fetch verified handymen from the backend
  useEffect(() => {
    const fetchVerifiedHandymen = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://e-handyhelp-web-backend.onrender.com/api/handymen/verified"
        );
        const sortedHandyman = response.data.sort((a, b) => {
          return (
            new Date(b.verifiedAt || b.updatedAt || b.createdAt) -
            new Date(a.verifiedAt || a.updatedAt || a.createdAt)
          );
        });
        setVerifiedHandymen(sortedHandyman);
      } catch (error) {
        console.error("Error fetching verified handymen:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVerifiedHandymen();
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

  const handleOpenDeleteModal = (handyman) => {
    setSelectedHandyman(handyman);
    setShowConfirmDelete(true);
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

  const handleDeleteHandyman = async (handyman) => {
        const result = await Swal.fire({
          title: "Are you sure?",
          text: `You are about to delete ${handyman.fname} ${handyman.lname}. This action cannot be undone.`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, delete it",
          cancelButtonText: "Cancel",
          customClass: {
            confirmButton: "custom-confirm-btn",
          },
        });
      
        if (!result.isConfirmed) return;
      
        Swal.fire({
          title: "Deleting...",
          text: "Please wait while we delete the handyman.",
          allowEscapeKey: false,
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading(); // Show loading spinner
          },
        });
      
        try {
          await fetch(
            `https://e-handyhelp-web-backend.onrender.com/api/handymen/${handyman._id}`,
            { method: "DELETE" }
          );
      
          setVerifiedHandymen((prevHandymen) =>
            prevHandymen.filter((h) => h._id !== handyman._id)
          );
      
          await logActivity("Deleted Verified Handyman", handyman);
      
          Swal.fire({
            title: "Deleted!",
            text: "Handyman deleted successfully.",
            icon: "success",
            showConfirmButton: true,
          });
        } catch (error) {
          console.error("Error deleting handyman:", error);
      
          Swal.fire({
            title: "Error",
            text: "Failed to delete handyman. Please try again.",
            icon: "error",
          });
        }
      };
  
  

  // Filter verified handymen based on search term
  const filteredHandymen = verifiedHandymen.filter((handyman) => {
    const fullName = `${handyman?.fname || ""} ${handyman?.lname || ""}`;
    return (
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (handyman?.username &&
        handyman.username.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

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
      selector: (row) => row.accounts_status || "Verified Handyman",
    },
   
    {
      name: "Action",
      cell: (row) => (
        <div className="button-group">
          <Button onClick={() => handleOpenModal(row)}
            title="Details"
            >
            <FaEye/>
            </Button>
          <Button onClick={() => handleDeleteHandyman(row)} className="ml-2"
            title="Delete">
          <FaTrash/>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="content-container verified-handyman">
      <h2>Verified Handymen</h2>
      <Form.Control
        type="text"
        placeholder="Search by name or username..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-3"
      />
      <DataTable
        columns={columns}
        data={filteredHandymen}
        pagination
        highlightOnHover
        striped
        responsive
        style={{ minHeight: "400px" }} // Consistent with other component layout
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
          <Button style={{ backgroundColor: "#727475", borderColor: "#727475", color: "#fff" }}
          onClick={handleCloseModal}>Close</Button>
        </Modal.Footer>
      </Modal>

     
    </div>
  );
};

export default VerifiedHandyman;
