import React, { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import PasswordStrengthMeter from "./PasswordStrengthMeter";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Helmet } from "react-helmet";

// import "./NewRegister.css"

const eye = <FontAwesomeIcon icon={faEye} display={false} />;
const eyeSlash = <FontAwesomeIcon icon={faEyeSlash} display={false} />;

const cipher = require("../../libs/cipher");

function disableZoom() {
  const metaTag = document.createElement("meta");
  metaTag.name = "viewport";
  metaTag.content =
    "width=device-width, initial-scale=0.9, maximum-scale=1.0, user-scalable=no";
  document.getElementsByTagName("head")[0].appendChild(metaTag);
}
function SignUp() {
  useEffect(() => {
    disableZoom();
  }, []);
  const navigate = useNavigate();

  const inputEmail = useRef(null);
  const inputUsername = useRef(null);
  const inputMasterPassword = useRef(null);
  const inputMasterPasswordRetype = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  // Hide & show password
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  async function createAccountHandler() {
    var validRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (inputEmail.current.value === "") {
      inputEmail.current.focus();
      alert("Please enter an email address");
      return;
    }
    if (inputEmail.current.value !== "") {
      if (!inputEmail.current.value.match(validRegex)) {
        alert("Please enter a valid email address");
        inputEmail.current.focus();
        return;
      }
      //return;
    }
    if (inputUsername.current.value === "") {
      alert("Please enter the username field");
      inputUsername.current.focus();
      return;
    }
    if (inputMasterPassword.current.value === "") {
      alert("Please enter a master password");
      inputMasterPassword.current.focus();
      return;
    }
    if (inputMasterPassword.current.value.length < 8) {
      alert("Master password must be at least 8 characters long");
      inputMasterPassword.current.focus();
      return;
    }
    if (inputMasterPasswordRetype.current.value === "") {
      alert("Please Re-type the master password");
      inputMasterPasswordRetype.current.focus();
      return;
    }
    if (
      inputMasterPassword.current.value !==
      inputMasterPasswordRetype.current.value
    ) {
      alert("Master password that you have entered is different, try again!");
      inputMasterPasswordRetype.current.focus();
      return;
    }

    /* Construct payloads */
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 50)); // have to add delay. if not, somehow the notification doesnt show up

    const nameField = inputUsername.current.value;
    const emailField = inputEmail.current.value;
    const masterPassField = inputMasterPassword.current.value;

    const [iv, masterPasswordHash, protectedSymmetricKey] =
      cipher.encryptPasswordAndHashKey(emailField, masterPassField);

    /* Send data to server */
    let response;
    try {
      response = await fetch(`${process.env.REACT_APP_API_URL}/api/register`, {
        method: "POST",
        body: JSON.stringify({
          name: nameField,
          email: emailField,
          password: Buffer.from(masterPasswordHash).toString("base64"),
          key: Buffer.from(protectedSymmetricKey).toString("base64"),
          iv: Buffer.from(iv).toString("base64"),
        }),
        headers: { "Content-type": "application/json" },
      });
    } catch (err) {
      toast.error("The server is not responding. Please try again.");
      setIsLoading(false);
      return;
    }

    const data = await response.json();
    setIsLoading(false);

    if (data.status === "success") {
      navigate("/login");
      toast.success(
        <div>
          <strong>{data.message}</strong>
          <br />
          Please check your inbox folder and/or spam folder to confirm your
          email
        </div>,
        { autoClose: 6500 }
      );
    } else if (data.status === "error") {
      toast.error(data.message);
    } else {
      // if server is up but unknown error message is sent
      toast.error("The server seems to be down. Please try again.");
    }
  }
  const [Masterpassword, setMPValue] = useState("");
  return (
    <div className="App">
      <Helmet>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
        ></meta>
      </Helmet>
      <nav className="navbar navbar-expand-lg navbar-light fixed-top">
        <div className="container">
          <a href="/" target="blank">
          <img
            src="./PG_logo.png"
            className="app-logo"
            style={{ width: "150px", height: "45px" }}
          ></img>

          </a>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul className="navbar-nav ml-auto"></ul>
          </div>
        </div>
      </nav>
      <div className="auth-wrapper">
        <div className="auth-inner">
          <form>
            <h3 style={{ color: "white", fontWeight: "bold" }}>Sign Up</h3>

            <div className="mb-3">
              <label style={{ color: "white", fontWeight: "bold" }}>
                Email address
              </label>
              <input
                type="email"
                ref={inputEmail}
                className="form-control"
                placeholder="Enter email"
                style={{width: "315px"}}
              />
            </div>
            <div className="mb-3">
              <label style={{ color: "white", fontWeight: "bold" }}>
                Username</label>
              <input
                type="text"
                ref={inputUsername}
                className="form-control"
                placeholder="Enter username"
                style={{width: "315px"}}
              />
            </div>
            <div className="mb-3" >
              <label style={{ color: "white", fontWeight: "bold" }}>
                Master Password
              <input
                type={passwordShown ? "text" : "password"}
                value={Masterpassword}
                ref={inputMasterPassword}
                className="form-control"
                placeholder="Enter master password"
                style={{width: "315px"}}
                onChange={(e) => setMPValue(e.target.value)}
              />
              </label>
              <i
                class="eye-1"
                onClick={togglePasswordVisiblity}
                style={{ marginLeft: '5px', color: "white"}}
              >
                {passwordShown ? eyeSlash : eye}
              </i>{" "}
              <PasswordStrengthMeter password={Masterpassword} />
            </div>

            <div className="mb-3">
              {/* <br/> */}
              {/* <br/> */}
              <label style={{ color: "white", fontWeight: "bold" }}>
                Re-type Master Password
                <input
                  type={passwordShown ? "text" : "password"}
                  ref={inputMasterPasswordRetype}
                  className="form-control"
                  placeholder="Enter master password"
                  style={{width: "315px"}}
                />
              </label>
              <i
                className="eye-1"
                onClick={togglePasswordVisiblity}
                style={{ marginLeft: '5px', color: "white"}}
              >
                {passwordShown ? eyeSlash : eye}
              </i>
            </div>
            <div className="d-grid">
              <input
                type="button"
                value="Submit"
                className="btn btn-primary"
                onClick={createAccountHandler}
                style={{ background: "#4e2fff" }}
              />
              {/* Sign Up
              </button> */}
            </div>
            <p
              className="forgot-password text-right"
              style={{ color: "white", fontWeight: "bold" }}
            >
              <a href="/login" style={{ color: "white", fontWeight: "bold" }}>
              Already have an account?
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
export default SignUp;
