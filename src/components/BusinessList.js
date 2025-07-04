import React from "react";
import businesses from "../data/business";
import Card from "./Card";
import "./BusinessList.css";

const BusinessList = () => {
    return (
        <div className="business-container">
            {businesses.map((business) => (
                <Card key={business.id} {...business} type="business" />
            ))}
        </div>
    );
};

export default BusinessList;
