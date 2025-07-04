import React, { useState, useEffect } from "react";
import {
  Box, Typography, TextField, Button, List, ListItem, ListItemText,
  CircularProgress, Paper, IconButton, Drawer
} from "@mui/material";
import { Send, Delete, Close } from "@mui/icons-material";

const ChatsPage = () => {
  const [messages, setMessages] = useState([]);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isPanelOpen, setIsPanelOpen] = useState(false); 

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const data = {
        messages: [
          {
            id: 1,
            userName: "John Doe",
            text: "Hello, I would like to inquire about your service.",
            responses: ["Hello John, thank you for reaching out!"]
          },
          {
            id: 2,
            userName: "Jane Smith",
            text: "Can you give me an update on my order?",
            responses: []
          }
        ]
      };
      setMessages(data.messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSendResponse = async (messageId) => {
    if (response.trim() === "") return;

    try {
      const updatedMessages = messages.map(msg =>
        msg.id === messageId ? { ...msg, responses: [...msg.responses, response] } : msg
      );
      setMessages(updatedMessages);
      setResponse("");
    } catch (error) {
      console.error("Error sending response:", error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      setMessages(messages.filter(msg => msg.id !== messageId));
      setSelectedMessage(null);
      setIsPanelOpen(false);
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const handleMessageClick = (message) => {
    setSelectedMessage(message);
    setIsPanelOpen(true); // Yan paneli aç
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
    setSelectedMessage(null);
  };

  return (
    <Box sx={{ display: "flex", height: "100vh", paddingTop: 3,}}>
      <Box sx={{ width: "400px",  boxShadow: 2 }}>
   

        <Paper sx={{  borderRadius: 2, boxShadow: 2 }}>
          <Box sx={{ maxHeight: "calc(100vh - 120px)", overflowY: "auto" }}>
            <List>
              {loading ? (
                <CircularProgress size={24} sx={{ display: "block", margin: "0 auto" }} />
              ) : (
                messages.map((message) => (
                  <ListItem
                    key={message.id}
                    divider
                    sx={{ paddingY: 2, cursor: "pointer" }}
                    onClick={() => handleMessageClick(message)}
                  >
                    <ListItemText
                      primary={<Typography variant="h6" sx={{ fontWeight: "bold", color: "#444" }}>{message.userName}</Typography>}
                      secondary={
                        <>
                          <Typography variant="body2" color="textSecondary">{message.text}</Typography>
                          {message.responses && message.responses.length > 0 && (
                            <Typography variant="body2" color="primary">
                              <strong>Admin:</strong> {message.responses[message.responses.length - 1]}
                            </Typography>
                          )}
                        </>
                      }
                    />
                    <IconButton onClick={() => handleDeleteMessage(message.id)} color="error">
                      <Delete />
                    </IconButton>
                  </ListItem>
                ))
              )}
            </List>
          </Box>
        </Paper>
      </Box>

      <Drawer
        anchor="right"
        open={isPanelOpen}
        onClose={handleClosePanel}
        sx={{
          "& .MuiDrawer-paper": {
            width: "400px",
            padding: 3,
            backgroundColor: "#fff",
            boxShadow: "-5px 0px 10px rgba(0,0,0,0.1)"
          }
        }}
      >
        {selectedMessage && (
          <>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography variant="h5" sx={{ fontWeight: "bold", color: "#333" }}>
                {selectedMessage.userName}
              </Typography>
              <IconButton onClick={handleClosePanel}>
                <Close />
              </IconButton>
            </Box>

            <Typography variant="body1" sx={{ marginTop: 2, color: "#444" }}>
              <strong>User's Message:</strong> {selectedMessage.text}
            </Typography>

            {selectedMessage.responses.length > 0 && (
              <Box sx={{ marginTop: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#007bff" }}>
                  Admin Responses:
                </Typography>
                {selectedMessage.responses.map((res, index) => (
                  <Typography key={index} variant="body1" sx={{ color: "#2ecc71" }}>
                    {res}
                  </Typography>
                ))}
              </Box>
            )}

            {/* Yanıt Alanı */}
            <Box sx={{ marginTop: 3 }}>
              <TextField
                label="Your response"
                variant="outlined"
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                fullWidth
                size="small"
                multiline
                rows={4}
                sx={{ marginBottom: 2, backgroundColor: "#f9f9f9" }}
              />
              <Button
                onClick={() => handleSendResponse(selectedMessage.id)}
                variant="contained"
                color="primary"
                startIcon={<Send />}
                sx={{ marginRight: 2 }}
              >
                Send Response
              </Button>
            </Box>
          </>
        )}
      </Drawer>
    </Box>
  );
};

export default ChatsPage;
