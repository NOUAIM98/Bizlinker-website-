import React, { useState, useEffect } from "react";
import { Box, Typography, Grid, Button, CircularProgress } from "@mui/material";
import { Business, Event, LocalOffer, RateReview } from "@mui/icons-material";
import { Card, CardHeader, CardContent } from "@mui/material";

const HomePage = () => {
  const [data, setData] = useState({
    businesses: 0,
    events: 0,
    services: 0,
    reviews: 0,
  });

  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });

  useEffect(() => {
    const fetchCounts = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_BASE}/dashboardCounts.php`
        );
        const json = await res.json();
        if (json.success) {
          setData(json.data);
        }
      } catch (err) {
        console.error("Error fetching dashboard counts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCounts();
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = () => {
    console.log("Form Data Submitted:", formData);
    setFormData({ name: "", description: "" });
  };

  const statsCard = (title, count, Icon, iconColor) => (
    <Grid item xs={12} sm={6} md={3}>
      <Card
        sx={{
          height: "100%",
          backgroundColor: "#ffffff",
          boxShadow: 3,
          borderRadius: "12px",
          transition: "transform 0.3s ease, box-shadow 0.3s ease",
          "&:hover": {
            transform: "translateY(-10px)",
            boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)",
          },
        }}
      >
        <CardHeader
          title={title}
          titleTypographyProps={{
            variant: "h6",
            fontWeight: "bold",
            sx: { color: "#333", fontSize: "1.1rem" },
          }}
          avatar={<Icon sx={{ fontSize: 40, color: iconColor }} />}
        />
        <CardContent
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "16px",
          }}
        >
          <Typography variant="h4" sx={{ color: "#333" }}>
            {loading ? <CircularProgress size={24} color="inherit" /> : count}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );

  return (
    <Box
      sx={{
        padding: 3,
        backgroundColor: "#ffffff",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Grid container spacing={3} sx={{ marginBottom: 4 }}>
        {statsCard("Businesses", data.businesses, Business, "#FF5733")}
        {statsCard("Events", data.events, Event, "#3498db")}
        {statsCard("Services", data.services, LocalOffer, "#ff9800")}
        {statsCard("Reviews", data.reviews, RateReview, "#2ecc71")}
      </Grid>
    </Box>
  );
};

export default HomePage;
