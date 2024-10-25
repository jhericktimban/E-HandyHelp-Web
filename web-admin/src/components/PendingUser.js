import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, Alert } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { FaUserClock, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import './styles.css';

const PendingUser = () => {
  const [showModal, setShowModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [alert, setAlert] = useState(null);

  // Fetch pending users from the backend
  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/pending');
        setPendingUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
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

  const handleVerifyUser = async () => {
    if (selectedUser) {
      try {
        await axios.put(`http://localhost:5000/api/users/${selectedUser._id}/verify`);
        setPendingUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === selectedUser._id ? { ...user, account_status: 'verified' } : user
          )
        );
        setAlert({ type: 'success', message: 'User verified successfully.' }); // Alert on success
        handleCloseModal();
      } catch (error) {
        console.error('Error verifying user:', error);
        setAlert({ type: 'danger', message: 'Failed to verify user.' }); // Alert on error
      }
    }
  };

  const handleRejectUser = async () => {
    if (selectedUser) {
      try {
        await axios.put(`http://localhost:5000/api/users/${selectedUser._id}/reject`);
        setPendingUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === selectedUser._id ? { ...user, account_status: 'rejected' } : user
          )
        );
        setAlert({ type: 'success', message: 'User rejected successfully.' }); // Alert on success
        handleCloseModal();
      } catch (error) {
        console.error('Error rejecting user:', error);
        setAlert({ type: 'danger', message: 'Failed to reject user.' }); // Alert on error
      }
    }
  };

  const handleDeleteUser = async () => {
    if (selectedUser) {
      try {
        await axios.delete(`http://localhost:5000/api/users/${selectedUser._id}`);
        setPendingUsers((prevUsers) => prevUsers.filter(user => user._id !== selectedUser._id));
        setAlert({ type: 'success', message: 'User deleted successfully.' });
      } catch (error) {
        console.error('Error deleting user:', error);
        setAlert({ type: 'danger', message: 'Failed to delete user.' });
      } finally {
        setShowConfirmDelete(false);
        setSelectedUser(null);
      }
    }
  };

  const columns = [
    {
      name: 'Name',
      selector: (row) => `${row.fname} ${row.lname}`,
      sortable: true,
    },
    {
      name: 'Username',
      selector: (row) => row.username,
      sortable: true,
    },
    {
      name: 'Account Status',
      selector: (row) => row.account_status, // Fixed typo here
      sortable: true,
    },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="action-cell">
          <Button variant="primary" onClick={() => handleOpenModal(row)}>
            <FaUserClock /> View Details
          </Button>
          <Button variant="danger" onClick={() => { setSelectedUser(row); setShowConfirmDelete(true); }}>
            <FaTrash /> Delete
          </Button>
        </div>
      ),
    },
  ];

  const filteredUsers = pendingUsers.filter((user) => {
    const fullName = `${user?.fname || ''} ${user?.lname || ''}`;
    return fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (user?.username && user.username.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  return (
    <div className="content-container pending-user">
      <h2>Pending Users</h2>
      <Form.Control
        type="text"
        placeholder="Search by Name or Email"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-3"
      />
      <DataTable
        columns={columns}
        data={filteredUsers} // Use the filtered users for the DataTable
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
              <p>Email: {selectedUser.email}</p>
              <p>Contact: {selectedUser.contact}</p>
              <p>Date of Birth: {new Date(selectedUser.dateOfBirth).toLocaleDateString()}</p>
              <p>Account Status: {selectedUser.account_status}</p>
              {selectedUser.validID ? (
                <p><strong>Valid ID:</strong> {selectedUser.validID}</p>
              ) : (
                <p><strong>Valid ID:</strong> <em>No ID provided</em></p>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
          <Button variant="success" onClick={handleVerifyUser}>Verify</Button>
          <Button variant="danger" onClick={handleRejectUser}>Reject</Button>
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

export default PendingUser;
