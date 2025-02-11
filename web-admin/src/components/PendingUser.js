import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import DataTable from "react-data-table-component";
import axios from "axios";
import "../css/pendinguser.css";

const PendingUser = () => {
  const [showModal, setShowModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [alert, setAlert] = useState(null);
  const [enlargedImage, setEnlargedImage] = useState(null);

  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const response = await axios.get(
          "https://e-handyhelp-web-backend.onrender.com/api/users/pending"
        );
        setPendingUsers(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
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

  const handleImageClick = (image) => {
    setEnlargedImage(image);
  };

  const handleCloseImageModal = () => {
    setEnlargedImage(null);
  };

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
      selector: (row) => row.account_status || "Pending",
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="button-group">
          <Button onClick={() => handleOpenModal(row)}>Details</Button>
          <Button
            onClick={() => {
              setSelectedUser(row);
              setShowConfirmDelete(true);
            }}
          >
            Delete
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="content-container pending-user">
      <h2>Pending Users</h2>
      <Form.Control
        type="text"
        placeholder="Search by name or username..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-3"
      />
      <DataTable columns={columns} data={pendingUsers} pagination />

      {alert && (
        <Alert variant="success" onClose={() => setAlert(null)} dismissible>
          {alert.message}
        </Alert>
      )}

      {/* Modal for user details */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>User Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <>
              <h5>
                Name: {selectedUser.fname} {selectedUser.lname}
              </h5>
              <p>Email: {selectedUser.email}</p>
              <p>
                Date of Birth: {" "}
                {new Date(selectedUser.dateOfBirth).toLocaleDateString()}
              </p>
              {selectedUser.images && selectedUser.images.length > 0 ? (
                <div
                  className="valid-id-images"
                  style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}
                >
                  {selectedUser.images.map((image, index) => (
                    <img
                      key={index}
                      src={
                        image.startsWith("data:image")
                          ? image
                          : `data:image/png;base64,${image}`
                      }
                      alt={`Valid ID ${index + 1}`}
                      style={{ width: "80px", cursor: "pointer" }}
                      onClick={() => handleImageClick(image)}
                    />
                  ))}
                </div>
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
        </Modal.Footer>
      </Modal>

      {/* Image Modal */}
      <Modal show={!!enlargedImage} onHide={handleCloseImageModal} centered>
        <Modal.Body className="text-center">
          <img
            src={enlargedImage}
            alt="Enlarged ID"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleCloseImageModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PendingUser;
