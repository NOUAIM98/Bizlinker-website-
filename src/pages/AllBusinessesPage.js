import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styles from "./AllBusinessesPage.module.css";
import { FaStar } from "react-icons/fa6";
import ExploreCategories from "../components/ExploreCategories";

const Slideshow = ({ photos, interval = 3000 }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (photos && photos.length > 1) {
      const timer = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % photos.length);
      }, interval);
      return () => clearInterval(timer);
    }
  }, [photos, interval]);

  const getImageUrl = (photo) => {
    if (!photo || photo === "default.jpg") {
      return `${process.env.REACT_APP_API_BASE}/uploads/default.jpg`;
    }

    if (photo.startsWith("http")) return photo;

    return `${process.env.REACT_APP_API_BASE}/${photo}`;
  };

  return (
    <img
      src={getImageUrl(photos?.[currentIndex])}
      alt={`Slide ${currentIndex}`}
      className={styles.businessImage}
      onError={(e) => {
        e.target.onerror = null;
        e.target.src = `${process.env.REACT_APP_API_BASE}/uploads/default.jpg`;
      }}
    />
  );
};

const AllBusinesses = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const categoryFromURL = queryParams.get("category");

  const [allBusinesses, setAllBusinesses] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [cityFilter, setCityFilter] = useState("All");
  const [openNow, setOpenNow] = useState(false);
  const [kidFriendly, setKidFriendly] = useState(false);
  const [petFriendly, setPetFriendly] = useState(false);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    setCategoryFilter(categoryFromURL || "All");
  }, [categoryFromURL]);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE}/getAllBusinesses.php`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setAllBusinesses(data.businesses);
          const allCities = [...new Set(data.businesses.map((b) => b.city))];
          setCities(allCities);
        } else {
          console.error("Error fetching businesses:", data.message);
        }
      })
      .catch((error) => console.error("Error fetching businesses:", error));
  }, []);

  const filteredBusinesses = allBusinesses.filter((business) => {
    const matchesApproved =
      business.contact && business.contact.status === "approved";
    const matchesCategory =
      categoryFilter === "All" || business.category === categoryFilter;
    const matchesCity =
      cityFilter === "All" || business.location.includes(cityFilter);
    const matchesOpenNow =
      !openNow || (business.contact && business.contact.status === "Open");
    const matchesKidFriendly = !kidFriendly || business.kidFriendly === true;
    const matchesPetFriendly = !petFriendly || business.petFriendly === true;
    return (
      matchesApproved &&
      matchesCategory &&
      matchesCity &&
      matchesOpenNow &&
      matchesKidFriendly &&
      matchesPetFriendly
    );
  });

  const sortedBusinesses = filteredBusinesses
    .slice()
    .sort((a, b) => b.rating - a.rating);

  return (
    <div className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.heroImageWrapper}>
          <img
            src="/hero.png"
            alt="Business Hero"
            className={styles.heroImage}
          />
        </div>
        <div className={styles.overlay}></div>
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>Find the Best Business Services</h1>
          <p className={styles.heroSubtitle}>
            Explore top-rated services for your needs, from restaurants to
            photography.
          </p>
        </div>
      </section>

      <ExploreCategories onCategorySelect={(cat) => setCategoryFilter(cat)} />

      <div className={styles.sectioncontainer}>
        <div className={styles.filterAndBusinesses}>
          <aside className={styles.sidebar}>
            <h3>Filters</h3>

            <label>Category:</label>
            <select
              className={styles.filterSelect}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All</option>
              <option value="Restaurants">Restaurants</option>
              <option value="Hotels">Hotels</option>
              <option value="Clothing Stores">Clothing Stores</option>
              <option value="Electronics">Electronics</option>
              <option value="Banks">Banks</option>
              <option value="Automotive">Automotive</option>
              <option value="Education">Education</option>
              <option value="Beauty & Care">Beauty & Care</option>
              <option value="Pet Services">Pet Services</option>
              <option value="Supermarkets">Supermarkets</option>
              <option value="Real Estate">Real Estate</option>
            </select>

            <label>City:</label>
            <select
              className={styles.filterSelect}
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
            >
              <option value="All">All</option>
              {cities.map((city, index) => (
                <option key={index} value={city}>
                  {city}
                </option>
              ))}
            </select>

            <label className={styles.openNowLabel}>
              <input
                type="checkbox"
                checked={openNow}
                onChange={() => setOpenNow(!openNow)}
              />
              Open Now
            </label>

            <label className={styles.kidFriendlyLabel}>
              <input
                type="checkbox"
                checked={kidFriendly}
                onChange={() => setKidFriendly(!kidFriendly)}
              />
              Kid Friendly
            </label>

            <label className={styles.kidFriendlyLabel}>
              <input
                type="checkbox"
                checked={petFriendly}
                onChange={() => setPetFriendly(!petFriendly)}
              />
              Pet Friendly
            </label>
          </aside>

          <div className={styles.businesses}>
            {sortedBusinesses.length > 0 ? (
              sortedBusinesses.map((business) => (
                <Link
                  key={business.id}
                  to={`/business/${business.id}`}
                  className={styles.businessCard}
                >
                  <div className={styles.businessImageWrapper}>
                    <Slideshow
                      photos={
                        business.photos
                          ? Array.isArray(business.photos)
                            ? business.photos
                            : [business.photos]
                          : ["default.jpg"]
                      }
                    />
                  </div>
                  <div className={styles.businessContent}>
                    <h3 className={styles.businessTitle}>{business.name}</h3>
                    <p className={styles.businessLocation}>
                      {business.location}
                    </p>
                    <p className={styles.businessDescription}>
                      {business.about || "No description available."}
                    </p>
                    <div className={styles.businessTags}>
                      {["Fast Food", "Takeaway"].map((tag) => (
                        <span key={tag} className={styles.businessTag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className={styles.businessRating}>
                      <FaStar /> {business.rating}
                      <span className={styles.reviewCount}>
                        ({business.reviews} reviews)
                      </span>
                    </p>
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

export default AllBusinesses;
