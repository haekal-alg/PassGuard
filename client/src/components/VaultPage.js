import React, { useRef, useContext, useEffect, useState } from "react";
import "./VaultPage.css";
import ModeSecureNotes from "./ModeSecureNotes";
import ReactDOM from "react-dom/client";
import AuthContext from "../store/auth-context";
import { useNavigate } from "react-router-dom";

// to show vault item dynamically
import { styled } from "@mui/material/styles";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import ListItemText from "@mui/material/ListItemText";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Grid from "@mui/material/Grid";
import FolderIcon from "@mui/icons-material/Folder";
import DeleteIcon from "@mui/icons-material/Delete";

function VaultPage() {
  const authCtx = useContext(AuthContext);
  let username;
  const navigate = useNavigate();

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
      const response = await fetch("http://localhost:8080/api/sync", {
        headers: { Authorization: "Bearer " + authCtx.token },
      });
      let data = await response.json();

      // store user data in memory
      authCtx.sync(data);

      /* [TODO] Parse data here */
      console.log(data.profile.name);

      setIsVaultChanged(false);
      username = data.profile.name;
      return username;
    }
    syncVault();
  }, [isVaultChanged]);

  console.log(username);

  function generate(element) {
    return [0, 1, 2].map((value) =>
      React.cloneElement(element, {
        key: value,
      })
    );
  }

  const Demo = styled("div")(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
  }));

  const [dense, setDense] = React.useState(false);

  return (
    <div className="body">
      <div className="topnavVault">
        <a href="/" className="app">
          PassGuard
        </a>
        <div className="topnav-rightVault">
          <p id="account">Account</p>
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
          <Demo>
            <List dense={dense}>
              {generate(
                <ListItem
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemAvatar>
                    <Avatar>
                      <FolderIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText primary="Dummy item"/>
                </ListItem>
              )}
            </List>
          </Demo>
        </Grid>
        {/* <p>{JSON.stringify(authCtx.vault)}</p> */}
      </div>
      <div className="bot_nav_vault">@PassGuard, inc</div>
    </div>
  );
}

export default VaultPage;
