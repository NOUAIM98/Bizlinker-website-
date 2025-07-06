import React, { useState } from "react";
import {
  Box,
  IconButton,
  TextField,
  Paper,
  Typography,
  Avatar,
} from "@mui/material";
import { Send, ChatBubbleOutline, Close } from "@mui/icons-material";
import axios from "axios";

const LiveChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { text: "Hello! How can I help you?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async () => {
    if (input.trim() === "") return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE}/chatgpt.php`,
        { message: input }
      );

      const botReply =
        response.data.reply || "Sorry, I didn't understand that.";
      setMessages((prev) => [...prev, { text: botReply, sender: "bot" }]);
    } catch (error) {
      console.error(
        "AI Chat Error:",
        error.response ? error.response.data : error
      );
      setMessages((prev) => [
        ...prev,
        { text: "Error: Could not reach AI server.", sender: "bot" },
      ]);
    }
  };

  const formatMessage = (text) => {
    const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
    const phoneRegex = /(\+?\d[\d\s\-().]{7,}\d)/g;

    let elements = [text];

    const applyRegex = (regex, createLink) => {
      const newElements = [];

      elements.forEach((segment) => {
        if (typeof segment === "string") {
          let lastIndex = 0;
          let match;
          while ((match = regex.exec(segment)) !== null) {
            newElements.push(segment.slice(lastIndex, match.index));
            newElements.push(createLink(match));
            lastIndex = match.index + match[0].length;
          }
          newElements.push(segment.slice(lastIndex));
        } else {
          newElements.push(segment);
        }
      });

      elements = newElements;
    };

    applyRegex(markdownLinkRegex, (match) => (
      <a
        key={match[2]}
        href={match[2]}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#1976d2" }}
      >
        {match[1]}
      </a>
    ));

    applyRegex(urlRegex, (match) => (
      <a
        key={match[0]}
        href={match[0]}
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: "#1976d2" }}
      >
        {match[0]}
      </a>
    ));

    applyRegex(emailRegex, (match) => (
      <a
        key={match[0]}
        href={`mailto:${match[0]}`}
        style={{ color: "#1976d2" }}
      >
        {match[0]}
      </a>
    ));

    applyRegex(phoneRegex, (match) => (
      <a
        key={match[0]}
        href={`tel:${match[0].replace(/\s+/g, "")}`}
        style={{ color: "#1976d2" }}
      >
        {match[0]}
      </a>
    ));

    return elements;
  };

  return (
    <Box sx={{ position: "fixed", bottom: 20, right: 20, zIndex: 1000 }}>
      <IconButton
        onClick={toggleChat}
        sx={{
          bgcolor: "primary.main",
          color: "white",
          "&:hover": { bgcolor: "primary.dark" },
          width: 56,
          height: 56,
        }}
      >
        {isOpen ? <Close /> : <ChatBubbleOutline />}
      </IconButton>

      {isOpen && (
        <Paper
          elevation={6}
          sx={{
            position: "absolute",
            bottom: 70,
            right: 0,
            width: 340,
            maxHeight: 500,
            display: "flex",
            flexDirection: "column",
            borderRadius: 2,
            overflow: "hidden",
            boxShadow: "0 0 15px rgba(0,0,0,0.2)",
          }}
        >
          <Box sx={{ bgcolor: "primary.main", color: "white", p: 2 }}>
            <Typography variant="h6">Chat with Nova 🤖</Typography>
          </Box>

          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 2,
              display: "flex",
              flexDirection: "column",
              gap: 1,
              backgroundColor: "#f9f9f9",
            }}
          >
            {messages.map((msg, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "flex-end",
                  justifyContent:
                    msg.sender === "user" ? "flex-end" : "flex-start",
                  gap: 1,
                }}
              >
                {msg.sender === "bot" && (
                  <Avatar
                    alt="Nova"
                    src="https://cdn-icons-png.flaticon.com/512/4712/4712107.png"
                    sx={{ width: 32, height: 32 }}
                  />
                )}
                <Typography
                  component="div"
                  sx={{
                    p: 1,
                    px: 2,
                    bgcolor:
                      msg.sender === "user" ? "primary.light" : "grey.300",
                    borderRadius: 2,
                    maxWidth: "75%",
                    wordBreak: "break-word",
                    fontSize: 14,
                  }}
                >
                  {formatMessage(msg.text)}
                </Typography>
              </Box>
            ))}
          </Box>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              p: 1,
              borderTop: "1px solid #ddd",
              backgroundColor: "#fff",
            }}
          >
            <TextField
              fullWidth
              size="small"
              variant="outlined"
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />
            <IconButton color="primary" onClick={sendMessage} sx={{ ml: 1 }}>
              <Send />
            </IconButton>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default LiveChat;
