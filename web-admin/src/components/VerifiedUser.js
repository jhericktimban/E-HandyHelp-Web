import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import DataTable from "react-data-table-component";
import axios from "axios";
import "../css/verifieduser.css";
import Swal from "sweetalert2";
import {
  FaEye,
  FaBan,
  FaTrash,
} from "react-icons/fa";

const VerifiedUser = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [verifiedUsers, setVerifiedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showConfirmDelete, setShowConfirmDelete] = useState(false); // State for delete confirmation
  const [alert, setAlert] = useState(null);

  const [loading, setLoading] = useState(true);

  const [showImageModal, setShowImageModal] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  // Fetch verified users from the backend
  useEffect(() => {
    const fetchVerifiedUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://e-handyhelp-web-backend.onrender.com/api/users/verified"
        );

        const sortedUsers = response.data.sort((a, b) => {
          return (
            new Date(b.verifiedAt || b.updatedAt || b.createdAt) -
            new Date(a.verifiedAt || a.updatedAt || a.createdAt)
          );
        });

        setVerifiedUsers(sortedUsers); // Set the sorted users
      } catch (error) {
        console.error("Error fetching verified users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVerifiedUsers();
  }, []);

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const customStyles = {
    headCells: {
      style: {
        fontWeight: "bold",
        fontSize: "16px",
      },
    },
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setShowConfirmDelete(false); // Reset delete confirmation when modal closes
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
          description: `Admin ${action.toLowerCase()} user: ${user.fname} ${user.lname}`,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error("Error logging activity:", error);
    }
  };

  const handleDeleteUser = async (user) => {
            const result = await Swal.fire({
              title: "Are you sure?",
              text: `You are about to delete ${user.fname} ${user.lname}. This action cannot be undone.`,
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
              text: "Please wait while we delete the user.",
              allowEscapeKey: false,
              allowOutsideClick: false,
              didOpen: () => {
                Swal.showLoading(); // Show loading spinner
              },
            });
          
            try {
              await fetch(
                `https://e-handyhelp-web-backend.onrender.com/api/users/${user._id}`,
                { method: "DELETE" }
              );
          
              setVerifiedUsers((prevUser) =>
                prevUser.filter((u) => u._id !== user._id)
              );
          
              await logActivity("Deleted Verified User", user);
          
              Swal.fire({
                title: "Deleted!",
                text: "User deleted successfully.",
                icon: "success",
                showConfirmButton: true,
              });
            } catch (error) {
              console.error("Error deleting user:", error);
          
              Swal.fire({
                title: "Error",
                text: "Failed to delete user. Please try again.",
                icon: "error",
              });
            }
          };


  // Filter verified users based on search term
  const filteredUsers = verifiedUsers.filter((user) => {
    const fullName = `${user?.fname || ""} ${user?.lname || ""}`;
    return (
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user?.username &&
        user.username.toLowerCase().includes(searchTerm.toLowerCase()))
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
      selector: (row) => row.accounts_status || "Verified User",
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
          <Button
            onClick={() => {
              handleDeleteUser(row);
             
            }}
            title="Delete"
          >
            <FaTrash/>
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="content-container verified-user">
      <h2>Verified Users</h2>
      <Form.Control
        type="text"
        placeholder="Search by name or username..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-3"
      />
      <DataTable
        columns={columns}
        data={filteredUsers} // Use the filtered users
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

      {/* Modal for User details */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header style={{ backgroundColor: "#1960b2" }} closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <>
              <h5>
                Name: {selectedUser.fname} {selectedUser.lname}
              </h5>
              <p>Address: {selectedUser.address}</p>
              <p>Email: {selectedUser.email}</p>
              <p>Username: {selectedUser.username}</p>
              <p>Contact: {selectedUser.contact}</p>

              <p>
                Date of Birth:{" "}
                {new Date(selectedUser.dateOfBirth).toLocaleDateString()}
              </p>
              {selectedUser.images && selectedUser.images.length > 0 ? (
                <>
                  <strong>Valid ID:</strong>
                  <div className="image-carousel-user">
                    <button
                      className="carousel-btn-user left"
                      onClick={() =>
                        setImageIndex((prev) =>
                          prev > 0 ? prev - 1 : selectedUser.images.length - 1
                        )
                      }
                    >
                      &#10094;
                    </button>
                    <img
                      src={
                        selectedUser.images[imageIndex].startsWith("data:image")
                          ? selectedUser.images[imageIndex]
                          : `data:image/png;base64,${selectedUser.images[imageIndex]}`
                      }
                      alt={`Valid ID ${imageIndex + 1}`}
                      className="carousel-image-user fixed-size"
                      onClick={() => setShowImageModal(true)}
                    />
                    <button
                      className="carousel-btn-user right"
                      onClick={() =>
                        setImageIndex((prev) =>
                          prev < selectedUser.images.length - 1 ? prev + 1 : 0
                        )
                      }
                    >
                      &#10095;
                    </button>
                  </div>

                  {/* Image Modal for Full-Size View */}
                  {showImageModal && (
                    <div
                      className="image-modal-user"
                      onClick={() => setShowImageModal(false)}
                    >
                      <div className="modal-content-user">
                        <img
                          src={
                            selectedUser.images[imageIndex].startsWith(
                              "data:image"
                            )
                              ? selectedUser.images[imageIndex]
                              : `data:image/png;base64,${selectedUser.images[imageIndex]}`
                          }
                          alt={`Valid ID ${imageIndex + 1}`}
                          className="full-size-image-user"
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

export default VerifiedUser;
