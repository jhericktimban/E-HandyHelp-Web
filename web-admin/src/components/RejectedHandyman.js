import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import DataTable from "react-data-table-component";
import axios from "axios";
import "../css/rejectedhandyman.css";

const RejectedHandyman = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false); // State for delete confirmation modal
  const [selectedHandyman, setSelectedHandyman] = useState(null);
  const [rejectedHandymen, setRejectedHandymen] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch rejected handymen from the backend
  useEffect(() => {
    const fetchRejectedHandymen = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/handymen/rejected"
        );
        setRejectedHandymen(response.data);
      } catch (error) {
        console.error("Error fetching rejected handymen:", error);
      }
    };

    fetchRejectedHandymen();
  }, []);

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
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedHandyman(null);
  };

  // Function to handle the delete action
  const handleDelete = async () => {
    try {
      await axios.delete(
        `http://localhost:8000/api/handymen/rejected/${selectedHandyman._id}`
      ); // Make sure the API endpoint is correct
      setRejectedHandymen(
        rejectedHandymen.filter((h) => h._id !== selectedHandyman._id)
      ); // Update state after deletion
      handleCloseDeleteModal();
    } catch (error) {
      console.error("Error deleting handyman:", error);
    }
  };

  const filteredHandymen = rejectedHandymen.filter((handyman) => {
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
      sortable: true,
    },
    {
      name: "Username",
      selector: (row) => row.username,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.accounts_status || "Rejected",
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="button-group">
          <Button
          
            onClick={() => handleOpenModal(row)}
            className="mr-2"
          >
             Details
          </Button>
          <Button
          onClick={() => handleOpenDeleteModal(row)}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="content-container rejected-handyman">
      <h2>Rejected Handymen</h2>
      <Form.Control
        type="text"
        placeholder="Search by name or username..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-3"
      />
      <div>
        {" "}
        {/* Removed overflow styling for better layout */}
        <DataTable
          columns={columns}
          data={filteredHandymen} // Use filtered data for display
          pagination
          highlightOnHover
          striped
          responsive
        />
      </div>

      {/* Modal for handyman details */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Handyman Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedHandyman && (
            <>
              <h5>
                Name: {selectedHandyman.fname} {selectedHandyman.lname}
              </h5>
              <p>Username: {selectedHandyman.username}</p>
              <p>Contact: {selectedHandyman.contact}</p>
              <p>
                Specialization: {selectedHandyman.specialization.join(", ")}
              </p>
              <p>Account Status: {selectedHandyman.accounts_status}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the handyman {selectedHandyman?.fname}{" "}
          {selectedHandyman?.lname}?
        </Modal.Body>
        <Modal.Footer>
          <Button  onClick={handleCloseDeleteModal}>
            Cancel
          </Button>
          <Button  onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RejectedHandyman;
