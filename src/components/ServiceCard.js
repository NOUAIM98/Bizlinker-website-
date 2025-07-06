import React from "react";

const CategoryCard = ({ icon: IconComponent, title }) => {
    return (
        <a
            href={`/${title.toLowerCase().replace(/\s+/g, '-')}`}
            style={{
                textDecoration: 'none',
                display: 'block',
            }}
        >
            <div
                className="category-card"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "150px",
                    height: "100px",
                    border: "1px solid #ddd",
                    borderRadius: "10px",
                    background: "#fff",
                    boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                    margin: "10px",
                }}
            >
                <IconComponent size={32} color="#333" />
                <p className="category-title" style={{ marginTop: "10px", fontSize: "14px", color: "#333" }}>
                    {title}
                </p>
            </div>
        </a>
    );
};

export default CategoryCard;
