import React from "react";
import "../styles/tools.css";

const futureTools = [
  {
    title: "Schema Generator",
    desc: "Generate JSON-LD for Medical Business & FAQ schemas.",
    status: "In Development",
    icon: "📜"
  },
  {
    title: "Sitemap Validator",
    desc: "Deep-crawl XML sitemaps to find hidden 404s.",
    status: "Q2 2026",
    icon: "🗺️"
  },
  {
    title: "Favicon Tracker",
    desc: "Monitor favicon visibility in Google Search results.",
    status: "Planned",
    icon: "🌍"
  },
  {
    title: "Keyword Tracker",
    desc: "Track local rankings for medical keywords.",
    status: "Planned",
    icon: "📈"
  }
];

export default function ComingSoon() {
  return (
    <div className="tools-container">
      <h2 className="module-title">Advanced SEO Toolbox</h2>
      <p className="module-subtitle">Additional modules being optimized for your workflow.</p>
      
      <div className="tools-grid">
        {futureTools.map((tool, index) => (
          <div key={index} className="tool-card locked">
            <div className="tool-icon">{tool.icon}</div>
            <div className="tool-badge">{tool.status}</div>
            <h3>{tool.title}</h3>
            <p>{tool.desc}</p>
            <div className="lock-overlay">
              <span>Coming Soon</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}