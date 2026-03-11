const axios = require('axios');
const cheerio = require('cheerio');

const runQA = async (url) => {
  try {
    // 1. Fetch the HTML from the URL
    const { data } = await axios.get(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (QA-Dashboard-Bot/1.0)' }
    });

    // 2. Load it into Cheerio
    const $ = cheerio.load(data);

    // 3. Extract the SEO data
    const pageData = {
      url: url,
      title: $('title').text() || "Missing Title",
      h1: $('h1').first().text() || "Missing H1",
      metaDescription: $('meta[name="description"]').attr('content') || "Missing Description",
      images: $('img').length,
      images_no_alt: $('img:not([alt])').length,
      status: "pass"
    };

    // 4. Basic Validation Logic
    if (pageData.title.length > 60 || pageData.title === "Missing Title") pageData.status = "warning";
    if (pageData.h1 === "Missing H1") pageData.status = "error";

    return pageData;

  } catch (error) {
    console.error("Crawl Error:", error.message);
    return { error: "Could not reach the website. Check the URL and try again." };
  }
};

module.exports = { runQA };