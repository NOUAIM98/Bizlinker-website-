import React from "react";
import { FaPhoneAlt, FaEnvelope } from "react-icons/fa"; 

const ContactPage = () => {


  return (
    <div>
      <h1>Contact Us</h1>
      <p>If you need assistance or have any questions, please reach out to us!</p>

      <div style={{ marginBottom: "20px" }}>
        <h3>Contact Information</h3>
        <ul style={{ listStyleType: "none", padding: 0 }}>
          <li><FaPhoneAlt /> <strong>Phone:</strong> (123) 456-7890</li>
          <li><FaEnvelope /> <strong>Email:</strong> <a href="mailto:contact@ourwebsite.com" style={{ color: "#00bfa5", textDecoration: "none" }}>contact@ourwebsite.com</a></li>
        </ul>
      </div>

      <div>
        <h3>Our Location</h3>
        <p>1234 Main St, City, State, 12345</p>
      </div>
    </div>
  );
};

export default ContactPage;
