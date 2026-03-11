import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

import QAScanner from "./modules/QAScanner";
import History from "./modules/History";
import ReportView from "./modules/ReportView";
import ComingSoon from "./modules/ComingSoon";
import Reports from "./modules/Reports";

import "./styles/variables.css";
import "./styles/layout.css";

export default function App() {

  // Initialize 'active' from localStorage, or default to 'scanner'
  const [active, setActive] = useState(() => {
    return localStorage.getItem("dashboardTab") || "scanner";
  });

  const [theme, setTheme] = useState("theme-dark");

  // Whenever 'active' changes, save it to localStorage
  useEffect(() => {
    localStorage.setItem("dashboardTab", active);
  }, [active]);
  const renderModule = () => {
    switch (active) {
      case "scanner":
        return <QAScanner />;
      case "history":
        return <History />;
      case "reports": 
        return <Reports />; 
      default:
        return <ComingSoon />;
    }
  };

  return (
    // Apply the theme class to the dashboard container
    <div className={`dashboard ${theme}`}>
      <Sidebar active={active} setActive={setActive} />

      <div className="workspace">
        <Topbar module={active} setTheme={setTheme} />

        {/* The content area handles internal scrolling */}
        <div className="content">
          {renderModule()}
        </div>
      </div>
    </div>
  );
}