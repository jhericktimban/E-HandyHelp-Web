import React, { useEffect, useState } from "react";
import DataTable from "react-data-table-component";
import "../css/activitylogs.css";

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch("https://e-handyhelp-web-backend.onrender.com/api/activityLogs");
        const data = await response.json();
        console.log("Fetched Logs:", data); // Debugging line
        setLogs(data);
      } catch (error) {
        console.error("Error fetching logs:", error);
      } finally {
        setLoading(false);
      }
    };
    

    fetchLogs();
  }, []);

  // Define columns for DataTable
  const columns = [
    {
      name: "Username",
      selector: (row) => row.username,
      sortable: true,
    },
    {
      name: "Action",
      selector: (row) => row.action,
      sortable: true,
    },
    {
      name: "Description",
      selector: (row) => row.description,
    },
    {
      name: "Timestamp",
      selector: (row) => new Date(row.timestamp).toLocaleString(),
      sortable: true,
    },
  ];

  // Custom styles for DataTable
  const customStyles = {
    headCells: {
      style: {
        fontWeight: "bold",
        fontSize: "16px",
        backgroundColor: "#007bff",
        color: "#fff",
      },
    },
    rows: {
      style: {
        fontSize: "14px",
      },
    },
  };

  return (
    <div className="activity-logs-container">
      <h2 className="activity-logs-title">Activity Logs</h2>

      {/* Data Table */}
      <DataTable
        columns={columns}
        data={logs}
        pagination
        highlightOnHover
        striped
        responsive
        progressPending={loading}
        customStyles={customStyles}
      />
    </div>
  );
};

export default ActivityLogs;
