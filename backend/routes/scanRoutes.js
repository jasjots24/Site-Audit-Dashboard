const express = require('express');
const router = express.Router();
const { performAudit } = require('../engine/seoEngine');
const { buildFinalReport } = require('../report/reportBuilder');

router.post('/scan', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: "Website URL is required" });
  }

  try {
    console.log(`🚀 Starting full audit for: ${url}`);
    
    // 1. Run the heavy analysis
    const auditData = await performAudit(url);
    
    // 2. Build the summarized report
    const finalReport = buildFinalReport(url, auditData);
    
    console.log(`✅ Audit complete for ${url}. Score: ${finalReport.summary.seo_score}`);
    res.json(finalReport);
    
  } catch (err) {
    console.error("Route Error:", err.message);
    res.status(500).json({ 
      error: "Analysis failed", 
      message: err.message 
    });
  }
});

module.exports = router;