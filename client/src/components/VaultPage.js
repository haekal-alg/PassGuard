import React, { useContext } from "react";
import "./VaultPage.css";
import ModeSecureNotes from "./ModeSecureNotes";
import ReactDOM from "react-dom/client";
import AuthContext from '../store/auth-context';

function VaultPage() {
  const authCtx = useContext(AuthContext);

  const handleClickOpen = () => {
    const root = ReactDOM.createRoot(document.getElementById("root"));
    root.render(<ModeSecureNotes />);
  };
  
  const logoutHandler = () => {
    authCtx.logout();
  };

  return (
    <div className="body">
      <div className="topnavVault">
        <a href="/" className="app">
          PassGuard
        </a>
        <div className="topnav-rightVault">
          <button onClick={logoutHandler} className="logout">Logout</button>
				</div>
      </div>
      <p id="vaultItems">Vault Items</p>
      <button onClick={handleClickOpen} id="addItems">
        + Add Items
      </button>
      <div>
        
      </div>

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
      <div className="detail"></div>
      <div className="bot_nav_vault">@PassGuard, inc</div>
    </div>
  );
}

export default VaultPage;
