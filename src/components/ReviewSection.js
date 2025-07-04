import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ReviewSection.css";

const ReviewSection = () => {
    const [starRating, setStarRating] = useState(0);
    const navigate = useNavigate();

    const handleStarClick = (rating) => {
        setStarRating(rating);
    };

    const handleReviewButtonClick = () => {
        navigate("/write-review");
    };

    return (
        <div className="review-section">
            <img src={process.env.PUBLIC_URL + "/review.png"} className="review-image" alt="Review" />

            <div className="review-content">
                <h1>Want to Share Your Experience?</h1>
                <p className="review-subtext">We’d love to hear your thoughts and improve our services!</p>

                <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            className={`star ${star <= starRating ? "filled" : ""}`}
                            onClick={() => handleStarClick(star)}
                        >
                            ★
                        </span>
                    ))}
                </div>

                <button className="review-button" onClick={handleReviewButtonClick}>
                    Write a review
                </button>
            </div>
        </div>
    );
};

export default ReviewSection;
