import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import styles from "./AllEventsPage.module.css";
import { FaSearch, FaStar } from "react-icons/fa";

const Slideshow = ({ photos, interval = 3000 }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (photos && photos.length > 1) {
      const timer = setInterval(() => {
        setCurrent((prev) => (prev + 1) % photos.length);
      }, interval);
      return () => clearInterval(timer);
    }
  }, [photos, interval]);

  const getPhotoUrl = (photo) => {
    if (!photo) return `${process.env.REACT_APP_API_BASE}/uploads/default.jpg`;
    if (photo.startsWith("http")) return photo;
    if (photo.startsWith("uploads/")) {
      return `${process.env.REACT_APP_API_BASE}/${photo}`;
    }
    return `${process.env.REACT_APP_API_BASE}/uploads/${photo}`;
  };

  return (
    <img
      src={getPhotoUrl(photos?.[current])}
      alt={`Slide ${current}`}
      className={styles.eventImage}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = `${process.env.REACT_APP_API_BASE}/uploads/default.jpg`;
      }}
    />
  );
};

const AllEventsPage = () => {
  const location = useLocation();
  const queryApplied = useRef(false);

  const [categoryFilter, setCategoryFilter] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE}/getEvents.php`)
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
        setLoading(false);
      });
  }, []);

  const formatEventDate = (dateStr) => {
    const dateObj = new Date(dateStr);
    return dateObj.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getImageUrl = (event) => {
    let imagePath = "";
    if (event.image) {
      imagePath = event.image;
    } else if (event.photos && event.photos.length > 0) {
      imagePath = event.photos[0];
    } else {
      return `${process.env.REACT_APP_API_BASE}/uploads/default.jpg`;
    }

    if (imagePath.startsWith("http")) return imagePath;
    if (imagePath.startsWith("uploads/")) {
      return `${process.env.REACT_APP_API_BASE}/${imagePath}`;
    }
    return `${process.env.REACT_APP_API_BASE}/uploads/${imagePath}`;
  };

  const parsePrice = (price) => Number(price.toString().replace("$", ""));

  const filteredEvents = events.filter((event) => {
    const eventPrice = parsePrice(event.price);
    const eventDate = new Date(event.date);
    const matchesCategory =
      categoryFilter === "All" || event.category === categoryFilter;
    const matchesPrice =
      (!minPrice || eventPrice >= Number(minPrice)) &&
      (!maxPrice || eventPrice <= Number(maxPrice));
    const matchesDate =
      (!startDate || eventDate >= new Date(startDate)) &&
      (!endDate || eventDate <= new Date(endDate));
    return matchesCategory && matchesPrice && matchesDate;
  });

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.x}>
      <section className={styles.hero}>
        <div className={styles.heroImageWrapper}>
          <img src="/event.png" alt="Event Hero" className={styles.heroImage} />
        </div>
        <div className={styles.heroContent}>
          <motion.h1
            className={styles.heroTitle}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Discover Upcoming Events
          </motion.h1>
          <motion.p
            className={styles.heroSubtitle}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Find events near you, from concerts to festivals and more.
          </motion.p>
        
          
        </div>
      </section>

      <div className={styles.container}>
        <div className={styles.filterAndEvents}>
          <aside className={styles.sidebar}>
            <label>Category:</label>
            <select
              className={styles.searchBox}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Concerts">Concerts</option>
              <option value="Festivals">Festivals</option>
              <option value="Sports">Sports</option>
              <option value="Workshops">Workshops</option>
              <option value="Exhibitions">Exhibitions</option>
              <option value="Conferences">Conferences</option>
              <option value="Food & Drink">Food & Drink</option>
              <option value="Markets">Markets</option>
              <option value="Outdoor Activities">Outdoor Activities</option>
              <option value="Networking">Networking</option>
              <option value="Community Events">Community Events</option>
              <option value="Theater & Shows">Theater & Shows</option>
            </select>

            <label>Price ($):</label>
            <div className={styles.priceFilter}>
              <input
                type="number"
                placeholder="Min"
                className={styles.searchBox}
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
              <input
                type="number"
                placeholder="Max"
                className={styles.searchBox}
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>

            <label>Date:</label>
            <input
              type="date"
              className={styles.searchBox}
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <input
              type="date"
              className={styles.searchBox}
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </aside>

          <div className={styles.events}>
            {filteredEvents.length > 0 ? (
              filteredEvents.map((event) => (
                <Link
                  key={event.id}
                  to={`/event/${event.id}`}
                  className={styles.eventCard}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  {event.photos && event.photos.length > 1 ? (
                    <Slideshow photos={event.photos} />
                  ) : (
                    <img
                      src={getImageUrl(event)}
                      alt={event.name}
                      className={styles.eventImage}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `${process.env.REACT_APP_API_BASE}/uploads/default.jpg`;
                      }}
                    />
                  )}
                  <div className={styles.eventContent}>
                    <h3 className={styles.eventTitle}>{event.name}</h3>
                    <p className={styles.eventLocation}>{event.location}</p>
                    <p className={styles.eventDate}>
                      {formatEventDate(event.date)}
                    </p>
                    <p className={styles.eventPrice}>$ {event.price}</p>
                    <p className={styles.eventxReview}>
                      <FaStar /> {Number(event.rating).toFixed(1)} (
                      {event.reviews} reviews)
                    </p>
                    <button className={styles.moreInfo}>More Info</button>
                  </div>
                </Link>
              ))
            ) : (
              <p className={styles.noResults}>No results found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllEventsPage;
