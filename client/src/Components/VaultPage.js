import "./VaultPage.css";

function VaultPage() {
  return (
    <body>
      <div className="topnavVault">
        <a href="#App" className="app">
          PassGuard
        </a>
        <div className="menuVault">
          <a href="#Vault" id="vault" className="active">
            Vault
          </a>
          <a href="#Generate" id="generate">
            Generate
          </a>
          <a href="#Report" id="report">
            Report
          </a>
        </div>
      </div>
      <p id="vaultItems">Vault Items</p>
      <input type="button" value="+ Add Item" id="addItems" />
      <div className="mode">
        <p id="all">All Items</p>
        <br />
        <p id="loginItems">Login</p>
        <br />
        <p id="cardItems">Cards</p>
        <br />
        <p id="secureNotesItems">Secure Notes</p>
        <br />
      </div>
      <div className="detail">
      </div>
      <div className="bot_nav_vault">@PassGuard, inc</div>
    </body>
  );
}

export default VaultPage;
