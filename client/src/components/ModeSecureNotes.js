import VaultPage from "./VaultPage";
import ReactDOM from "react-dom/client";
import ModeLogin from "./ModeLogin";
import ModeCard from "./ModeCard";
import "./ModeSecureNotes.css";
import React, { useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../store/auth-context";

function ModeSecureNotes() {
  const authCtx = useContext(AuthContext);
  const inputNoteName = useRef(null);
  const inputMessage = useRef(null);
  const navigate = useNavigate();
  const [isVaultChanged, setIsVaultChanged] = useState(false);

  async function savePopup() {
    const response = await fetch("http://localhost:8080/api/user/secureNote", {
      method: "POST",
      body: JSON.stringify({
        userId: authCtx.login,
        name: inputNoteName.current.value,
        notes: inputMessage.current.value,
      }),
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + authCtx.token,
      },
    });

    const data = await response.json();
    console.log(data);

    if (!(data.status && data.status === "error")) setIsVaultChanged(true); // has to exist for every handler that changes the vault
    
    if (inputMessage !== "") {
      alert("Item successfully added");
      navigate("/vault");
    }
    else {
      alert("Pleas fill the required field");
      navigate("/vault/note");
    }
  }

  const closePopup = () => {
    navigate("/vault");
  };
  const NoteHandler = () => {
    navigate("/vault/note");
  };
  const LoginHandler = () => {
    navigate("/vault/loginInfo");
  };
  const CardHandler = () => {
    navigate("/vault/card");
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
            <p>Name</p>
            <input type="text" id="noteName" ref={inputNoteName} />
            <br />
            <p>Notes</p>
            <textarea name="message" id="message" ref={inputMessage}></textarea>
            <br />
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

export default ModeSecureNotes;
