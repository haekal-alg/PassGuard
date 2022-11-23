// import styled, { css } from "styled-components";
import React from "react";
import "./LoginPage.css";

function LoginPage() {
  return (
    <body>
      <div className="topnav">
        <a href="#Logo">Logo</a>
        <a href="#PassGuard">PassGuard</a>
        <div className="topnav-right">
          <a href="#Home">Home</a>
          <a href="#Register">Register</a>
        </div>
      </div>
      <div className="main">
        <div className="efek">
          <h1>Login</h1>
          <h5>Sign-in to your account</h5>
          <label id="emailLogin">
            <input type="text" placeholder="Email Address" />
          </label>
          <label id="passwordLogin">
            <input type="text" placeholder="Master Password" />
          </label>
          <p className="forgotLogin">Forgot password? Click here</p>
          <div>
            <input type="button" value="Login" className="loginButton" />
          </div>
          <br />
          <p className="copyrightLogin">@PassGuard, inc</p>
        </div>
      </div>
    </body>
  );
}

export default LoginPage;
