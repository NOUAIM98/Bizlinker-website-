import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const SearchResults = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get("q")?.toLowerCase();

  const [events, setEvents] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!searchQuery) return;

    fetch(`${process.env.REACT_APP_API_BASE}/searchEvents.php?q=${searchQuery}`)
      .then((res) => res.json())
      .then((data) => {
        setEvents(data);
      })
      .catch((error) => console.error("Error fetching events:", error));

    fetch(
      `${process.env.REACT_APP_API_BASE}/searchServices.php?q=${searchQuery}`
    )
      .then((res) => res.json())
      .then((data) => {
        setServices(data);
      })
      .catch((error) => console.error("Error fetching services:", error))
      .finally(() => setLoading(false));
  }, [searchQuery]);

  return (
    <div>
      <h1>Search Results for: "{searchQuery}"</h1>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <h2>Businesses </h2>
          {events.length > 0 ? (
            events.map((event) => (
              <div key={event.id}>
                <h3>{event.name}</h3>
                <p>{event.description}</p>
              </div>
            ))
          ) : (
            <p>No business found.</p>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;
