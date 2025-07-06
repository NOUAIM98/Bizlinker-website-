import React, { useState } from "react";
import { Dialog, Button, TextField, Box, Typography, FormControl, InputAdornment, MenuItem, InputLabel, Select } from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import LockIcon from "@mui/icons-material/Lock";

const BuyServiceModal = ({ isOpen, onClose, service }) => {
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [serviceType, setServiceType] = useState(service?.options?.[0] || "Basic");

  if (!service || !isOpen) return null;

  const price = service.price[serviceType] || 0;
  const serviceFee = price * 0.05;
  const total = price + serviceFee;

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md">
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 3,
          p: 3,
          backgroundImage: "linear-gradient(rgba(38, 38, 38, 0.61), rgba(34, 34, 34, 0.61)), url(/forbusiness.png)",                    backgroundSize: "cover",
          backgroundPosition: "center",  
        }}
      >
        <Box
          sx={{
            backgroundColor: "white",
            p: 3,
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            Complete Your Payment
          </Typography>

          <Box display="flex" gap={2} mt={2}>
            <Button
              variant={paymentMethod === "Credit Card" ? "contained" : "outlined"}
              onClick={() => setPaymentMethod("Credit Card")}
              sx={{ flex: 1, textTransform: "none" }}
            >
              Credit Card
            </Button>
            <Button
              variant={paymentMethod === "PayPal" ? "contained" : "outlined"}
              onClick={() => setPaymentMethod("PayPal")}
              sx={{ flex: 1, textTransform: "none" }}
            >
              PayPal
            </Button>
            <Button
              variant={paymentMethod === "Crypto" ? "contained" : "outlined"}
              onClick={() => setPaymentMethod("Crypto")}
              sx={{ flex: 1, textTransform: "none" }}
            >
              Crypto
            </Button>
          </Box>

          {paymentMethod === "Credit Card" && (
            <Box mt={3}>
              <TextField label="Name on Card" variant="outlined" fullWidth margin="normal" />
              <TextField
                label="Card Number"
                variant="outlined"
                fullWidth
                margin="normal"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <CreditCardIcon />
                    </InputAdornment>
                  ),
                }}
              />
              <Box display="flex" gap={2}>
                <TextField label="Expiry (MM/YY)" variant="outlined" fullWidth margin="normal" />
                <TextField label="CVC" variant="outlined" fullWidth margin="normal" />
              </Box>
            </Box>
          )}

          <Typography variant="body2" color="textSecondary" display="flex" alignItems="center" gap={1} mt={2}>
            <LockIcon fontSize="small" /> Payments are handled by our secure partner.
          </Typography>
        </Box>

        <Box
          sx={{
            backgroundColor: "white",
            p: 3,
            borderRadius: "12px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
          }}
        >
          <Typography variant="h6" fontWeight="bold">
            Service Summary
          </Typography>

          <Typography variant="body1">
            <strong>Service:</strong> {service.name}
          </Typography>
          <Typography variant="body1">
            <strong>Freelancer:</strong> {service.freelancer}
          </Typography>
          <Typography variant="body1">
            <strong>Delivery Time:</strong> {service.deliveryTime}
          </Typography>

        
          <Typography variant="body1" mt={2}>
            <strong>Price:</strong> ${price}
          </Typography>
          <Typography variant="body1">
            <strong>Service Fee:</strong> $5.00
          </Typography>
   <Box display="flex" mt={2} gap={1}>
            <TextField label="Promo code" variant="outlined" fullWidth />
            <Button variant="contained" sx={{ backgroundColor: "#FF5900"}}>Apply</Button>
          </Box>
          <Typography variant="h6" fontWeight="bold" sx={{ mt: 2, color: "#1876D2" }}>
            <strong>Total:</strong> ${total}
          </Typography>

     <Box display="flex" flexDirection="column" alignItems="center" mt={3} >
         
     
                 <Box display="flex" gap={2} mt={2} >
                     <Button variant="outlined" onClick={onClose} sx={{ textTransform: "none", width: "30%", padding: "10px 30px "}}>
                                   Cancel
                                 </Button>
                                 <Button variant="contained" sx={{ backgroundColor: "#FF5900", textTransform: "none", width: "70%", padding: "10px 30px 10px 30px"}}>
                                   Pay Now
                                 </Button>
                 </Box>
               </Box>
        </Box>
      </Box>
    </Dialog>
  );
};

export default BuyServiceModal;
