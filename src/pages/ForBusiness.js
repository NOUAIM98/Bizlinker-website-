import React from "react";
import { useNavigate } from "react-router-dom";
import { FaChartLine, FaStar, FaClipboard, FaSuitcase, FaLink, FaChartBar, FaTrophy, FaCommentDots, FaCalendarAlt } from 'react-icons/fa'; 
import "./ForBusiness.css";
import BusinessFeature from "./BusinessFeature";

function ForBusiness() {
  const navigate = useNavigate();

  return (
    <div className="join">
      <br />
      <br />
      <br />
      <br />
      <br/><br/><br/>
      <br/><br/><br/>

      <h1 className="join-main-title">Join Our Platform and Grow Together!</h1>
      <p className="join-description">
        Whether you're a business owner, an event organizer, or a freelancer,
        our platform helps you connect with the right audience. Choose the
        option that suits you and apply today to take your reach to the next
        level!
      </p>
      <br />
      <br />
      <br />
      <br />
      <br />

      <div
        className="image-business"
        style={{
          backgroundImage: "url('/forbusiness.png')",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          height: "400px",
        }}
      >
        <div className="image-businesses">
          <p className="image-text">
            Unlock Opportunities in Business, Events, and Services!
            <br />
            <p className="exp">
              Take the first step now and expand your reach to new heights!
            </p>
          </p>
        </div>
      </div>
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <BusinessFeature
        title="Become a Business Partner"
        subtitle="Promote your business and reach more customers! Add your business to our platform and expand your customer base. Apply now and start growing today!"
        buttonText="Apply Now"
        onButtonClick={() => navigate("/business-application-form")}
        features={[
          { icon: <FaChartLine />, text: "List your business and increase visibility." },
          { icon: <FaStar />, text: "Gain customer trust with reviews and ratings." },
          { icon: <FaClipboard />, text: "Access analytics to track your performance." },
        ]}
      />
      <br />
      <br />
      <br />
      <br />
      <br />
      <BusinessFeature
        title="Create an Event"
        subtitle="Share your events with a wider audience! From concerts to workshops and seminars, publish your events and reach your target audience easily. Apply now to feature your event!"
        buttonText="Apply Now"
        onButtonClick={() => navigate("/event-application-form")}
        features={[
          { icon: <FaSuitcase />, text: "Get your event featured on our platform." },
          { icon: <FaLink />, text: "Attract the right audience with targeted visibility." },
          { icon: <FaChartBar />, text: "Simplify ticketing and registrations." },
        ]}
      />
      <br />
      <br />
      <br />
      <br />
      <br />
      <BusinessFeature
        title="Offer Your Services"
        subtitle="Showcase your skills and earn more! Promote your freelance services and connect with new clients. Apply now to find the right opportunities for you."
        buttonText="Apply Now"
        onButtonClick={() => navigate("/service-application-form")}
        features={[
          { icon: <FaTrophy />, text: "Showcase your skills to thousands of potential clients." },
          { icon: <FaCommentDots />, text: "Set your own rates and terms." },
          { icon: <FaCalendarAlt />, text: "Build credibility with verified reviews." },
        ]}
      />

      <br />
      <br />
      <br />
      <br />
    </div>
  );
}

export default ForBusiness;
