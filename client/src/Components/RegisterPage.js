import "./RegisterPage.css";

function RegisterPage() {
    return (
      <body>
        <div className="topnav">
          <a href="#Logo">Logo</a>
          <a href="#PassGuard">PassGuard</a>
          <div className="topnav-right">
            <a href="#Home">Home</a>
            <a href="#Login">Login</a>
          </div>
        </div>
        <div className="main">
          <div className="efek">
            <h1>Register</h1>
            <h5>Sign-up for New Account</h5>
            <label id="email">
              <input type="text" placeholder="Email Address" />
            </label>
            <label id="username">
              <input type="text" placeholder="Username" />
            </label>
            <label id="master_password">
              <input type="text" placeholder="Master Password" />
            </label>
            <label id="master_password">
              <input type="text" placeholder="Re-Type Master Password" />
            </label>
            <p className="forgot">Already have an account? Click here</p>
            <div>
              <input type="button" value="Create Account" className="login_button" />
            </div>
            <br />
            <p className="copyright">@PassGuard, inc</p>
          </div>
        </div>
      </body>
    );
  }
  
  export default RegisterPage;
  