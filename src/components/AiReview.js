import React, { useEffect, useState } from "react";
import axios from "axios";

const AiReview = ({ reviews, reviewType, targetID }) => {
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(true);

  const boxStyle = {
    marginTop: "2rem",
    alignItems: "center",
    width: "90%",
    maxWidth: "1100px",
    padding: "1.5rem",
    background: "white",
    border: "1px solid #ddd",
    borderRadius: "0.625rem",
    boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
    transition: "box-shadow 0.3s ease-in-out",
    marginLeft: "auto",
    marginRight: "auto",
    "@media (max-width: 768px)": {
      width: "95%",
      padding: "1rem",
      marginTop: "1rem",
    },
  };

  const textStyle = {
    fontStyle: "italic",
    color: "#555",
    fontSize: "clamp(14px, 4vw, 16px)",
    textAlign: "center",
    whiteSpace: "pre-line",
    lineHeight: "1.5",
    padding: "0 0.5rem",
    "@media (max-width: 768px)": {
      fontSize: "clamp(12px, 3.5vw, 14px)",
    },
  };

  useEffect(() => {
    if (
      !Array.isArray(reviews) ||
      reviews.length === 0 ||
      !targetID ||
      !reviewType
    )
      return;

    const textOnly = reviews
      .map((r) => r.comment || r.text || r.review || "")
      .filter(Boolean);

    if (textOnly.length === 0) {
      setSummary("No reviews available for this listing.");
      setLoading(false);
      return;
    }

    axios
      .post(`${process.env.REACT_APP_API_BASE}/summarizeReviews.php`, {
        reviews: textOnly,
        targetID,
        reviewType,
      })
      .then((res) => {
        if (
          !res.data.success &&
          res.data.message?.includes("Waiting for more")
        ) {
          setSummary(
            "Not enough reviews yet to generate a summary. A summary will appear after 5 reviews."
          );
          setLoading(false);
          return;
        }
        setSummary(res.data.summary || "No summary available.");
        setLoading(false);
      })
      .catch(() => {
        setSummary("Could not generate review summary.");
        setLoading(false);
      });
  }, [reviews, reviewType, targetID]);

  return (
    <div
      style={boxStyle}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = "0px 6px 15px rgba(0, 0, 0, 0.15)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.boxShadow = "0px 4px 10px rgba(0, 0, 0, 0.1)")
      }
    >
      <p style={textStyle}>
        {loading
          ? "Generating AI review summary..."
          : summary
          ? summary
          : "No summary available."}
      </p>
    </div>
  );
};

export default AiReview;
