import React, { useState, useEffect } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import DataTable from "react-data-table-component";
import axios from "axios";
import "../css/pendinghandyman.css";

const PendingHandyman = () => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedHandyman, setSelectedHandyman] = useState(null);
  const [pendingHandymen, setPendingHandymen] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [handymanToDelete, setHandymanToDelete] = useState(null);
  const [alert, setAlert] = useState(null);

  // Fetch pending handymen from the backend
  useEffect(() => {
    axios
      .get("https://e-handyhelp-web-backend.onrender.com/api/handymen/pending")
      .then((response) => {
        setPendingHandymen(response.data);
      })
      .catch((error) => {
        console.error("Error fetching handymen:", error);
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
      axios
        .put(
          `https://e-handyhelp-web-backend.onrender.com/api/handymen/${selectedHandyman._id}/verify`
        )
        .then(() => {
          setPendingHandymen(
            pendingHandymen.filter(
              (handyman) => handyman._id !== selectedHandyman._id
            )
          );
          setAlert({ message: "Handyman verified successfully." });
          handleCloseModal();
        })
        .catch((error) => {
          console.error("Error verifying handyman:", error);
        });
    }
  };

  const handleRejectHandyman = () => {
    if (selectedHandyman) {
      axios
        .put(
          `https://e-handyhelp-web-backend.onrender.com/api/handymen/${selectedHandyman._id}/reject`
        )
        .then(() => {
          setPendingHandymen(
            pendingHandymen.filter(
              (handyman) => handyman._id !== selectedHandyman._id
            )
          );
          setAlert({ message: "Handyman rejected successfully." });
          handleCloseModal();
        })
        .catch((error) => {
          console.error("Error rejecting handyman:", error);
        });
    }
  };

  const handleDeleteHandyman = (handymanId) => {
    setHandymanToDelete(handymanId);
    setShowDeleteModal(true);
  };

  const confirmDeleteHandyman = () => {
    if (handymanToDelete) {
      axios
        .delete(
          `https://e-handyhelp-web-backend.onrender.com/api/handymen/${selectedHandyman._id}`
        )
        .then(() => {
          setPendingHandymen(
            pendingHandymen.filter(
              (handyman) => handyman._id !== selectedHandyman
            )
          );
          setShowDeleteModal(false);
          setAlert("Handyman deleted successfully!");
        })
        .catch((error) => {
          console.error("Error deleting handyman:", error);
        });
    }
  };

  // Filtering handymen based on the search term
  const filteredHandymen = pendingHandymen.filter((handyman) => {
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
      selector: (row) => row.accounts_status || "Pending Handyman",
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="button-group">
          <Button onClick={() => handleOpenModal(row)} className="mb-2">
            Detail
          </Button>
          <Button onClick={() => handleDeleteHandyman(row._id)}>Delete</Button>
        </div>
      ),
    },
  ];

  return (
    <div className="content-container pending-handyman">
      <h2>Pending Handymen</h2>
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
        responsive
        customStyles={{
          table: {
            style: {
              width: "100%",
            },
          },
        }}
      />

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
              <p>
                Description:{" "}
                {selectedHandyman.accounts_status || "Pending Approval"}
              </p>
              <p>Email: {selectedHandyman.email}</p>
              <p>
                Date of Birth:{" "}
                {new Date(selectedHandyman.dateOfBirth).toLocaleDateString()}
              </p>

              {selectedHandyman.images && selectedHandyman.images.length > 0 ? (
                <>
                  <strong>Valid ID:</strong>
                  <div className="valid-id-images">
                    {selectedHandyman.images.map((image, index) => (
                      <img
                        key={index}
                        src={`https://e-handyhelp-web-backend.onrender.com${image}`} // Load image from backend
                        alt={`Valid ID ${index + 1}`}
                        style={{
                          maxWidth: "100%",
                          height: "auto",
                          margin: "5px",
                        }}
                      />
                    ))}
                  </div>
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
          <Button onClick={handleVerifyHandyman}>Verify</Button>
          <Button onClick={handleRejectHandyman}>Reject</Button>
        </Modal.Footer>
      </Modal>

      {/* Confirmation modal for deletion */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header style={{ backgroundColor: "#1960b2" }} closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete this handyman?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button onClick={confirmDeleteHandyman}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PendingHandyman;
