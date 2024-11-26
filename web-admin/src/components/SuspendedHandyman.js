import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import DataTable from "react-data-table-component";
import axios from "axios";
import "../css/suspendedhandyman.css";

const SuspendedHandyman = () => {
  const [showModal, setShowModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [showConfirmLift, setShowConfirmLift] = useState(false);
  const [selectedHandyman, setSelectedHandyman] = useState(null);
  const [suspendedHandymen, setSuspendedHandymen] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [alert, setAlert] = useState(null);

  // Fetch suspended handymen from the backend
  const fetchSuspendedHandymen = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8000/handymen/suspended"
      );
      setSuspendedHandymen(response.data);
    } catch (error) {
      console.error("Error fetching suspended handymen:", error);
    }
  };

  useEffect(() => {
    fetchSuspendedHandymen(); // Fetch data when component mounts
  }, []);

  const handleOpenModal = (handyman) => {
    setSelectedHandyman(handyman);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedHandyman(null);
  };

  const handleConfirmDelete = () => {
    setShowConfirmDelete(true);
  };

  const handleConfirmLift = () => {
    setShowConfirmLift(true);
  };

  const handleDeleteHandyman = async () => {
    try {
      await axios.delete(
        `http://localhost:8000/handymen/${selectedHandyman._id}`
      );
      setAlert({ type: "success", message: "Handyman deleted successfully." });
      await fetchSuspendedHandymen(); // Refresh data after deletion
    } catch (error) {
      console.error("Error deleting handyman:", error);
      setAlert({ type: "danger", message: "Failed to delete handyman." });
    } finally {
      setShowConfirmDelete(false);
      setSelectedHandyman(null);
    }
  };

  const handleLiftSuspension = async () => {
    try {
      await axios.put(
        `http://localhost:8000/api/handymen/lift-suspension/${selectedHandyman._id}`,
        {
          accounts_status: "verified",
        }
      );
      setAlert({ type: "success", message: "Suspension lifted successfully." });
      await fetchSuspendedHandymen(); // Refresh data after lifting suspension
    } catch (error) {
      console.error("Error lifting suspension:", error);
      setAlert({ type: "danger", message: "Failed to lift suspension." });
    } finally {
      setShowConfirmLift(false);
      setSelectedHandyman(null);
    }
  };

  // Filter suspended handymen based on search term
<<<<<<< HEAD
  const filteredHandymen = suspendedHandymen.filter((handyman) => {
    const fullName = `${handyman?.fname || ""} ${handyman?.lname || ""}`;
    return (
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (handyman?.username &&
        handyman.username.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });
=======
  const filteredHandymen = suspendedHandymen.filter((handyman) =>
    `${handyman.fname} ${handyman.lname}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );
>>>>>>> fa407173ed1d37fa06522cf50e89ca3ddcbf2e4b

  const columns = [
    {
      name: "Name",
      selector: (row) => `${row.fname} ${row.lname}`,
      sortable: true,
      width: "150px",
    },
    {
      name: "Username",
      selector: (row) => row.username, // Replaced email with username
      sortable: true,
      width: "200px",
    },
    {
      name: "Account Status",
      selector: (row) => row.accounts_status || "Suspended",
      sortable: true,
      width: "150px",
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="button-group">
          <Button
<<<<<<< HEAD
            
=======
            variant="success"
>>>>>>> fa407173ed1d37fa06522cf50e89ca3ddcbf2e4b
            onClick={() => {
              setSelectedHandyman(row);
              handleConfirmLift();
            }}
          >
            Lift Suspension
          </Button>
          <Button
<<<<<<< HEAD
           
=======
            variant="danger"
>>>>>>> fa407173ed1d37fa06522cf50e89ca3ddcbf2e4b
            onClick={() => {
              setSelectedHandyman(row);
              handleConfirmDelete();
            }}
          >
            Delete
          </Button>
<<<<<<< HEAD
          <Button 
          onClick={() => handleOpenModal(row)}>
=======
          <Button variant="primary" onClick={() => handleOpenModal(row)}>
>>>>>>> fa407173ed1d37fa06522cf50e89ca3ddcbf2e4b
             Details
          </Button>
        </div>
      ),
      width: "200px",
    },
  ];

  return (
    <div className="content-container suspended-handyman">
      <h2>Suspended Handymen</h2>
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
        data={filteredHandymen}
        pagination
        highlightOnHover
        striped
        responsive
      />

      {alert && (
        <Alert variant={alert.type} onClose={() => setAlert(null)} dismissible>
          {alert.message}
        </Alert>
      )}

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
              <p>Username: {selectedHandyman.username}</p>{" "}
              {/* Updated to display username */}
              <p>Contact: {selectedHandyman.contact}</p>
              <p>
                Specialization: {selectedHandyman.specialization.join(", ")}
              </p>
              <p>Account Status: {selectedHandyman.accounts_status}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirmation Modal for Delete */}
      <Modal
        show={showConfirmDelete}
        onHide={() => setShowConfirmDelete(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete {selectedHandyman?.fname}{" "}
          {selectedHandyman?.lname}?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmDelete(false)}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteHandyman}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirmation Modal for Lifting Suspension */}
      <Modal show={showConfirmLift} onHide={() => setShowConfirmLift(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Lift Suspension</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to lift the suspension for{" "}
          {selectedHandyman?.fname} {selectedHandyman?.lname}?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmLift(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={handleLiftSuspension}>
            Lift Suspension
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SuspendedHandyman;
