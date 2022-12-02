import VaultPage from "./VaultPage";
import ReactDOM from "react-dom/client";
import ModeSecureNotes from "./ModeSecureNotes";
import ModeLogin from "./ModeLogin";
import "./ModeCard.css";
import { useNavigate } from "react-router-dom";

function ModeCard() {
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
            <div className="dropdownCard">
              <button className="dropbtnCard">Item Type</button>
              <div className="dropdown-contentCard">
                <button onClick={NoteHandler} className="ModeNote">
                  Secure Note
                </button>
                <br />
                <button onClick={LoginHandler} className="ModeLogin">
                  Login
                </button>
                <br />
                <button onClick={CardHandler} className="ModeCard">
                  Card
                </button>
              </div>
            </div>
            <div className="firstRow">
              <p>Name</p>
              <p>Cardholder name</p>
            </div>
            <div className="secondRow">
              <input type="text"></input>
              <input type="text"></input>
            </div>
            <div className="thirdRow">
              <p>Card Number</p>
              <p>Brand</p>
            </div>
            <div className="fourthRow">
              <input type="text"></input>
              <input type="text"></input>
            </div>
            <div className="fifthRow">
              <p>Expiration Date</p>
            </div>
            <div className="sixthRow">
              <input type="text"></input>
            </div>
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

export default ModeCard;
