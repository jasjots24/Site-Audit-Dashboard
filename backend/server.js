const express = require('express');
const cors = require('cors');
const { runFullSEOAudit } = require('./utils/seoEngine');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/scan', async (req, res) => {
  const { url, mode } = req.body;

  if (!url) return res.status(400).json({ error: "URL is required" });

  console.log(`🔎 Initiating ${mode || 'quick'} scan for: ${url}`);

  try {
    // 1. Run the Full SEO Audit
    const results = await runFullSEOAudit(url);
    
    // 2. Format the results for ReportView
    res.json({
      reportId: "rep_" + Math.random().toString(36).substr(2, 9),
      site: url,
      scan_date: new Date().toISOString(),
      pages_scanned: results.length,
      summary: {
        pass: 0, // You can count pages with 0 issues if you wish
        warning: results.length, // All pages with issues are counted as warnings/errors
        error: 0
      },
      pages: results.map(r => ({
        url: r.url,
        status: 'warning',
        issues_count: r.issues.length,
        details: r.issues.map(msg => ({ 
          type: 'SEO_Issue', 
          status: 'warning', 
          msg: msg 
        }))
      }))
    });

  } catch (err) {
    console.error("Scan Error:", err);
    res.status(500).json({ error: "Scan failed: " + err.message });
  }
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));