import React, { useState } from "react";
import "../styles/report.css";

export default function ReportView({ data }) {
  const [selectedPage, setSelectedPage] = useState(null);

  // 1. Safety check must come before any logic
  if (!data) return <p className="no-data">No report data available.</p>;

  // 2. Helper function for sharing
  const copyShareLink = (id) => {
    const shareUrl = `https://qa-dashboard.io/share/${id}`;
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert("Unique share link copied to clipboard!");
    });
  };

  return (
    <div className="report-container">
      
      {/* 3. THE ACTIONS BAR (Moved to the top) */}
      <div className="report-actions-bar">
        <div className="report-info">
          <span className="report-id-badge">ID: {data.reportId || data.id || 'TEMP_ID'}</span>
          <span className="report-timestamp"> Scanner On - {new Date(data.scan_date).toLocaleDateString()}</span>
        </div>
        
        <div className="action-buttons">
          <button className="action-btn share" onClick={() => copyShareLink(data.reportId || data.id)}>
            Share Report
          </button>
          <button className="action-btn download" onClick={() => window.print()}>
            Export PDF
          </button>
        </div>
      </div>

      {/* 4. SUMMARY CARDS */}
      <div className="summary-grid">
        <div className="summary-card pass">
          <span>Passed Checks</span>
          <h3>{data.summary.pass}</h3>
        </div>
        <div className="summary-card warning">
          <span>Warnings</span>
          <h3>{data.summary.warning}</h3>
        </div>
        <div className="summary-card error">
          <span>Critical Errors</span>
          <h3>{data.summary.error}</h3>
        </div>
      </div>

      {/* 5. DETAILS TABLE */}
      <div className="report-table-wrapper">
        <table className="report-table">
          <thead>
            <tr>
              <th>Page URL</th>
              <th>Status</th>
              <th>Issues</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {data.pages && data.pages.map((page, index) => (
              <tr key={index} className="table-row">
                <td className="url-cell">{page.url}</td>
                <td>
                  <span className={`status-pill ${page.status}`}>
                    {page.status.toUpperCase()}
                  </span>
                </td>
                <td>{page.issues_count} issues</td>
                <td>
                  <button className="view-btn" onClick={() => setSelectedPage(page)}>
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 6. SIDE DRAWER FOR PAGE DETAILS */}
      {selectedPage && (
        <div className="side-drawer-overlay" onClick={() => setSelectedPage(null)}>
          <div className="side-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <h3>Page Details</h3>
              <button onClick={() => setSelectedPage(null)}>✕</button>
            </div>
            <div className="drawer-content">
              <p className="drawer-url">{selectedPage.url}</p>
              <hr className="divider" />
              {selectedPage.details && selectedPage.details.length > 0 ? (
                selectedPage.details.map((issue, idx) => (
                  <div key={idx} className={`issue-item ${issue.status}`}>
                    <strong>{issue.type.replace("_", " ")}</strong>
                    <p>{issue.msg}</p>
                  </div>
                ))
              ) : (
                <p className="no-issues">No issues found for this page! 🎉</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}