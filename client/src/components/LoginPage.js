import React, { useRef, useState, useContext, useEffect } from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import AuthContext from "../store/auth-context";
import "react-toastify/dist/ReactToastify.css";
import "./LoginPage.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import Navbar from "./Navbar";

const eye = <FontAwesomeIcon icon={faEye} display={false} />;
const cipher = require("../libs/cipher");

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    if (queryParams.get("email_verified") === "true") {
      navigate("/login", { replace: true });
      toast.success("Email is verified");
    }
  });

  const inputEmail = useRef(null);
  const inputMasterPassword = useRef(null);

  const authCtx = useContext(AuthContext);
  const [isLoading, setIsLoading] = useState(false);

  // Hide & show password
  const [passwordShown, setPasswordShown] = useState(false);
  const togglePasswordVisiblity = () => {
    setPasswordShown(passwordShown ? false : true);
  };

  async function loginHandler() {
    /* Input validation */
    if (inputEmail.current.value === "") {
      inputEmail.current.focus();
      if (
        /^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/.test(
          inputEmail.current.value
        )
      ) {
        alert("Please enter a valid email address");
        return;
      }
      alert("Please enter your email");
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

    /* Construct password hash */
    setIsLoading(true);
    await new Promise((r) => setTimeout(r, 50));

    const emailField = inputEmail.current.value;
    const masterPassField = inputMasterPassword.current.value;

    const masterPasswordKey = cipher.hashDataWithSalt(
      // MASTER KEY
      masterPassField,
      emailField
    );
    const masterPasswordHash = cipher.hashDataWithSalt(
      masterPassField,
      masterPasswordKey
    );

    /* Send data to server */
    // caught error when the server is down. Prevent infinite loading in button
    let response;
    try {
      response = await fetch(`${process.env.REACT_APP_API_URL}/api/login`, {
        method: "POST",
        body: JSON.stringify({
          email: emailField,
          password: Buffer.from(masterPasswordHash).toString("base64"),
        }),
        headers: { "Content-type": "application/json" },
      });
    } catch (err) {
      toast.error("The server is not responding. Please try again.");
      setIsLoading(false);
      return;
    }

    const data = await response.json(); // consists of only token
    setIsLoading(false);

    if (data.status === "success") {
      authCtx.login(data.idToken, data.expirationTime, masterPasswordKey);
      //authCtx.login(data.idToken, new Date(Date.now() + 3000));
      //navigate("/vault");
      navigate("/test"); /* FOR TESTING ONLY. Real value is /vault */
    } else if (data.status === "error") {
      toast.error(data.message);
    } else {
      toast.error("The server seems to be down. Please try again.");
    }
  }

  return (
    <div className="body">
      <div className="topnavMain">
        <a href="/">PassGuard</a>
        <div className="topnav-rightMain">
          <a href="/">Home</a>
          <a href="/register">Register</a>
        </div>
      </div>
      <div className="mainLogin">
        <div className="efekLogin">
          <h1>Login</h1>
          <h5>Sign-in to access your secure vault</h5>
          <label id="emailLogin">
            <input
              autoComplete="off"
              type="text"
              placeholder="Email Address"
              ref={inputEmail}
            />
          </label>
          <label id="passwordLogin">
            <input
              ref={inputMasterPassword}
              placeholder="Password"
              name="password"
              type={passwordShown ? "text" : "password"}
            />
            <i onClick={togglePasswordVisiblity}>{eye}</i>{" "}
          </label>
          <div>
            <input
              type="button"
              value={isLoading ? "Logging in..." : "Login"}
              className={isLoading ? "loginButtonLoading" : "loginButton"}
              onClick={loginHandler}
              disabled={isLoading ? true : false}
            />
          </div>
          <p className="copyrightLogin">@PassGuard, inc</p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
