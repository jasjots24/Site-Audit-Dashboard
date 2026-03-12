const buildFinalReport = (siteUrl, pageResults) => {
  const summary = {
    total_pages: pageResults.length,
    pass: 0,
    warning: 0,
    error: 0,
    total_issues: 0,
    critical_fixes: []
  };

  pageResults.forEach(page => {
    // Increment counters safely
    summary[page.status || 'error']++;
    
    // Use optional chaining and default to empty array
    const issues = page.details || page.issues || [];
    summary.total_issues += issues.length;

    if (page.status === 'error') {
      issues.forEach(issue => {
        if (issue.severity === 'error' && summary.critical_fixes.length < 5) {
          summary.critical_fixes.push({
            url: page.url,
            issue: issue.msg
          });
        }
      });
    }
  });

  // Calculate SEO Score
  let score = 100 - (summary.error * 5) - (summary.warning * 2);
  summary.seo_score = Math.max(score, 0);

  return {
    reportId: "rep_" + Math.random().toString(36).substr(2, 9),
    site: siteUrl,
    scan_date: new Date().toISOString(),
    summary: summary,
    pages: pageResults
  };
};

module.exports = { buildFinalReport };