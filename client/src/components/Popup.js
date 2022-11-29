import React, { useState } from "react";
import "./Popup.css";
import "./Dropdown.js";
import Dropdown from "./Dropdown.js";

function PopUp() {
  const [popup, setPop] = useState(false);
  const handleClickOpen = () => {
    setPop(!popup);
    // document.body.style.backgroundColor = "#D0CECE";
  };
  const closePopup = () => {
    setPop(false);
    // document.body.style.backgroundColor = "#FFF5E9";
  };
  const options = [
    { value: "login", label: "Login" },
    { value: "card", label: "Card" },
    { value: "secureNote", label: "Secure Note" },
  ];
  return (
    <div>
      <button onClick={handleClickOpen} id="addItems">
        + Add Items
      </button>
      <div>
        {popup ? (
          <div className="mainPopup">
            <div className="popup">
              <div className="popup-header">Add Item</div>
              <div className="popup-body">
                <p>Type of Item</p>
                <Dropdown placeHolder="Select..." options={options} style={{width: '10%'}}/>
                <p>Name</p>
                <input type="text" id="noteName" />
                <br />
                <p>Notes</p>
                <textarea name="message" id="message"></textarea>
                <br />
                <button onClick={closePopup} id="saveButton">
                  Save
                </button>
                <button onClick={closePopup} id="cancelButton">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}
export default PopUp;
