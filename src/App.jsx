import { useState } from "react";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";

import QAScanner from "./modules/QAScanner";
import History from "./modules/History";
import ReportView from "./modules/ReportView";
import ComingSoon from "./modules/ComingSoon";

import "./styles/variables.css";
import "./styles/layout.css";

export default function App() {
  const [active, setActive] = useState("scanner");
  const [theme, setTheme] = useState("theme-dark"); // "theme-dark", "theme-light", or "theme-gradient"

  const renderModule = () => {
    switch (active) {
      case "scanner":
        return <QAScanner />;
      case "history":
        return <History />;
      case "reports":
        return <ReportView />;
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