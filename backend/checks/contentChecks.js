const cheerio = require('cheerio');

const runContentChecks = (html) => {
  const $ = cheerio.load(html);
  const issues = [];

  // 1. Meta Title Presence
  const titleTag = $('title');
  const titleText = titleTag.text().trim();
  if (!titleText) {
    issues.push({ type: 'Content', severity: 'error', msg: "Missing Meta Title" });
  } else {
    // 2. Title Length
    if (titleText.length < 30) issues.push({ type: 'Content', severity: 'warning', msg: `Title is too short (${titleText.length} chars)` });
    if (titleText.length > 65) issues.push({ type: 'Content', severity: 'warning', msg: `Title is too long (${titleText.length} chars)` });
  }

  // 3. Meta Description
  const metaDesc = $('meta[name="description"]').attr('content');
  if (!metaDesc) {
    issues.push({ type: 'Content', severity: 'error', msg: "Missing Meta Description" });
  } else {
    // 4. Description Length
    if (metaDesc.length < 120) issues.push({ type: 'Content', severity: 'warning', msg: "Description is too short" });
    if (metaDesc.length > 320) issues.push({ type: 'Content', severity: 'warning', msg: "Description is too long" });
  }

  // 5. H1 Tag Checks
  const h1s = $('h1');
  if (h1s.length === 0) issues.push({ type: 'Content', severity: 'error', msg: "Missing H1 Tag" });
  if (h1s.length > 1) issues.push({ type: 'Content', severity: 'warning', msg: `Multiple H1 tags found (${h1s.length})` });

  // 6. Low Word Count
  const bodyText = $('body').text().replace(/\s+/g, ' ').trim();
  const wordCount = bodyText.split(' ').length;
  if (wordCount < 300) issues.push({ type: 'Content', severity: 'warning', msg: `Low word count (${wordCount} words)` });

  return issues;
};

module.exports = { runContentChecks };