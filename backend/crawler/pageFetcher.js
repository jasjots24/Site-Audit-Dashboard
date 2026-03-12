const axios = require('axios');
const pLimit = require('p-limit');

// Change the initialization to this:
const limit = (typeof pLimit === 'function') ? pLimit(10) : pLimit.default(10);

const fetchPage = async (url) => {
  return limit(async () => {
    try {
      const response = await axios.get(url, {
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) SEO-Scanner/1.0',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9'
        }
      });
      return { url, html: response.data, success: true };
    } catch (error) {
      return { url, error: error.message, success: false };
    }
  });
};

module.exports = { fetchPage };