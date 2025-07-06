import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaYoutube } from "react-icons/fa";
import { Link } from "react-router-dom";
import "./Footer.css"; 

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section logo-social">
 <div className="logo-title">
  <img src="/ologo.png" alt="Logo" className="footer-logo" />
  <h2>Bizlinker</h2>
</div>

          <p>Follow Us on Social Media</p>
          <div className="social-icons">
            <a href="https://www.facebook.com"><FaFacebook /></a>
            <a href="https://x.com"><FaTwitter /></a>
            <a href="https://www.instagram.com"><FaInstagram /></a>
            <a href="https://www.youtube.com"><FaYoutube /></a>
          </div>
        </div>

        <div className="footer-section">
          <h3>Company</h3>
          <ul>
            <li><Link to="/company/about-us">About Us</Link></li>
            <li><Link to="/company/privacy-policy">Privacy Policy</Link></li>
            <li><Link to="/company/terms-conditions">Terms & Conditions</Link></li>
            <li><Link to="/company/contact">Contact Us</Link></li>
            <li><Link to="/company/faqs">FAQs</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h3>Features</h3>
          <ul>
            <li><Link to="/businesses">Businesses</Link></li>
            <li><Link to="/services">Services</Link></li>
            <li><Link to="/events">Events</Link></li>
            <li><Link to="/for-business">For Business Owners</Link></li>
          </ul>
        </div>

        <div className="footer-section contact">
          <h3>Contact Us</h3>
          <p>For any inquiries or assistance, we'd love to hear from you!</p>
          <ul>
            <li><span>Email:</span> <a href="mailto:contact@ourwebsite.com">contact@ourwebsite.com</a></li>
            <li><span>Phone:</span> (123) 456-7890</li>
            <li><span>Address:</span> 123 Business Analytics Blvd, Suite 456, Tech City, TC 78901</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 CompanyX. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
