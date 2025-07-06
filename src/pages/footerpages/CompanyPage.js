import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import AboutUsPage from "./AboutUsPage";
import PrivacyPolicyPage from "./PrivacyPolicyPage";
import TermsConditionsPage from "./TermsConditionsPage";
import ContactPage from "./ContactPage";
import FAQsPage from "./FAQsPage";
import "./CompanyPage.css";
import CompanySidebar from "./CompanySidebar";

const CompanyPage = () => {
  return (
    <div className="company-container">
      <CompanySidebar />
      <div className="company-content">
        <Routes>
          <Route path="about-us" element={<AboutUsPage />} />
          <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="terms-conditions" element={<TermsConditionsPage />} />
          <Route path="contact" element={<ContactPage />} />
          <Route path="faqs" element={<FAQsPage />} />
        </Routes>
      </div>
    </div>
  );
};

export default CompanyPage;

