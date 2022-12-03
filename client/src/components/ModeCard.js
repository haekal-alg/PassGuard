// import VaultPage from "./VaultPage";
import ReactDOM from "react-dom/client";
// import ModeSecureNotes from "./ModeSecureNotes";
// import ModeLogin from "./ModeLogin";
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
    <div className="bodyCd">
      <div className="topnavNote">
        <a href="#App" className="appCd">
          PassGuard
        </a>
      </div>
      <div className="mainPopupCd">
        <div className="popupCd">
          <div className="popup-headerCd">Add Item</div>
          <div className="popup-bodyCd">
            <p>Type of Item</p>
            <div className="dropdownCardCd">
              <button className="dropbtnCardCd">Item Type</button>
              <div className="dropdown-contentCardCd">
                <button onClick={NoteHandler} className="ModeNoteCd">
                  Secure Note
                </button>
                <br />
                <button onClick={LoginHandler} className="ModeLoginCd">
                  Login
                </button>
                <br />
                <button onClick={CardHandler} className="ModeCardCd">
                  Card
                </button>
              </div>
            </div>
            <div className="firstRow">
              <p>Name</p>
              <p className="CardNumbertxt">Cardholder name</p>
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
            <button onClick={savePopup} id="saveButtonCd">
              Save
            </button>
            <button onClick={closePopup} id="cancelButtonCd">
              Cancel
            </button>
          </div>
        </div>
      </div>
      <div className="bot_nav_vaultCd">@PassGuard, inc</div>
    </div>
  );
}

export default ModeCard;
