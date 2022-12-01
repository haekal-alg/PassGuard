import VaultPage from "./VaultPage";
import ReactDOM from "react-dom/client";
import ModeSecureNotes from "./ModeSecureNotes";
import ModeCard from "./ModeCard";
import "./ModeLogin.css";
import { useNavigate } from "react-router-dom";

function ModeLogin() {
  const navigate = useNavigate();
  
  const savePopup = () => {
    navigate("/vault");
    alert("Item successfully added");
  };
  const closePopup = () => {
    navigate("/vault");
  };
  const NoteHandler = () => {
    navigate("/note");
  };
  const LoginHandler = () => {
    navigate("/loginInfo");
  };
  const CardHandler = () => {
    navigate("/card");
  };
  return (
    <div className="body">
      <div className="topnavVault">
        <a href="#App" className="app">
          PassGuard
        </a>
      </div>
      <div className="mainPopup">
        <div className="popup">
          <div className="popup-header">Add Item</div>
          <div className="popup-body">
            <p>Type of Item</p>
            <div className="dropdownLogin">
              <button className="dropbtnLogin">Item Type</button>
              <div className="dropdown-contentLogin">
                <button onClick={NoteHandler} className="ModeNote">Secure Note</button>
                <br />
                <button onClick={LoginHandler} className="ModeLogin">Login</button>
                <br />
                <button onClick={CardHandler} className="ModeCard">Card</button>
              </div>
            </div>
            <p>TES123</p>
            <button onClick={savePopup} id="saveButton">
              Save
            </button>
            <button onClick={closePopup} id="cancelButton">
              Cancel
            </button>
          </div>
        </div>
      </div>
      <div className="bot_nav_vault">@PassGuard, inc</div>
    </div>
  );
}

export default ModeLogin;
