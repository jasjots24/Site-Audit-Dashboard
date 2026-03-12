const { runCrawl } = require('../crawler/crawlerEngine');
const { runContentChecks } = require('../checks/contentChecks');
const { runTechnicalChecks } = require('../checks/technicalChecks');
const { runImageChecks } = require('../checks/imageChecks');
const { runLinkChecks } = require('../checks/linkChecks');

/**
 * The Orchestrator:
 * Coordinates discovery (Crawl) and analysis (Checks).
 */
const performAudit = async (baseUrl) => {
  // 1. Discovery Phase
  // crawlerEngine returns the raw HTML and the full list of sitemap URLs
  const { results, sitemapUrls } = await runCrawl(baseUrl);

  // 2. Analysis Phase (Parallel processing of all pages)
  const auditTasks = results.map(async (page) => {
    // Handle pages that failed to fetch initially
    if (!page.success) {
      return {
        url: page.url,
        status: 'error',
        responseTime: 'N/A',
        issues_count: 1,
        issues: [{ type: 'System', severity: 'error', msg: `Fetch Failed: ${page.error}` }]
      };
    }

    try {
      // Execute all check modules
      // Content & Technical are synchronous (DOM analysis)
      // Images & Links are asynchronous (requires additional pings)
      const content = runContentChecks(page.html);
      const technical = runTechnicalChecks(page.html, page.url, sitemapUrls);
      const images = await runImageChecks(page.html, baseUrl);
      const links = await runLinkChecks(page.html, baseUrl);

      // Consolidate all issues into one flat array
      const allIssues = [...content, ...technical, ...images, ...links];

      // Determine page-level status
      let status = 'pass';
      if (allIssues.some(i => i.severity === 'error')) status = 'error';
      else if (allIssues.some(i => i.severity === 'warning')) status = 'warning';

      return {
        url: page.url,
        responseTime: `${page.responseTime}ms`,
        status: status,
        issues_count: allIssues.length,
        details: allIssues // Standardized for your Frontend ReportView
      };
    } catch (err) {
      console.error(`Error auditing ${page.url}:`, err);
      return {
        url: page.url,
        status: 'error',
        issues_count: 1,
        details: [{ type: 'System', severity: 'error', msg: "Internal analysis error" }]
      };
    }
  });

  // 3. Result Aggregation
  const finalReport = await Promise.all(auditTasks);
  
  return finalReport;
};

module.exports = { performAudit };