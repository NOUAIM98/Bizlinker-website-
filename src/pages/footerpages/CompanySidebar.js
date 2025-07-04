import React from "react";
import { Link } from "react-router-dom";
import "./CompanySidebar.css"; 
const CompanySidebar = () => {
  return (
    <div className="company-sidebar">
      <ul className="sidebar-menu">
        <li>
        <Link to="/company/about-us" className="sidebar-link">About Us</Link>
        </li>
        <li>
          <Link to="/company/privacy-policy" className="sidebar-link">
            Privacy Policy
          </Link>
        </li>
        <li>
          <Link to="/company/terms-conditions" className="sidebar-link">
            Terms & Conditions
          </Link>
        </li>
        <li>
          <Link to="/company/contact" className="sidebar-link">
            Contact
          </Link>
        </li>
        <li>
          <Link to="/company/faqs" className="sidebar-link">
            FAQs
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default CompanySidebar;
