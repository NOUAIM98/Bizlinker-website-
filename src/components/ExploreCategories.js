import React from "react";
import {
  FaHamburger,
  FaTshirt,
  FaLaptop,
  FaUniversity,
  FaCar,
  FaGraduationCap,
  FaHotel,
} from "react-icons/fa";

const categories = [
  { icon: <FaHamburger size={40} />, label: "Restaurants" },
  { icon: <FaHotel size={40} />, label: "Hotels" },
  { icon: <FaTshirt size={40} />, label: "Clothing Stores" },
  { icon: <FaLaptop size={40} />, label: "Electronics" },
  { icon: <FaUniversity size={40} />, label: "Banks" },
  { icon: <FaCar size={40} />, label: "Autos" },
];

const ExploreCategories = ({ onCategorySelect }) => {
  return (
    <div style={{ textAlign: "left", padding: "60px" }}>
      <h2
        style={{
          fontSize: "24px",
          fontWeight: "regular",
          marginBottom: "40px",
          paddingLeft: "60px",
        }}
      >
        Discover Best Businesses by Category
      </h2>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "30px",
          flexWrap: "wrap",
        }}
      >
        {categories.map((category, index) => (
          <div
            key={index}
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              width: "185px",
              height: "130px",
              border: "1px solid #ddd",
              borderRadius: "12px",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
              backgroundColor: "#fff",
              cursor: "pointer",
              transition: "transform 0.2s",
            }}
            // On hover scale effect
            onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            // When clicked, call onCategorySelect (if provided)
            onClick={() => onCategorySelect && onCategorySelect(category.label)}
          >
            {category.icon}
            <span style={{ marginTop: "10px", fontSize: "14px", fontWeight: "500" }}>
              {category.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExploreCategories;
