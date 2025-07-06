import React from "react";
import { useNavigate } from "react-router-dom";
import "./Card.css";
import { FaStar } from "react-icons/fa6";

const Card = ({
  id,
  image,
  name,
  place,
  category,
  rating,
  reviews,
  type,
  promoted,
}) => {
  const navigate = useNavigate();

  const handleMoreInfo = () => {
    if (type === "business") {
      navigate(`/business/${id}`);
    } else if (type === "event") {
      navigate(`/event/${id}`);
    } else if (type === "service") {
      navigate(`/service/${id}`);
    }
  };

  return (
    <div className="card" style={{ position: "relative" }}>
      {promoted && <div className="promoted-tag">Promoted</div>}

      <div className="card-image-container">
        <img
          src={
            image
              ? `${process.env.REACT_APP_API_BASE}/${image}`
              : "/default.jpg"
          }
          alt={name || "image"}
          className="card-image"
        />
      </div>

      <div className="card-content">
        <h3 className="card-title">{name || "Unnamed"}</h3>
        <div className="card-info">
          <span className="card-category">{category || "Unknown"}</span>
          <span className="card-location">{place || "Location"}</span>
        </div>
        <div className="card-footer">
          <span className="rating">
            <FaStar /> {rating || "0.0"}
          </span>
          <span className="reviews">({reviews || 0} reviews)</span>
        </div>
        <button className="more-info-btn" onClick={handleMoreInfo}>
          More Info
        </button>
      </div>
    </div>
  );
};

export default Card;
