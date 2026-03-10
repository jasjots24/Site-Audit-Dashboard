export default function Topbar({ module, setTheme }) {

  const titles = {
    scanner: "QA Scanner",
    history: "Scan History",
    reports: "Reports",
    tools: "Tools"
  };

  return (
    <div className="topbar">

      <div style={{flex:1}}>
        
        {titles[module]}
      </div>

      <select onChange={(e)=>setTheme(e.target.value)}>
        <option value="theme-dark">Dark</option>
        <option value="theme-light">Light</option>
        <option value="theme-gradient">Gradient</option>
      </select>

    </div>
  );
}