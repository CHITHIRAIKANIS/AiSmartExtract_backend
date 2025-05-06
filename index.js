const express = require('express');
const cors = require('cors');
const axios = require('axios');
const cheerio = require('cheerio');
const { SummarizerManager } = require('node-summarizer'); 

const app = express();
app.use(cors());
app.use(express.json());

app.post("/api/extract", async (req, res) => {
  const { url } = req.body;

  try {
    const { data: html } = await axios.get(url);
    const $ = cheerio.load(html);
    const pageText = $("body").text();
    const cleanText = pageText.replace(/\s+/g, ' ').trim(); // Optional: clean up extra spaces
    const summarizer = new SummarizerManager(cleanText, 10); // 10 = number of sentences in summary
    const summaryResult = summarizer.getSummaryByFrequency();
    const summary = summaryResult.summary || "Summary not available";
    console.log(summary)
    res.json({ result: `Summary: ${summary}` });
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ error: "Failed to process URL" });
  }
});

app.listen(5000, () => {
  console.log("Server running on 5000");
});
