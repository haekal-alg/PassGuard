import React, { useState } from "react";
import "./Popup.css";
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
  return (
    <div>
      <button onClick={handleClickOpen} id="addItems">+ Add Items</button>
      <div>
        {popup ? (
          <div className="mainPopup">
            <div className="popup">
              <div className="popup-header">Add Item
              </div>
              <div className="popup-body">
                <p>Type of Item</p>
                <input list="type" name="type" placeholder="Secure Note" id="type_border"/>
                <datalist id="type">
                  <option value="Login" />
                  <option value="Cards" />
                  <option value="Secure Note" />
                </datalist>
                <p>Name</p>
                <input type="text" id="noteName" /><br />
                <p>Notes</p>
                <textarea name="message" id="message"></textarea>
                <br />
                <button onClick={closePopup} id="saveButton">Save</button>
                <button onClick={closePopup} id="cancelButton">Cancel</button>
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
