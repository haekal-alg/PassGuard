import React, { useState } from "react";
import "./Popup.css";
function PopUp() {
  const [popup, setPop] = useState(false);
  const handleClickOpen = () => {
    setPop(!popup);
    document.body.style.backgroundColor = "#D0CECE";
  };
  const closePopup = () => {
    setPop(false);
    document.body.style.backgroundColor = "#FFF5E9";
  };
  return (
    <div>
      <button onClick={handleClickOpen} id="addItems">+ Add Items</button>
      <div>
        {popup ? (
          <div className="mainPopup">
            <div className="popup">
              <div className="popup-header">
                <h1>popup</h1>
                <h1 onClick={closePopup}>X</h1>
              </div>
              <div>
                <p>This is simple popup in React js</p>
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
