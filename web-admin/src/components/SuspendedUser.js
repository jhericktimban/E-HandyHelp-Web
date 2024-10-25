import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Alert } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import './styles.css';

const SuspendedUser = () => {
  const [showModal, setShowModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [suspendedUsers, setSuspendedUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [alert, setAlert] = useState(null);

  // Function to fetch suspended users from the backend
  const fetchSuspendedUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users/suspended');
      setSuspendedUsers(response.data);
    } catch (error) {
      console.error('Error fetching suspended users:', error);
    }
  };

  // Fetch suspended users when component mounts
  useEffect(() => {
    fetchSuspendedUsers();
  }, []);

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleConfirmDelete = () => {
    setShowConfirmDelete(true);
  };

  const handleDeleteUser = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${selectedUser._id}`);
      setAlert({ type: 'success', message: 'User deleted successfully.' });
      fetchSuspendedUsers(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting user:', error);
      setAlert({ type: 'danger', message: 'Failed to delete user.' });
    } finally {
      setShowConfirmDelete(false);
      setSelectedUser(null);
    }
  };

  const handleLiftSuspension = async (user) => {
    try {
      await axios.put(`http://localhost:5000/api/users/${user._id}/lift-suspension`);
      setAlert({ type: 'success', message: `Suspension lifted for ${user.fname} ${user.lname}.` });
      fetchSuspendedUsers(); // Refresh the list after lifting suspension
    } catch (error) {
      console.error('Error lifting suspension:', error);
      setAlert({ type: 'danger', message: 'Failed to lift suspension.' });
    }
  };

  // Filter suspended users based on search term
  const filteredUsers = suspendedUsers.filter(user =>
    `${user.fname} ${user.lname}`.toLowerCase().includes(searchTerm.toLowerCase())
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
      selector: row => row.accounts_status || 'Suspended',
      sortable: true,
    },
    {
      name: 'Action',
      selector: row => row.id, // Set a unique identifier
      cell: row => (
        <div className="action-cell">
          <Button variant="primary" onClick={() => handleOpenModal(row)} className="btn">
            View Details
          </Button>
          <Button variant="danger" onClick={() => { setSelectedUser(row); handleConfirmDelete(); }} className="btn">
            Delete
          </Button>
          <Button variant="success" onClick={() => handleLiftSuspension(row)} className="btn">
            Lift Suspension
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="content-container suspended-user">
      <h2>Suspended Users</h2>
      <Form.Control
        type="text"
        placeholder="Search by name..."
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
      />

      {/* Alert for success or error messages */}
      {alert && (
        <Alert variant={alert.type} onClose={() => setAlert(null)} dismissible>
          {alert.message}
        </Alert>
      )}

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

      {/* Confirmation Modal for Deletion */}
      <Modal show={showConfirmDelete} onHide={() => setShowConfirmDelete(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete {selectedUser?.fname} {selectedUser?.lname}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmDelete(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteUser}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SuspendedUser;
