import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";
import "./Navbar.css";
import {
  BsBank,
  BsHouseDoor,
  BsBag,
  BsMortarboard,
  BsBuilding,
  BsLightning,
  BsHospital,
  BsScissors,
  BsHouseHeart,
  BsHeartPulse,
  BsCarFront,
  BsShopWindow,
  BsBrush,
  BsCodeSlash,
  BsPalette,
  BsCameraVideo,
  BsPlug,
  BsTools,
  BsMusicNoteBeamed,
  BsPeople,
  BsCalendarEvent,
  BsMic,
  BsCup,
  BsTree,
} from "react-icons/bs";
import { IoRestaurantOutline } from "react-icons/io5";
import { FaHandshake } from "react-icons/fa";
import logoImage from "./logo.png";
import {
  MdSportsSoccer,
  MdFestival,
  MdTheaterComedy,
  MdCleaningServices,
  MdKeyboardArrowDown,
  MdAdd,
  MdKeyboardArrowRight,
  MdSearch,
} from "react-icons/md";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Navbar = ({ user, onLogout, onLoginSuccess }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);
  const [isBusinessDropdownOpen, setIsBusinessDropdownOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const [isEventsDropdownOpen, setIsEventsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setCurrentUser(user);
  }, [user]);

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const handleLogoClick = () => navigate("/");
  const openLoginModal = () => setIsLoginModalOpen(true);
  const openSignUpModal = () => setIsSignUpModalOpen(true);
  const closeModals = () => {
    setIsLoginModalOpen(false);
    setIsSignUpModalOpen(false);
  };

  const handleCategoryNav = (type, category) => {
    navigate(`/${type}?category=${encodeURIComponent(category)}`);
  };

  const getProfilePicture = () => {
    const defaultImage =
      "https://cdn-icons-png.flaticon.com/512/847/847969.png";
    if (currentUser?.profilePicture) {
      const pic = currentUser.profilePicture;
      return pic.startsWith("http") || pic.startsWith("data:")
        ? pic
        : `${process.env.REACT_APP_API_BASE}/${pic}`;
    }
    return defaultImage;
  };

  const handleProfileClick = () => {
    if (location.pathname === "/settings") {
      const from = location.state?.from || "/";
      navigate(from);
    } else {
      navigate("/settings", { state: { from: location.pathname } });
    }
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE}/search.php?q=${encodeURIComponent(
          query
        )}`
      );
      const data = await res.json();

      if (data.type === "business") {
        navigate(`/business/${data.id}`);
      } else if (data.type === "service") {
        navigate(`/service/${data.id}`);
      } else if (data.type === "event") {
        navigate(`/event/${data.id}`);
      } else {
        toast.info("No results found for your search.");
      }
    } catch (err) {
      console.error("Search error:", err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-logo" onClick={handleLogoClick}>
          <img
            src={logoImage}
            alt="Logo"
            style={{ height: "50px", objectFit: "contain" }}
          />
        </div>

        <form className="search-container" onSubmit={handleSearchSubmit}>
          <input
            type="text"
            className="search-input"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="search-button">
            <MdSearch />
          </button>
        </form>

        <ul className={`navbar-links ${isMenuOpen ? "active" : ""}`}>
          <div className="navbar-group">
            <li className="dropdown">
              <button
                className="dropdown-button"
                onClick={() => setIsBusinessDropdownOpen((prev) => !prev)}
              >
                Businesses <MdKeyboardArrowDown />
              </button>
              {isBusinessDropdownOpen && (
                <ul className="dropdown-menu">
                  <li
                    onClick={() =>
                      handleCategoryNav("businesses", "Restaurants")
                    }
                  >
                    <IoRestaurantOutline /> Restaurants
                  </li>
                  <li onClick={() => handleCategoryNav("businesses", "Health")}>
                    <BsHospital /> Health
                  </li>
                  <li onClick={() => handleCategoryNav("businesses", "Hotels")}>
                    <BsBuilding /> Hotels
                  </li>
                  <li
                    onClick={() => handleCategoryNav("businesses", "Fitness")}
                  >
                    <BsHeartPulse /> Fitness
                  </li>
                  <li
                    onClick={() =>
                      handleCategoryNav("businesses", "Automotive")
                    }
                  >
                    <BsCarFront /> Automotive
                  </li>
                  <li
                    onClick={() => handleCategoryNav("businesses", "Education")}
                  >
                    <BsMortarboard /> Education
                  </li>
                  <li onClick={() => handleCategoryNav("businesses", "Banks")}>
                    <BsBank /> Banks
                  </li>
                  <li
                    onClick={() =>
                      handleCategoryNav("businesses", "Electronics")
                    }
                  >
                    <BsLightning /> Electronics
                  </li>
                  <li
                    onClick={() =>
                      handleCategoryNav("businesses", "Clothing Shops")
                    }
                  >
                    <BsBag /> Clothing Shops
                  </li>
                  <li
                    onClick={() =>
                      handleCategoryNav("businesses", "Beauty & Care")
                    }
                  >
                    <BsScissors /> Beauty & Care
                  </li>
                  <li
                    onClick={() =>
                      handleCategoryNav("businesses", "Pet Services")
                    }
                  >
                    <BsHouseHeart /> Pet Services
                  </li>
                  <li
                    onClick={() =>
                      handleCategoryNav("businesses", "Supermarkets")
                    }
                  >
                    <BsShopWindow /> Supermarkets
                  </li>
                  <li
                    onClick={() =>
                      handleCategoryNav("businesses", "Real Estate")
                    }
                  >
                    <BsHouseDoor /> Real Estate
                  </li>
                  <li onClick={() => navigate("/businesses")}>
                    <MdKeyboardArrowRight /> See All
                  </li>
                </ul>
              )}
            </li>

            <li className="dropdown">
              <button
                className="dropdown-button"
                onClick={() => setIsServicesDropdownOpen((prev) => !prev)}
              >
                Services <MdKeyboardArrowDown />
              </button>
              {isServicesDropdownOpen && (
                <ul className="dropdown-menu">
                  <li
                    onClick={() =>
                      handleCategoryNav("services", "Web Development")
                    }
                  >
                    <BsCodeSlash /> Web Development
                  </li>
                  <li onClick={() => handleCategoryNav("services", "Design")}>
                    <BsPalette /> Design
                  </li>
                  <li
                    onClick={() =>
                      handleCategoryNav("services", "Video Editing")
                    }
                  >
                    <BsCameraVideo /> Video Editing
                  </li>
                  <li
                    onClick={() =>
                      handleCategoryNav("services", "Cleaning Services")
                    }
                  >
                    <MdCleaningServices /> Cleaning Services
                  </li>
                  <li onClick={() => handleCategoryNav("services", "Painting")}>
                    <BsBrush /> Painting
                  </li>
                  <li
                    onClick={() =>
                      handleCategoryNav("services", "Electrical Repair")
                    }
                  >
                    <BsPlug /> Electrical Repair
                  </li>
                  <li onClick={() => handleCategoryNav("services", "Handyman")}>
                    <BsTools /> Handyman
                  </li>
                  <li
                    onClick={() =>
                      handleCategoryNav("services", "Home Maintenance")
                    }
                  >
                    <BsHouseDoor /> Home Maintenance
                  </li>
                  <li onClick={() => navigate("/services")}>
                    <MdKeyboardArrowRight /> See All
                  </li>
                </ul>
              )}
            </li>

            <li className="dropdown">
              <button
                className="dropdown-button"
                onClick={() => setIsEventsDropdownOpen((prev) => !prev)}
              >
                Events <MdKeyboardArrowDown />
              </button>
              {isEventsDropdownOpen && (
                <ul className="dropdown-menu">
                  <li onClick={() => handleCategoryNav("events", "Concerts")}>
                    <BsMusicNoteBeamed /> Concerts
                  </li>
                  <li onClick={() => handleCategoryNav("events", "Festivals")}>
                    <MdFestival /> Festivals
                  </li>
                  <li onClick={() => handleCategoryNav("events", "Sports")}>
                    <MdSportsSoccer /> Sports
                  </li>
                  <li onClick={() => handleCategoryNav("events", "Workshops")}>
                    <BsMic /> Workshops
                  </li>
                  <li
                    onClick={() => handleCategoryNav("events", "Exhibitions")}
                  >
                    <BsPalette /> Exhibitions
                  </li>
                  <li
                    onClick={() => handleCategoryNav("events", "Conferences")}
                  >
                    <BsCalendarEvent /> Conferences
                  </li>
                  <li
                    onClick={() => handleCategoryNav("events", "Food & Drink")}
                  >
                    <BsCup /> Food & Drink
                  </li>
                  <li onClick={() => handleCategoryNav("events", "Markets")}>
                    <BsShopWindow /> Markets
                  </li>
                  <li
                    onClick={() =>
                      handleCategoryNav("events", "Outdoor Activities")
                    }
                  >
                    <BsTree /> Outdoor Activities
                  </li>
                  <li onClick={() => handleCategoryNav("events", "Networking")}>
                    <FaHandshake /> Networking
                  </li>
                  <li
                    onClick={() =>
                      handleCategoryNav("events", "Community Events")
                    }
                  >
                    <BsPeople /> Community Events
                  </li>
                  <li
                    onClick={() =>
                      handleCategoryNav("events", "Theater & Shows")
                    }
                  >
                    <MdTheaterComedy /> Theater & Shows
                  </li>
                  <li onClick={() => navigate("/events")}>
                    <MdKeyboardArrowRight /> See All
                  </li>
                </ul>
              )}
            </li>
          </div>

          <li className="forbusiness">
            <button
              className="dropdown-forbusiness"
              onClick={() => navigate("/for-business")}
            >
              <MdAdd /> For Business
            </button>
          </li>

          {!currentUser ? (
            <div className="auth-buttons">
              <li>
                <button className="btn-login" onClick={openLoginModal}>
                  Log in
                </button>
              </li>
              <li>
                <button className="btn-signup" onClick={openSignUpModal}>
                  Sign Up
                </button>
              </li>
            </div>
          ) : (
            <li
              className="dropdown"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
              onClick={handleProfileClick}
            >
              <img
                src={getProfilePicture()}
                alt="avatar"
                style={{ borderRadius: "50%", width: "32px", height: "32px" }}
              />
              <span>{currentUser.firstName}</span>
            </li>
          )}
        </ul>

        <div className="menu-toggle" onClick={toggleMenu}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      </div>

      <LoginModal
        open={isLoginModalOpen}
        onClose={closeModals}
        onLoginSuccess={(userData) => {
          onLoginSuccess(userData);
          setCurrentUser(userData);
          closeModals();
        }}
      />
      <SignUpModal
        open={isSignUpModalOpen}
        onClose={closeModals}
        onSignupSuccess={(userData) => {
          onLoginSuccess(userData);
          setCurrentUser(userData);
          closeModals();
        }}
      />
    </nav>
  );
};

export default Navbar;
