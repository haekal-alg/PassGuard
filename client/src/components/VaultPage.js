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

function VaultPage() {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const newNoteName = useRef(null);
	const newNoteMessage = useRef(null);

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
        <ListItemText onClick={() => editLogin(item)}>{item.name}</ListItemText>
      </ListItem>
    );
  }

  const [open, setOpen] = useState(false);
  const closeModal = () => setOpen(false);
  async function savePopup(secureNoteId) {
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
    setOpen(false);
  }

  function displayNote(item) {
    console.log(item.name);
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
          <button id="trigger" onClick={() => setOpen((o) => !o)}>
            {item.name}
          </button>
          <Popup
            open={open}
            closeOnDocumentClick
            onClose={closeModal}
            position="right center"
          >
            <div className="editNote">
              <p>Name</p>
              <input type="text" id="noteName" defaultValue={item.name} ref={newNoteName} />
              <br />
              <p>Notes</p>
              <textarea name="message" id="message" defaultValue={item.notes} ref={newNoteMessage} />
              <br />
              <button onClick={() => savePopup(item.secureNoteId)} id="saveButton">
                Edit
              </button>
              <button onClick={closeModal} id="cancelButton">
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
        <ListItemText onClick={() => editCard(item)}>{item.name}</ListItemText>
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

  // Edit Item Vault
  function editNote(item) {}

  function editLogin(item) {}

  function editCard(item) {}

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
              <List>
                {authCtx.vault.loginData.map(displayLogin)}
                {authCtx.vault.noteData.map(displayNote)}
                {/* {authCtx.vault.cardData.map(displayCard)} */}
              </List>
            </Grid>
          </div>
          <div className="bot_nav_vault">@PassGuard, inc</div>
        </>
      )}
    </div>
  );
}

export default VaultPage;
