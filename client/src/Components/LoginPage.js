import React from "react";
import { useRef } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./LoginPage.css";

const cipher = require("../libs/cipher");
const toastifyWrapper = require("../libs/toastifyWrapper");

function LoginPage() {
  const inputEmail = useRef(null);
  const inputMasterPassword = useRef(null);

  async function loginHandler() {
    if (inputEmail.current.value === "") {
      alert("Please enter your email");
      inputEmail.current.focus();
      return;
    }
    if (inputMasterPassword.current.value === "") {
      alert("Please enter a master password");
      inputMasterPassword.current.focus();
      return;
    }

    let toastID = toast.loading("Trying to login...");
    await new Promise((r) => setTimeout(r, 50));

    const emailField = inputEmail.current.value;
    const masterPassField = inputMasterPassword.current.value;

    const masterPasswordKey = cipher.hashDataWithSalt(
      masterPassField,
      emailField
    );
    const masterPasswordHash = cipher.hashDataWithSalt(
      masterPassField,
      masterPasswordKey
    );

    const loginData = {
      email: emailField,
      password: Buffer.from(masterPasswordHash).toString("base64"),
    };
    const response = await fetch("http://localhost:8080/api/login", {
      method: "POST",
      body: JSON.stringify(loginData),
      headers: { "Content-type": "application/json" },
    });

    const data = await response.json();
    console.log(data);

    if (data.status === "success") {
      // navigate to vault
      toastifyWrapper.update(toast, toastID, "Login success", "success");
    } else if (data.status === "error") {
      toastifyWrapper.update(toast, toastID, data.message, "error");
    }
  }

  return (
    <div className="body">
      <div className="topnavMain">
        <a href="#Logo">Logo</a>
        <a href="#PassGuard">PassGuard</a>
        <div className="topnav-rightMain">
          <a href="#Home">Home</a>
          <a href="/register">Register</a>
        </div>
      </div>
      <div className="mainLogin">
        <div className="efekLogin">
          <h1>Login</h1>
          <h5>Sign-in to your account</h5>
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
              autoComplete="off"
              type="text"
              placeholder="Master Password"
              ref={inputMasterPassword}
            />
          </label>
          {/* <a href="#forgot" id="forgotLogin">
            Forgot password? Click here
          </a> */}
          <div>
            <input
              type="button"
              value="Login"
              className="loginButton"
              onClick={loginHandler}
            />
          </div>
          <p className="copyrightLogin">@PassGuard, inc</p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
