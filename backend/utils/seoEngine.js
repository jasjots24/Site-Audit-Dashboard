const axios = require("axios");
const cheerio = require("cheerio");
const xml2js = require("xml2js");

const TITLE_MIN = 30;
const TITLE_MAX = 65;
const DESC_MIN = 120;
const DESC_MAX = 320;

const runFullSEOAudit = async (url) => {
  if (!url) throw new Error("URL parameter is missing");
  // Use the passed 'url' parameter consistently
  const sitemapUrl = `${url.replace(/\/$/, "")}/sitemap.xml`;
  
  const sitemapRes = await axios.get(sitemapUrl);
  const parsed = await xml2js.parseStringPromise(sitemapRes.data);
  
  // Extract URLs from sitemap
  // Note: some sitemaps use <url><loc> while others use <sitemap><loc>
  const urls = parsed.urlset.url.map(u => u.loc[0]);

  const titleMap = new Map();
  const descMap = new Map();
  const failures = [];

  for (const pageUrl of urls) {
    try {
      const pageRes = await axios.get(pageUrl, { 
        timeout: 10000,
        headers: { 'User-Agent': 'Mozilla/5.0' } 
      });
      
      const $ = cheerio.load(pageRes.data);
      const title = $("title").text().trim();
      const description = $('meta[name="description"]').attr("content")?.trim() || "";
      const titleLength = title.length;
      const descLength = description.length;

      let issues = [];
      if (!title) issues.push("Missing title");
      if (!description) issues.push("Missing description");
      if (title && (titleLength < TITLE_MIN || titleLength > TITLE_MAX)) 
        issues.push(`Title length ${titleLength} (should be ${TITLE_MIN}-${TITLE_MAX})`);
      if (description && (descLength < DESC_MIN || descLength > DESC_MAX)) 
        issues.push(`Description length ${descLength} (should be ${DESC_MIN}-${DESC_MAX})`);

      // Logic for Duplicates
      if (title) {
        if (titleMap.has(title)) issues.push(`Duplicate title (already seen on ${titleMap.get(title)})`);
        else titleMap.set(title, pageUrl);
      }
      if (description) {
        if (descMap.has(description)) issues.push(`Duplicate description (already seen on ${descMap.get(description)})`);
        else descMap.set(description, pageUrl);
      }

      if (issues.length > 0) {
        failures.push({ 
          url: pageUrl, 
          titleLength, 
          descriptionLength: descLength, 
          issues 
        });
      }
    } catch (err) {
      failures.push({ url: pageUrl, issues: ["Page fetch failed"] });
    }
  }
  return failures;
};

module.exports = { runFullSEOAudit };