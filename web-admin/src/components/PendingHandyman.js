import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import './pendinghandyman.css';

const PendingHandyman = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedHandyman, setSelectedHandyman] = useState(null);
  const [pendingHandymen, setPendingHandymen] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [handymanToDelete, setHandymanToDelete] = useState(null);

  // Fetch pending handymen from the backend
  useEffect(() => {
    axios.get('http://localhost:5000/api/handymen/pending')
      .then((response) => {
        setPendingHandymen(response.data);
      })
      .catch((error) => {
        console.error('Error fetching handymen:', error);
      });
  }, []);

  const handleOpenModal = (handyman) => {
    setSelectedHandyman(handyman);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedHandyman(null);
  };

  const handleVerifyHandyman = () => {
    if (selectedHandyman) {
      axios.put(`http://localhost:5000/api/handymen/${selectedHandyman._id}/verify`)
        .then(() => {
          setPendingHandymen(pendingHandymen.map(handyman =>
            handyman._id === selectedHandyman._id ? { ...handyman, accounts_status: 'verified' } : handyman
          ));
          handleCloseModal();
        })
        .catch(error => {
          console.error('Error verifying handyman:', error);
        });
    }
  };

  const handleRejectHandyman = () => {
    if (selectedHandyman) {
      axios.put(`http://localhost:5000/api/handymen/${selectedHandyman._id}/reject`)
        .then(() => {
          setPendingHandymen(pendingHandymen.map(handyman =>
            handyman._id === selectedHandyman._id ? { ...handyman, accounts_status: 'rejected' } : handyman
          ));
          handleCloseModal();
        })
        .catch(error => {
          console.error('Error rejecting handyman:', error);
        });
    }
  };

  const handleDeleteHandyman = (handymanId) => {
    setHandymanToDelete(handymanId);
    setShowDeleteModal(true);
  };

  const confirmDeleteHandyman = () => {
    if (handymanToDelete) {
      axios.delete(`http://localhost:5000/api/handymen/${handymanToDelete}`)
        .then(() => {
          setPendingHandymen(pendingHandymen.filter(handyman => handyman._id !== handymanToDelete));
          setShowDeleteModal(false);
          alert('Handyman deleted successfully!');
        })
        .catch(error => {
          console.error('Error deleting handyman:', error);
        });
    }
  };

  // Filtering handymen based on the search term
  const filteredHandymen = pendingHandymen.filter((handyman) => {
    const fullName = `${handyman?.fname || ''} ${handyman?.lname || ''}`;
    return fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           (handyman?.contact && handyman.contact.toLowerCase().includes(searchTerm.toLowerCase()));
  });

  const columns = [
    {
      name: 'Name',
      selector: row => `${row.fname} ${row.lname}`,
      sortable: true,
    },
    {
      name: 'Status',
      selector: row => row.accounts_status || 'Pending Handyman',
      sortable: true,
    },
    {
      name: 'Action',
      cell: row => (
        <div className="action-buttons">
          <Button variant="primary" onClick={() => handleOpenModal(row)} className="mb-2">
            View Details
          </Button>
          <Button variant="danger" onClick={() => handleDeleteHandyman(row._id)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="content-container pending-handyman">
      <h2>Pending Handymen</h2>
      <Form.Control
        type="text"
        placeholder="Search by Name or Contact"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-3"
      />
      <DataTable
        columns={columns}
        data={filteredHandymen}
        pagination
        highlightOnHover
        responsive
        customStyles={{
          table: {
            style: {
              width: '100%',
            },
          },
        }}
      />

      {/* Modal for handyman details */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Handyman Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedHandyman && (
            <>
              <h5>Name: {selectedHandyman.fname} {selectedHandyman.lname}</h5>
              <p>Description: {selectedHandyman.accounts_status || 'Pending Handyman'}</p>
              <p>Contact: {selectedHandyman.contact}</p>
              <p>Specialization: {selectedHandyman.specialization.join(', ')}</p>
              {selectedHandyman.validID ? (
                <p><strong>Valid ID:</strong> {selectedHandyman.validID}</p>
              ) : (
                <p><strong>Valid ID:</strong> <em>No ID provided</em></p>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
          <Button variant="success" onClick={handleVerifyHandyman}>Verify</Button>
          <Button variant="danger" onClick={handleRejectHandyman}>Reject</Button>
        </Modal.Footer>
      </Modal>

      {/* Confirmation modal for deletion */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this handyman?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={confirmDeleteHandyman}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PendingHandyman;
