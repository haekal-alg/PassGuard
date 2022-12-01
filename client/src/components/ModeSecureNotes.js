import VaultPage from "./VaultPage";
import ReactDOM from "react-dom/client";
import ModeLogin from "./ModeLogin";
import ModeCard from "./ModeCard";
import "./ModeSecureNotes.css"
import React, { useRef, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

function ModeSecureNotes() {
  const inputNoteName = useRef(null);
	const inputMessage = useRef(null);
  const navigate = useNavigate();

  async function savePopup() {
    /* Send data to server */
		// const response = await fetch("http://localhost:8080/api/secureNote", {
		// 	method: "POST",
		// 	body: JSON.stringify({
		// 		name: inputNoteName,
		// 		notes: inputMessage,
		// 	}),
		// 	headers: { "Content-type": "application/json" },
		// });
    // const data = await response.json();
    // if (data.status === "success") {
		// 	authCtx.login(data.idToken, data.expirationTime);
		// 	//authCtx.login(data.idToken, new Date(Date.now() + 3000));
		// 	navigate("/vault"); /* FOR TESTING ONLY. Real value is /vault */
		// } else if (data.status === "error") {
		// 	toast.error(data.message);
		// }

    alert("Item successfully added");
    navigate("/vault");
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
