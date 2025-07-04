import React, { useEffect, useState } from "react";
import { Box, Typography, Chip } from "@mui/material";

const ReportsforUsers = ({ userID }) => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE}/getReports.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userID }),
        });
        const data = await res.json();
        if (data.success) {
          setReports(data.reports);
        } else {
          setReports([]);
        }
      } catch (error) {
        console.error("Error fetching reports:", error);
        setReports([]);
      }
      setLoading(false);
    };

    fetchReports();
  }, [userID]);

  if (loading) {
    return <Typography>Loading reports...</Typography>;
  }

  return (
    <Box sx={{ width: "100%", maxWidth: '1300px' }}>
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Reports
      </Typography>
      {reports.length === 0 ? (
        <Typography variant="body1" sx={{ color: "#777" }}>
          No reports found.
        </Typography>
      ) : (
        reports.map((report, idx) => (
          <Box
            key={idx}
            sx={{
              display: "flex",
              flexDirection: "column",
              p: 2,
              mb: 2,
              borderBottom: "1px solid #ddd",
              backgroundColor: "#ffffff",
              borderRadius: "10px",
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: "bold", color: "#000" }}>
              {report.title}
            </Typography>
            <Typography variant="body2" sx={{ color: "#333", marginBottom: 1 }}>
              {report.description}
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
              <Chip label={report.category} color="primary" size="small" />
              <Chip
                label={`Status: ${report.status}`}
                color={report.status === "Resolved" ? "success" : "warning"}
                size="small"
              />
            </Box>
            <Typography variant="body2" sx={{ color: "#555", marginTop: 2 }}>
              Admin's response: {report.adminResponse || "No response yet."}
            </Typography>
          </Box>
        ))
      )}
    </Box>
  );
};

export default ReportsforUsers;
