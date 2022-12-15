import React, { useRef, useContext, useEffect, useState } from "react";
import "./NewVault.css";
// import ModeSecureNotes from "./ModeSecureNotes";
// import ReactDOM from "react-dom/client";
import AuthContext from "store/auth-context";
import { useNavigate } from "react-router-dom";
import Popup from "reactjs-popup";

// to show vault item dynamically
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import LoginIcon from "@mui/icons-material/Login";
import { orange } from "@mui/material/colors";
import NoteIcon from "@mui/icons-material/Note";

const cipher = require("libs/cipher");
const hibp = require("libs/alertBreached");
var generator = require("generate-password");

function NewVault() {
  const authCtx = useContext(AuthContext);
  const [isVaultChanged, setIsVaultChanged] = useState(false);
  const [globalSymkey] = useState(localStorage.getItem("symkey"));
  const navigate = useNavigate();

  const nameRef = useRef(null);
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);

  const nameNoteRef = useRef(null);
  const messageNoteRef = useRef(null);

  const newNoteName = useRef(null);
  const newNoteMessage = useRef(null);

  const newLoginName = useRef(null);
  const newUsername = useRef(null);
  const newPassword = useRef(null);

  const tempNameLogin = [];
  const tempUsernameLogin = [];
  const tempPasswordLogin = [];
  const tempNameNote = [];
  const tempMessageNote = [];

  // state
  const [isShow, setisShow] = useState(false);
  const [isNote, setisNote] = useState(false);
  const [isEditLogin, setIsEditLogin] = useState(false);
  const [isEditNote, setIsEditNote] = useState(false);
  const [inputText, setInputText] = useState("");
  const [indexEditNote, setIndexEditNote] = useState(0);
  const [indexEditLogin, setIndexEditLogin] = useState(0);

  console.log(indexEditNote);
  console.log(indexEditLogin);

  const logoutHandler = () => {
    authCtx.logout();
  };

  useEffect(() => {
    /* [TODO] add validation. if error occured do not sync */
    async function syncVault() {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/sync`,
        {
          headers: { Authorization: "Bearer " + authCtx.token },
        }
      );
      const data = await response.json();
      //console.log("syncvault() => ", data)

      // store user data in memory
      authCtx.sync(data);
      authCtx.dataNameLoginSync(tempNameLogin);
      authCtx.dataUsernameLoginSync(tempUsernameLogin);
      authCtx.dataPasswordLoginSync(tempPasswordLogin);
      authCtx.dataNameNoteSync(tempNameNote);
      authCtx.dataMessageNoteSync(tempMessageNote);

      setIsVaultChanged(false);

      return data;
    }

    async function parseData() {
      let symkey;
      const data = await syncVault();

      const iv = Buffer.from(data.profile.iv, "base64");

      // Get the master key by decrypting protected master key
      // This condition is only true only when user first logged in
      if (!(authCtx.masterKey === null)) {
        const protectedSymmKey = Buffer.from(
          data.profile.protectedKey,
          "base64"
        );
        const masterKey = authCtx.masterKey;

        symkey = cipher.aes256Decrypt(iv, protectedSymmKey, masterKey);
        symkey = Buffer.from(symkey).toString("base64");

        authCtx.save(symkey); // save to local
      }

      // Parse encrypted user data
      symkey = Buffer.from(globalSymkey, "base64");

      data.loginData.forEach(function (item) {
        const itemName = Buffer.from(item.name, "base64");
        const itemPassword = Buffer.from(item.password, "base64");
        const itemUsername = Buffer.from(item.username, "base64");
        const decryptedName = cipher
          .aes256Decrypt(iv, itemName, symkey)
          .toString();
        const decryptedPassword = cipher
          .aes256Decrypt(iv, itemPassword, symkey)
          .toString();
        const decryptedUsername = cipher
          .aes256Decrypt(iv, itemUsername, symkey)
          .toString();
        tempNameLogin.push(decryptedName);
        tempUsernameLogin.push(decryptedUsername);
        tempPasswordLogin.push(decryptedPassword);
      });

      data.noteData.forEach(function (item) {
        const itemNoteName = Buffer.from(item.name, "base64");
        const itemNoteMessage = Buffer.from(item.notes, "base64");
        const decryptedNoteName = cipher
          .aes256Decrypt(iv, itemNoteName, symkey)
          .toString();
        const decryptedNoteMessage = cipher
          .aes256Decrypt(iv, itemNoteMessage, symkey)
          .toString();
        tempNameNote.push(decryptedNoteName);
        tempMessageNote.push(decryptedNoteMessage);
      });
    }

    parseData();
  }, [isVaultChanged]);

  console.log(authCtx.vault);
  console.log(authCtx.nameLoginVault);
  console.log(authCtx.messageNoteVault);

  // Mengedit Item Vault
  async function editLogin(item) {
    if ( newLoginName !== "" && newUsername !== "" && newPassword !== "" ) {
      const symkey = Buffer.from(globalSymkey, "base64");
      const iv = Buffer.from(authCtx.vault.profile.iv, "base64");

      const encryptedNewLoginName = cipher.aes256Encrypt(iv, newLoginName.current.value, symkey); // encrypt
      newLoginName = Buffer.from(encryptedNewLoginName).toString("base64"); // encode with base64

      const encryptedNewLoginUsername = cipher.aes256Encrypt(iv, newUsername.current.value, symkey); // encrypt
      newUsername = Buffer.from(encryptedNewLoginUsername).toString("base64"); // encode with base64

      const encryptedNewLoginPassword = cipher.aes256Encrypt(iv, newPassword.current.value, symkey); // encrypt
      newPassword = Buffer.from(encryptedNewLoginPassword).toString("base64"); // encode with base64
      
      console.log(newLoginName);

      // send data to server to update data
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/user/loginInfo?loginInfoId=${item.loginInfoId}&name=${newLoginName}&username=${newUsername}&password=${newPassword}`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
            Authorization: "Bearer " + authCtx.token,
          },
        }
      );

      const data = await response.json();
      if (!(data.status && data.status === "error")) setIsVaultChanged(true);

      alert("Item successfully Edited");
    } else {
      alert("Please fill the required field");
    }
  }

  async function editNote(item) {
    if ( newNoteName !== "" && newNoteMessage !== "" ) {
      const symkey = Buffer.from(globalSymkey, "base64");
      const iv = Buffer.from(authCtx.vault.profile.iv, "base64");

      const encryptedNewNoteName = cipher.aes256Encrypt(iv, newNoteName.current.value, symkey); // encrypt
      newNoteName = Buffer.from(encryptedNewNoteName).toString("base64"); // encode with base64

      const encryptedNewNoteMessage = cipher.aes256Encrypt(iv, newNoteMessage.current.value, symkey); // encrypt
      newNoteMessage = Buffer.from(encryptedNewNoteMessage).toString("base64"); // encode with base64
      console.log(item.secureNoteId);
      
      // send data to server to update data
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/user/secureNote?secureNoteId=${item.secureNoteId}&name=${newNoteName}&notes=${newNoteMessage}`,
        {
          method: "PATCH",
          headers: {
            "Content-type": "application/json",
            Authorization: "Bearer " + authCtx.token,
          },
        }
      );

      const data = await response.json();

      if (!(data.status && data.status === "error")) setIsVaultChanged(true);
      alert("Item successfully Edited");
    } else {
      alert("Please fill the required field");
    }
  }

  // Menampilkan Item Vault
  function displayLogin(item, index) {
    return (
      <>
        <li
          key={authCtx.vault.loginData[index].loginInfoId}
          className="item-list"
        >
          <LoginIcon sx={{ color: orange[800] }} fontSize="small" />
          <div className="list-content">
            <button className="website" onClick={() => editLoginHandler(index)}>
              {item}
            </button>
          </div>
          <button type="button" className="del-btn" testid="delete">
            <img
              src="https://assets.ccbp.in/frontend/react-js/password-manager-delete-img.png"
              className="del-image"
              alt="delete"
              onClick={() => deleteLogin(authCtx.vault.loginData[index])}
            />
          </button>
        </li>
      </>
    );
  }

  function displayNote(item, index) {
    return (
      <>
        <li
          key={authCtx.vault.noteData[index].secureNoteId}
          className="item-list"
        >
          <NoteIcon sx={{ color: orange[800] }} fontSize="small" />
          <div className="list-content">
            <button className="website" onClick={() => editNoteHandler(index)}>
              {item}
            </button>
          </div>
          <button type="button" className="del-btn" testid="delete">
            <img
              src="https://assets.ccbp.in/frontend/react-js/password-manager-delete-img.png"
              className="del-image"
              alt="delete"
              onClick={() => deleteNote(authCtx.vault.noteData[index])}
            />
          </button>
        </li>
      </>
    );
  }

  // Delete Item Vault
  async function deleteNote(item) {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/user/secureNote?secureNoteId=${item.secureNoteId}`,
      {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + authCtx.token,
        },
      }
    );

    const data = await response.json();
    if (!(data.status && data.status === "error")) setIsVaultChanged(true); // has to exist for every handler that changes the vault
  }

  async function deleteLogin(item) {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/user/loginInfo?loginInfoId=${item.loginInfoId}`,
      {
        method: "DELETE",
        headers: {
          "Content-type": "application/json",
          Authorization: "Bearer " + authCtx.token,
        },
      }
    );

    const data = await response.json();
    if (!(data.status && data.status === "error")) setIsVaultChanged(true); // has to exist for every handler that changes the vault
  }

  // return a json object with all its values encrypted
  async function userDataEncryptionHandler(userData) {
    const symkey = Buffer.from(globalSymkey, "base64");
    const iv = Buffer.from(authCtx.vault.profile.iv, "base64");

    for (let key in userData) {
      const encrypted = cipher.aes256Encrypt(iv, userData[key], symkey); // encrypt
      userData[key] = Buffer.from(encrypted).toString("base64"); // encode with base64
    }

    return userData;
  }

  /* Check for breached password */
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
  const generateSecurePassword = () => {
    const password = generator.generate({
      length: 14,
      numbers: true,
      uppercase: true,
      excludeSimilarCharacters: true,
    });
    passwordRef.current.value = password;
  };

  // Add Item Vault
  async function addLogin() {
    if (nameRef !== "" && usernameRef !== "" && passwordRef !== "") {
      let userData = {
        name: nameRef.current.value,
        username: usernameRef.current.value,
        password: passwordRef.current.value,
      };

      userData = await userDataEncryptionHandler(userData);
      console.log(userData);

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/user/loginInfo`,
        {
          method: "POST",
          body: JSON.stringify(userData),
          headers: {
            "Content-type": "application/json",
            Authorization: "Bearer " + authCtx.token,
          },
        }
      );

      const data = await response.json();
      console.log(data);

      alert("Item successfully added");
      if (!(data.status && data.status === "error")) {
        setIsVaultChanged(true);
      }
    } else {
      alert("Please fill the required field");
    }
  }

  async function addNote() {
    if (
      nameNoteRef.current.value !== "" &&
      messageNoteRef.current.value !== ""
    ) {
      let userData = {
        name: nameNoteRef.current.value,
        notes: messageNoteRef.current.value,
      };

      userData = await userDataEncryptionHandler(userData);
      console.log(userData);

      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/user/secureNote`,
        {
          method: "POST",
          body: JSON.stringify(userData),
          headers: {
            "Content-type": "application/json",
            Authorization: "Bearer " + authCtx.token,
          },
        }
      );

      const data = await response.json();
      console.log(data);

      if (!(data.status && data.status === "error")) {
        setIsVaultChanged(true);
      }
      alert("Item successfully added");
    } else {
      alert("Please fill the required field");
    }
  }

  // conditional rendering
  const noteHandler = () => {
    setisNote(true);
    setIsEditLogin(false);
  };
  const loginHandler = () => {
    setisNote(false);
    setIsEditNote(false);
  };
  const editLoginHandler = (index) => {
    setIsEditLogin(true);
    setIndexEditLogin(index);
  };
  const editNoteHandler = (index) => {
    setIsEditNote(true);
    setIndexEditNote(index);
  };

  // Toogle Password Visibility
  const [passwordShown, setPasswordShown] = useState(false);

  // Password toggle handler
  const togglePassword = () => {
    setPasswordShown(!passwordShown);
  };

  // yang akan ditampilkan di browser
  return (
    <div className="main-container">
      {authCtx.vault && (
        <>
          <div className="navbar">
            <img src="./PG_logo.png" className="app-logo" alt="app logo" />
            <button className="logoutButtonVault" onClick={logoutHandler}>logout</button>
          </div>
          {!isNote && (
            <>
              <div className="sub-div1">
                {!isEditLogin && (
                  <>
                    <form className="add-details">
                      <h1 className="detail-heading">Add New Login Info</h1>
                      <div className="input-holder">
                        <img
                          src="https://assets.ccbp.in/frontend/react-js/password-manager-website-img.png"
                          className="input-image"
                          alt="website"
                        />
                        <input
                          type="text"
                          className="input-element"
                          placeholder="Enter Website Name"
                          ref={nameRef}
                        />
                      </div>

                      <div className="input-holder">
                        <img
                          src="https://assets.ccbp.in/frontend/react-js/password-manager-username-img.png"
                          className="input-image"
                          alt="username"
                        />
                        <input
                          type="text"
                          className="input-element"
                          placeholder="Enter Username"
                          ref={usernameRef}
                        />
                      </div>
                      <div className="input-holder">
                        <img
                          src="https://assets.ccbp.in/frontend/react-js/password-manager-password-img.png"
                          className="input-image"
                          alt="password"
                        />
                        <input
                          type={passwordShown ? "text" : "password"}
                          className="input-element"
                          placeholder="Enter Password"
                          ref={passwordRef}
                        />
                        <input type="button" value="show password" className="toggle-button" onClick={() => togglePassword()} />
                      </div>
                      <div className="button">
                        <input
                          type="button"
                          value="Alert Breached"
                          onClick={check}
                          className="check-btn"
                        />
                        <input
                          type="button"
                          value="Generate Password"
                          onClick={() => generateSecurePassword()}
                          className="generate-btn"
                        />
                        <input
                          type="button"
                          value="Add"
                          className="add-btn"
                          onClick={addLogin}
                        />
                      </div>
                    </form>
                    <img
                      src="https://assets.ccbp.in/frontend/react-js/password-manager-lg-img.png"
                      className="sub-div1-image1"
                      alt="password manager"
                    />
                  </>
                )}
                {isEditLogin && (
                  <>
                    <form className="add-details">
                      <h1 className="detail-heading">Edit Login Info</h1>
                      <div className="input-holder">
                        <img
                          src="https://assets.ccbp.in/frontend/react-js/password-manager-website-img.png"
                          className="input-image"
                          alt="website"
                        />
                        <input
                          type="text"
                          className="input-element"
                          placeholder="Enter Website Name"
                          ref={nameRef}
                          defaultValue={authCtx.nameLoginVault[indexEditLogin]}
                        />
                      </div>

                      <div className="input-holder">
                        <img
                          src="https://assets.ccbp.in/frontend/react-js/password-manager-username-img.png"
                          className="input-image"
                          alt="username"
                        />
                        <input
                          type="text"
                          className="input-element"
                          placeholder="Enter Username"
                          ref={usernameRef}
                          defaultValue={
                            authCtx.usernameLoginVault[indexEditLogin]
                          }
                        />
                      </div>
                      <div className="input-holder">
                        <img
                          src="https://assets.ccbp.in/frontend/react-js/password-manager-password-img.png"
                          className="input-image"
                          alt="password"
                        />
                        <input
                          type="password"
                          className="input-element"
                          placeholder="Enter Password"
                          ref={passwordRef}
                          defaultValue={
                            authCtx.passwordLoginVault[indexEditLogin]
                          }
                        />
                      </div>
                      <div className="button">
                        <input
                          type="button"
                          onClick={check}
                          className="check-btn"
                        >
                          Alert Breached
                        </input>
                        <input
                          type="button"
                          onClick={() => generateSecurePassword()}
                          className="generate-btn"
                        >
                          Generate Password
                        </input>
                        <input
                          type="button"
                          value="Edit Vault"
                          className="add-btn"
                          onClick={() => editLogin(authCtx.vault.noteData[indexEditLogin])}
                        />
                      </div>
                    </form>
                    <img
                      src="https://assets.ccbp.in/frontend/react-js/password-manager-lg-img.png"
                      className="sub-div1-image1"
                      alt="password manager"
                    />
                  </>
                )}
              </div>
              <div className="sub-div2">
                <div className="first-div">
                  <div className="your-password">
                    <h1 className="heading-name">Your Vault</h1>
                    <p className="colored-text">
                      {authCtx.nameLoginVault.length}
                    </p>
                  </div>
                  <div className="mode">
                    <button
                      className="modeLoginButton-login"
                      onClick={() => loginHandler()}
                    >
                      Login
                    </button>
                    <button
                      className="modeNoteButton"
                      onClick={() => noteHandler()}
                    >
                      Note
                    </button>
                  </div>
                </div>
                <hr />
                <ul className="result-container">
                  {authCtx.nameLoginVault.map(displayLogin)}
                </ul>
              </div>
            </>
          )}
          {isNote && (
            <>
              <div className="sub-div1">
                {!isEditNote && (
                  <>
                    <form className="add-details">
                      <h1 className="detail-heading">Add New Secure Notes</h1>
                      <div className="input-holder">
                        <img
                          src="https://assets.ccbp.in/frontend/react-js/password-manager-website-img.png"
                          className="input-image"
                          alt="website"
                        />
                        <input
                          type="text"
                          className="input-element"
                          placeholder="Enter Note Name"
                          ref={messageNoteRef}
                        />
                      </div>

                      <div className="input-holder-note">
                        <img
                          src="https://assets.ccbp.in/frontend/react-js/password-manager-username-img.png"
                          className="input-image"
                          alt="username"
                        />
                        <textarea
                          className="input-element-message"
                          placeholder="Enter Message"
                          ref={nameNoteRef}
                        />
                      </div>
                      <input
                        type="button"
                        value="Add"
                        className="add-btn"
                        onClick={addNote}
                      />
                    </form>
                    <img
                      src="https://assets.ccbp.in/frontend/react-js/password-manager-lg-img.png"
                      className="sub-div1-image1"
                      alt="password manager"
                    />
                  </>
                )}
                {isEditNote && (
                  <>
                    <form className="add-details">
                      <h1 className="detail-heading">Edit Secure Notes</h1>
                      <div className="input-holder">
                        <img
                          src="https://assets.ccbp.in/frontend/react-js/password-manager-website-img.png"
                          className="input-image"
                          alt="website"
                        />
                        <input
                          type="text"
                          className="input-element"
                          placeholder="Enter Note Name"
                          ref={messageNoteRef}
                          defaultValue={authCtx.messageNoteVault[indexEditNote]}
                        />
                      </div>

                      <div className="input-holder-note">
                        <img
                          src="https://assets.ccbp.in/frontend/react-js/password-manager-username-img.png"
                          className="input-image"
                          alt="username"
                        />
                        <textarea
                          className="input-element-message"
                          placeholder="Enter Message"
                          ref={nameNoteRef}
                          defaultValue={authCtx.nameNoteVault[indexEditNote]}
                        />
                      </div>
                      <input
                        type="button"
                        value="Edit Vault"
                        className="add-btn"
                        onClick={() => editNote(authCtx.vault.noteData[indexEditNote])}
                      />
                    </form>
                    <img
                      src="https://assets.ccbp.in/frontend/react-js/password-manager-lg-img.png"
                      className="sub-div1-image1"
                      alt="password manager"
                    />
                  </>
                )}
              </div>
              <div className="sub-div2">
                <div className="first-div">
                  <div className="your-password">
                    <h1 className="heading-name">Your Vault</h1>
                    <p className="colored-text">
                      {authCtx.nameNoteVault.length}
                    </p>
                  </div>
                  <div className="mode">
                    <button
                      className="modeLoginButton"
                      onClick={() => loginHandler()}
                    >
                      Login
                    </button>
                    <button
                      className="modeNoteButton-note"
                      onClick={() => noteHandler()}
                    >
                      Note
                    </button>
                  </div>
                </div>
                <hr />
                <ul className="result-container">
                  {authCtx.messageNoteVault.map(displayNote)}
                </ul>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default NewVault;
