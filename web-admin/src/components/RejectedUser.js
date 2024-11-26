import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import DataTable from "react-data-table-component";
import axios from "axios";
import "../css/rejecteduser.css";

const RejectedUser = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // State for delete confirmation
  const [selectedUser, setSelectedUser] = useState(null);
  const [rejectedUsers, setRejectedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch rejected users from the backend
  useEffect(() => {
    const fetchRejectedUsers = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/users/rejected"
        );
        setRejectedUsers(response.data);
      } catch (error) {
        console.error("Error fetching rejected users:", error);
      }
    };

    fetchRejectedUsers();
  }, []);

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setShowDeleteConfirm(false); // Reset delete confirmation when modal closes
  };

  const handleDeleteUser = async () => {
    if (selectedUser) {
      try {
        await axios.delete(
          `http://localhost:8000/api/users/${selectedUser._id}`
        ); // Call delete API
        setRejectedUsers(
          (prevUsers) =>
            prevUsers.filter((user) => user._id !== selectedUser._id) // Remove user from state
        );
        handleCloseModal();
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  // Filter rejected users based on search term
<<<<<<< HEAD
  const filteredUsers = rejectedUsers.filter((user) => {
    const fullName = `${user?.fname || ""} ${user?.lname || ""}`;
    return (
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user?.username &&
        user.username.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });
=======
  const filteredUsers = rejectedUsers.filter((user) =>
    `${user.fname} ${user.lname}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

>>>>>>> fa407173ed1d37fa06522cf50e89ca3ddcbf2e4b
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
      selector: (row) => row.accounts_status || "Rejected",
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="button-group">
<<<<<<< HEAD
          <Button 
          onClick={() => handleOpenModal(row)}>
             Details
          </Button>
          <Button
            
=======
          <Button variant="primary" onClick={() => handleOpenModal(row)}>
             Details
          </Button>
          <Button
            variant="danger"
>>>>>>> fa407173ed1d37fa06522cf50e89ca3ddcbf2e4b
            onClick={() => {
              setSelectedUser(row);
              setShowDeleteConfirm(true);
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="content-container rejected-user">
      <h2>Rejected Users</h2>
      <Form.Control
        type="text"
<<<<<<< HEAD
        placeholder="Search by name or username..."
=======
        placeholder="Search by name..."
>>>>>>> fa407173ed1d37fa06522cf50e89ca3ddcbf2e4b
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
      />

      {/* Modal for user details */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <>
              <h5>
                Name: {selectedUser.fname} {selectedUser.lname}
              </h5>
              <p>Username: {selectedUser.username}</p>
              <p>Contact: {selectedUser.contact}</p>
              <p>
                Date of Birth:{" "}
                {new Date(selectedUser.dateOfBirth).toLocaleDateString()}
              </p>
              <p>Account Status: {selectedUser.accounts_status}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirmation modal for deletion */}
      <Modal show={showDeleteConfirm} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the user {selectedUser?.fname}{" "}
          {selectedUser?.lname}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteUser}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RejectedUser;
