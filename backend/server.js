const express = require('express');
const cors = require('cors');
const { runQA } = require('./utils/crawler'); // Import our engine
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// THE SCAN ENDPOINT
app.post('/api/scan', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL is required" });
  }

  console.log(`🔎 Scanning started for: ${url}`);

  // Execute the crawler
  const results = await runQA(url);

  if (results.error) {
    return res.status(500).json(results);
  }

  // Send the real data back to the frontend
  res.json({
    reportId: "rep_" + Math.random().toString(36).substr(2, 9),
    site: url,
    scan_date: new Date().toISOString(),
    pages_scanned: 1, // Start with single page for now
    summary: {
      pass: results.status === "pass" ? 1 : 0,
      warning: results.status === "warning" ? 1 : 0,
      error: results.status === "error" ? 1 : 0
    },
    pages: [
      {
        url: "/",
        status: results.status,
        issues_count: results.status === "pass" ? 0 : 1,
        details: [
          { type: "Meta Title", status: results.status, msg: results.title }
        ]
      }
    ]
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));