import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  User,
  EnvelopeSimple,
  Buildings,
  Bell,
  Warning,
  Heart,
  Trash,
  SignOut,
} from "@phosphor-icons/react";
import {
  Snackbar,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Box,
  Typography,
  Modal,
  TextField,
} from "@mui/material";
import "./SettingsPage.css";
import Reports from "../components/Reports";

function SettingsPage({ user, onUpdateUser }) {
  const [activeTab, setActiveTab] = useState("profile");
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [profilePreview, setProfilePreview] = useState(
    user?.profilePicture || ""
  );
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [unlinkConfirmOpen, setUnlinkConfirmOpen] = useState(false);
  const [businessCodeDialog, setBusinessCodeDialog] = useState(false);
  const [businessCode, setBusinessCode] = useState("");
  const [isBusinessLinked, setIsBusinessLinked] = useState(false);
  const [currentBiz, setCurrentBiz] = useState(null);
  const [bizName, setBizName] = useState("");
  const [bizEmail, setBizEmail] = useState("");
  const [bizPhone, setBizPhone] = useState("");
  const [bizWebsite, setBizWebsite] = useState("");
  const [bizLocation, setBizLocation] = useState("");
  const [bizDescription, setBizDescription] = useState("");
  const [bizPhotos, setBizPhotos] = useState([]);
  const [messages, setMessages] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    let currentUser = user || (stored && JSON.parse(stored));
    if (currentUser) {
      if (currentUser.linkedBusinessID) {
        setIsBusinessLinked(true);
        fetchBusinessData(currentUser.linkedBusinessID);
      } else if (currentUser.userID) {
        fetch(`${process.env.REACT_APP_API_BASE}/getUser.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userID: currentUser.userID }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success && data.user && data.user.linkedBusinessID) {
              currentUser = data.user;
              localStorage.setItem("user", JSON.stringify(currentUser));
              onUpdateUser(currentUser);
              setIsBusinessLinked(true);
              fetchBusinessData(currentUser.linkedBusinessID);
            }
          })
          .catch((error) => console.error("Get user failed", error));
      }
      if (activeTab === "messages") {
        const id = currentUser.linkedBusinessID
          ? currentUser.linkedBusinessID
          : currentUser.userID;
        fetchMessages(id);
      }
      if (activeTab === "favourites" && currentUser.userID) {
        fetch(`${process.env.REACT_APP_API_BASE}/getFavorites.php`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userID: currentUser.userID }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              setFavorites(data.favorites);
            } else {
              console.error("Error fetching favorites:", data.message);
            }
          })
          .catch((error) => console.error("Error fetching favorites:", error));
      }
    }
  }, [user, onUpdateUser, activeTab]);

  const fetchBusinessData = async (businessID) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE}/getBusiness.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ businessID }),
        }
      );
      const data = await res.json();
      if (data.success && data.business) {
        setCurrentBiz(data.business);
      }
    } catch (error) {
      console.error("Fetch business failed", error);
    }
  };

  const fetchMessages = async (id) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE}/getMessages.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const fetchConversation = async (user1, user2) => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE}/getMessages.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ user1, user2 }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setSelectedChat((prev) => ({ ...prev, chatHistory: data.messages }));
      }
    } catch (error) {
      console.error("Error fetching conversation:", error);
    }
  };

  const handleSave = async () => {
    if (!user || !user.userID) {
      setSnackbarMessage("User ID is missing");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    if (
      email &&
      email.trim() !== "" &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      setSnackbarMessage("Please enter a valid email address");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    const payload = { userID: user.userID };
    if (firstName.trim() !== "") payload.firstName = firstName.trim();
    if (lastName.trim() !== "") payload.lastName = lastName.trim();
    if (email.trim() !== "") payload.email = email.trim();
    if (phone.trim() !== "") payload.phone = phone.trim();
    if (
      profilePreview.trim() !== "" &&
      profilePreview.trim() !== user.profilePicture
    )
      payload.profilePicture = profilePreview.trim();
    const res = await fetch(
      `${process.env.REACT_APP_API_BASE}/updateUser.php`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );
    const data = await res.json();
    if (data.success) {
      const mergedUser = { ...user };
      if (firstName.trim() !== "") mergedUser.firstName = firstName.trim();
      if (lastName.trim() !== "") mergedUser.lastName = lastName.trim();
      if (email.trim() !== "") mergedUser.email = email.trim();
      if (phone.trim() !== "") mergedUser.phone = phone.trim();
      if (
        profilePreview.trim() !== "" &&
        profilePreview.trim() !== user.profilePicture
      )
        mergedUser.profilePicture = profilePreview.trim();
      onUpdateUser(mergedUser);
      setSnackbarMessage("Settings Updated Successfully!");
      setSnackbarSeverity("success");
    } else {
      setSnackbarMessage(data.message || "Failed to update settings");
      setSnackbarSeverity("error");
    }
    setSnackbarOpen(true);
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfilePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };
  const handleSendMessage = async () => {
    if (!selectedChat.newMessage || selectedChat.newMessage.trim() === "")
      return;
    const payload = {
      senderID: user.linkedBusinessID ? user.linkedBusinessID : user.userID,
      receiverID: selectedChat.partnerID,
      content: selectedChat.newMessage.trim(),
      type: "reply",
    };
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE}/submitMessage.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (data.success) {
        setSelectedChat((prev) => ({
          ...prev,
          chatHistory: [
            ...prev.chatHistory,
            {
              content: payload.content,
              created_at: new Date().toLocaleString(),
            },
          ],
          newMessage: "",
        }));
        fetchMessages(
          user.linkedBusinessID ? user.linkedBusinessID : user.userID
        );
      } else {
        setSnackbarMessage(data.message || "Failed to send message");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setSnackbarMessage("Error sending message");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
    window.location.reload();
  };

  const handleDelete = () => {
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    setConfirmOpen(false);
    if (!user || !user.userID) return;
    const res = await fetch(
      `${process.env.REACT_APP_API_BASE}/deleteAccount.php`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID: user.userID }),
      }
    );
    const data = await res.json();
    if (data.success) {
      setSnackbarMessage(
        "Your account has been deleted. You can no longer log in."
      );
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      localStorage.removeItem("user");
      navigate("/");
      window.location.reload();
    } else {
      setSnackbarMessage("Error deleting account");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const handleOpenBusinessCodeDialog = () => {
    setBusinessCode("");
    setBusinessCodeDialog(true);
  };

  const handleCloseBusinessCodeDialog = () => {
    setBusinessCodeDialog(false);
  };

  const handleBusinessCodeSubmit = async () => {
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE}/verifyBusinessCode.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code: businessCode, userID: user.userID }),
        }
      );
      const data = await res.json();
      if (data.success) {
        setIsBusinessLinked(true);
        setSnackbarMessage("Business Account Linked!");
        setSnackbarSeverity("success");
        setBusinessCodeDialog(false);
        if (data.ownerID) {
          const updatedUser = { ...user, linkedBusinessID: data.ownerID };
          onUpdateUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
          fetchBusinessData(data.ownerID);
        }
      } else {
        setSnackbarMessage("Invalid or used code");
        setSnackbarSeverity("error");
      }
    } catch {
      setSnackbarMessage("Failed to verify code");
      setSnackbarSeverity("error");
    }
    setSnackbarOpen(true);
  };

  const handleBusinessPhotoChange = (e) => {
    if (!e.target.files.length) return;
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBizPhotos((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleBusinessUpdate = async () => {
    const payload = { linkedBusinessID: user.linkedBusinessID };
    if (bizName.trim() !== "") payload.businessName = bizName.trim();
    if (bizEmail.trim() !== "") payload.email = bizEmail.trim();
    if (bizPhone.trim() !== "") payload.phone = bizPhone.trim();
    if (bizWebsite.trim() !== "") payload.websiteURL = bizWebsite.trim();
    if (bizLocation.trim() !== "") payload.location = bizLocation.trim();
    if (bizDescription.trim() !== "")
      payload.description = bizDescription.trim();
    if (bizPhotos.length > 0) payload.photos = bizPhotos.join(",");
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE}/updateBusiness.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (data.success) {
        setSnackbarMessage("Business Information Updated!");
        setSnackbarSeverity("success");
      } else {
        setSnackbarMessage(
          data.message || "Failed to update business information"
        );
        setSnackbarSeverity("error");
      }
    } catch {
      setSnackbarMessage("Error updating business information");
      setSnackbarSeverity("error");
    }
    setSnackbarOpen(true);
  };

  const handleUnlinkBusiness = async () => {
    if (!user || !user.userID) return;
    const res = await fetch(
      `${process.env.REACT_APP_API_BASE}/unlinkBusiness.php`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID: user.userID }),
      }
    );
    const data = await res.json();
    if (data.success) {
      setSnackbarMessage("Business unlinked successfully");
      setSnackbarSeverity("success");
      setIsBusinessLinked(false);
      setCurrentBiz(null);
      const updatedUser = { ...user, linkedBusinessID: null };
      onUpdateUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    } else {
      setSnackbarMessage(data.message || "Failed to unlink business");
      setSnackbarSeverity("error");
    }
    setSnackbarOpen(true);
  };

  const defaultProfileImage = `${process.env.REACT_APP_API_BASE}/uploads/default.png`;

  const getProfileImage = (src) => {
    if (!src) return defaultProfileImage;
    if (src.startsWith("data:") || src.startsWith("http")) {
      return src;
    }
    return `https://getbizlinker.site/backend/${src}`;
  };

  const renderMessagesTab = () => {
    const loggedInId = user.linkedBusinessID
      ? user.linkedBusinessID
      : user.userID;

    const conversations = messages.reduce((acc, message) => {
      const partnerID =
        message.senderID === loggedInId ? message.receiverID : message.senderID;
      const partnerName =
        message.senderID === loggedInId
          ? message.receiverName || "User"
          : message.senderName || "User";
      const partnerProfileImage =
        message.senderID === loggedInId
          ? message.receiverProfileImage
          : message.senderProfileImage;

      if (!acc[partnerID]) {
        acc[partnerID] = {
          partnerID,
          partnerName,
          partnerProfileImage,
          chatHistory: [],
        };
      }
      acc[partnerID].chatHistory.push({
        senderID: message.senderID,
        content: message.content,
        created_at: message.created_at,
      });
      return acc;
    }, {});
    const convArray = Object.values(conversations);

    convArray.forEach((conv) => {
      conv.chatHistory.sort(
        (a, b) => new Date(a.created_at) - new Date(b.created_at)
      );
    });

    return (
      <Box sx={{ width: "100%", maxWidth: "1300px" }}>
        <h2> Conversations </h2>
        {convArray.length === 0 ? (
          <Typography variant="body1" sx={{ color: "#777" }}>
            No messages yet.
          </Typography>
        ) : (
          convArray.map((conv, idx) => {
            const lastMsg = conv.chatHistory[conv.chatHistory.length - 1];
            return (
              <Box
                key={idx}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  p: 2,
                  mb: 2,
                  borderBottom: "1px solid #ddd",
                  cursor: "pointer",
                  backgroundColor: "#ffffff",
                  transition: "background-color 0.3s ease",
                  borderRadius: "10px",
                  height: "90px",
                  "&:hover": {
                    backgroundColor: "#EEEEEE",
                  },
                }}
                onClick={() =>
                  setSelectedChat({
                    partnerID: conv.partnerID,
                    partnerName: conv.partnerName,
                    partnerProfileImage: getProfileImage(
                      conv.partnerProfileImage
                    ),
                    chatHistory: conv.chatHistory,
                    newMessage: "",
                  })
                }
              >
                <img
                  src={getProfileImage(conv.partnerProfileImage)}
                  alt="Profile"
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: "50%",
                    objectFit: "cover",
                    marginRight: 16,
                  }}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = `${process.env.REACT_APP_API_BASE}/uploads/defualt.png`;
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography
                    variant="subtitle1"
                    sx={{ fontWeight: "bold", color: "#000" }}
                  >
                    {conv.partnerName}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#333" }}>
                    {lastMsg ? lastMsg.content : "No message"}
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ color: "#555" }}>
                  {lastMsg
                    ? new Date(lastMsg.created_at).toLocaleTimeString()
                    : ""}
                </Typography>
              </Box>
            );
          })
        )}
      </Box>
    );
  };

  const parsePhotos = (photoString) => {
    if (!photoString) return [];
    return photoString
      .split(",")
      .map((p) => p.trim())
      .filter((p) => p)
      .map((p) => {
        if (p.startsWith("http") || p.startsWith("data:")) return p;
        if (p.startsWith("uploads/")) {
          return `https://getbizlinker.site/backend/${encodeURI(p)}`;
        }
        return `https://getbizlinker.site/backend/uploads/${encodeURI(p)}`;
      });
  };

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
    if (!photos || photos.length === 0) return null;
    return (
      <img
        src={photos[currentIndex]}
        alt={`Slide ${currentIndex + 1}`}
        className="favoriteImage"
      />
    );
  };

  const handleRemoveFavorite = async (favorite) => {
    if (!user || !user.userID) return;
    let payload = { userID: user.userID };
    if (favorite.businessID) {
      payload.businessID = favorite.businessID;
    } else if (favorite.eventID) {
      payload.eventID = favorite.eventID;
    } else {
      setSnackbarMessage("Missing eventID or businessID");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE}/removeFavorite.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (data.success) {
        setSnackbarMessage("Favorite removed successfully");
        setSnackbarSeverity("success");
        setFavorites(
          favorites.filter((fav) => {
            if (favorite.businessID) {
              return fav.businessID !== favorite.businessID;
            } else if (favorite.eventID) {
              return fav.eventID !== favorite.eventID;
            }
            return true;
          })
        );
      } else {
        setSnackbarMessage(data.message || "Failed to remove favorite");
        setSnackbarSeverity("error");
      }
    } catch (error) {
      setSnackbarMessage("Error removing favorite");
      setSnackbarSeverity("error");
    }
    setSnackbarOpen(true);
  };

  const renderFavouritesTab = () => {
    return (
      <div>
        <h2>Favourite Businesses</h2>
        {favorites.length === 0 ? (
          <Typography className="noFavoritesText">
            No favourite businesses yet.
          </Typography>
        ) : (
          <div className="favoritesGrid">
            {favorites.map((fav, idx) => {
              const photosArray = fav.businessPhoto
                ? fav.businessPhoto
                    .split(",")
                    .map((p) => p.trim())
                    .filter((p) => p)
                : [];
              const parsedPhotos = photosArray.map((p) => {
                if (p.startsWith("http") || p.startsWith("data:")) return p;
                if (p.startsWith("uploads/"))
                  return `https://getbizlinker.site/backend/${encodeURI(p)}`;
                return `https://getbizlinker.site/backend/uploads/${encodeURI(
                  p
                )}`;
              });

              return (
                <div key={idx} className="favoriteCard">
                  <div className="favoriteImageContainer">
                    {parsedPhotos.length > 1 ? (
                      <Slideshow photos={parsedPhotos} interval={3000} />
                    ) : (
                      <img
                        src={
                          parsedPhotos[0] ||
                          "https://dummyimage.com/150x150/ccc/fff&text=No+Image"
                        }
                        alt={fav.businessName}
                        className="favoriteImage"
                      />
                    )}
                    <button
                      onClick={() => handleRemoveFavorite(fav)}
                      className="favoriteRemoveButton"
                    >
                      <Heart size={24} weight="fill" className="heartIcon" />
                    </button>
                  </div>

                  <div className="favoriteInfo">
                    <Typography variant="h6" className="favoriteName">
                      {fav.businessName}
                    </Typography>
                    <Typography className="favoriteLocation">
                      {fav.location}
                    </Typography>
                    <button
                      component={Link}
                      to={`/business/${fav.businessID}`}
                      className="viewButton"
                    >
                      View Business
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const renderPageContent = () => {
    switch (activeTab) {
      case "profile":
        return (
          <div>
            <h2>Profile Information</h2>
            <div className="profile-section">
              <div className="profile-picture-container">
                {profilePreview ? (
                  <img
                    src={profilePreview}
                    alt="Profile"
                    className="profile-picture"
                  />
                ) : (
                  <div
                    style={{
                      width: "100px",
                      height: "100px",
                      border: "1px solid #ccc",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "12px",
                      color: "#999",
                    }}
                  >
                    No Image
                  </div>
                )}
                <input
                  type="file"
                  onChange={handleProfilePictureChange}
                  accept="image/*"
                />
              </div>
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder={user?.firstName || ""}
                  className="profile-input"
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder={user?.lastName || ""}
                  className="profile-input"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={user?.email || ""}
                  className="profile-input"
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={user?.phone || ""}
                  className="profile-input"
                />
              </div>
               <div className="form-group">
                <label>Current Password</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={user?.phone || ""}
                  className="profile-input"
                />
              </div>
 <div className="form-group">
                <label>New Password</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={user?.phone || ""}
                  className="profile-input"
                />
              </div>
               <div className="form-group">
                <label>Confirm Password</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={user?.phone || ""}
                  className="profile-input"
                />
              </div>
              <div className="buttons">
                <button className="button-save" onClick={handleSave}>
                  Update
                </button>
              </div>
              <button className="btn-delete" onClick={handleDelete}>
                <Trash size={20} color="#ff4d4d" /> Delete Account
              </button>
            </div>
          </div>
        );
      case "reports":
        return (
          <div>
            <h2>Reports</h2>

            <Reports />
          </div>
        );
      case "business":
        return (
          <div>
            <h2>Business Settings</h2>
            {!isBusinessLinked ? (
              <div style={{ marginTop: "30px" }}>
                <h3 style={{ color: "#999" }}>
                  No business account is connected to this account.
                </h3>
                <Button
                  onClick={handleOpenBusinessCodeDialog}
                  variant="contained"
                  sx={{
                    marginTop: 2,
                    borderRadius: 4,
                    textTransform: "none",
                    background: "#333",
                    color: "#fff",
                    "&:hover": { background: "#22222" },
                  }}
                >
                  Enter 8-Digit Code
                </Button>
              </div>
            ) : (
              <div style={{ marginTop: "30px" }}>
                <h3 style={{ color: "#999" }}>Update Business Information</h3>
                <div className="form-group">
                  <label>Business Name</label>
                  <input
                    type="text"
                    value={bizName}
                    onChange={(e) => setBizName(e.target.value)}
                    placeholder={currentBiz?.businessName || ""}
                    className="profile-input"
                  />
                </div>
                <div className="form-group">
                  <label>Business Email</label>
                  <input
                    type="email"
                    value={bizEmail}
                    onChange={(e) => setBizEmail(e.target.value)}
                    placeholder={currentBiz?.email || ""}
                    className="profile-input"
                  />
                </div>
                <div className="form-group">
                  <label>Business Phone</label>
                  <input
                    type="text"
                    value={bizPhone}
                    onChange={(e) => setBizPhone(e.target.value)}
                    placeholder={currentBiz?.phone || ""}
                    className="profile-input"
                  />
                </div>
                <div className="form-group">
                  <label>Website URL</label>
                  <input
                    type="text"
                    value={bizWebsite}
                    onChange={(e) => setBizWebsite(e.target.value)}
                    placeholder={currentBiz?.websiteURL || ""}
                    className="profile-input"
                  />
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={bizLocation}
                    onChange={(e) => setBizLocation(e.target.value)}
                    placeholder={currentBiz?.location || ""}
                    className="profile-input"
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={bizDescription}
                    onChange={(e) => setBizDescription(e.target.value)}
                    placeholder={currentBiz?.description || ""}
                    className="profile-input"
                    style={{ minHeight: "80px" }}
                  />
                </div>
                <div className="form-group">
                  <label>Photos</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleBusinessPhotoChange}
                  />
                  <div
                    style={{
                      marginTop: "10px",
                      display: "flex",
                      gap: "10px",
                      flexWrap: "wrap",
                    }}
                  >
                    {bizPhotos.map((photo, idx) => (
                      <img
                        key={idx}
                        src={photo}
                        alt="Business"
                        style={{
                          width: "120px",
                          borderRadius: "4px",
                          border: "1px solid #ccc",
                        }}
                      />
                    ))}
                  </div>
                </div>
                <Button
                  onClick={handleBusinessUpdate}
                  variant="contained"
                  sx={{
                    marginTop: 2,
                    borderRadius: 4,
                    textTransform: "none",
                    background:
                      "linear-gradient(45deg, #58CFFB 30%, #007EA7 90%)",
                    color: "#fff",
                    "&:hover": {
                      background:
                        "linear-gradient(45deg, #58CFFB 40%, #007EA7 100%)",
                    },
                  }}
                >
                  Update Business
                </Button>
                <Button
                  onClick={() => setUnlinkConfirmOpen(true)}
                  variant="contained"
                  sx={{
                    marginTop: 2,
                    marginLeft: 2,
                    borderRadius: 4,
                    textTransform: "none",
                    background:
                      "linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)",
                    color: "#fff",
                    "&:hover": {
                      background:
                        "linear-gradient(45deg, #FF8E53 40%, #FE6B8B 100%)",
                    },
                  }}
                >
                  Unlink Business
                </Button>
              </div>
            )}
          </div>
        );
      case "messages":
        return renderMessagesTab();
      case "favourites":
        return renderFavouritesTab();
      default:
        return <Typography variant="h4">Page Not Found</Typography>;
    }
  };

  return (
    <div className="settings-page">
      <aside className="sidebar">
        <ul>
          <li
            className={activeTab === "profile" ? "active" : ""}
            onClick={() => setActiveTab("profile")}
          >
            <User size={24} color="#444444" /> <span>Profile Settings</span>
          </li>
          <li
            className={activeTab === "business" ? "active" : ""}
            onClick={() => setActiveTab("business")}
          >
            <Buildings size={24} color="#444444" />{" "}
            <span>Business Settings</span>
          </li>
          <li
            className={activeTab === "messages" ? "active" : ""}
            onClick={() => setActiveTab("messages")}
          >
            <EnvelopeSimple size={24} color="#444444" /> <span>Messages</span>
          </li>

          <li
            className={activeTab === "reports" ? "active" : ""}
            onClick={() => setActiveTab("reports")}
          >
            <Warning size={24} color="#444444" /> <span>Reports</span>
          </li>
          <li
            className={activeTab === "favourites" ? "active" : ""}
            onClick={() => setActiveTab("favourites")}
          >
            <Heart size={24} color="#444444" /> <span>Favourite List</span>
          </li>
          <li
            className="logout"
            onClick={handleLogout}
            style={{ cursor: "pointer", marginTop: "20px", color: "#d9534f" }}
          >
            <SignOut size={24} color="#d9534f" /> <span>Logout</span>
          </li>
        </ul>
      </aside>
      <div className="settings-content">{renderPageContent()}</div>
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        PaperProps={{
          sx: {
            background: "#ffffff",
            color: "#333",
            border: "1px solid #444",
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>Delete Account</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#333" }}>
            Deleting your account cannot be undone. Are you sure you want to
            proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", paddingBottom: 2 }}>
          <Button
            onClick={() => setConfirmOpen(false)}
            variant="outlined"
            sx={{
              borderRadius: 4,
              textTransform: "none",
              borderColor: "#333",
              color: "#333",
              "&:hover": { borderColor: "#525252", color: "#525252" },
            }}
          >
            No
          </Button>
          <Button
            onClick={confirmDelete}
            variant="contained"
            sx={{
              marginLeft: 2,
              borderRadius: 4,
              textTransform: "none",
              background: "#D10000",
              color: "#fff",
              "&:hover": { background: "#EC1D1D" },
            }}
          >
            Yes, Delete
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={businessCodeDialog}
        onClose={handleCloseBusinessCodeDialog}
        PaperProps={{
          sx: {
            background: "#ffffff",
            color: "#333",
            border: "1px solid #fbfbfb",
            borderRadius: 2,
            width: "500px",
            alignItems: "center",
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>Link Business</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#bbb" }}>
            Enter the 8-digit code sent to your email
          </DialogContentText>
          <input
            type="text"
            value={businessCode}
            onChange={(e) => setBusinessCode(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleBusinessCodeSubmit();
            }}
            style={{
              width: "100%",
              height: "30px",
              marginTop: "16px",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #555",
              background: "#fbfbfb",
              color: "#fff",
              alignItems: "center",
            }}
          />
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", paddingBottom: 2 }}>
          <Button
            onClick={handleCloseBusinessCodeDialog}
            variant="outlined"
            sx={{
              borderRadius: 4,
              textTransform: "none",
              borderColor: "#999",
              color: "#333",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleBusinessCodeSubmit}
            variant="contained"
            sx={{
              marginLeft: 2,
              borderRadius: 4,
              textTransform: "none",
              background: "#FF5900",
              color: "#fff",
              "&:hover": { background: "#FF5900" },
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={unlinkConfirmOpen}
        onClose={() => setUnlinkConfirmOpen(false)}
        PaperProps={{
          sx: {
            background: "#141414",
            color: "#fff",
            border: "1px solid #444",
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle sx={{ fontWeight: "bold" }}>Unlink Business</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: "#bbb" }}>
            Are you sure you want to unlink your business from your account?
            This will disable business functionalities and you will need to
            re-verify your business to link it again.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "center", paddingBottom: 2 }}>
          <Button
            onClick={() => setUnlinkConfirmOpen(false)}
            variant="outlined"
            sx={{
              borderRadius: 4,
              textTransform: "none",
              borderColor: "#999",
              color: "#999",
              "&:hover": { borderColor: "#fff", color: "#fff" },
            }}
          >
            No
          </Button>
          <Button
            onClick={() => {
              setUnlinkConfirmOpen(false);
              handleUnlinkBusiness();
            }}
            variant="contained"
            sx={{
              marginLeft: 2,
              borderRadius: 4,
              textTransform: "none",
              background: "linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)",
              color: "#fff",
              "&:hover": {
                background: "linear-gradient(45deg, #FF8E53 40%, #FE6B8B 100%)",
              },
            }}
          >
            Yes, Unlink
          </Button>
        </DialogActions>
      </Dialog>
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
      {selectedChat && (
        <Modal
          open={true}
          onClose={() => setSelectedChat(null)}
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backdropFilter: "blur(4px)",
          }}
        >
          <Box
            sx={{
              width: 500,
              bgcolor: "#ffffff",
              p: 3,
              borderRadius: 3,
              boxShadow: 24,
              border: "2px solid #F5A623",
              maxHeight: "80vh",
              overflow: "hidden",
            }}
          >
            <Typography
              variant="h6"
              sx={{ mb: 2, color: "#333", fontWeight: "bold" }}
            >
              Chat with {selectedChat.firstName} {selectedChat.lastName}
            </Typography>

            <Box
              sx={{
                maxHeight: 300,
                overflowY: "auto",
                mb: 2,
                background: "rgba(0, 0, 0, 0.05)",
                borderRadius: 2,
                p: 1,
              }}
            >
              {selectedChat.chatHistory &&
              selectedChat.chatHistory.length > 0 ? (
                selectedChat.chatHistory.map((chatItem, i) => {
                  const loggedInId = user.linkedBusinessID
                    ? user.linkedBusinessID
                    : user.userID;
                  const isMyMessage = chatItem.senderID === loggedInId;
                  return (
                    <Box
                      key={i}
                      sx={{
                        display: "flex",
                        justifyContent: isMyMessage ? "flex-end" : "flex-start",
                        mb: 1,
                      }}
                    >
                      <Box
                        sx={{
                          maxWidth: "80%",
                          p: 2,
                          backgroundColor: isMyMessage ? "#333" : "#FF5900",
                          color: "#fff",
                          borderRadius: 2,
                          boxShadow: 2,
                          position: "relative",
                          height: "auto",
                          minHeight: "50px",
                          maxHeight: "200px",
                          overflow: "hidden",
                        }}
                      >
                        <Typography variant="body2" sx={{ lineHeight: 1.5 }}>
                          {chatItem.content}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            display: "block",
                            textAlign: "right",
                            fontSize: "12px",
                            color: "#ddd",
                            marginTop: 1,
                          }}
                        >
                          {new Date(chatItem.created_at).toLocaleTimeString()}
                        </Typography>

                        <Box
                          sx={{
                            position: "absolute",
                            bottom: "-8px",
                            right: isMyMessage ? "-8px" : "auto",
                            left: isMyMessage ? "auto" : "-8px",
                            width: 0,
                            height: 0,
                            borderLeft: "8px solid transparent",
                            borderRight: "8px solid transparent",
                            borderTop: isMyMessage
                              ? "8px solid #FF5900"
                              : "8px solid #333",
                          }}
                        />
                      </Box>
                    </Box>
                  );
                })
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No conversation history.
                </Typography>
              )}
            </Box>

            <Box sx={{ display: "flex", gap: 1 }}>
              <TextField
                variant="outlined"
                placeholder="Type your message..."
                fullWidth
                size="small"
                value={selectedChat.newMessage || ""}
                onChange={(e) =>
                  setSelectedChat({
                    ...selectedChat,
                    newMessage: e.target.value,
                  })
                }
                InputProps={{
                  style: {
                    background: "#f1f1f1",
                    borderRadius: 4,
                    padding: "10px",
                  },
                }}
                sx={{
                  borderRadius: "4px",
                }}
              />
              <Button
                variant="contained"
                sx={{
                  background: "#FF5900",
                  textTransform: "none",
                  color: "#fff",
                  padding: "12px 20px",
                  borderRadius: "4px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  "&:hover": {
                    background: "#FF5900",
                    boxShadow: "0 6px 10px rgba(0, 0, 0, 0.15)",
                  },
                }}
                onClick={handleSendMessage}
              >
                Send
              </Button>
            </Box>
          </Box>
        </Modal>
      )}
    </div>
  );
}

export default SettingsPage;
