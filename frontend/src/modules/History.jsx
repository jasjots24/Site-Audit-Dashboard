import React, { useState, useEffect } from "react";
import { historyData } from "../data/historyData";
import ReportView from "./ReportView";
import "../styles/history.css";

export default function History() {
  const [selectedReport, setSelectedReport] = useState(() => {
  const saved = localStorage.getItem("selectedReport");
  return saved ? JSON.parse(saved) : null;
});

useEffect(() => {
  if (selectedReport) {
    localStorage.setItem("selectedReport", JSON.stringify(selectedReport));
  } else {
    localStorage.removeItem("selectedReport");
  }
}, [selectedReport]);

  // IF A REPORT IS SELECTED, SHOW THE REPORTVIEW
  if (selectedReport) {
    return (
      <div className="history-detail-view">
        <header className="detail-header">
          <button className="back-btn" onClick={() => setSelectedReport(null)}>
            ← Back to History
          </button>
          <div className="report-meta">
            <span className="hash-id">HASH: {selectedReport.reportId || selectedReport.id}</span>
          </div>
        </header>
        
        {/* We pass the selected data into our existing ReportView */}
        <ReportView data={selectedReport} />
      </div>
    );
  }

  // OTHERWISE, SHOW THE TABLE
  return (
    <div className="history-container">
      <h2 className="module-title">Scan History</h2>
      <div className="history-table-wrapper">
        <table className="history-table">
          <thead>
            <tr>
              <th>Website</th>
              <th>Date</th>
              <th>Pages</th>
              <th>Errors</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {historyData.map((scan) => (
              <tr key={scan.id}>
                <td className="site-url">{scan.site}</td>
                <td>{scan.scan_date}</td>
                <td>{scan.pages_scanned}</td>
                <td>
                  <span className="error-pill">{scan.summary.error} Errors</span>
                </td>
                <td>
                  <span className="status-indicator">Verified</span>
                </td>
                <td>
                  <button 
                    className="view-btn" 
                    onClick={() => setSelectedReport(scan)}
                  >
                    View Report
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}