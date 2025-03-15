import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import DataTable from "react-data-table-component";
import axios from "axios";
import "../css/pendinguser.css";
import Swal from "sweetalert2";
import {
  FaEye,
  FaTrash,
  FaSync,
} from "react-icons/fa";


const PendingUser = () => {
  const [showModal, setShowModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [alert, setAlert] = useState(null);

  const [showImageModal, setShowImageModal] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  const [loading, setLoading] = useState(true);

  // Fetch pending users from the backend
  
    const fetchPendingUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://e-handyhelp-web-backend.onrender.com/api/users/pending"
        );
        // Sort pending handymen by creation date (descending)
        const sortedUsers = response.data.sort((a, b) => {
          return (
            new Date(b.createdAt || b.updatedAt || b.pendingAt) -
            new Date(a.createdAt || a.updatedAt || a.pendingAt)
          );
        });

        setPendingUsers(sortedUsers);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    useEffect(() => {
    fetchPendingUsers();
  }, []);

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

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
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
            description: `Admin ${action.toLowerCase()}: ${user.fname} ${user.lname}`,
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (error) {
        console.error("Error logging activity:", error);
      }
    };
    
  const handleVerifyUser = async () => {
    const result = await Swal.fire({
                  title: "Are you sure?",
                  text: "This will verified the user.",
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonText: "Yes",
                  cancelButtonText: "Cancel",
                  customClass: {
                    confirmButton: "custom-confirm-btn",
                    cancelButton: "custom-cancel-btn",
                  },
                });
            
            if (!result.isConfirmed) return;
        
            Swal.fire({
                  title: "Verifying...",
                  text: "Please wait while we verify the user.",
                  allowEscapeKey: false,
                  allowOutsideClick: false,
                  didOpen: () => {
                    Swal.showLoading(); // Show loading spinner
                  },
                });

    if (selectedUser) {
      try {
        await fetch(`https://e-handyhelp-web-backend.onrender.com/api/users/${selectedUser._id}/verify`, {
          method: "PUT",
        });
  
        setPendingUsers(pendingUsers.filter((user) => user._id !== selectedUser._id));
        
  
        // Log Activity
        await logActivity("Verified User", selectedUser);
          Swal.fire("Verified!", "User verified successfully.", "success");
          handleCloseModal();
      } catch (error) {
        console.error("Error verifying user:", error);
        Swal.fire({
                  title: "Error",
                  text: "Failed to delete user. Please try again.",
                  icon: "error",
                });
      }
    }
  };
  
  const handleRejectUser = async () => {
    const result = await Swal.fire({
          title: "Are you sure?",
          text: "This will reject the user.",
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes",
          cancelButtonText: "Cancel",
          customClass: {
            confirmButton: "custom-confirm-btn",
            cancelButton: "custom-cancel-btn",
          },
        });
    
        if (!result.isConfirmed) return;
    
          Swal.fire({
                title: "Rejecting...",
                text: "Please wait while we reject the user.",
                allowEscapeKey: false,
                allowOutsideClick: false,
                didOpen: () => {
                  Swal.showLoading(); // Show loading spinner
                },
              });


    if (selectedUser) {
      try {
        await fetch(`https://e-handyhelp-web-backend.onrender.com/api/users/${selectedUser._id}/reject`, {
          method: "PUT",
        });
  
        setPendingUsers(pendingUsers.filter((user) => user._id !== selectedUser._id));
        
  
        // Log Activity
        await logActivity("Rejected User", selectedUser);
          Swal.fire("Rejected!", "User rejected successfully.", "success");
          handleCloseModal();
      } catch (error) {
        console.error("Error rejecting user:", error);
        Swal.fire({
                  title: "Error",
                  text: "Failed to reject user. Please try again.",
                  icon: "error",
                });
      }
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
      
          setPendingUsers((prevUser) =>
            prevUser.filter((u) => u._id !== user._id)
          );
      
          await logActivity("Deleted Pending User", user);
      
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
      selector: (row) => row.account_status || "Pending",
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="button-group">
          <Button onClick={() => handleOpenModal(row)}
          title="Details"
            >
              <FaEye/></Button>
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

  const filteredUsers = pendingUsers.filter((user) => {
    const fullName = `${user?.fname || ""} ${user?.lname || ""}`;
    return (
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user?.username &&
        user.username.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="content-container pending-user">
      <h2>Pending Users</h2>
      <Form.Control
        type="text"
        placeholder="Search by name or username..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-3"
      />
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "10px" }}>
                    <Button
                      className="refresh-btn"
                      onClick={fetchPendingUsers}
                      style={{
                        backgroundColor: "#1960b2",
                        borderColor: "#1960b2",
                      }}
                    >
                      <FaSync /> Refresh
                    </Button>
                  </div>
      <DataTable
        columns={columns}
        data={filteredUsers}
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

      {/* Modal for user details */}
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
          <Button style={{ backgroundColor: "#1960b2", borderColor: "#1960b2", color: "#fff" }}
          onClick={handleVerifyUser}>Verify</Button>
          <Button style={{ backgroundColor: "#1960b2", borderColor: "#1960b2", color: "#fff" }}
          onClick={handleRejectUser}>Reject</Button>
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
          Are you sure you want to delete {selectedUser?.fname}{" "}
          {selectedUser?.lname}?
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowConfirmDelete(false)}>Cancel</Button>
          <Button onClick={handleDeleteUser}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PendingUser;
