import React from "react";

function BusinessFeature({
  title,
  subtitle,
  features,
  buttonText,
  onButtonClick,
}) {
  return (
    <div className="join">
      <h1 className="join-title">{title}</h1>
      <p className="join-description">{subtitle}</p>

      <br />
      <br />
      <br />
      <div className="business-features">
        {features.map((feature, index) => (
          <div className="feature-card" key={index}>
            <div className="feature-icon">{feature.icon}</div>
            <p className="feature-text">{feature.text}</p>
          </div>
        ))}
      </div>

      <button className="apply-now-button" onClick={onButtonClick} style={{ height: '50px', backgroundColor: '#FF5900', color: 'white'}}>
        {buttonText}
        
      </button>
    </div>
  );
}

export default BusinessFeature;
