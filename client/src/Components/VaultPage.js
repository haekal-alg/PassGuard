import "./VaultPage.css";

function VaultPage() {
  return (
    <body>
      <div className="topnav">
        <a href="#App" className="app">
          PassGuard
        </a>
        <div className="menu">
          <a href="#Vault" className="vault">
            Vault
          </a>
          <a href="#Generate" className="generate">
            Generate
          </a>
          <a href="#Report" className="report">
            Report
          </a>
        </div>
      </div>
      <div className="mode">
      </div>
      <div className="detail">
      </div>
      <div className="bot_nav">
        <p>@PassGuard, inc</p>
      </div>
    </body>
  );
}

export default VaultPage;
