import React, { useState, useEffect } from "react";
import { CaretLeft, CaretRight } from "phosphor-react"; // Ok ikonları için
import "./Slideshow.css";

const Slideshow = ({ photos, interval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (photos.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex(prevIndex => (prevIndex + 1) % photos.length);
      }, interval);
      return () => clearInterval(timer);
    }
  }, [photos, interval]);

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? photos.length - 1 : prevIndex - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === photos.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="slideshow-container">
      <button className="slide-button left" onClick={prevSlide}>
        <CaretLeft size={32} />
      </button>
      <img
        src={photos[currentIndex]}
        alt={`Slide ${currentIndex + 1}`}
        className="slideshow-image"
      />
      <button className="slide-button right" onClick={nextSlide}>
        <CaretRight size={32} />
      </button>
    </div>
  );
};

export default Slideshow;
