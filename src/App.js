import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import Navbar from "./components/Navbar";
import AdminLogin from "./pages/AdminLogin";

import Hero from "./components/Hero";
import CardList from "./components/CardList";
import ExploreCategories from "./components/ExploreCategories";
import ExploreServices from "./components/ExploreServices";
import SearchResults from "./components/SearchResults";
import Footer from "./components/Footer";
import BusinessPage from "./pages/BusinessPage";
import EventsPage from "./pages/EventsPage";
import ServicePage from "./pages/ServicePage";
import WriteReview from "./pages/WriteReview";
import AdminPanel from "./pages/AdminPanel";
import SubAdminPanel from "./pages/SubAdminPanel";

import ForBusiness from "./pages/ForBusiness";
import BusinessApplicationForm from "./pages/BusinessApplicationForm";
import EventApplicationForm from "./pages/EventApplicationForm";
import ServiceApplicationForm from "./pages/ServiceApplicationForm";
import BusinessList from "./pages/BusinessList";
import AllEventsPage from "./pages/AllEventsPage";
import AllBusinessesPage from "./pages/AllBusinessesPage";
import ReviewSection from "./components/ReviewSection";
import AllServicesPage from "./pages/AllServicesPage";
import AboutUsPage from "./pages/footerpages/AboutUsPage";
import FAQsPage from "./pages/footerpages/FAQsPage";
import PrivacyPolicyPage from "./pages/footerpages/PrivacyPolicyPage";
import ContactPage from "./pages/footerpages/ContactPage";
import TermsConditionsPage from "./pages/footerpages/TermsConditionsPage";
import SettingsPage from "./pages/SettingsPage";
import CompanyPage from "./pages/footerpages/CompanyPage";
import LiveChat from "./components/LiveChat";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const location = useLocation();
  const navigate = useNavigate();
  const [restaurantCards, setRestaurantCards] = useState([]);
  const [eventCards, setEventCards] = useState([]);
  const [serviceCards, setServiceCards] = useState([]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE}/home_data.php`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched promoted home data:", data);
        if (data.success) {
          setRestaurantCards(
            data.data.businesses.map((item) => ({
              ...item,
              type: "business",
              promoted: true,
            }))
          );
          setEventCards(
            data.data.events.map((item) => ({
              ...item,
              type: "event",
              promoted: true,
            }))
          );
          setServiceCards(
            data.data.services.map((item) => ({
              ...item,
              type: "service",
              promoted: true,
            }))
          );
        }
      })
      .catch((err) => {
        console.error("Failed to fetch promoted home data:", err);
      });
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && !user) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLoginSuccess = (loggedInUser) => {
    setUser(loggedInUser);
    localStorage.setItem("user", JSON.stringify(loggedInUser));
  };

  const handleUpdateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    navigate("/");
  };

  const goToEvents = () => {
    navigate("/events");
  };

  const goToServices = () => {
    navigate("/services");
  };

  return (
    <div className="App">
      {location.pathname !== "/admin" &&
        location.pathname !== "/sub-admin" &&
        location.pathname !== "/x123y-login" && (
          <Navbar
            user={user}
            onLogout={handleLogout}
            onLoginSuccess={handleLoginSuccess}
          />
        )}

      <LiveChat />

      <div className="main-content">
        <ToastContainer position="top-center" autoClose={3000} />
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />

                <ReviewSection />
                <div>
                  <div className="business-container">
                    <h1 className="center-text">
                      Explore Businesses That Fit Your Needs
                    </h1>
                    <CardList
                      title={
                        <h4 style={{ textAlign: "left" }}>
                          Popular Businesses to Check Out This Week
                        </h4>
                      }
                      cards={restaurantCards.map((card) => ({
                        ...card,
                        type: "business",
                      }))}
                    />
                  </div>
                  <div className="event-container">
                    <h1 className="center-text">
                      Looking for something fun to do?
                    </h1>
                    <CardList
                      title={
                        <h4 style={{ textAlign: "left" }}>
                          Popular Tickets & Upcoming Events
                        </h4>
                      }
                      cards={eventCards.map((card) => ({
                        ...card,
                        type: "event",
                      }))}
                    />

                    <h1 className="center-info">
                      From concerts to festivals and everything in between, find
                      the hottest events happening near you. Don't miss out on
                      unforgettable experiences!
                    </h1>
                    <button
                      className="browse-button-event"
                      onClick={goToEvents}
                    >
                      Browse All Events
                    </button>
                  </div>
                  <div className="service-container">
                    <h1 className="service-text">
                      Looking for the right professional to get the job done?
                    </h1>
                    <ExploreServices />
                    <button
                      className="browse-button-service"
                      onClick={goToServices}
                    >
                      See All Services
                    </button>
                  </div>
                </div>
              </>
            }
          />
          <Route path="/company/*" element={<CompanyPage />}>
            <Route path="about-us" element={<AboutUsPage />} />
            <Route path="privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="terms-conditions" element={<TermsConditionsPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="faqs" element={<FAQsPage />} />
          </Route>
          <Route path="/search" element={<SearchResults />} />

          <Route path="/write-review" element={<WriteReview />} />
          <Route path="/for-business" element={<ForBusiness />} />
          <Route path="/business-list" element={<BusinessList />} />
          <Route path="/business/:id" element={<BusinessPage />} />
          <Route path="/event/:id" element={<EventsPage />} />
          <Route path="/all-events" element={<AllEventsPage />} />
          <Route path="/services" element={<AllServicesPage />} />
          <Route path="/businesses" element={<AllBusinessesPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about-us" element={<AboutUsPage />} />
          <Route path="/faqs" element={<FAQsPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
          <Route path="/terms-conditions" element={<TermsConditionsPage />} />
          <Route path="/service/:id" element={<ServicePage />} />
          <Route path="/events" element={<AllEventsPage />} />
          <Route path="/browse-button-event" element={<AllEventsPage />} />
          <Route path="/admin" element={<AdminPanel />} />
          <Route path="/x123y-login" element={<AdminLogin />} />
          <Route path="/sub-admin" element={<SubAdminPanel />} />
          <Route
            path="/business-application-form"
            element={<BusinessApplicationForm />}
          />
          <Route
            path="/event-application-form"
            element={<EventApplicationForm />}
          />
          <Route
            path="/service-application-form"
            element={<ServiceApplicationForm />}
          />
          <Route
            path="/settings"
            element={
              <SettingsPage user={user} onUpdateUser={handleUpdateUser} />
            }
          />
        </Routes>
      </div>

      {location.pathname !== "/admin" &&
        location.pathname !== "/sub-admin" &&
        location.pathname !== "/x123y-login" && <Footer />}
    </div>
  );
}

function WrappedApp() {
  return (
    <Router>
      <App />
    </Router>
  );
}

export default WrappedApp;
