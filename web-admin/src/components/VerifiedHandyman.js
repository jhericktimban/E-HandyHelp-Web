import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import DataTable from "react-data-table-component";
import axios from "axios";
import "../css/verifiedhandyman.css";

const VerifiedHandyman = () => {
  const [showModal, setShowModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [selectedHandyman, setSelectedHandyman] = useState(null);
  const [verifiedHandymen, setVerifiedHandymen] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [alert, setAlert] = useState(null);

  const [loading, setLoading] = useState(true);

  // Fetch verified handymen from the backend
  // Fetch verified handymen from the backend
useEffect(() => {
  const fetchVerifiedHandymen = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        "https://e-handyhelp-web-backend.onrender.com/api/handymen/verified"
      );
      setVerifiedHandymen(response.data);
    } catch (error) {
      console.error("Error fetching verified handymen:", error);
    } finally {
      setLoading(false);
    }
  };

  fetchVerifiedHandymen();
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
    setShowConfirmDelete(true);
  };

  const handleCloseDeleteModal = () => {
    setShowConfirmDelete(false);
    setSelectedHandyman(null);
  };

  const handleDeleteHandyman = async () => {
    if (selectedHandyman) {
      try {
        await axios.delete(
          `https://e-handyhelp-web-backend.onrender.com/api/handymen/${selectedHandyman._id}`
        );
        setVerifiedHandymen(
          verifiedHandymen.filter(
            (handyman) => handyman._id !== selectedHandyman._id
          )
        );
        setAlert({ message: "Handyman deleted successfully!" });
      } catch (error) {
        console.error("Error deleting handyman:", error);
      } finally {
        setShowConfirmDelete(false);
        setSelectedHandyman(null);
      }
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
      sortable: true,
    },
    {
      name: "Username",
      selector: (row) => row.username,
      sortable: true,
    },
    {
      name: "Account Status",
      selector: (row) => row.accounts_status || "Verified Handyman",
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="button-group">
          <Button onClick={() => handleOpenModal(row)}>Details</Button>
          <Button onClick={() => handleOpenDeleteModal(row)} className="ml-2">
            Delete
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

      />

      {/* Alert for success or error messages */}
      {alert && (
        <Alert variant={alert.type} onClose={() => setAlert(null)} dismissible>
          {alert.message}
        </Alert>
      )}

      {/* Modal for handyman details */}
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
              <p>Username: {selectedHandyman.username}</p>
              <p>
                Description:{" "}
                {selectedHandyman.accounts_status || "Verified Handyman"}
              </p>
              <p>Email: {selectedHandyman.email}</p>
              <p>
                Specialization: {selectedHandyman.specialization.join(", ")}
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCloseModal}>Close</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for delete confirmation */}
      <Modal show={showConfirmDelete} onHide={handleCloseDeleteModal} centered>
        <Modal.Header style={{ backgroundColor: "#1960b2" }} closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete the handyman{" "}
          <strong>
            {selectedHandyman?.fname} {selectedHandyman?.lname}
          </strong>
          ?
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCloseDeleteModal}>Cancel</Button>
          <Button onClick={handleDeleteHandyman}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default VerifiedHandyman;
