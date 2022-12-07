import VaultPage from "./VaultPage";
import ReactDOM from "react-dom/client";
import ModeSecureNotes from "./ModeSecureNotes";
import ModeCard from "./ModeCard";
import "./ModeLogin.css";
import { useNavigate } from "react-router-dom";
import React, { useRef, useState, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import AuthContext from "../store/auth-context";

const eye = <FontAwesomeIcon icon={faEye} display={false} />;
const hibp = require("../libs/alertBreached");
var generator = require("generate-password");

function ModeLogin() {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const inputLoginName = useRef(null);
  const inputLoginEmail = useRef(null);
  const inputLoginPassword = useRef(null);
  const [isVaultChanged, setIsVaultChanged] = useState(false);

  async function savePopup() {
    const response = await fetch("http://localhost:8080/api/user/loginInfo", {
      method: "POST",
      body: JSON.stringify({
        userId: authCtx.login,
        name: inputLoginName.current.value,
        username: inputLoginEmail.current.value,
        password: inputLoginPassword.current.value,
      }),
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + authCtx.token,
      },
    });

    const data = await response.json();

    if (!(data.status && data.status === "error")) setIsVaultChanged(true); // has to exist for every handler that changes the vault

    if (inputLoginName !== "") {
      alert("Item successfully added");
      navigate("/vault");
    } else {
      alert("Pleas fill the required field");
      navigate("/vault/login");
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

  const check = async () => {
    const text = inputLoginPassword.current.value;

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
    inputLoginPassword.current.value = password;
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
              <input type="text" id="loginName" ref={inputLoginName}></input>
            </div>
            <div>
              <p>Email</p>
              <input type="email" id="loginEmail" ref={inputLoginEmail}></input>
            </div>
            <p>Password</p>
            <div className="thirdRow">
              <input
                id="loginPassword"
                ref={inputLoginPassword}
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
