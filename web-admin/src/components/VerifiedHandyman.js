import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import DataTable from "react-data-table-component";
import axios from "axios";
import "../css/verifiedhandyman.css";

const VerifiedHandyman = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedHandyman, setSelectedHandyman] = useState(null);
  const [verifiedHandymen, setVerifiedHandymen] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);

  // Fetch verified handymen from the backend
  useEffect(() => {
    axios
      .get(
        "https://661be00c-d2b2-45f7-95e7-954b7c9ba16b-00-1lrnb460qojsa.pike.replit.dev/api/handymen/verified"
      )
      .then((response) => {
        setVerifiedHandymen(response.data);
      })
      .catch((error) => {
        console.error("Error fetching verified handymen:", error);
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

  const handleOpenDeleteModal = (handyman) => {
    setSelectedHandyman(handyman);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedHandyman(null);
  };

  const handleDeleteHandyman = async () => {
    if (selectedHandyman) {
      try {
        await axios.delete(
          `https://661be00c-d2b2-45f7-95e7-954b7c9ba16b-00-1lrnb460qojsa.pike.replit.dev/api/handymen/${selectedHandyman._id}`
        );
        setVerifiedHandymen(
          verifiedHandymen.filter(
            (handyman) => handyman._id !== selectedHandyman._id
          )
        );
        setAlertMessage("Handyman deleted successfully!");
        setAlertVisible(true);
      } catch (error) {
        console.error("Error deleting handyman:", error);
      } finally {
        handleCloseDeleteModal();
      }
    }
  };

  // Filter verified handymen based on search term
  const filteredHandymen = verifiedHandymen.filter((handyman) =>
    `${handyman.fname} ${handyman.lname}`
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

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
          <Button variant="primary" onClick={() => handleOpenModal(row)}>
            Details
          </Button>
          <Button
            variant="danger"
            onClick={() => handleOpenDeleteModal(row)}
            className="ml-2"
          >
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
        striped
        responsive
        style={{ minHeight: "400px" }} // Consistent with other component layout
      />

      {/* Modal for handyman details */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Handyman Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedHandyman && (
            <>
              <h5>
                Name: {selectedHandyman.fname} {selectedHandyman.lname}
              </h5>
              <p>
                Description:{" "}
                {selectedHandyman.accounts_status || "Verified Handyman"}
              </p>
              <p>Contact: {selectedHandyman.contact}</p>
              <p>
                Specialization: {selectedHandyman.specialization.join(", ")}
              </p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for delete confirmation */}
      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal} centered>
        <Modal.Header closeButton>
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
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteHandyman}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Alert for successful deletion */}
      <Alert
        variant="success"
        show={alertVisible}
        onClose={() => setAlertVisible(false)}
        dismissible
      >
        {alertMessage}
      </Alert>
    </div>
  );
};

export default VerifiedHandyman;
