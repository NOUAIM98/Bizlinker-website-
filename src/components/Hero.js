import React, { useState, useEffect } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import "./Hero.css";

const images = [
    process.env.PUBLIC_URL + "/hero1.png",
    process.env.PUBLIC_URL + "/hero2.png",
    process.env.PUBLIC_URL + "/hero3.png",
];

const Hero = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const interval = setInterval(() => {
            nextSlide();
        }, 6000);
        return () => clearInterval(interval);
    }, [currentIndex]);

    const nextSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        }
    };

    return (
        <section className="hero-container">
            <div className="hero-slider">
                {images.map((image, index) => (
                    <div
                        key={index}
                        className={index === currentIndex ? "slide active" : "slide"}
                        style={{ backgroundImage: `url(${image})` }}
                    ></div>
                ))}
                <motion.button
                    className="arrow left"
                    onClick={prevSlide}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <FaArrowLeft />
                </motion.button>
                <motion.button
                    className="arrow right"
                    onClick={nextSlide}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <FaArrowRight />
                </motion.button>
            </div>

            <motion.div
                className="hero-content"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.h1
                    className="hero-title"
                    variants={itemVariants}
                >
                    Discover the Best Around You
                </motion.h1>

                <motion.h2
                    className="highlight"
                    variants={itemVariants}
                >
                    Businesses, Services, and Events
                </motion.h2>

                <motion.p
                    className="heroexp"
                    variants={itemVariants}
                >
                    Your ultimate guide to top-rated experiences, trusted services, and unmissable events
                </motion.p>
            </motion.div>
        </section>
    );
};

export default Hero;
