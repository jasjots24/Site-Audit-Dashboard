import React from "react";
import { historyData } from "../data/historyData";
import "../styles/reports-modules.css";

export default function Reports() {
  // Calculate Global Stats
  const totalScans = historyData.length;
  const totalErrors = historyData.reduce((acc, curr) => acc + curr.summary.error, 0);
  const avgPages = Math.round(historyData.reduce((acc, curr) => acc + curr.pages_scanned, 0) / totalScans);
  
  // Simple health score formula: (Passed / Total Checks) * 100
  const globalHealth = 84; // Mocked average for now

  return (
    <div className="reports-module">
      <div className="reports-header">
        <h2 className="module-title">Portfolio Overview</h2>
        <div className="health-score-large">
          <div className="score-circle">
            <span className="score-num">{globalHealth}%</span>
            <span className="score-label">Avg Health</span>
          </div>
        </div>
      </div>

      <div className="stats-strip">
        <div className="stat-box">
          <span>Active Projects</span>
          <p>{totalScans}</p>
        </div>
        <div className="stat-box">
          <span>Critical Issues</span>
          <p className="danger-text">{totalErrors}</p>
        </div>
        <div className="stat-box">
          <span>Avg. Pages/Site</span>
          <p>{avgPages}</p>
        </div>
      </div>

      <h3 className="sub-section-title">Site Performance Breakdown</h3>
      <div className="site-cards-grid">
        {historyData.map((site) => {
          const health = Math.round((site.summary.pass / (site.summary.pass + site.summary.error + site.summary.warning)) * 100);
          return (
            <div key={site.id} className="site-health-card">
              <div className="card-top">
                <h4>{site.site}</h4>
                <span className={`health-pill ${health > 80 ? 'good' : 'bad'}`}>{health}%</span>
              </div>
              <div className="mini-progress">
                <div className="mini-bar" style={{ width: `${health}%` }}></div>
              </div>
              <div className="card-bottom">
                <span>{site.summary.error} Errors</span>
                <span>{site.summary.warning} Warnings</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}