const { fetchSitemapUrls } = require('./sitemapFetcher');
const { fetchPage } = require('./pageFetcher');
const cheerio = require('cheerio');

const normalizeUrl = (url, baseUrl) => {
  try {
    const obj = new URL(url, baseUrl);
    obj.hash = ''; // Remove fragments
    return obj.href.replace(/\/$/, ""); // Remove trailing slash
  } catch (e) {
    return null;
  }
};

const runCrawl = async (baseUrl) => {
  const normalizedBase = baseUrl.replace(/\/$/, "");
  let urlsToCrawl = await fetchSitemapUrls(normalizedBase);

  // FALLBACK: If sitemap is empty, find links from Homepage
  if (urlsToCrawl.length <= 1) {
    console.log("⚠️ Sitemap not found. Falling back to internal link discovery...");
    const homePage = await fetchPage(normalizedBase);
    if (homePage.success) {
      const $ = cheerio.load(homePage.html);
      const discovered = new Set([normalizedBase]);
      
      $('a[href]').each((_, el) => {
        const href = $(el).attr('href');
        const fullUrl = normalizeUrl(href, normalizedBase);
        // Only include internal links
        if (fullUrl && fullUrl.startsWith(normalizedBase)) {
          discovered.add(fullUrl);
        }
      });
      urlsToCrawl = Array.from(discovered);
    }
  }

  console.log(`🔎 Total URLs for analysis: ${urlsToCrawl.length}`);

  // Fetch all HTML with performance limits
  const results = await Promise.all(
    urlsToCrawl.map(async (url) => {
      const startTime = Date.now();
      const pageData = await fetchPage(url);
      const responseTime = Date.now() - startTime;

      return {
        url,
        html: pageData.html,
        success: pageData.success,
        responseTime,
        error: pageData.error
      };
    })
  );

  return { results, sitemapUrls: urlsToCrawl };
};

module.exports = { runCrawl };