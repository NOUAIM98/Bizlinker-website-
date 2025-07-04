import React, { useState } from "react";
import { Dialog, Button, TextField, Box, Typography, Radio, RadioGroup, FormControlLabel, FormControl, InputAdornment, MenuItem, InputLabel, Select } from "@mui/material";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import LockIcon from "@mui/icons-material/Lock";

const BuyTicketsModal = ({ isOpen, onClose, event }) => {
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [quantity, setQuantity] = useState(1); 

  if (!event || !isOpen) return null;

  const handleQuantityChange = (event) => {
    setQuantity(event.target.value);
  };

  const price = event.price ? parseFloat(event.price.replace("$", "")) : 0;
  const subtotal = price * quantity;
  const serviceFee = price * 0.05;
  const total = subtotal + serviceFee;

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md">
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 3,
          p: 3,
          backgroundImage: "linear-gradient(rgba(38, 38, 38, 0.61), rgba(34, 34, 34, 0.61)), url(/forbusiness.png)",                    backgroundSize: "cover",
          backgroundPosition: "center",        }}
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
              <TextField label="Name on Card" variant="outlined" fullWidth margin="normal"  />
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
          <br /> 
            <Typography variant="body2" color="textSecondary" display="flex" alignItems="center" gap={1}>
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
            Summary
          </Typography>

          <Typography variant="body1">
            <strong>Event:</strong> {event.name}
          </Typography>
          <Typography variant="body1">
            <strong>Date:</strong> {event.date}
          </Typography>
          <Typography variant="body1">
            <strong>Location:</strong> {event.location}
          </Typography>
          <Typography variant="body1">
            <strong>Ticket Type:</strong> General Admission
          </Typography>
          <br /> 
          <Box mt={2}>
            <FormControl fullWidth>
              <InputLabel id="quantity-label">Quantity</InputLabel>
              <Select
                labelId="quantity-label"
                value={quantity}
                label="Quantity"
                onChange={handleQuantityChange}
              >
                {[1, 2, 3, 4, 5].map((num) => (
                  <MenuItem key={num} value={num}>
                    {num}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box >
          <br /> 

          <Typography variant="body1">
            <strong>Price per Ticket:</strong> ${price}
          </Typography>
          <Typography variant="body1">
            <strong>Subtotal:</strong> ${subtotal}
          </Typography>
          <Typography variant="body1">
            <strong>Service Fee:</strong> $5.00
          </Typography>

          <Box display="flex" mt={2} gap={1}>
            <TextField label="Promo code" variant="outlined" fullWidth />
            <Button variant="contained" sx={{ backgroundColor: "#FF5900"}}>Apply</Button>
          </Box>

          <Typography
            variant="h6"
            fontWeight="bold"
            sx={{ mt: 2, color: "#1876D2" }}
          >
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

export default BuyTicketsModal;
