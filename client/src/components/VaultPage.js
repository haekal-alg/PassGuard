import React, { useRef, useContext, useEffect, useState } from "react";
import "./VaultPage.css";
// import ModeSecureNotes from "./ModeSecureNotes";
// import ReactDOM from "react-dom/client";
import AuthContext from "../store/auth-context";
import { useNavigate } from "react-router-dom";
import Popup from "reactjs-popup";

// to show vault item dynamically
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import LoginIcon from "@mui/icons-material/Login";
import DeleteIcon from "@mui/icons-material/Delete";
import { orange } from "@mui/material/colors";
import NoteIcon from "@mui/icons-material/Note";
import CreditCardIcon from "@mui/icons-material/CreditCard";

import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

function VaultPage() {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();

  const newNoteName = useRef(null);
  const newNoteMessage = useRef(null);

  const newLoginName = useRef(null);
  const newUsername = useRef(null);
  const newPassword = useRef(null);

  const newCardName = useRef(null);
  const newCardNumber = useRef(null);
  const newHolderName = useRef(null);
  const newBrand = useRef(null);
  const newExpirationDate = useRef(null);

  const handleClickOpen = () => {
    navigate("/vault/note");
  };

  const logoutHandler = () => {
    authCtx.logout();
  };

  const [isVaultChanged, setIsVaultChanged] = useState(false);
  // This hook will get all user data when the page is first opened OR user make changes to their vault
  // The data is then parsed and displayed accordingly on the page
  useEffect(() => {
    /* [TODO] add validation. if error occured do not sync */
    async function syncVault() {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/sync`,
        {
          headers: { Authorization: "Bearer " + authCtx.token },
        }
      );
      let data = await response.json();

      // store user data in memory
      authCtx.sync(data);

      setIsVaultChanged(false);
    }
    syncVault();
  }, [isVaultChanged]);

  console.log(authCtx.vault);

  // Mengedit Item Vault
  const [openLogin, setOpenLogin] = useState(false);
  const closeModalLogin = () => setOpenLogin(false);
  async function savePopupLogin(loginInfoId) {
    // send data to server to update data
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/user/loginInfo?loginInfoId=${loginInfoId}&name=${newLoginName.current.value}&username=${newUsername.current.value}&password=${newPassword.current.value}`,
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

    if (newLoginName !== "" && newUsername !== "" && newPassword !== "") {
      alert("Item successfully changed");
    } else {
      alert("Please fill the Note Message");
    }
    setOpenLogin(false);
  }

  const [openNote, setOpenNote] = useState(false);
  const closeModalNote = () => setOpenNote(false);
  async function savePopupNote(secureNoteId) {
    // send data to server to update data
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/user/secureNote?secureNoteId=${secureNoteId}&name=${newNoteName.current.value}&notes=${newNoteMessage.current.value}`,
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

    if (newNoteMessage !== "") {
      alert("Item successfully changed");
    } else {
      alert("Please fill the Note Message");
    }
    setOpenNote(false);
  }

  const [openCard, setOpenCard] = useState(false);
  const closeModalCard = () => setOpenCard(false);
  async function savePopupCard(creditCardId) {
    // send data to server to update data
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/user/creditCard?creditCardId=${creditCardId}&name=${newCardName.current.value}&holderName=${newHolderName.current.value}&cardNumber=${newCardNumber.current.value}&brand=${newBrand.current.value}&expirationDate=${newExpirationDate.current.value}`,
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

    if (
      newCardName !== "" &&
      newCardNumber !== "" &&
      newBrand !== "" &&
      newHolderName !== "" &&
      newExpirationDate !== ""
    ) {
      alert("Item successfully changed");
    } else {
      alert("Please fill the Note Message");
    }
    setOpenCard(false);
  }

  // Menampilkan Item Vault
  function displayLogin(item) {
    console.log(item.name);
    return (
      <ListItem
        secondaryAction={
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={() => deleteLogin(item.loginInfoId)}
          >
            <DeleteIcon />
          </IconButton>
        }
      >
        <ListItemAvatar>
          <Avatar>
            <LoginIcon sx={{ color: orange[800] }} />
          </Avatar>
        </ListItemAvatar>
        <ListItemText>{item.name}</ListItemText>
      </ListItem>
    );
  }

  function displayNote(item) {
    console.log(Buffer.from(item.name, "base64").toString("utf8"));
    console.log(item.name);

    const buff = Buffer.from("aGkgcmVhZGVycw==", "base64");
    const str = buff.toString("utf8");
    console.log(str); // hi readers

    return (
      <ListItem
        secondaryAction={
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={() => deleteNote(item.secureNoteId)}
          >
            <DeleteIcon />
          </IconButton>
        }
      >
        <ListItemAvatar>
          <Avatar>
            <NoteIcon sx={{ color: orange[800] }} />
          </Avatar>
        </ListItemAvatar>
        {/* <ListItemText><button onClick={item(editNote)}>{item.name}</button></ListItemText> */}
        <ListItemText>
          <button id="trigger" onClick={() => setOpenNote((o) => !o)}>
            {item.name}
          </button>
          <Popup
            open={openNote}
            closeOnDocumentClick
            onClose={closeModalNote}
            position="right center"
          >
            <div className="editNote">
              <p>Name</p>
              <input
                type="text"
                id="noteName"
                defaultValue={item.name}
                ref={newNoteName}
              />
              <br />
              <p>Notes</p>
              <textarea
                name="message"
                id="message"
                defaultValue={item.notes}
                ref={newNoteMessage}
              />
              <br />
              <button
                onClick={() => savePopupNote(item.secureNoteId)}
                id="saveButton"
              >
                Edit
              </button>
              <button onClick={closeModalNote} id="cancelButton">
                Cancel
              </button>
            </div>
          </Popup>
        </ListItemText>
      </ListItem>
    );
  }

  function displayCard(item) {
    console.log(item.name);
    return (
      <ListItem
        secondaryAction={
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={() => deleteCard(item.creditCardId)}
          >
            <DeleteIcon />
          </IconButton>
        }
      >
        <ListItemAvatar>
          <Avatar>
            <CreditCardIcon sx={{ color: orange[800] }} />
          </Avatar>
        </ListItemAvatar>
        <ListItemText>
          <button id="trigger" onClick={() => setOpenNote((o) => !o)}>
            {item.name}
          </button>
          <Popup
            open={openNote}
            closeOnDocumentClick
            onClose={closeModalNote}
            position="right center"
          >
            <Box
              component="form"
              sx={{
                "& .MuiTextField-root": { m: 1, width: "25ch" },
              }}
              noValidate
              autoComplete="off"
            >
              <div>
                <TextField
                  required
                  id="outlined-required"
                  label="Required"
                  defaultValue="Hello World"
                />
                <TextField
                  disabled
                  id="outlined-disabled"
                  label="Disabled"
                  defaultValue="Hello World"
                />
                <TextField
                  id="outlined-password-input"
                  label="Password"
                  type="password"
                  autoComplete="current-password"
                />
                <TextField
                  id="outlined-read-only-input"
                  label="Read Only"
                  defaultValue="Hello World"
                  InputProps={{
                    readOnly: true,
                  }}
                />
                <TextField
                  id="outlined-number"
                  label="Number"
                  type="number"
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
                <TextField
                  id="outlined-search"
                  label="Search field"
                  type="search"
                />
                <TextField
                  id="outlined-helperText"
                  label="Helper text"
                  defaultValue="Default Value"
                  helperText="Some important text"
                />
              </div>
            </Box>
          </Popup>
        </ListItemText>
      </ListItem>
    );
  }

  // Delete Item Vault
  async function deleteNote(secureNoteId) {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/user/secureNote?secureNoteId=${secureNoteId}`,
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

  async function deleteLogin(loginInfoId) {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/user/loginInfo?loginInfoId=${loginInfoId}`,
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

  async function deleteCard(creditCardId) {
    const response = await fetch(
      `${process.env.REACT_APP_API_URL}/api/user/creditCard?creditCardId=${creditCardId}`,
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

  let filters = "all";
  function VaultDisplay({ filters }) {
    switch (filters) {
      case "login":
        return <>{authCtx.vault.loginData.map(displayLogin)}</>;
      case "note":
        return <>{authCtx.vault.noteData.map(displayNote)}</>;
      case "card":
        return <>{authCtx.vault.creditData.map(displayCard)}</>;
      default:
        return (
          <>
            {authCtx.vault.loginData.map(displayLogin)}
            {authCtx.vault.noteData.map(displayNote)}
            {authCtx.vault.creditData.map(displayCard)}
          </>
        );
    }
  }

  // yang akan ditampilkan di browser
  return (
    <div className="body">
      {authCtx.vault && (
        <>
          <div className="topnavVault">
            <a href="/" className="app">
              PassGuard
            </a>
            <div className="topnav-rightVault">
              <p id="account">{authCtx.vault.profile.name}</p>
              <button onClick={logoutHandler} className="logout">
                Logout
              </button>
            </div>
          </div>
          <p id="vaultItems">Vault Items</p>
          <button onClick={handleClickOpen} id="addItems">
            + Add Items
          </button>
          <div></div>

          <div className="mode">
            <p id="filter">Filters</p>
            <hr />
            <p id="all">All Items</p>
            <br />
            <p id="loginItems">Login</p>
            <br />
            <p id="cardItems">Cards</p>
            <br />
            <p id="secureNotesItems">Secure Notes</p>
            <br />
          </div>
          <div className="detail">
            <Grid item xs={12} md={6}>
              <List>{  VaultDisplay({filters})  }</List>
            </Grid>
          </div>
          <div className="bot_nav_vault">@PassGuard, inc</div>
        </>
      )}
    </div>
  );
}

export default VaultPage;
