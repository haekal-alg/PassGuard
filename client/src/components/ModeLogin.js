import VaultPage from "./VaultPage";
import ReactDOM from "react-dom/client";
import ModeSecureNotes from "./ModeSecureNotes";
import ModeCard from "./ModeCard";
import "./ModeLogin.css";
import { useNavigate } from "react-router-dom";
import React, { useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";

const eye = <FontAwesomeIcon icon={faEye} display={false} />;
const hibp = require("../libs/alertBreached");
var generator = require("generate-password");

function ModeLogin() {
  const navigate = useNavigate();
  const nameRef = useRef(null);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  const savePopup = () => {
    navigate("/vault");
    alert("Item successfully added");
  };
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

  const check = async () => {
    const text = passwordRef.current.value;

    if (text === "") {
      alert("Please fill the password field");
      return;
    }
    const times = await hibp.checkBreachedPassword(text);
    alert(times);
  };

  /* Generate secure random password */
  function generateSecurePassword() {
    const password = generator.generate({
      length: 14,
      numbers: true,
      uppercase: true,
      excludeSimilarCharacters: true,
    });
    passwordRef.current.value = password;
  }
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };
  return (
    <div className="bodyLg">
      <div className="topnavLogin">
        <a href="#App" className="app">
          PassGuard
        </a>
      </div>
      <div className="mainPopupLg">
        <div className="popupLg">
          <div className="popup-headerLg">Add Item</div>
          <div className="popup-bodyLg">
            <p>Type of Item</p>
            <div className="dropdownLogin">
              <button className="dropbtnLogin">Item Type</button>
              <div className="dropdown-contentLogin">
                <button onClick={NoteHandler} className="ModeNoteLg">
                  Secure Note
                </button>
                <br />
                <button onClick={LoginHandler} className="ModeLoginLg">
                  Login
                </button>
                <br />
                <button onClick={CardHandler} className="ModeCardLg">
                  Card
                </button>
              </div>
            </div>
            <div>
              <p>Name</p>
              <input type="text"></input>
            </div>
            <div>
              <p>Email</p>
              <input type="email"></input>
            </div>
            <p>Password</p>
            <div className="thirdRow">
              <input
                ref={passwordRef}
                type={passwordShown ? "text" : "password"}
              ></input>

              <i classname="eye" onClick={togglePasswordVisiblity}>
                {eye}
              </i>
              <button onClick={generateSecurePassword} id="generateButton">
                Generate
              </button>
              <button onClick={check} id="checkButton">
                Check
              </button>
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
      <div className="bot_nav_vaultLg">@PassGuard, inc</div>
    </div>
  );
}

export default ModeLogin;
