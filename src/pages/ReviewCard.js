import React from "react";
import "./ReviewCard.css";
import { events } from './events';
import { FaTriangleExclamation } from "react-icons/fa6"; 

const ReviewCard = ({ name, profileImage, comment, rating, date,onReport }) => {

  return (
    <div className="review-card">
      <img
        src={profileImage}
        alt={`${name}'s profile`}
        className="profile-image"
      />
      <div className="review-content">
        <h3>{name}</h3>
        <p className="rating">⭐ {rating}</p>
        <button 
                onClick={onReport} 
                style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    background: "none",
                    border: "none",
                    color: "#f56565",  
                    cursor: "pointer",
                    fontSize: "18px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    transition: "color 0.2s ease-in-out"
                }}
                onMouseEnter={(e) => e.target.style.color = "#d32f2f"}
                onMouseLeave={(e) => e.target.style.color = "#f56565"}
            >
                <FaTriangleExclamation /> 
            </button>
        <p className="comment">{comment}</p>
        <p className="date">Written {date}</p>
      </div>
    </div>
  );
};

export default ReviewCard;
