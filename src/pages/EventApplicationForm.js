import React, { useState } from "react";
import {
  Button,
  TextField,
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const categories = ["Concerts", "Festivals", "Sports", "Workshops", "Exhibitions",'Conferences','Food & Drink','Markets', 'Outdoor Activities','Networking','Community Events', 'Theater & Performances'];


const EventApplicationForm = () => {
  const navigate = useNavigate();

  const [eventName, setEventName] = useState("");
  const [category, setCategory] = useState("");
  const [websiteURL, setWebsiteURL] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [ticketDetails, setTicketDetails] = useState([{ type: "", price: "" }]);
  const [totalTickets, setTotalTickets] = useState("");
  const [photos, setPhotos] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [socialMedia, setSocialMedia] = useState({
    facebook: "",
    instagram: "",
    other: "",
  });

  const handleAddTicketType = () => {
    setTicketDetails([...ticketDetails, { type: "", price: "" }]);
  };

  const handleTicketDetailChange = (index, field, value) => {
    const updated = [...ticketDetails];
    updated[index][field] = value;
    setTicketDetails(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("eventName", eventName);
    formData.append("category", category);
    formData.append("websiteURL", websiteURL);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("address", address);
    formData.append("description", description);
    formData.append("eventDate", eventDate);
    formData.append("eventTime", eventTime);
    formData.append("totalTickets", totalTickets);
    formData.append("ticketDetails", JSON.stringify(ticketDetails));
    formData.append("socialMedia", JSON.stringify(socialMedia));

    if (photos) {
      Array.from(photos).forEach((photo, index) => {
        formData.append(`photos[${index}]`, photo);
      });
    }

    try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE}/submitEventApplication.php`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      if (data.success) {
        toast.success("Event submitted successfully!", {
          position: "bottom-center",
          autoClose: 2000,
        });
        setTimeout(() => navigate("/"), 2000);
      } else {
        toast.error(`Failed: ${data.message}`, { position: "bottom-center" });
      }
    } catch (err) {
      toast.error("An error occurred. Please try again.", {
        position: "bottom-center",
      });
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        py: 4,
      }}
    >
      <ToastContainer />
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{ maxWidth: 600, margin: "auto", p: 10 }}
      >
        <h2>Event Application Form</h2>

        <TextField
          fullWidth
          margin="normal"
          label="Event Name"
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
        />

        <FormControl fullWidth margin="normal">
          <InputLabel>Event Category</InputLabel>
          <Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          fullWidth
          margin="normal"
          label="Website URL"
          placeholder="http://example.com"
          value={websiteURL}
          onChange={(e) => setWebsiteURL(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Email"
          placeholder="example@event.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Phone"
          placeholder="+00 123 567 999"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Event Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          multiline
          rows={4}
          label="Event Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Event Date"
          placeholder="e.g., 2025-10-01"
          value={eventDate}
          onChange={(e) => setEventDate(e.target.value)}
        />
        <TextField
          fullWidth
          margin="normal"
          label="Event Time"
          placeholder="e.g., 10:00 AM - 02:00 AM"
          value={eventTime}
          onChange={(e) => setEventTime(e.target.value)}
        />

        <Box sx={{ mt: 2 }}>
          <h4 style={{ textAlign: "left" }}>Ticket Details</h4>
          {ticketDetails.map((ticket, index) => (
            <Box key={index} sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                label="Type"
                value={ticket.type}
                onChange={(e) =>
                  handleTicketDetailChange(index, "type", e.target.value)
                }
              />
              <TextField
                fullWidth
                label="Price ($)"
                type="number"
                inputProps={{ min: 1 }}
                value={ticket.price}
                onChange={(e) =>
                  handleTicketDetailChange(index, "price", e.target.value)
                }
              />
            </Box>
          ))}
          <Button variant="outlined" onClick={handleAddTicketType}>
            + Add another type
          </Button>
        </Box>

        <TextField
          fullWidth
          margin="normal"
          label="Total Tickets"
          value={totalTickets}
          onChange={(e) => setTotalTickets(e.target.value)}
        />

        <Button variant="outlined" component="label" fullWidth sx={{ my: 2 }}>
          Upload Event Photos
          <input
            type="file"
            hidden
            multiple
            onChange={(e) => setPhotos(e.target.files)}
          />
        </Button>

        <Box sx={{ mt: 2 }}>
          <h4 style={{ textAlign: "left" }}>Social Media (Optional)</h4>
          <TextField
            fullWidth
            margin="normal"
            label="Facebook"
            value={socialMedia.facebook}
            onChange={(e) =>
              setSocialMedia({ ...socialMedia, facebook: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="normal"
            label="Instagram"
            value={socialMedia.instagram}
            onChange={(e) =>
              setSocialMedia({ ...socialMedia, instagram: e.target.value })
            }
          />
          <TextField
            fullWidth
            margin="normal"
            label="Other"
            value={socialMedia.other}
            onChange={(e) =>
              setSocialMedia({ ...socialMedia, other: e.target.value })
            }
          />
        </Box>

        <Box sx={{ fontSize: "12px", color: "gray", my: 2, textAlign: "left" }}>
          Please review your info before submitting. Incomplete applications may
          delay approval.
        </Box>

        <FormControlLabel
          control={
            <Checkbox
              required
              checked={termsAccepted}
              onChange={(e) => setTermsAccepted(e.target.checked)}
            />
          }
          label={
            <span>
              I agree to the{" "}
              <a
                href="/company/terms-conditions"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms
              </a>{" "}
              and{" "}
              <a
                href="/company/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
              .
            </span>
          }
        />

        <Button
          type="submit"
          variant="contained"
          sx={{
            backgroundColor: "#FF5900",
            height: "50px",
            fontSize: "16px",
            mt: 3,
          }}
          fullWidth
        >
          Submit Application
        </Button>
      </Box>
    </Box>
  );
};

export default EventApplicationForm;
