import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginModal from "./LoginModal";
import SignUpModal from "./SignUpModal";
import "./Navbar.css";

const Navbar = () => {
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogoClick = () => {
        navigate("/");
    };

    const toggleLoginModal = () => {
        setIsLoginModalOpen(!isLoginModalOpen);
    };

    const toggleSignUpModal = () => {
        setIsSignUpModalOpen(!isSignUpModalOpen);
    };

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div
                    className="navbar-logo"
                    onClick={handleLogoClick}
                    style={{ cursor: "pointer" }}
                >
                    Logo
                </div>
                <ul className="navbar-links">
                    <li><button className="btn" onClick={toggleLoginModal}>Log in</button></li>
                    <li><button className="btn signup" onClick={toggleSignUpModal}>Sign Up</button></li>
                </ul>
            </div>

            {isLoginModalOpen && <LoginModal onClose={toggleLoginModal} />}

            {isSignUpModalOpen && <SignUpModal onClose={toggleSignUpModal} />}
        </nav>
    );
};

export default Navbar;
