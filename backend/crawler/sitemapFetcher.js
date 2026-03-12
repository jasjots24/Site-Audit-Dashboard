const axios = require('axios');
const xml2js = require('xml2js');

const fetchSitemapUrls = async (baseUrl) => {
  try {
    const sitemapUrl = `${baseUrl.replace(/\/$/, "")}/sitemap.xml`;
    const response = await axios.get(sitemapUrl, { timeout: 10000 });
    
    const parsed = await xml2js.parseStringPromise(response.data);
    
    // Check for standard sitemap format <urlset><url><loc>
    if (parsed.urlset && parsed.urlset.url) {
      return parsed.urlset.url.map(u => u.loc[0]);
    }
    
    // Fallback for sitemap index files <sitemapindex><sitemap><loc>
    if (parsed.sitemapindex && parsed.sitemapindex.sitemap) {
      return parsed.sitemapindex.sitemap.map(s => s.loc[0]);
    }

    throw new Error("Sitemap format not recognized or empty.");
  } catch (error) {
    console.error("Sitemap Fetch Error:", error.message);
    // If sitemap fails, return the homepage as a fallback
    return [baseUrl]; 
  }
};

module.exports = { fetchSitemapUrls };