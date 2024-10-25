import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import './styles.css';

const VerifiedUser = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [verifiedUsers, setVerifiedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false); // State for delete confirmation

  // Fetch verified users from the backend
  useEffect(() => {
    const fetchVerifiedUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/verified'); // Fetching from backend
        setVerifiedUsers(response.data); // Set the fetched users in state
      } catch (error) {
        console.error('Error fetching verified users:', error);
      }
    };

    fetchVerifiedUsers();
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
        await axios.delete(`http://localhost:5000/api/users/${selectedUser._id}`); // Call delete API
        setVerifiedUsers((prevUsers) =>
          prevUsers.filter((user) => user._id !== selectedUser._id) // Remove user from state
        );
        handleCloseModal();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  // Filter verified users based on search term
  const filteredUsers = verifiedUsers.filter(user =>
    `${user.fname} ${user.lname}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    {
      name: 'Name',
      selector: row => `${row.fname} ${row.lname}`,
      sortable: true,
    },
    {
      name: 'Username',
      selector: row => row.username,
      sortable: true,
    },
    {
      name: 'Account Status',
      selector: row => row.accounts_status,
      sortable: true,
    },
    {
      name: 'Action',
      cell: row => (
        <div className="button-group">
          <Button variant="primary" onClick={() => handleOpenModal(row)}>
            View Details
          </Button>
          <Button variant="danger" onClick={() => {
            setSelectedUser(row);
            setShowDeleteConfirm(true);
          }}>
            Delete
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
      />

      {/* Modal for user details */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <>
              <h5>Name: {selectedUser.fname} {selectedUser.lname}</h5>
              <p>Username: {selectedUser.username}</p>
              <p>Contact: {selectedUser.contact}</p>
              <p>Date of Birth: {new Date(selectedUser.dateOfBirth).toLocaleDateString()}</p>
              <p>Account Status: {selectedUser.accounts_status}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Confirmation modal for deletion */}
      <Modal show={showDeleteConfirm} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the user {selectedUser?.fname} {selectedUser?.lname}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteUser}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default VerifiedUser;
