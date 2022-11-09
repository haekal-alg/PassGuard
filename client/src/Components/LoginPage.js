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
          <label id="email">
            <input type="text" placeholder="Email Address" />
          </label>
          <label id="master_password">
            <input type="text" placeholder="Master Password" />
          </label>
          <p className="forgot">Forgot password? Click here</p>
          <div>
            {/* <button type="submit" className="button_login"><img src="./Resource/right_arrow_icon.jpg" alt="right arrow"/>Login</button> */}
            <input type="button" value="Login" className="login_button" />
          </div>
          <br />
          <p className="copyright">@PassGuard, inc</p>
        </div>
      </div>
    </body>
  );
}

export default LoginPage;
