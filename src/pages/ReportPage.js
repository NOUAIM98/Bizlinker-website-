import React, { useState, useEffect, useRef } from "react";
import "./ReportPage.css";

const POLL_INTERVAL = 5000; // 5 seconds

const ReportPage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportData, setReportData] = useState({
    user: [],
    business: [],
    services: [],
    events: [],
    others: [],
  });
  const [admin, setAdmin] = useState(null);

  const pollingRef = useRef(null);

  useEffect(() => {
    const stored = localStorage.getItem("admin");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.adminID) {
          setAdmin(parsed);
        }
      } catch (e) {
        console.error("Failed to parse admin from localStorage", e);
      }
    }
  }, []);

  const reports = [
    { id: "user", name: "User Reports" },
    { id: "business", name: "Business Reports" },
    { id: "services", name: "Services Reports" },
    { id: "events", name: "Events Reports" },
    { id: "others", name: "Others Reports" },
  ];

  const fetchReports = () => {
    fetch(`${process.env.REACT_APP_API_BASE}/getReports.php`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const grouped = {
            user: [],
            business: [],
            services: [],
            events: [],
            others: [],
          };
          data.reports.forEach((report) => {
            const type = report.targetType;
            if (grouped[type]) {
              grouped[type].push(report);
            } else {
              grouped.others.push(report);
            }
          });
          setReportData(grouped);
        }
      })
      .catch((err) => console.error("Error fetching reports:", err));
  };

  useEffect(() => {
    fetchReports();
    pollingRef.current = setInterval(fetchReports, POLL_INTERVAL);
    return () => {
      // Cleanup the interval on unmount
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, []);

  const handleClaim = async (e, reportID) => {
    e.stopPropagation();
    if (!admin || !admin.adminID) {
      alert("You're not authenticated.");
      return;
    }
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE}/claimReport.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ reportID, adminID: admin.adminID }),
        }
      );
      const data = await res.json();
      if (data.success) {
        alert("Report claimed successfully.");
        fetchReports(); // Manually refresh to see the immediate change
      } else {
        alert(data.message || "Failed to claim the report.");
      }
    } catch (err) {
      alert("Something went wrong.");
    }
  };

  const renderClaimedBy = (claimedByName, claimedByRole) => {
    if (!claimedByName) return null;
    let tagStyle = {};
    let tagLabel = "";
    if (claimedByRole === "admin") {
      tagStyle = { color: "red", fontWeight: "bold", marginLeft: "6px" };
      tagLabel = "[Admin]";
    } else if (claimedByRole === "subadmin") {
      tagStyle = { color: "purple", fontWeight: "bold", marginLeft: "6px" };
      tagLabel = "[Sub-Admin]";
    }
    return (
      <p>
        <strong>Claimed By:</strong>
        {tagLabel && <span style={tagStyle}>{tagLabel}</span>} {claimedByName}
      </p>
    );
  };

  return (
    <div className="report-page">
      {!selectedCategory ? (
        <div className="report-cards">
          {reports.map((report) => (
            <div
              key={report.id}
              className="report-card"
              onClick={() => setSelectedCategory(report.id)}
            >
              <h3>{report.name}</h3>
            </div>
          ))}
        </div>
      ) : !selectedReport ? (
        <div className="report-list">
          <button
            className="back-btn"
            onClick={() => setSelectedCategory(null)}
          >
            ← Back
          </button>
          <h2>{reports.find((r) => r.id === selectedCategory).name}</h2>
          {reportData[selectedCategory].length === 0 ? (
            <p>No reports found for this category.</p>
          ) : (
            reportData[selectedCategory].map((report) => (
              <div
                key={report.reportID}
                className="report-item"
                onClick={() => setSelectedReport(report)}
              >
                <div
                  style={{ display: "flex", alignItems: "center", gap: "10px" }}
                >
                  <img
                    src={
                      report.profilePicture
                        ? `${process.env.REACT_APP_API_BASE}/${report.profilePicture}`
                        : `${process.env.REACT_APP_API_BASE}/uploads/default.png`
                    }
                    alt="Profile"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                  <div>
                    <p>
                      <strong>{report.reporterName}</strong>
                    </p>
                    <p>
                      <strong>Total Reports:</strong>{" "}
                      {report.totalReportsByUser}
                    </p>
                    <p>
                      <strong>Account Created:</strong>{" "}
                      {new Date(report.userCreatedAt).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Issue:</strong> {report.issue}
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(report.created_at).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Status:</strong>{" "}
                      <span style={{ color: "orange", fontWeight: "bold" }}>
                        {report.status}
                      </span>
                    </p>
                    {report.claimedByName ? (
                      renderClaimedBy(
                        report.claimedByName,
                        report.claimedByRole
                      )
                    ) : (
                      <button
                        className="claim-btn"
                        onClick={(e) => handleClaim(e, report.reportID)}
                        style={{
                          marginTop: "10px",
                          padding: "6px 16px",
                          backgroundColor: "#1976d2",
                          color: "white",
                          border: "none",
                          borderRadius: "6px",
                          cursor: "pointer",
                          fontWeight: "bold",
                        }}
                      >
                        Claim Report
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      ) : (
        <div className="report-detail">
          <button className="back-btn" onClick={() => setSelectedReport(null)}>
            ← Back
          </button>
          <h2>Report Details</h2>
          <img
            src={
              selectedReport.profilePicture
                ? `${process.env.REACT_APP_API_BASE}/${selectedReport.profilePicture}`
                : `${process.env.REACT_APP_API_BASE}/uploads/default.png`
            }
            alt="Profile"
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              objectFit: "cover",
              marginBottom: 10,
            }}
          />
          <p>
            <strong>Reported By:</strong> {selectedReport.reporterName}
          </p>
          <p>
            <strong>User Joined:</strong>{" "}
            {new Date(selectedReport.userCreatedAt).toLocaleDateString()}
          </p>
          <p>
            <strong>Total Reports Submitted:</strong>{" "}
            {selectedReport.totalReportsByUser}
          </p>
          <p>
            <strong>Target Name:</strong> {selectedReport.targetName}
          </p>
          <p>
            <strong>Type:</strong> {selectedReport.targetType}
          </p>
          <p>
            <strong>Issue:</strong> {selectedReport.issue}
          </p>
          <p>
            <strong>Details:</strong> {selectedReport.details}
          </p>
          <p>
            <strong>Status:</strong>{" "}
            <span style={{ color: "orange", fontWeight: "bold" }}>
              {selectedReport.status}
            </span>
          </p>
          <p>
            <strong>Date:</strong>{" "}
            {new Date(selectedReport.created_at).toLocaleDateString()}
          </p>
          {selectedReport.claimedByName ? (
            renderClaimedBy(
              selectedReport.claimedByName,
              selectedReport.claimedByRole
            )
          ) : (
            <button
              className="claim-btn"
              onClick={(e) => handleClaim(e, selectedReport.reportID)}
              style={{
                marginTop: "10px",
                padding: "8px 20px",
                backgroundColor: "#1976d2",
                color: "white",
                border: "none",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              Claim Report
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ReportPage;
