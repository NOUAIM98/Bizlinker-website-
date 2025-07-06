import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Phone,
  Envelope,
  Star,
  Heart,
  XCircle,
  Calendar,
  Ticket,
} from "phosphor-react";
import {
  Button,
  Modal,
  Box,
  Typography,
  Rating,
  TextField,
} from "@mui/material";
import {
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

import { services } from "./services";
import ReviewCard from "./ReviewCard";
import BuyServiceModal from "./BuyServiceModal";
import { Web } from "@mui/icons-material";
import { FaStar } from "react-icons/fa6";
import Portfolio from "../components/Portfolio";
import { Pin } from "lucide-react";
import { heIL } from "@mui/x-date-pickers/locales";
import styles from "./ServicePage.module.css";
import AiReview from "../components/AiReview";
import { Snackbar, Alert } from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ServicePage = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_BASE}/getServiceById.php?id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setService(data.service);
        } else {
          console.error(data.message);
        }
      })
      .catch((err) => console.error(err));
  }, [id]);

  const fetchReviews = () => {
    fetch(`${process.env.REACT_APP_API_BASE}/getReviews.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ serviceID: id, reviewType: "service" }),
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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewDate, setReviewDate] = useState("");
  const [rating, setRating] = useState(5);
  const [photos, setPhotos] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [selectedReportReason, setSelectedReportReason] = useState("");
  const [reportingReview, setReportingReview] = useState(null);
  const [reviews, setReviews] = useState([]);
  const loggedInUser = JSON.parse(localStorage.getItem("user")) || {};
  const currentUserID = loggedInUser.userID;
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  const [modalState, setModalState] = useState({
    buy: false,
    portfolio: false,
    gallery: false,
  });

  if (!service) {
    return <h2>Service not found</h2>;
  }

  const handleModal = (modalName, value) => {
    setModalState((prevState) => ({ ...prevState, [modalName]: value }));
  };

  const openMessageModal = () => {
    if (!currentUserID) {
      toast.error("Please log in to send a message.");

      return;
    }
    setIsMessageModalOpen(true);
  };

  const closeMessageModal = () => {
    setIsMessageModalOpen(false);
    setMessageText("");
  };
  const openReportModal = (reviewId) => {
    setReportingReview(reviewId);
    setIsReportModalOpen(true);
  };

  const closeReportModal = () => {
    setIsReportModalOpen(false);
    setSelectedReportReason("");
    setReportingReview(null);
  };

  const handleReportSubmit = () => {
    console.log("Review Reported:", {
      reviewId: reportingReview,
      reason: selectedReportReason,
    });
    closeReportModal();
  };

  const handleSendMessage = () => {
    if (!messageText.trim()) return;

    const payload = {
      senderID: currentUserID,
      receiverID: service.ownerID, // You must include `ownerID` in the service fetch response
      content: messageText.trim(),
      type: "inquiry",
    };

    fetch(`${process.env.REACT_APP_API_BASE}/submitMessage.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          toast.success("Message sent successfully!");
        } else {
          toast.error(data.message || "Failed to send message.");
        }
        setIsMessageModalOpen(false);
        setMessageText("");
      })
      .catch((err) => {
        console.error("Message send failed", err);
        toast.error("Failed to send message.");
      });
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
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
      serviceID: id,
      reviewerID: currentUserID,
      comment: reviewText,
      rating,
      reviewDate: reviewDate || new Date().toISOString().split("T")[0], // Fallback to today if empty
      reviewType: "service",
    };

    console.log("Submitting review:", newReview);
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
    setPhotos([]);
    closeReviewModal();
  };

  const handleQuestionSubmit = () => {
    const payload = {
      userID: currentUserID,
      serviceID: service.id,
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
    setPhotos(Array.from(files));
  };

  return (
    <div className="container">
      <div className="breadcrumb">{service.category}</div>
      <div className="header">
        <h1>{service.serviceTitle}</h1>
        <div className="rating">
          <span className="stars">⭐ {service.rating}</span>
          <span className="reviews">({service.reviewCount} reviews)</span>
        </div>
      </div>
      <div className="content">
        <div className="images">
          <img
            className="main-image"
            src={process.env.PUBLIC_URL + service.image}
            alt="Service"
          />
        </div>

        <div className={styles.info}>
          <div className={styles.providerContainer}>
            <img
              className={styles.providerImage}
              src={service.profile}
              alt="Provider"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `${process.env.REACT_APP_API_BASE}/uploads/default.png`;
              }}
            />
            <h2 className={styles.providerName}>{service.providerName}</h2>
          </div>

          <div className={styles.contactGroup}>
            <a
              href={service.contact.website}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.website}
            >
              {service.contact.website}
            </a>
            <p className={styles.contactInfo}>
              <Phone size={20} /> {service.contact.phone}
            </p>
            <p className={styles.contactInfo}>
              <Envelope size={20} /> {service.contact.email}
            </p>
            <p className={styles.location}>
              <Pin size={20} /> {service.location}
            </p>
            <p className={styles.price}>${Number(service.price).toFixed(2)}</p>
          </div>

          <div className={styles.buttonGroup}>
            <button className={styles.sendMessage} onClick={openMessageModal}>
              Send Message
            </button>

            <button
              className={styles.buyService}
              onClick={() => handleModal("buy", true)}
            >
              Buy Service
            </button>
          </div>
        </div>
      </div>
      <br /> <br />
      <br />
      <br />
      {service.portfolioURL && (
        <div style={{ padding: "20px 0" }}>
          <h2
            style={{
              fontSize: "22px",
              fontWeight: "bold",
              marginBottom: "10px",
            }}
          >
            My Portfolio
          </h2>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            {service.portfolioURL.split(",").map((url, index) => (
              <a
                key={index}
                href={url.trim()}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  color: "#2563eb",
                  textDecoration: "underline",
                  fontSize: "16px",
                  wordBreak: "break-word",
                }}
              >
                {url.trim()}
              </a>
            ))}
          </div>
        </div>
      )}
      <Modal
        open={isMessageModalOpen}
        onClose={closeMessageModal}
        aria-labelledby="message-modal"
        sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}
      >
        <Box
          sx={{
            padding: 4,
            width: 450,
            backgroundColor: "white",
            borderRadius: 3,
            boxShadow: 6,
            textAlign: "center",
            position: "relative",
          }}
        >
          <XCircle
            className="close"
            size={26}
            onClick={closeMessageModal}
            style={{
              cursor: "pointer",
              position: "absolute",
              right: 16,
              top: 16,
              color: "#555",
            }}
          />

          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
            Send a Message
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
            Write your message below and the freelancer will respond as soon as
            possible.
          </Typography>

          <TextField
            label="Your Message"
            multiline
            rows={4}
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            fullWidth
            sx={{ mb: 3 }}
          />

          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ py: 1.5, fontSize: 16, mb: 1.5 }}
            onClick={handleSendMessage}
          >
            Send Message
          </Button>
          <Button
            variant="outlined"
            fullWidth
            sx={{
              py: 1.5,
              fontSize: 16,
              borderColor: "#d1d5db",
              color: "#4b5563",
              backgroundColor: "#f3f4f6",
              "&:hover": {
                backgroundColor: "#e5e7eb",
                color: "#333",
              },
            }}
            onClick={closeMessageModal}
          >
            Cancel
          </Button>

          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            You can check your inbox for replies.
          </Typography>
        </Box>
      </Modal>
      <BuyServiceModal
        isOpen={modalState.buy}
        onClose={() => setModalState({ ...modalState, buy: false })}
        service={service}
      />
      <br />
      <br />
      <div className="portfolio-section">
        <br />
        <br />
        <br />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "40px" }}
          >
            <div
              style={{
                flex: 1,
                maxWidth: "48%",
              }}
              className="about-service"
            >
              <h2
                style={{
                  fontSize: "22px",
                  fontWeight: "bold",
                  color: "#333",
                  textAlign: "left",
                }}
              >
                Description About Service
              </h2>
              <p
                style={{
                  fontSize: "16px",
                  color: "#333",
                  lineHeight: "1.6",
                  textAlign: "justify",
                  marginBottom: "40px",
                }}
              >
                {service.description}
              </p>
            </div>

            <div
              style={{
                flex: 1,
                maxWidth: "48%",
              }}
              className="about-me"
            ></div>
          </div>
        </div>
      </div>
      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <XCircle className="close" size={24} onClick={closeModal} />
            <Typography variant="h6" sx={{ mb: 2 }}>
              Portfolio
            </Typography>
            <div className="gallery">
              {service.photos.slice(0, 5).map((photo, index) => (
                <img
                  key={index}
                  className="modal-photo"
                  src={photo}
                  alt={`Full-size photo ${index + 1}`}
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    margin: "5px",
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      )}
      <h2>AI Review</h2>
      <AiReview reviews={reviews} reviewType="service" targetID={service.id} />
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
            <div className="uploaded-photos">
              {photos.length > 0 &&
                photos.map((photo, index) => (
                  <img
                    key={index}
                    src={URL.createObjectURL(photo)}
                    alt="Review Photo"
                    style={{ width: 50, height: 50, margin: 5 }}
                  />
                ))}
            </div>
          </div>

          <Typography variant="body2" color="textSecondary" sx={{ mt: 2 }}>
            By submitting this review, you confirm that it reflects your honest
            experience and was not influenced by any incentives.
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
      <br />
      <div className="buttons" style={{ display: "flex", gap: "4px" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={openReviewModal}
          sx={{ width: "20%" }}
        >
          Write a review
        </Button>
      </div>
      <br />
      <br />
      {reviews.length === 0 ? (
        <Typography sx={{ mt: 2 }} color="textSecondary">
          No reviews yet for this service.
        </Typography>
      ) : (
        reviews.map((review) => (
          <ReviewCard
            key={review.feedbackID}
            name={review.reviewerName}
            profileImage={review.reviewerProfileImage}
            comment={review.comment}
            rating={review.rating}
            date={review.reviewDate}
            onReport={() => openReportModal(review.feedbackID)}
          />
        ))
      )}
      <Modal
        open={isReportModalOpen}
        onClose={closeReportModal}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Box
          sx={{
            padding: 3,
            width: 400,
            backgroundColor: "white",
            borderRadius: 2,
            textAlign: "center",
            boxShadow: 3,
            position: "relative",
          }}
        >
          <XCircle
            size={24}
            onClick={closeReportModal}
            style={{
              cursor: "pointer",
              position: "absolute",
              right: 16,
              top: 16,
              color: "#888",
            }}
          />

          <Typography
            variant="h6"
            sx={{ mb: 2, fontWeight: "bold", color: "#333" }}
          >
            Report Review
          </Typography>

          <FormControl component="fieldset" sx={{ width: "100%" }}>
            <RadioGroup
              value={selectedReportReason}
              onChange={(e) => setSelectedReportReason(e.target.value)}
              sx={{ mb: 3 }}
            >
              <FormControlLabel
                value="incorrect"
                control={<Radio />}
                label="Incorrect Information"
                sx={{ display: "flex", justifyContent: "space-between" }}
              />
              <FormControlLabel
                value="spam"
                control={<Radio />}
                label="Spam"
                sx={{ display: "flex", justifyContent: "space-between" }}
              />
              <FormControlLabel
                value="offensive"
                control={<Radio />}
                label="Offensive / Abusive"
                sx={{ display: "flex", justifyContent: "space-between" }}
              />
            </RadioGroup>
          </FormControl>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Button
              variant="contained"
              color="error"
              fullWidth
              sx={{
                mt: 2,
                padding: "10px 0",
                fontWeight: "bold",
                letterSpacing: 0.5,
              }}
              onClick={handleReportSubmit}
            >
              Report
            </Button>

            <Button
              variant="outlined"
              fullWidth
              sx={{
                padding: "10px 0",
                fontWeight: "bold",
                letterSpacing: 0.5,
              }}
              onClick={closeReportModal}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Modal>
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
      <ToastContainer
        position="bottom-center"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />
    </div>
  );
};

export default ServicePage;
