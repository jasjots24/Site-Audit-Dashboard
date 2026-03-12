const cheerio = require('cheerio');
const axios = require('axios');

const runImageChecks = async (html, baseUrl) => {
  const $ = cheerio.load(html);
  const issues = [];
  const images = $('img');

  for (const el of images.toArray()) {
    const src = $(el).attr('src');
    if (!src) continue;

    // 1. Correctly define 'ext' (extension)
    const ext = src.split('.').pop().toLowerCase().split(/[?#]/)[0]; 
    const alt = $(el).attr('alt');
    
    // Resolve absolute URL for size checking
    const fullSrc = src.startsWith('http') ? src : new URL(src, baseUrl).href;

    // 2. Alt Attribute Checks
    if (alt === undefined) {
      issues.push({ 
        type: 'Image', 
        severity: 'error', 
        msg: `Missing alt attribute: ${src}` 
      });
    } else if (alt.trim() === "") {
      issues.push({ 
        type: 'Image', 
        severity: 'warning', 
        msg: `Empty alt text (hidden from screen readers): ${src}` 
      });
    }

    // 3. Filename SEO Check
    const filename = src.split('/').pop().split(/[?#]/)[0];
    if (/^(image|img|dsc|screen|capture|asset|photo)[-_]?\d*/i.test(filename)) {
      issues.push({ 
        type: 'Image', 
        severity: 'info', 
        msg: `Non-descriptive filename: ${filename}` 
      });
    }

    // 4. Modern Format Check (Flagging legacy formats)
    const legacyFormats = ['jpg', 'jpeg', 'png'];
    if (legacyFormats.includes(ext)) {
      issues.push({ 
        type: 'Image', 
        severity: 'warning', 
        msg: `Legacy format detected (.${ext}). Convert to WebP/Avif for better SEO: ${src}` 
      });
    }

    // 5. File Size Check (Head Request)
    try {
      const headRes = await axios.head(fullSrc, { timeout: 3000 });
      const sizeBytes = headRes.headers['content-length'];
      if (sizeBytes && sizeBytes > 100000) { // 100KB threshold
        const sizeKB = Math.round(sizeBytes / 1024);
        issues.push({ 
          type: 'Image', 
          severity: 'warning', 
          msg: `Large image detected (${sizeKB}KB): ${src}` 
        });
      }
    } catch (e) {
      // Ignore errors if image head request fails
    }
  }

  return issues;
};

module.exports = { runImageChecks };