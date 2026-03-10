import { useState, useEffect } from "react";
import "../styles/scanner.css";
import "../styles/scanner.css";
import ReportView from "./ReportView";
import mockReport from "../data/mockReport.json"

export default function QAScanner() {
  const [mode, setMode] = useState("full");
  const [scanState, setScanState] = useState("idle");
  const [progress, setProgress] = useState(0);
  const [pagesCrawled, setPagesCrawled] = useState(0);
  const [currentTask, setCurrentTask] = useState("");

  const qaTests = ["Meta Title Length", "Meta Description Length", "H1 Validation", "Image Alt Tags", "Broken Links", "Canonical Tag", "OpenGraph Tags", "Robots Meta", "Sitemap Validation"];
  const tasks = ["Fetching sitemap", "Checking Meta Titles", "Checking Meta Descriptions", "Validating H1 Tags", "Checking Image Alt Tags", "Detecting Broken Links", "Validating Canonical Tags", "Analyzing OpenGraph Tags"];

  useEffect(() => {
  if (scanState !== "scanning") return;

  let i = 0;

  const interval = setInterval(() => {
    setProgress((prev) => {
      const next = prev + 8;
      
      if (next >= 100) {
        clearInterval(interval);
        setScanState("completed");
        return 100;
      }
      return next;
    });

    setPagesCrawled((prev) => prev + 2);
    setCurrentTask(tasks[i % tasks.length]);
    i++;
  }, 800);

  return () => clearInterval(interval);
}, [scanState]);


  return (
    <div className="scanner-container">
      <h1 className="scanner-title">Website QA Scanner</h1>
      <p className="scanner-subtitle">Run automated QA checks on your website</p>

      {/* Inputs stay visible until completed */}
      {scanState !== "completed" && (
        <>
          <input type="text" placeholder="Enter website URL (https://example.com)" className="scanner-input" />
          <div className="scanner-mode">
            <label>Scan Mode</label>
            <select value={mode} onChange={(e) => setMode(e.target.value)}>
              <option value="full">Run Full QA Scan</option>
              <option value="selected">Run Selected Tests</option>
            </select>
          </div>
          {mode === "selected" && scanState === "idle" && (
            <div className="qa-tests">
              {qaTests.map((test, index) => (
                <label key={index} className="qa-test-item">
                  <input type="checkbox" /> {test}
                </label>
              ))}
            </div>
          )}
          {scanState === "idle" && (
            <button className="scan-button" onClick={() => setScanState("scanning")}>
              Run QA Scan
            </button>
          )}
        </>
      )}

      {/* PREMIUM STATUS BOARD */}
      {(scanState === "scanning" || scanState === "completed") && (
        <div className={`qa-status-board ${scanState === "completed" ? "finished" : ""}`}>
          
          {/* Only show the status header/grid if scanning */}
          {scanState === "scanning" && (
            <>
              <div className="status-header">
                <div className="label-group">
                  <span className="label-main">System Scanning...</span>
                  <p className="task-log">{`> ${currentTask}`}</p>
                </div>
                <div className="progress-value">{progress}%</div>
              </div>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
              </div>
              <div className="status-grid">
                <div className="grid-item">
                  <span>Pages Crawled</span>
                  <p>{pagesCrawled}</p>
                </div>
                <div className="grid-item">
                  <span>Status</span>
                  <p className="status-active">In Progress</p>
                </div>
              </div>
            </>
          )}

          {/* Show ReportView ONLY when completed */}
          {scanState === "completed" && (
            <div className="report-wrapper">
              <ReportView data={mockReport} />
              <button
                className="scan-button reset-btn"
                onClick={() => {
                  setProgress(0);
                  setPagesCrawled(0);
                  setScanState("idle");
                }}
              >
                Run Another Scan
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
