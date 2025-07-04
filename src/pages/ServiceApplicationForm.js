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
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

 const categories = [
    'Web Development',
    'Design',
    'Video Editing',
    'Cleaning Services',
    'Painting',
    'Electrical Repair',
    'Handyman Services',
    'Home Maintenance',
  ];

export default function ServiceApplicationForm() {
  const [fullName, setFullName] = useState("");
  const [category, setCategory] = useState("");
  const [portfolioURL, setPortfolioURL] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [availability, setAvailability] = useState("");
  const [photos, setPhotos] = useState(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [socialMedia, setSocialMedia] = useState({
    facebook: "",
    linkedin: "",
    other: "",
  });
  const [servicesOffered, setServicesOffered] = useState([
    { serviceName: "", servicePrice: "" },
  ]);

  const navigate = useNavigate();
  const loggedInUser = JSON.parse(localStorage.getItem("user"));
  const userID = loggedInUser?.userID || null;

  const handleAddService = () => {
    setServicesOffered([
      ...servicesOffered,
      { serviceName: "", servicePrice: "" },
    ]);
  };

  const handleServiceChange = (index, field, value) => {
    const updated = [...servicesOffered];
    updated[index][field] = value;
    setServicesOffered(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("userID", userID);
    formData.append("fullName", fullName);
    formData.append("category", category);
    formData.append("portfolioURL", portfolioURL);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("location", location);
    formData.append("description", description);
    formData.append("availability", availability);
    formData.append("facebook", socialMedia.facebook);
    formData.append("linkedin", socialMedia.linkedin);
    formData.append("other", socialMedia.other);
    formData.append("servicesOffered", JSON.stringify(servicesOffered));

    if (photos) {
      Array.from(photos).forEach((photo, index) => {
        formData.append(`photos[${index}]`, photo);
      });
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE}/submitServiceApplication.php`,
        {
          method: "POST",
          body: formData,
        }
      );

      const responseText = await response.text();
      const data = JSON.parse(responseText);
      if (data.success) {
        toast.success("Service application submitted successfully!", {
          position: "bottom-center",
        });
        setTimeout(() => navigate("/"), 2000);
      } else {
        toast.error("Failed to submit: " + data.message, {
          position: "bottom-center",
        });
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.", {
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
        backgroundColor: "#fff",
        py: 4,
      }}
    >
      <ToastContainer />
      <Container
        maxWidth="md"
        sx={{ display: "flex", justifyContent: "center", my: 4 }}
      >
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ maxWidth: 600, margin: "auto", p: 10 }}
        >
          <h2>Service Application Form</h2>

          <TextField
            fullWidth
            margin="normal"
            label="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
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
            label="Portfolio URL"
            value={portfolioURL}
            onChange={(e) => setPortfolioURL(e.target.value)}
            placeholder="http://yourportfolio.com"
          />
          <TextField
            fullWidth
            margin="normal"
            label="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Phone Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Description"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <Box sx={{ mt: 2 }}>
            <h4 style={{ textAlign: "left" }}>Services Offered</h4>
            {servicesOffered.map((item, index) => (
              <Box key={index} sx={{ display: "flex", gap: 2, mb: 2 }}>
                <TextField
                  fullWidth
                  label="Service Name"
                  value={item.serviceName}
                  onChange={(e) =>
                    handleServiceChange(index, "serviceName", e.target.value)
                  }
                />
                <TextField
                  fullWidth
                  label="Price ($)"
                  type="number"
                  inputProps={{ min: 1 }}
                  placeholder="$1.00"
                  value={item.servicePrice}
                  onChange={(e) =>
                    handleServiceChange(index, "servicePrice", e.target.value)
                  }
                />
              </Box>
            ))}
            <Button
              variant="outlined"
              onClick={handleAddService}
              sx={{ height: "50px" }}
            >
              + Add
            </Button>
          </Box>

          <TextField
            fullWidth
            margin="normal"
            label="Availability"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
          />

          <Button
            variant="outlined"
            component="label"
            fullWidth
            sx={{ my: 2, height: "50px" }}
          >
            Upload Service Photos
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
              label="LinkedIn"
              value={socialMedia.linkedin}
              onChange={(e) =>
                setSocialMedia({ ...socialMedia, linkedin: e.target.value })
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
    </Box>
  );
}
