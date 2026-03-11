import scannerIcon from "../assets/icons/scanner.png";
import historyIcon from "../assets/icons/history.png";
import reportsIcon from "../assets/icons/reports.png";
import toolsIcon from "../assets/icons/tools.png";

export default function Sidebar({ active, setActive }) {

  const items = [
    { id: "scanner", label: "QA Scanner", icon: scannerIcon },
    { id: "history", label: "History", icon: historyIcon },
    { id: "reports", label: "Reports", icon: reportsIcon },
    { id: "tools", label: "Tools", icon: toolsIcon }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-inner">

        {items.map(item => (
          <div
            key={item.id}
            className={`nav-item ${active === item.id ? "active" : ""}`}
            onClick={() => setActive(item.id)}
          >
            <img src={item.icon} width="20" />
            <span className="nav-text">{item.label}</span>
          </div>
          
        ))}

      </div>
    </div>
  );
}