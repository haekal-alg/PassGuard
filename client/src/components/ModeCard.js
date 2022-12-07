// import VaultPage from "./VaultPage";
import ReactDOM from "react-dom/client";
// import ModeSecureNotes from "./ModeSecureNotes";
// import ModeLogin from "./ModeLogin";
import "./ModeCard.css";
import { useNavigate } from "react-router-dom";
import React, { useRef, useState, useContext } from "react";
import AuthContext from "../store/auth-context";

function ModeCard() {
  const authCtx = useContext(AuthContext);
  const navigate = useNavigate();
  const inputCardName = useRef(null);
  const inputCardHolderName = useRef(null);
  const inputCardNumber = useRef(null);
  const inputCardBrand = useRef(null);
  const inputCardExpDate = useRef(null);

  const [isVaultChanged, setIsVaultChanged] = useState(false);

  async function savePopup() {
    const response = await fetch("http://localhost:8080/api/user/loginInfo", {
      method: "POST",
      body: JSON.stringify({
        userId: authCtx.login,
        name: inputCardName.current.value,
        holderName: inputCardHolderName.current.value,
        cardNumber: inputCardNumber.current.value,
        brand: inputCardBrand.current.value,
        expirationDate: inputCardExpDate.current.value,
      }),
      headers: {
        "Content-type": "application/json",
        Authorization: "Bearer " + authCtx.token,
      },
    });

    const data = await response.json();

    if (!(data.status && data.status === "error")) setIsVaultChanged(true); // has to exist for every handler that changes the vault

    if (inputCardName !== "") {
      alert("Item successfully added");
      navigate("/vault");
    } else {
      alert("Pleas fill the required field");
      navigate("/vault/card");
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
              <input type="text" ref={inputCardName}></input>
              <input type="text" ref={inputCardHolderName}></input>
            </div>
            <div className="thirdRow">
              <p>Card Number</p>
              <p>Brand</p>
            </div>
            <div className="fourthRow">
              <input type="text" ref={inputCardNumber}></input>
              <input type="text" ref={inputCardBrand}></input>
            </div>
            <div className="fifthRow">
              <p>Expiration Date</p>
            </div>
            <div className="sixthRow">
              <input type="text" ref={inputCardExpDate}></input>
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
