import React from "react";
import { FaHamburger, FaTshirt, FaLaptop, FaUniversity, FaCar, FaGraduationCap, FaPalette, FaCode, FaPen, FaVideo } from "react-icons/fa";
import { FaBagShopping, FaCamera, FaShopify } from "react-icons/fa6";

const categories = [
    { icon: <FaPalette size={40} />, label: "Graphic Design" },
    { icon: <FaCode size={40} />, label: "Web Development" },
    { icon: <FaPen size={40} />, label: "Writing" },
    { icon: <FaCamera size={40} />, label: "Photography" },
    { icon: <FaVideo size={40} />, label: "Video Editing" },
    { icon: <FaBagShopping size={40} />, label: "Digital Marketing" },
];

const ExploreCategories = () => {
    return (
        <div style={{ textAlign: "left", padding: "60px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "40px", paddingLeft: "60px" }}>
                Discover Best Services by Category
            </h2>
            <div style={{ display: "flex", justifyContent: "center", gap: "30px", flexWrap: "wrap" }}>
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
                            border: "1px solid #FF5900",
                            borderRadius: "12px",
                            boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
                            backgroundColor: "#fff",
                            cursor: "pointer",
                            transition: "transform 0.2s",
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                        onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
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

