import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Phone, Envelope, Clock, Heart, XCircle } from "phosphor-react";
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
import "./BusinessPage.css";
import { CaretLeft, CaretRight } from "phosphor-react";
import Slideshow from "../components/Slideshow";
import AiReview from "../components/AiReview";

const BusinessPage = () => {
  const { id } = useParams();
  const [business, setBusiness] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSaved, setIsSaved] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [isGalleryModalOpen, setIsGalleryModalOpen] = useState(false);
  const [isFullPhotoModalOpen, setIsFullPhotoModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [reviewText, setReviewText] = useState("");
  const [reviewDate, setReviewDate] = useState("");
  const [rating, setRating] = useState(5);
  const [uploadPhotos, setUploadPhotos] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const loggedInUser = JSON.parse(localStorage.getItem("user")) || {};
  const currentUserID = loggedInUser.userID;

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE}/businessInfo.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setBusiness(data.business);
        } else {
          setError(data.message || "Business not found");
        }
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching business details");
        setLoading(false);
      });
  }, [id]);

  const fetchReviews = () => {
    fetch(`${process.env.REACT_APP_API_BASE}/getReviews.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, reviewType: "business" }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setReviews(data.reviews);
        }
      })
      .catch((err) => console.error("Error fetching reviews:", err));
  };

  useEffect(() => {
    if (id) {
      fetchReviews();
    }
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const websiteUrl = business.contact.website.startsWith("http")
    ? business.contact.website
    : "https://" + business.contact.website;

  const toggleSave = () => {
    setIsSaved(!isSaved);
  };

  const openReviewModal = () => {
    setIsReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
  };

  const openQuestionModal = () => {
    setIsQuestionModalOpen(true);
  };

  const closeQuestionModal = () => {
    setIsQuestionModalOpen(false);
  };

  const handleReviewSubmit = () => {
    const newReview = {
      id,
      reviewerID: currentUserID,
      comment: reviewText,
      rating,
      reviewDate,
      reviewType: "business",
    };
    fetch(`${process.env.REACT_APP_API_BASE}/submitReview.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newReview),
    })
      .then((response) => response.json())
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
      .catch((err) => {
        setSnackbarMessage("Error submitting review");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });
    setReviewText("");
    setReviewDate("");
    setRating(5);
    setUploadPhotos([]);
    closeReviewModal();
  };

  const handleQuestionSubmit = () => {
    const payload = {
      userID: currentUserID,
      businessID: business.id,
      question: questionText,
    };
    fetch(`${process.env.REACT_APP_API_BASE}/submitQuestion.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((response) => response.json())
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
      .catch((err) => {
        setSnackbarMessage("Error submitting question");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      });
    closeQuestionModal();
    setQuestionText("");
  };

  const handlePhotoChange = (e) => {
    const files = e.target.files;
    setUploadPhotos(Array.from(files));
  };

  const openGalleryModal = () => {
    setIsGalleryModalOpen(true);
  };

  const handleThumbnailClick = (photo) => {
    setSelectedPhoto(photo);
    setIsFullPhotoModalOpen(true);
  };

  const handleModalClick = (e, closeFunction) => {
    if (e.target.className === "modal") {
      closeFunction();
    }
  };

  const handleFavorite = () => {
    const payload = { userID: currentUserID, businessID: business.id };
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
      <div className="breadcrumb">{business.breadcrumb}</div>
      <div className="header">
        <h1>{business.name}</h1>
        <div className="rating">
          <span className="stars">⭐ {business.rating}</span>
          <span className="reviews">({business.reviews} reviews)</span>
        </div>
      </div>
      <div className="content">
        <div className="images">
          <Slideshow photos={business.photos} interval={3000} />
          <button className="see-all" onClick={openGalleryModal}>
            <span>See All</span>
          </button>
        </div>
        <div className="info">
          <a href={websiteUrl} target="_blank" rel="noopener noreferrer">
            {websiteUrl}
          </a>
          <p>
            <Phone size={20} /> {business.contact.phone}
          </p>
          <p>
            <Envelope size={20} /> {business.contact.email}
          </p>
          <p>
            <Clock size={20} /> {business.contact.hours} (
            {business.contact.status})
          </p>
          <button className="save" onClick={handleFavorite}>
            <Heart
              size={20}
              weight={isSaved ? "fill" : "regular"}
              color={isSaved ? "red" : "black"}
            />{" "}
            {isSaved ? "Saved" : "Save"}
          </button>
        </div>
      </div>
      <div className="about">
        <h2>About</h2>
        <p>{business.about}</p>
      </div>
      <div className="details">
        <div className="location">
          <h2>Location</h2>
          <p>{business.location}</p>
          <iframe
            title="Map"
            src={business.mapLink}
            width="100%"
            height="200"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>
        <div className="working-hours">
          <h2>Working Hours</h2>
          <ul>
            {business.workingHours.map((day, index) => (
              <li key={index}>
                {day.day}: {day.hours}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {isGalleryModalOpen && (
        <div
          className="modal"
          onClick={(e) =>
            handleModalClick(e, () => setIsGalleryModalOpen(false))
          }
        >
          <div className="modal-content">
            <h2>Gallery</h2>
            <div className="gallery">
              {business.photos.map((photo, index) => (
                <img
                  key={index}
                  className="gallery-thumb"
                  src={photo}
                  alt={`Photo ${index + 1}`}
                  onClick={() => handleThumbnailClick(photo)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      {isFullPhotoModalOpen && (
        <div
          className="modal"
          onClick={(e) =>
            handleModalClick(e, () => setIsFullPhotoModalOpen(false))
          }
        >
          <div className="modal-content">
            <img src={selectedPhoto} alt="Full view" className="full-photo" />
          </div>
        </div>
      )}
      <br /> <br />
      <h2>AI Review</h2>
      <AiReview
        reviews={reviews}
        reviewType="business"
        targetID={business.id}
      />
      <Modal
        open={isReviewModalOpen}
        onClose={closeReviewModal}
        aria-labelledby="write-review-modal"
        aria-describedby="write-your-review"
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
          <XCircle className="close" size={24} onClick={closeReviewModal} />
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
            onClick={closeReviewModal}
            sx={{ mt: 1 }}
          >
            Cancel
          </Button>
        </Box>
      </Modal>
      <br />
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

export default BusinessPage;
