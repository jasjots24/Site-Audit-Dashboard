const cheerio = require('cheerio');

const runTechnicalChecks = (html, pageUrl, sitemapUrls = []) => {
  const $ = cheerio.load(html);
  const issues = [];

  // 1. Canonical Tag
  const canonical = $('link[rel="canonical"]').attr('href');
  if (!canonical) {
    issues.push({ type: 'Technical', severity: 'error', msg: "Missing Canonical Tag" });
  } else {
    if (canonical !== pageUrl) {
      issues.push({ type: 'Technical', severity: 'warning', msg: `Canonical points to different URL: ${canonical}` });
    }
  }

  // 2. Robots Meta Tag (Noindex/Nofollow)
  const robots = $('meta[name="robots"]').attr('content');
  if (robots) {
    if (robots.includes('noindex')) {
      issues.push({ type: 'Technical', severity: 'warning', msg: "Page is set to 'noindex'" });
    }
    if (robots.includes('nofollow')) {
      issues.push({ type: 'Technical', severity: 'warning', msg: "Page is set to 'nofollow'" });
    }
  }

  // 3. Mobile Friendliness (Viewport)
  const viewport = $('meta[name="viewport"]').attr('content');
  if (!viewport) {
    issues.push({ type: 'Technical', severity: 'error', msg: "Missing Viewport Meta Tag (Mobile SEO)" });
  }

  // 4. Schema Markup (JSON-LD)
  const schema = $('script[type="application/ld+json"]').length;
  if (schema === 0) {
    issues.push({ type: 'Technical', severity: 'info', msg: "No JSON-LD Schema detected" });
  }

  // 5. Sitemap Validation (Check if current URL exists in the provided sitemap)
  if (sitemapUrls.length > 0 && !sitemapUrls.includes(pageUrl)) {
    issues.push({ type: 'Technical', severity: 'warning', msg: "Page is not listed in sitemap.xml" });
  }

  // 6. Security: Mixed Content
  if (pageUrl.startsWith('https')) {
    const insecureResources = $('img[src^="http:"], script[src^="http:"], link[href^="http:"]');
    if (insecureResources.length > 0) {
      issues.push({ type: 'Technical', severity: 'error', msg: `Mixed content: ${insecureResources.length} insecure resources detected` });
    }
  }

  return issues;
};

module.exports = { runTechnicalChecks };