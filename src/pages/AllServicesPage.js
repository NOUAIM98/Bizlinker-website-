import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./AllServicesPage.module.css";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa6";

function AllServicesPage() {
  const location = useLocation();
  const [services, setServices] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [deliveryTimeFilter, setDeliveryTimeFilter] = useState("All");

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const categoryParam = queryParams.get("category");
    setCategoryFilter(categoryParam || "All");
  }, [location.search]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE}/getServices.php`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.services)) {
          setServices(data.services);
        } else {
          setServices([]);
        }
      })
      .catch(() => setServices([]));
  }, []);

  const parsePrice = (p) => {
    if (!p) return 0;
    return Number(String(p).replace("$", "")) || 0;
  };

  const getImageUrl = (path, fallbackFile = "default.jpg") => {
    if (!path || path === "null" || path === "undefined" || path.trim() === "")
      return `${process.env.REACT_APP_API_BASE}/uploads/${fallbackFile}`;

    if (path.startsWith("http")) return path;

    return `${process.env.REACT_APP_API_BASE}/${path}`;
  };

  const filteredServices = services.filter((s) => {
    const price = parsePrice(s.price);
    const categoryMatch =
      categoryFilter === "All" || s.category === categoryFilter;
    const priceMatch =
      (!minPrice || price >= Number(minPrice)) &&
      (!maxPrice || price <= Number(maxPrice));
    const deliveryMatch =
      deliveryTimeFilter === "All" || s.deliveryTime === deliveryTimeFilter;
    return categoryMatch && priceMatch && deliveryMatch;
  });

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <video autoPlay loop muted playsInline className={styles.heroVideo}>
          <source
            src="https://getbizlinker.site/service.mp4"
            type="video/mp4"
          />
        </video>
        <div className={styles.overlay}></div>
        <div className={styles.heroContent}>
          <motion.h1
            className={styles.heroTitle}
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Discover the Best Services
          </motion.h1>
          <motion.p
            className={styles.heroSubtitle}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            Find the perfect service to meet your needs. Whether you're looking
            for design, development, or consulting, we've got you covered!
          </motion.p>
        </div>
      </section>

      <br />
      <br />

      <aside className={styles.sidebar}>
        <label>Category:</label>
        <select
          className={styles.categoryFilter}
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="Design">Design</option>
          <option value="Marketing">Marketing</option>
          <option value="Development">Development</option>
          <option value="Writing">Writing</option>
          <option value="Consulting">Consulting</option>
          <option value="Photography">Photography</option>
          <option value="Video">Video</option>
        </select>

        <label>Price ($):</label>
        <div className={styles.priceFilter}>
          <input
            type="number"
            placeholder="Min"
            className={styles.searchBox}
            value={minPrice}
            onChange={(e) =>
              setMinPrice(e.target.value >= 0 ? e.target.value : "")
            }
          />
          <input
            type="number"
            placeholder="Max"
            className={styles.searchBox}
            value={maxPrice}
            onChange={(e) =>
              setMaxPrice(e.target.value >= 0 ? e.target.value : "")
            }
          />
        </div>

        <label>Delivery Time:</label>
        <select
          className={styles.deliveryTimeFilter}
          value={deliveryTimeFilter}
          onChange={(e) => setDeliveryTimeFilter(e.target.value)}
        >
          <option value="All">All</option>
          <option value="24 Hours">24 Hours</option>
          <option value="2 Days">2 Days</option>
          <option value="3 Days">3 Days</option>
          <option value="1 Week">1 Week</option>
          <option value="Custom">Custom</option>
        </select>
      </aside>

      <div className={styles.services}>
        {filteredServices.length > 0 ? (
          filteredServices.map((s) => (
            <div key={s.id} className={styles.serviceCard}>
              <img
                src={getImageUrl(s.image)}
                alt={s.serviceTitle}
                className={styles.image}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = `${process.env.REACT_APP_API_BASE}/uploads/default.jpg`;
                }}
              />
              <div className={styles.serviceContent}>
                <div className={styles.freelancerInfo}>
                  <img
                    src={getImageUrl(s.profile, "default.png")}
                    alt="Profile"
                    className={styles.freelancerAvatar}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `${process.env.REACT_APP_API_BASE}/uploads/default.png`;
                    }}
                  />
                  <div>
                    <p className={styles.serviceProvider}>{s.providerName}</p>
                    <h3 className={styles.serviceTitle}>{s.serviceTitle}</h3>
                  </div>
                </div>
                <p className={styles.servicePrice}>
                  ${Number(s.price).toFixed(2)}
                </p>
                <p className={styles.serviceRating}>
                  <FaStar /> {Number(s.rating).toFixed(1)} ({s.reviewCount}{" "}
                  reviews)
                </p>
                <button className={styles.serviceButton}>
                  <Link to={`/service/${s.id}`} className={styles.serviceLink}>
                    View More
                  </Link>
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className={styles.noResults}>No results found.</p>
        )}
      </div>
    </div>
  );
}

export default AllServicesPage;
