import React from "react";
import { Link } from "react-router-dom";
import { businesses } from "./businesses"; 

const BusinessList = () => {
  return (
    <div>
      <h1>Businesses</h1>
      <ul>
        {businesses.map((business) => (
          <li key={business.id}>
            <Link to={`/business/${business.id}`}>{business.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BusinessList;
