const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/extract", async (req, res) => {
  const { url } = req.body;

  try {
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);
    const pageText = $("body").text();
    const cleanText = pageText;

    const hfResponse = await fetch("https://api-inference.huggingface.co/models/facebook/bart-large-cnn", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: cleanText })
    });

    const result = await hfResponse.json();
    const summary = result[0]?.summary_text || "Summary not available";

    res.json({ result: `Summary: ${summary}` });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: "Failed to process URL" });
  }
});

app.listen(5000, () => {
  console.log("Server running on 5000");
});
