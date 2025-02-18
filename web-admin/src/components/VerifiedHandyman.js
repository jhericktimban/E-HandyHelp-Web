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


  const [showImageModal, setShowImageModal] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  
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

     {/* Modal for Handyman details */}
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
                   <p>Address: {selectedHandyman.address}</p>
                   <p>Email: {selectedHandyman.email}</p>
                   <p>Username: {selectedHandyman.username}</p>
                   <p>Contact: {selectedHandyman.contact}</p>
                   <p>
                     Specialization:{" "}
                     {Array.isArray(selectedHandyman.specialization)
                       ? selectedHandyman.specialization.join(", ")
                       : selectedHandyman.specialization}
                   </p>
     
                   <p>
                     Date of Birth:{" "}
                     {new Date(selectedHandyman.dateOfBirth).toLocaleDateString()}
                   </p>
                   {selectedHandyman.images && selectedHandyman.images.length > 0 ? (
                     <>
                       <strong>Valid ID:</strong>
                       <div className="image-carousel-handyman">
                         <button
                           className="carousel-btn-handyman left"
                           onClick={() =>
                             setImageIndex((prev) =>
                               prev > 0
                                 ? prev - 1
                                 : selectedHandyman.images.length - 1
                             )
                           }
                         >
                           &#10094;
                         </button>
                         <img
                           src={
                             selectedHandyman.images[imageIndex].startsWith(
                               "data:image"
                             )
                               ? selectedHandyman.images[imageIndex]
                               : `data:image/png;base64,${selectedHandyman.images[imageIndex]}`
                           }
                           alt={`Valid ID ${imageIndex + 1}`}
                           className="carousel-image-handyman fixed-size"
                           onClick={() => setShowImageModal(true)}
                         />
                         <button
                           className="carousel-btn-handyman right"
                           onClick={() =>
                             setImageIndex((prev) =>
                               prev < selectedHandyman.images.length - 1
                                 ? prev + 1
                                 : 0
                             )
                           }
                         >
                           &#10095;
                         </button>
                       </div>
     
                       {/* Image Modal for Full-Size View */}
                       {showImageModal && (
                         <div
                           className="image-modal-handyman"
                           onClick={() => setShowImageModal(false)}
                         >
                           <div className="modal-content-handyman">
                             
                          
                             <img
                               src={
                                 selectedHandyman.images[imageIndex].startsWith(
                                   "data:image"
                                 )
                                   ? selectedHandyman.images[imageIndex]
                                   : `data:image/png;base64,${selectedHandyman.images[imageIndex]}`
                               }
                               alt={`Valid ID ${imageIndex + 1}`}
                               className="full-size-image-handyman"
                             />
                           </div>
                         </div>
                       )}
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
               
             </Modal.Footer>
           </Modal>
     
           {/* Confirmation Modal for Deletion */}
           <Modal
             show={showConfirmDelete}
             onHide={() => setShowConfirmDelete(false)}
             centered
           >
             <Modal.Header style={{ backgroundColor: "#1960b2" }} closeButton>
               <Modal.Title>Confirm Deletion</Modal.Title>
             </Modal.Header>
             <Modal.Body>
               Are you sure you want to delete {selectedHandyman?.fname}{" "}
               {selectedHandyman?.lname}?
             </Modal.Body>
             <Modal.Footer>
               <Button onClick={() => setShowConfirmDelete(false)}>Cancel</Button>
               <Button onClick={handleDeleteHandyman}>Delete</Button>
             </Modal.Footer>
           </Modal>
    </div>
  );
};

export default VerifiedHandyman;
