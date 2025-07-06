import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Modal,
  Box,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";

const ReportDetails = ({ open, handleClose, report }) => {
  if (!report) return null;

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          {report.targetName}
        </Typography>
        <Typography variant="subtitle2" color="textSecondary">
          {report.targetType}
        </Typography>
        <Typography>
          <strong>Issue:</strong> {report.issue}
        </Typography>
        <Typography>
          <strong>Date:</strong>{" "}
          {new Date(report.created_at).toLocaleDateString()}
        </Typography>
        <Typography>
          <strong>Reported By:</strong> {report.reporterName || "Unknown"}
        </Typography>
        <Typography>
          <strong>Details:</strong> {report.details}
        </Typography>
        <Typography>
          <strong>Status:</strong> {report.status}
        </Typography>
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 2 }}
          onClick={handleClose}
        >
          Back
        </Button>
      </Box>
    </Modal>
  );
};

const ReportForm = ({ open, handleClose, onSuccess }) => {
  const [reportType, setReportType] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [location, setLocation] = useState("");
  const [targetName, setTargetName] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.userID) {
      alert("User not logged in");
      return;
    }

    const payload = {
      reportedBy: user.userID,
      targetType: reportType.toLowerCase(),
      targetName: targetName || "Unnamed",
      issue: category || subCategory || "Unknown Issue",
      details: note || "No details provided",
    };

    try {
      setLoading(true);
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE}/submitReport.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      const data = await res.json();
      if (data.success) {
        alert("Report submitted successfully");
        handleClose();
        onSuccess();
      } else {
        alert(data.message || "Failed to submit report");
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          New Report
        </Typography>

        <FormControl fullWidth margin="normal">
          <InputLabel>Report Type</InputLabel>
          <Select
            value={reportType}
            onChange={(e) => setReportType(e.target.value)}
          >
            <MenuItem value="Business">Business</MenuItem>
            <MenuItem value="Service">Service</MenuItem>
            <MenuItem value="Event">Event</MenuItem>
            <MenuItem value="User">User</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label={
            reportType === "Event"
              ? "Event Name"
              : reportType === "Business"
              ? "Business Name"
              : reportType === "Service"
              ? "Provider Name"
              : "Target Name"
          }
          margin="normal"
          value={targetName}
          onChange={(e) => setTargetName(e.target.value)}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Category</InputLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <MenuItem value="Customer Experience">Customer Experience</MenuItem>
            <MenuItem value="Pricing">
              Pricing
            </MenuItem>
            <MenuItem value="Staff Conduct">Staff Conduct</MenuItem>
            <MenuItem value="Other">Other</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          label="Details"
          multiline
          rows={3}
          margin="normal"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />

        <Button
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
          disabled={loading}
          onClick={handleSubmit}
        >
          {loading ? "Submitting..." : "Submit Report"}
        </Button>
      </Box>
    </Modal>
  );
};

export default function Reports() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE}/getReports.php`
      );
      const data = await res.json();
      if (data.success) {
        setReports(data.reports);
      }
    } catch (err) {
      console.error("Error fetching reports:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setOpenModal(true)}
        sx={{ mb: 2 }}
      >
        + New Report
      </Button>

      {loading ? (
        <Typography>Loading reports...</Typography>
      ) : reports.length === 0 ? (
        <Typography color="textSecondary">
          Submitted reports will appear here once stored and fetched from
          backend.
        </Typography>
      ) : (
        reports.map((report) => (
          <Card
            key={report.reportID}
            sx={{ mb: 2 }}
            onClick={() => setSelectedReport(report)}
          >
            <CardContent>
              <Typography variant="h6">{report.targetName}</Typography>
              <Typography variant="subtitle2" color="textSecondary">
                {report.targetType}
              </Typography>
              <Typography>
                <strong>Issue:</strong> {report.issue}
              </Typography>
              <Typography>
                <strong>Date:</strong>{" "}
                {new Date(report.created_at).toLocaleDateString()}
              </Typography>
              <Typography
                color={report.status === "Resolved" ? "green" : "orange"}
              >
                <strong>Status:</strong> {report.status}
              </Typography>
            </CardContent>
          </Card>
        ))
      )}

      <ReportDetails
        open={!!selectedReport}
        handleClose={() => setSelectedReport(null)}
        report={selectedReport}
      />
      <ReportForm
        open={openModal}
        handleClose={() => setOpenModal(false)}
        onSuccess={fetchReports}
      />
    </div>
  );
}
