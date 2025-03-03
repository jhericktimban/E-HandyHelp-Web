import React, { useEffect, useState } from "react";
import "../css/activitylogs.css";

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    // Fetch logs from your backend
    const fetchLogs = async () => {
      try {
        const response = await fetch("https://e-handyhelp-web-backend.onrender.com/api/activityLogs/");
        const data = await response.json();
        setLogs(data);
      } catch (error) {
        console.error("Error fetching logs:", error);
      }
    };

    fetchLogs();
  }, []);

  // Filter logs based on search input
  const filteredLogs = logs.filter((log) =>
    log.username.toLowerCase().includes(search.toLowerCase()) ||
    log.action.toLowerCase().includes(search.toLowerCase()) ||
    log.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Activity Logs</h2>

      {/* Search Input */}
      <input
        type="text"
        placeholder="Search logs..."
        className="p-2 border rounded-md mb-4 w-full"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Logs Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-blue-600 text-white">
              <th className="p-3 border">Username</th>
              <th className="p-3 border">Action</th>
              <th className="p-3 border">Description</th>
              <th className="p-3 border">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log, index) => (
                <tr key={index} className="text-center border-b hover:bg-gray-100">
                  <td className="p-3 border">{log.username}</td>
                  <td className="p-3 border">{log.action}</td>
                  <td className="p-3 border">{log.description}</td>
                  <td className="p-3 border">{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center p-4">No logs found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ActivityLogs;
