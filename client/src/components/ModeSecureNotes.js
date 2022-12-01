import VaultPage from "./VaultPage";
import ReactDOM from "react-dom/client";
import ModeLogin from "./ModeLogin";
import ModeCard from "./ModeCard";
import "./ModeSecureNotes.css"

function ModeSecureNotes() {
  const root = ReactDOM.createRoot(document.getElementById("root"));
  const closePopup = () => {
    root.render(<VaultPage />);
  };
  const NoteHandler = () => {
    root.render(<ModeSecureNotes />);
  };
  const LoginHandler = () => {
    root.render(<ModeLogin />);
  };
  const CardHandler = () => {
    root.render(<ModeCard />);
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
            <div className="dropdownNote">
              <button className="dropbtnNote">Item Type</button>
              <div className="dropdown-contentNote">
                <button onClick={NoteHandler} className="ModeNote">Secure Note</button>
                <br />
                <button onClick={LoginHandler} className="ModeLogin">Login</button>
                <br />
                <button onClick={CardHandler} className="ModeCard">Card</button>
              </div>
            </div>
            <p>Name</p>
            <input type="text" id="noteName" />
            <br />
            <p>Notes</p>
            <textarea name="message" id="message"></textarea>
            <br />
            <button onClick={closePopup} id="saveButton">
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

export default ModeSecureNotes;
