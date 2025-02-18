import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { FaUserClock, FaTrash } from "react-icons/fa";
import axios from "axios";
import "../css/pendinguser.css";

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
  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://e-handyhelp-web-backend.onrender.com/api/users/pending"
        );
        setPendingUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
      finally {
        setLoading(false);
      }
    };

    fetchPendingUsers();
  }, []);

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleVerifyUser = () => {
    if (selectedUser) {
      axios
        .put(`https://e-handyhelp-web-backend.onrender.com/api/users/${selectedUser._id}/verify`)
        .then(() => {
          setPendingUsers(
            pendingUsers.filter((user) => user._id !== selectedUser._id)
          );
          setAlert({message: "User verified successfully." });
          handleCloseModal();
        })
        .catch((error) => {
          console.error("Error verifying user:", error);
        });
    }
  };
  

  const handleRejectUser = async () => {
    if (selectedUser) {
      try {
        await axios.put(
          `https://e-handyhelp-web-backend.onrender.com/api/users/${selectedUser._id}/reject`
        );
        setPendingUsers(
          pendingUsers.filter((user) => user._id !== selectedUser._id)
        );
        setAlert({message: "User rejected successfully." });
        handleCloseModal();
      } catch (error) {
        console.error("Error rejecting user:", error);
        setAlert({message: "Failed to reject user." });
      }
    }
  };

  const handleDeleteUser = async () => {
    if (selectedUser) {
      try {
        await axios.delete(
          `https://e-handyhelp-web-backend.onrender.com/api/users/${selectedUser._id}`
        );
        setPendingUsers(
            pendingUsers.filter((user) => user._id !== selectedUser._id)
          );
        setAlert({message: "User deleted successfully." });
      } catch (error) {
        console.error("Error deleting user:", error);
        
      } finally {
        setShowConfirmDelete(false);
        setSelectedUser(null);
      }
    }
  };

  const columns = [
    {
      name: "Name",
      selector: (row) => `${row.fname} ${row.lname}`,
      sortable: true,
    },
    {
      name: "Username",
      selector: (row) => row.username,
      sortable: true,
    },
    
    {
      name: "Account Status",
      selector: (row) => row.account_status || "Pending",
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="button-group">
          <Button onClick={() => handleOpenModal(row)}>Details</Button>
          <Button
            onClick={() => {
              setSelectedUser(row);
              setShowConfirmDelete(true);
            }}
          >
            Delete
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
      <DataTable
        columns={columns}
        data={filteredUsers}
        pagination
        highlightOnHover
        striped
        responsive
        progressPending={loading} 
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
              <p>Address:{selectedUser.address}</p>
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
                  <div className="image-carousel">
                    <button
                      className="carousel-btn left"
                      onClick={() =>
                        setImageIndex((prev) =>
                          prev > 0
                            ? prev - 1
                            : selectedUser.images.length - 1
                        )
                      }
                    >
                      &#10094;
                    </button>
                    <img
                      src={
                        selectedUser.images[imageIndex].startsWith(
                          "data:image"
                        )
                          ? selectedUser.images[imageIndex]
                          : `data:image/png;base64,${selectedUser.images[imageIndex]}`
                      }
                      alt={`Valid ID ${imageIndex + 1}`}
                      className="carousel-image fixed-size"
                      onClick={() => setShowImageModal(true)}
                    />
                    <button
                      className="carousel-btn right"
                      onClick={() =>
                        setImageIndex((prev) =>
                          prev < selectedUser.images.length - 1
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
                      className="image-modal"
                      onClick={() => setShowImageModal(false)}
                    >
                      <div className="modal-content">
                        <span
                          className="close-btn"
                          onClick={() => setShowImageModal(false)}
                        >
                          &times;
                        </span>
                        <img
                          src={
                            selectedUser.images[imageIndex].startsWith(
                              "data:image"
                            )
                              ? selectedUser.images[imageIndex]
                              : `data:image/png;base64,${selectedUser.images[imageIndex]}`
                          }
                          alt={`Valid ID ${imageIndex + 1}`}
                          className="full-size-image"
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
          <Button onClick={handleVerifyUser}>Verify</Button>
          <Button onClick={handleRejectUser}>Reject</Button>
        </Modal.Footer>
      </Modal>

      {/* Confirmation Modal for Deletion */}
      <Modal
        show={showConfirmDelete}
        onHide={() => setShowConfirmDelete(false)}
        centered>
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
