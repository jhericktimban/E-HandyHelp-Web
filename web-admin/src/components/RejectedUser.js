import React, { useState, useEffect } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import DataTable from "react-data-table-component";
import axios from "axios";
import "../css/rejecteduser.css";

const RejectedUser = () => {
  const [showModal, setShowModal] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false); // State for delete confirmation
  const [selectedUser, setSelectedUser] = useState(null);
  const [rejectedUsers, setRejectedUsers] = useState([]);
  const [alert, setAlert] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);

  const [showImageModal, setShowImageModal] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);

  // Fetch rejected users from the backend
  useEffect(() => {
    const fetchRejectedUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "https://e-handyhelp-web-backend.onrender.com/api/users/rejected"
        );
        setRejectedUsers(response.data);
      } catch (error) {
        console.error("Error fetching rejected users:", error);
      }
      finally{
        setLoading(false);
      }
    };

    fetchRejectedUsers();
  }, []);

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
    setShowConfirmDelete(false); // Reset delete confirmation when modal closes
  };

  const handleDeleteUser = async () => {
    if (selectedUser) {
      try {
        await axios.delete(
          `https://e-handyhelp-web-backend.onrender.com/api/users/${selectedUser._id}`
        ); // Call delete API
        setRejectedUsers(
          (prevUsers) =>
            prevUsers.filter((user) => user._id !== selectedUser._id) // Remove user from state
        );
        setAlert({message: "User deleted successfully." });
        
      } catch (error) {
        console.error("Error deleting user:", error);
      }
      finally {
        setShowConfirmDelete(false);
        setSelectedUser(null);
      }
    }
  };

  // Filter rejected users based on search term
  const filteredUsers = rejectedUsers.filter((user) => {
    const fullName = `${user?.fname || ""} ${user?.lname || ""}`;
    return (
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user?.username &&
        user.username.toLowerCase().includes(searchTerm.toLowerCase()))
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
      selector: (row) => row.accounts_status || "Rejected",
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div className="button-group">
          <Button 
          onClick={() => handleOpenModal(row)}>
             Details
          </Button>
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
    <div className="content-container rejected-user">
      <h2>Rejected Users</h2>
      <Form.Control
        type="text"
        placeholder="Search by name or username..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="mb-3"
      />
      <DataTable
        columns={columns}
        data={filteredUsers} // Use the filtered users
        pagination
        highlightOnHover
        striped
        responsive
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
               {selectedUser && (
                 <>
                   <h5>
                     Name: {selectedUser.fname} {selectedUser.lname}
                   </h5>
                   <p>Address: {selectedUser.address}</p>
                   <p>Email: {selectedUser.email}</p>
                   <p>Username: {selectedUser.username}</p>
                   <p>Contact: {selectedUser.contact}</p>
     
                   <p>
                     Date of Birth:{" "}
                     {new Date(selectedUser.dateOfBirth).toLocaleDateString()}
                   </p>
                   {selectedUser.images && selectedUser.images.length > 0 ? (
                     <>
                       <strong>Valid ID:</strong>
                       <div className="image-carousel-user">
                         <button
                           className="carousel-btn-user left"
                           onClick={() =>
                             setImageIndex((prev) =>
                               prev > 0 ? prev - 1 : selectedUser.images.length - 1
                             )
                           }
                         >
                           &#10094;
                         </button>
                         <img
                           src={
                             selectedUser.images[imageIndex].startsWith("data:image")
                               ? selectedUser.images[imageIndex]
                               : `data:image/png;base64,${selectedUser.images[imageIndex]}`
                           }
                           alt={`Valid ID ${imageIndex + 1}`}
                           className="carousel-image-user fixed-size"
                           onClick={() => setShowImageModal(true)}
                         />
                         <button
                           className="carousel-btn-user right"
                           onClick={() =>
                             setImageIndex((prev) =>
                               prev < selectedUser.images.length - 1 ? prev + 1 : 0
                             )
                           }
                         >
                           &#10095;
                         </button>
                       </div>
     
                       {/* Image Modal for Full-Size View */}
                       {showImageModal && (
                         <div
                           className="image-modal-user"
                           onClick={() => setShowImageModal(false)}
                         >
                           <div className="modal-content-user">
                             <img
                               src={
                                 selectedUser.images[imageIndex].startsWith(
                                   "data:image"
                                 )
                                   ? selectedUser.images[imageIndex]
                                   : `data:image/png;base64,${selectedUser.images[imageIndex]}`
                               }
                               alt={`Valid ID ${imageIndex + 1}`}
                               className="full-size-image-user"
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
               Are you sure you want to delete {selectedUser?.fname}{" "}
               {selectedUser?.lname}?
             </Modal.Body>
             <Modal.Footer>
               <Button onClick={() => setShowConfirmDelete(false)}>Cancel</Button>
               <Button onClick={handleDeleteUser}>Delete</Button>
             </Modal.Footer>
           </Modal>
    </div>
  );
};

export default RejectedUser;
