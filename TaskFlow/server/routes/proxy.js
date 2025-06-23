const express = require("express");
const axios = require("axios");
const rateLimit = require("express-rate-limit");
const router = express.Router();

const API_URL = "https://jsonplaceholder.typicode.com/todos";


const TOKENS = {
  apikey: "my-api-key-123",
  jwt: "my-jwt-token-abc",
};


const limiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  message: "Too many requests. Please try again later.",
});

router.use(limiter);

router.get("/tasks", async (req, res) => {
  try {
    const strategy = req.query.auth || "apikey";
    const token = TOKENS[strategy];
    if (!token) return res.status(400).json({ error: "Invalid auth method" });

    console.log(`🔁 Proxying /tasks with ${strategy.toUpperCase()} token`);

    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    res.json(response.data);
  } catch (err) {
    if (err.response && err.response.status === 401) {
      console.warn("🔄 Token expired. Refresh logic would go here.");
      return res.status(401).json({ error: "Token expired. Please refresh." });
    }
    console.error("❌ Proxy error:", err.message);
    res.status(500).json({ error: "Proxy failed" });
  }
});

module.exports = router;