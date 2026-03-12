const cheerio = require('cheerio');
const axios = require('axios');
const pLimit = require('p-limit');
const { parsePhoneNumberFromString } = require('libphonenumber-js');

// Ensure you use p-limit@3 if using require, or handle accordingly
const limit = pLimit(10); 

const runLinkChecks = async (html, baseUrl) => {
  const $ = cheerio.load(html);
  const issues = [];
  const links = $('a');

  const linkTasks = links.toArray().map((el) => limit(async () => {
    const href = $(el).attr('href');
    const anchorText = $(el).text().trim();

    // Skip fragments, javascript, or missing hrefs
    if (!href || href.startsWith('#') || href.startsWith('javascript:')) return;

    // --- 1. Handle Phone Numbers (tel:) ---
    if (href.startsWith('tel:')) {
      const phoneNum = href.replace('tel:', '').trim();
      // Validates against international standards
      const phoneNumber = parsePhoneNumberFromString(phoneNum); 
      
      if (!phoneNumber || !phoneNumber.isValid()) {
        issues.push({ 
          type: 'Link', 
          severity: 'error', 
          msg: `Invalid phone number format: ${phoneNum}` 
        });
      }
      return; // Skip Axios ping
    }

    // --- 2. Handle Emails (mailto:) ---
    if (href.startsWith('mailto:')) {
      const email = href.replace('mailto:', '').split('?')[0].trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      
      if (!emailRegex.test(email)) {
        issues.push({ 
          type: 'Link', 
          severity: 'error', 
          msg: `Invalid email format: ${email}` 
        });
      }
      return; // Skip Axios ping
    }

    // --- 3. Handle Standard Web Links ---
    try {
      // Resolve URL (handles relative paths like /about)
      const fullUrl = href.startsWith('http') ? href : new URL(href, baseUrl).href;
      const isInternal = fullUrl.includes(new URL(baseUrl).hostname);

      // Anchor Text Quality
      if (!anchorText) {
        issues.push({ type: 'Link', severity: 'warning', msg: `Empty anchor text for link: ${href}` });
      } else if (['click here', 'read more', 'link', 'more'].includes(anchorText.toLowerCase())) {
        issues.push({ type: 'Link', severity: 'info', msg: `Generic anchor text: "${anchorText}"` });
      }

      // Security Check
      if (isInternal && fullUrl.startsWith('http:')) {
        issues.push({ type: 'Link', severity: 'error', msg: `Insecure internal link (HTTP): ${href}` });
      }

      // Live Ping Verification
      const response = await axios.get(fullUrl, { 
        timeout: 5000, 
        validateStatus: false, 
        headers: { 'User-Agent': 'SEO-Bot' } 
      });

      if (response.status === 404) {
        issues.push({ type: 'Link', severity: 'error', msg: `Broken link (404 Not Found): ${href}` });
      } else if (response.status >= 300 && response.status < 400) {
        issues.push({ type: 'Link', severity: 'warning', msg: `Redirect detected (${response.status}): ${href}` });
      } else if (response.status >= 500) {
        issues.push({ type: 'Link', severity: 'error', msg: `Server error on linked page (${response.status}): ${href}` });
      }
    } catch (err) {
      // If URL resolution fails or timeout occurs
      issues.push({ type: 'Link', severity: 'error', msg: `Link unreachable: ${href}` });
    }
  }));

  await Promise.all(linkTasks);
  return issues;
};

module.exports = { runLinkChecks };