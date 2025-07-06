import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Phone,
  Envelope,
  Calendar,
  Ticket,
  Heart,
  XCircle,
} from "phosphor-react";
import {
  Button,
  Modal,
  TextField,
  Box,
  Typography,
  Rating,
  Snackbar,
  Alert,
} from "@mui/material";
import ReviewCard from "./ReviewCard";
import BuyTicketsModal from "./BuyTicketsModal";
import "./EventsPage.css";
import { Web } from "@mui/icons-material";
import AiReview from "../components/AiReview";

const Slideshow = ({ photos, interval = 3000 }) => {
  const [current, setCurrent] = useState(0);
  useEffect(() => {
    if (photos.length > 1) {
      const timer = setInterval(() => {
        setCurrent((prev) => (prev + 1) % photos.length);
      }, interval);
      return () => clearInterval(timer);
    }
  }, [photos, interval]);
  const getPhotoUrl = (photo) => {
    if (photo.startsWith("uploads/")) {
      return `${process.env.REACT_APP_API_BASE}/${photo}`;
    }
    return `${process.env.REACT_APP_API_BASE}/${photo}`;
  };
  return (
    <img
      src={getPhotoUrl(photos[current])}
      alt={`Slide ${current}`}
      className="eventImage"
    />
  );
};

const EventsPage = ({ user, onUpdateUser }) => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [isSaved, setIsSaved] = useState(false);
  const [error, setError] = useState("");
  const [modalState, setModalState] = useState({ buy: false, gallery: false });
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewDate, setReviewDate] = useState("");
  const [rating, setRating] = useState(5);
  const [photos, setPhotos] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const loggedInUser = JSON.parse(localStorage.getItem("user")) || {};
  const currentUserID = loggedInUser.userID;

  // Fallback: if user prop isn’t provided, try localStorage.
  const currentUser = user || JSON.parse(localStorage.getItem("user")) || {};

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE}/getEvents.php`)
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((e) => e.id === Number(id));
        setEvent(found);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching event:", error);
        setLoading(false);
      });
  }, [id]);

  const fetchReviews = () => {
    fetch(`${process.env.REACT_APP_API_BASE}/getReviews.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventID: id, reviewType: "event" }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setReviews(data.reviews);
        }
      })
      .catch((error) => console.error("Error fetching reviews:", error));
  };

  useEffect(() => {
    if (id) {
      fetchReviews();
    }
  }, [id]);

  // Calculate average rating and review count based on fetched reviews.
  const calculatedRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, rev) => sum + Number(rev.rating), 0) /
          reviews.length
        ).toFixed(1)
      : event?.rating || 0;
  const reviewCount = reviews.length > 0 ? reviews.length : event?.reviews || 0;

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
      return "/event.png";
    }
    if (imagePath.startsWith("uploads/")) {
      return `https://getbizlinker.site/backend/${imagePath}`;
    }
    return `https://getbizlinker.site/backend/uploads/${imagePath}`;
  };

  if (loading) return <div>Loading...</div>;
  if (!event) return <h2>Event not found</h2>;

  const handleReviewSubmit = () => {
    const reviewerID = currentUser.userID || currentUser.id;
    if (!reviewerID) {
      setSnackbarMessage("You must be logged in to submit a review");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    const newReview = {
      eventID: event.id,
      reviewerID,
      reviewTitle,
      comment: reviewText,
      rating,
      reviewDate,
      reviewType: "event",
    };
    fetch(`${process.env.REACT_APP_API_BASE}/submitReview.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newReview),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          fetchReviews();
          setSnackbarMessage("Review submitted");
          setSnackbarSeverity("success");
        } else {
          setSnackbarMessage(data.message || "Error submitting review");
          setSnackbarSeverity("error");
        }
        setSnackbarOpen(true);
      })
      .catch((error) => {
        setSnackbarMessage("Error submitting review");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });
    setReviewTitle("");
    setReviewText("");
    setReviewDate("");
    setRating(5);
    setPhotos([]);
    setIsReviewModalOpen(false);
  };

  const handleQuestionSubmit = () => {
    const reviewerID = currentUser.userID || currentUser.id;
    if (!reviewerID) {
      setSnackbarMessage("You must be logged in to submit a question");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    const payload = {
      userID: reviewerID,
      eventID: event.id,
      question: questionText,
    };
    fetch(`${process.env.REACT_APP_API_BASE}/submitQuestion.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSnackbarMessage("Question submitted successfully");
          setSnackbarSeverity("success");
        } else {
          setSnackbarMessage(data.message || "Error submitting question");
          setSnackbarSeverity("error");
        }
        setSnackbarOpen(true);
      })
      .catch((error) => {
        setSnackbarMessage("Error submitting question");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });
    setQuestionText("");
    setIsQuestionModalOpen(false);
  };

  const handlePhotoChange = (e) => {
    const files = e.target.files;
    setPhotos(Array.from(files));
  };

  const handleModalClick = (e, closeFunc) => {
    if (e.target.className === "modal") {
      closeFunc();
    }
  };

  const handleFavorite = () => {
    const payload = { userID: currentUserID, eventID: event.id };
    fetch(`${process.env.REACT_APP_API_BASE}/addFavorite.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setSnackbarMessage("Business added to favorites");
          setSnackbarSeverity("success");
          setIsSaved(true);
        } else {
          setSnackbarMessage(data.message || "Failed to add favorite");
          setSnackbarSeverity("error");
        }
        setSnackbarOpen(true);
      })
      .catch((err) => {
        setSnackbarMessage("Error adding favorite");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });
  };

  return (
    <div className="container">
      <div className="breadcrumb">{event.breadcrumb}</div>
      <div className="header">
        <h1>{event.name}</h1>
        <div className="rating">
          <span className="stars">⭐ {calculatedRating}</span>
          <span className="reviews">({reviewCount} reviews)</span>
        </div>
      </div>
      <div className="content">
        <div className="images">
          {event.photos && event.photos.length > 1 ? (
            <Slideshow photos={event.photos} />
          ) : (
            <img className="main-image" src={getImageUrl(event)} alt="Event" />
          )}
          <button
            className="see-all"
            onClick={() => setModalState({ ...modalState, gallery: true })}
          >
            <span>See All</span>
          </button>
        </div>
        <div className="info">
          <a
            href={event.contact.website}
            target="_blank"
            rel="noopener noreferrer"
          >
            {event.contact.website}
          </a>
          <p>
            <Phone size={20} /> {event.contact.phone}
          </p>
          <p>
            <Envelope size={20} /> {event.contact.email}
          </p>
          <p>
            <Calendar size={20} /> {formatEventDate(event.contact.date)}
          </p>
          <p className="infoprice">
            <Ticket size={20} /> ${event.price}
          </p>
          <button className="save" onClick={handleFavorite}>
            <Heart
              size={20}
              weight={
                currentUser.favourites?.some((fav) => fav.id === event.id)
                  ? "fill"
                  : "regular"
              }
              color={
                currentUser.favourites?.some((fav) => fav.id === event.id)
                  ? "red"
                  : "black"
              }
            />
            {currentUser.favourites?.some((fav) => fav.id === event.id)
              ? "Saved"
              : "Save"}
          </button>
          <Button
            className="buy-tickets"
            variant="contained"
            color="primary"
            onClick={() => setModalState({ ...modalState, buy: true })}
            sx={{
              mt: 2,
              width: "100%",
              fontSize: "1rem",
              fontWeight: "bold",
              textTransform: "none",
            }}
          >
            Buy Tickets
          </Button>
        </div>
      </div>
      <div className="about">
        <h2>About the Event</h2>
        <p>{event.description}</p>
      </div>
      <BuyTicketsModal
        isOpen={modalState.buy}
        onClose={() => setModalState({ ...modalState, buy: false })}
        event={event}
      />
      <div className="details">
        <div className="location">
          <h2>Location</h2>
          <p>{event.location}</p>
          <iframe
            title="Map"
            src={event.mapLink}
            width="100%"
            height="200"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>

        <div className="working-hours">
          <h2>Event Timings</h2>
          <ul>
            {event.schedule.map((item, index) => (
              <li key={index}>
                {item.time}: {item.activity}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <Modal
        open={modalState.gallery || false}
        onClose={() => setModalState({ ...modalState, gallery: false })}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <div
          className="galleryModal"
          onClick={(e) =>
            handleModalClick(e, () =>
              setModalState({ ...modalState, gallery: false })
            )
          }
        >
          <div className="galleryGrid" onClick={(e) => e.stopPropagation()}>
            {event.photos.map((photo, index) => (
              <img
                key={index}
                className="galleryPhoto"
                src={
                  photo.startsWith("uploads/")
                    ? `https://getbizlinker.site/backend/${photo}`
                    : `https://getbizlinker.site/backend/uploads/${photo}`
                }
                alt={`Gallery ${index + 1}`}
                onClick={() => setSelectedPhoto(photo)}
              />
            ))}
          </div>
        </div>
      </Modal>

      <Modal
        open={Boolean(selectedPhoto)}
        onClose={() => setSelectedPhoto(null)}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <div
          className="selectedPhotoModal"
          onClick={() => setSelectedPhoto(null)}
        >
          <img
            src={
              selectedPhoto?.startsWith("uploads/")
                ? `https://getbizlinker.site/backend/${selectedPhoto}`
                : `https://getbizlinker.site/backend/uploads/${selectedPhoto}`
            }
            alt="Full view"
            className="selectedPhoto"
          />
        </div>
      </Modal>
      <br />
      <br />
      <br />
      <br />
      <h2>AI Review</h2>
      <AiReview reviews={reviews} reviewType="event" targetID={event.id} />
      <Modal
        open={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Box
          sx={{
            padding: 3,
            width: 500,
            height: 600,
            backgroundColor: "white",
            borderRadius: 2,
          }}
        >
          <XCircle
            className="close"
            size={24}
            onClick={() => setIsReviewModalOpen(false)}
          />
          <Typography variant="h6" sx={{ mb: 2 }}>
            Write a Review
          </Typography>
          <div className="rating-stars">
            <Rating
              value={rating}
              onChange={(e, newValue) => setRating(newValue)}
              size="large"
            />
          </div>
          <TextField
            label="Date of Experience"
            type="date"
            value={reviewDate}
            onChange={(e) => setReviewDate(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Title Your Review"
            value={reviewTitle}
            onChange={(e) => setReviewTitle(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <TextField
            label="Write Your Review"
            multiline
            rows={4}
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <div className="photo-upload">
            <Typography variant="body2" sx={{ mb: 1 }}>
              Add some photos (Optional)
            </Typography>
            <Button variant="outlined" component="label" fullWidth>
              Click to add photos
              <input
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={handlePhotoChange}
              />
            </Button>
          </div>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            By submitting this review, you confirm that it reflects your honest
            experience.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleReviewSubmit}
            sx={{ mt: 2 }}
          >
            Submit Review
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            onClick={() => setIsReviewModalOpen(false)}
            sx={{ mt: 1 }}
          >
            Cancel
          </Button>
        </Box>
      </Modal>

      <div className="buttons">
        <Button
          variant="contained"
          color="primary"
          onClick={() => setIsReviewModalOpen(true)}
          sx={{ width: "45%" }}
        >
          Write a review
        </Button>
      </div>
      <br />
      <br />
      <br />

      <div className="reviews">
        {reviews.map((rev, index) => (
          <ReviewCard
            key={index}
            name={rev.reviewerName}
            profileImage={
              rev.reviewerProfileImage || "https://via.placeholder.com/60"
            }
            comment={rev.comment}
            rating={rev.rating}
            date={rev.reviewDate}
          />
        ))}
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default EventsPage;
