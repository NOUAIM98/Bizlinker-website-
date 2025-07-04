const express = require("express");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAIApi(
  new Configuration({ apiKey: "YOUR_OPENAI_API_KEY" })
);

const cors = require("cors");
app.use(cors());

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4-turbo",
      messages: [
        { role: "system", content: "You are a customer support assistant." },
        { role: "user", content: message },
      ],
    });

    const reply = response.data.choices[0].message.content;

    if (reply.toLowerCase().includes("customer support")) {
      return res.json({
        message: "I am redirecting you to customer support...",
        transfer: true,
      });
    }

    res.json({ message: reply, transfer: false });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred." });
  }
});

app.listen(5000, () =>
  console.log("Server running at: https://getbizlinker.site:${PORT}")
);
