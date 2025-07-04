import React, { useState } from "react";
import {
  Button,
  TextField,
  Box,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Container,
  IconButton,
} from "@mui/material";
import { FormControlLabel, Checkbox } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const categories = [
    'Restaurants', 'Health', 'Hotels', 'Fitness', 'Automotive',
    'Education', 'Banks', 'Electronics', 'Clothing Shops',
    'Beauty & Care', 'Pet Services', 'Supermarkets', 'Real Estate',
  ];
const BusinessApplicationForm = () => {
  const navigate = useNavigate();

  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("");
  const [websiteURL, setWebsiteURL] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [description, setDescription] = useState("");
  const [workingHours, setWorkingHours] = useState([{ day: "", time: "" }]);
  const [selectedDays, setSelectedDays] = useState([]);
  const [photos, setPhotos] = useState(null);
  const [governmentDoc, setGovernmentDoc] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [socialMedia, setSocialMedia] = useState({
    facebook: "",
    instagram: "",
    other: "",
  });

  const handleAddWorkingHour = () => {
    setWorkingHours([...workingHours, { day: "", time: "" }]);
  };

  const handleWorkingHourChange = (index, field, value) => {
    const updatedHours = [...workingHours];
    updatedHours[index][field] = value;

    if (field === "day") {
      const previousDay = workingHours[index].day;
      if (previousDay) {
        setSelectedDays(selectedDays.filter((day) => day !== previousDay));
      }
      setSelectedDays([...selectedDays, value]);
    }

    setWorkingHours(updatedHours);
  };

  const handleRemoveWorkingHour = (index) => {
    const removedDay = workingHours[index].day;
    setWorkingHours(workingHours.filter((_, i) => i !== index));
    setSelectedDays(selectedDays.filter((day) => day !== removedDay));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("businessName", businessName);
    formData.append("category", category);
    formData.append("websiteURL", websiteURL);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("location", address);
    formData.append("description", description);
    formData.append("workingHours", JSON.stringify(workingHours));
    formData.append("facebook", socialMedia.facebook);
    formData.append("instagram", socialMedia.instagram);
    formData.append("other", socialMedia.other);

    if (photos) {
      Array.from(photos).forEach((photo, index) => {
        formData.append(`photos[${index}]`, photo);
      });
    }
    if (governmentDoc) {
      formData.append("governmentDoc", governmentDoc);
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE}/submitBusinessApplication.php`,
        {
          method: "POST",
          body: formData,
        }
      );

      const responseText = await response.text();
      const data = JSON.parse(responseText);

      if (data.success) {
        toast.success("Application submitted successfully!");
        setTimeout(() => navigate("/"), 2000);
      } else {
        toast.error("Failed to submit: " + data.message);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#fff",
        py: 4,
      }}
    >
      <Container
        maxWidth="md"
        sx={{ display: "flex", justifyContent: "center", my: 4 }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ maxWidth: 600, margin: "auto", p: 10 }}
        >
          <h2>Business Application Form</h2>

          <TextField
            fullWidth
            margin="normal"
            label="Business Name"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {categories.map((cat) => (
                <MenuItem key={cat} value={cat}>
                  {cat}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            margin="normal"
            label="Website URL"
            value={websiteURL}
            onChange={(e) => setWebsiteURL(e.target.value)}
            placeholder="http://example.com"
          />

          <TextField
            fullWidth
            margin="normal"
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@business.com"
          />

          <TextField
            fullWidth
            margin="normal"
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+00 123 567 999"
          />

          <TextField
            fullWidth
            margin="normal"
            label="Business Location (Address)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <TextField
            fullWidth
            margin="normal"
            label="Description"
            multiline
            rows={4}
            placeholder="Provide a short and compelling description of your business."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Box sx={{ mt: 2 }}>
            <h4 style={{ textAlign: "left" }}>Working Hours</h4>
            {workingHours.map((hour, index) => (
              <Box
                key={index}
                sx={{ display: "flex", gap: 2, mb: 2, alignItems: "center" }}
              >
                <FormControl fullWidth>
                  <InputLabel>Day</InputLabel>
                  <Select
                    value={hour.day}
                    onChange={(e) =>
                      handleWorkingHourChange(index, "day", e.target.value)
                    }
                  >
                    {daysOfWeek.map((day) =>
                      !selectedDays.includes(day) || hour.day === day ? (
                        <MenuItem key={day} value={day}>
                          {day}
                        </MenuItem>
                      ) : null
                    )}
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Time"
                  placeholder="e.g., 10:00 AM - 02:00 PM"
                  value={hour.time}
                  onChange={(e) =>
                    handleWorkingHourChange(index, "time", e.target.value)
                  }
                />
                <IconButton
                  color="error"
                  onClick={() => handleRemoveWorkingHour(index)}
                >
                  x
                </IconButton>
              </Box>
            ))}
            <Button
              variant="outlined"
              onClick={handleAddWorkingHour}
              disabled={workingHours.length >= 7}
            >
              + Add
            </Button>
          </Box>

          <Box sx={{ mt: 2 }}>
            <h4 style={{ textAlign: "left" }}>Business Photos</h4>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ my: 2, height: "50px" }}
            >
              Upload Business Photos
              <input
                type="file"
                hidden
                multiple
                onChange={(e) => setPhotos(e.target.files)}
              />
            </Button>
          </Box>

          <Box sx={{ mt: 2 }}>
            <h4 style={{ textAlign: "left" }}>Government Document</h4>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              sx={{ my: 2, height: "50px" }}
            >
              Upload Government Document
              <input
                type="file"
                hidden
                onChange={(e) => setGovernmentDoc(e.target.files[0])}
              />
            </Button>
          </Box>

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
              label="Other Platforms"
              value={socialMedia.other}
              onChange={(e) =>
                setSocialMedia({ ...socialMedia, other: e.target.value })
              }
            />
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
                I confirm that I have read and agree to the{" "}
                <a
                  href="/company/terms-conditions"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Terms and Conditions
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
              color: "#ffffff",
              height: "50px",
              fontSize: "16px",
              marginTop: "20px",
            }}
            fullWidth
          >
            Submit Application
          </Button>
        </Box>
      </Container>

      <ToastContainer position="bottom-center" autoClose={3000} />
    </Box>
  );
};

export default BusinessApplicationForm;
