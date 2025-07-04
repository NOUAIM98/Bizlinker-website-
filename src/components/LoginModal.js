import React, { useState, useEffect } from "react";
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

const LoginModal = ({ open, onClose, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (open) {
      setEmail("");
      setPassword("");
      setError("");
      setSuccess("");
    }
  }, [open]);

  if (!open) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError("All fields are required");
      return;
    }
    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_BASE}/login.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
      const result = await response.json();
      if (result.status === "success") {
        setSuccess("You have successfully logged in.");
        setError("");
        const userData = {
          userID: result.user.userID,
          firstName: result.user.firstName,
          lastName: result.user.lastName,
          email: result.user.email,
          phone: result.user.phone,
          profilePicture: result.user.profilePicture,
        };
        onLoginSuccess(userData);
        onClose();
      } else {
        setError(result.message);
      }
    } catch {
      setError("An error occurred while logging in. Please try again later.");
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
            alignItems: "center",
            justifyContent: "left",
            background:
              "linear-gradient(135deg, rgb(216, 255, 239), rgb(255, 215, 193))",
          }}
        >
          <Typography
            variant="h4"
            sx={{
              fontWeight: "bold",
              fontFamily: "Caudex",
              paddingBottom: "20px",
              paddingLeft: "10px",
            }}
          >
            Welcome Back!
          </Typography>
        </Box>
        <Box
          sx={{
            width: { xs: "100%", md: "50%" },
            p: { xs: 2, sm: 4, md: 4 },
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography
            variant="h5"
            gutterBottom
            sx={{ fontWeight: "bold", textAlign: "left" }}
          >
            Log In
          </Typography>
          {error && (
            <Typography color="error" sx={{ mb: 2 }}>
              {error}
            </Typography>
          )}
          {success && (
            <Typography color="success" sx={{ mb: 2 }}>
              {success}
            </Typography>
          )}
          <Box component="form" sx={{ mt: 2 }} onSubmit={handleLogin}>
            <TextField
              fullWidth
              label="Email"
              type="email"
              margin="normal"
              variant="outlined"
              sx={{ borderRadius: 2 }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              variant="outlined"
              sx={{ borderRadius: 2 }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
                "&:hover": { backgroundColor: "#333" },
                height: "50px",
              }}
              type="submit"
            >
              Log In
            </Button>
          </Box>
          <Divider sx={{ my: 3 }}>OR</Divider>
          <Button
            fullWidth
            variant="outlined"
            startIcon={<GoogleIcon />}
            sx={{
              mt: 2,
              backgroundColor: "#fff",
              color: "#127FBF",
              borderRadius: "24px",
              borderColor: "#127FBF",
              "&:hover": { backgroundColor: "#F5F7FA" },
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
              "&:hover": { backgroundColor: "#F5F7FA" },
              height: "50px",
            }}
          >
            Continue with Apple
          </Button>
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Don't have an account?{" "}
            <Button size="small" sx={{ textTransform: "none" }}>
              Sign Up
            </Button>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginModal;
