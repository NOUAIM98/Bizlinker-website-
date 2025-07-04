import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Divider,
  IconButton,
} from "@mui/material";
import {
  Google as GoogleIcon,
  Apple as AppleIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { Sparkle } from "phosphor-react";

const SignUpModal = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.password
    ) {
      setError("All fields are required");
      return;
    }

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE}/signup.php`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            password: formData.password,
          }),
        }
      );

      const result = await response.json();
      if (result.status === "success") {
        setSuccess(result.message);
        setError("");
        setFormData({ firstName: "", lastName: "", email: "", password: "" });
        setTimeout(onClose, 2000);
        setError(result.message);
      }
    } catch (error) {
      setError("An error occurred while signing up. Please try again later.");
    }
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 999,
        p: { xs: 1, sm: 2 },
        boxSizing: "border-box",
      }}
      onClick={onClose}
    >
      <Box
        sx={{
          width: { xs: "100%", sm: "90%", md: "1000px" },
          maxWidth: "1000px",
          bgcolor: "background.paper",
          borderRadius: 4,
          overflow: "hidden",
          position: "relative",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
          margin: { xs: "0", sm: "20px", md: "0" },
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 1000,
            color: "grey.500",
            backgroundColor: "rgba(255, 255, 255, 0.8)",
            "&:hover": {
              backgroundColor: "rgba(255, 255, 255, 0.9)",
            },
          }}
        >
          <CloseIcon />
        </IconButton>
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            p: { xs: 2, sm: 4, md: 4 },
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            justifyContent: "center",
            background:
              "linear-gradient(135deg, rgb(216, 255, 239), rgb(255, 215, 193))",
            gap: 2,
          }}
        >
          {/* Left section */}
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", mb: 2, textAlign: "left" }}
          >
            Join Us Today and Unlock Exclusive Benefits!
          </Typography>
          <Typography variant="body1">
            {" "}
            <Sparkle /> Access to Trusted Reviews
          </Typography>
          <Typography variant="body1">
            {" "}
            <Sparkle />
            Stay Informed and Save Time
          </Typography>
          <Typography variant="body1">
            <Sparkle /> Create and Manage Your Business Profile
          </Typography>
          <Typography variant="body1">
            <Sparkle /> Find the Best Service Providers
          </Typography>
          <Typography variant="body1">
            {" "}
            <Sparkle /> Book Tickets for Events
          </Typography>
        </Box>
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            p: { xs: 2, sm: 4, md: 4 },
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: "bold", textAlign: "left" }}
          >
            Sign Up
          </Typography>
          {error && <Typography color="error">{error}</Typography>}
          {success && <Typography color="success">{success}</Typography>}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
            />
            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={{
                mt: 3,
                backgroundColor: "#222222",
                color: "#fff",
                borderRadius: "24px",
                "&:hover": {
                  backgroundColor: "#333",
                },
                height: "50px",
              }}
              type="submit"
            >
              Sign Up
            </Button>
          </Box>
          <Divider sx={{ my: 3 }}>OR</Divider>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            sx={{
              mt: 1,
              backgroundColor: "#fff",
              color: "#127FBF",
              borderRadius: "24px",
              borderColor: "#127FBF",
              "&:hover": {
                backgroundColor: "#F5F7FA",
              },
              height: "50px",
            }}
          >
            Continue with Google
          </Button>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<AppleIcon />}
            sx={{
              mt: 2,
              backgroundColor: "#fff",
              color: "#127FBF",
              borderRadius: "24px",
              borderColor: "#127FBF",
              "&:hover": {
                backgroundColor: "#F5F7FA",
              },
              height: "50px",
            }}
          >
            Continue with Apple
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SignUpModal;
