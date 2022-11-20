import "./RegisterPage.css";
import { useRef } from "react";

const chiper = require('./Cipher')

function RegisterPage() {
  const inputEmail = useRef(null);
  const inputUsername = useRef(null);
  const inputMasterPassword = useRef(null);
  const inputMasterPasswordRetype = useRef(null);

  function handleClick() {
    if (inputEmail.current.value === '' ) {
      alert('Please enter an email address')
    }
    if (inputUsername.current.value === '' ) {
      alert('Tolong masukan username yang anda inginkan')
    }
    if (inputMasterPassword.current.value === '' ) {
      alert('Tolong masukan master password')
    }
    if (inputMasterPasswordRetype.current.value === '' ) {
      alert('tolong ketikkan ulang password')
    }
    if (inputMasterPassword.current.value !== inputMasterPasswordRetype.current.value) {
      alert('Master password that you have entered is different, try again!')
    }
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(inputEmail.current.value)) {
      console.log(inputEmail.current.value);
    }
    else {
      alert('Please enter a valid email address')
    }
    console.log(inputUsername.current.value);
    console.log(inputMasterPassword.current.value);
    console.log(inputMasterPasswordRetype.current.value);

    console.log(chiper.hashDataWithSalt(inputMasterPassword.current.value, inputEmail.current.value))
  }

  return (
    <div className="body">
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
          <input 
            ref={inputEmail}
            type="email" 
            id="email"
            name="email" 
            placeholder="Email"
            required="" 
            className="form-control" 
          />
          </label>
          <label id="username">
            <input ref={inputUsername} type="text" placeholder="Username" />
          </label>
          <label id="master_password">
            <input
              ref={inputMasterPassword}
              type="password"
              placeholder="Master Password"
            />
          </label>
          <label id="master_password">
            <input
              ref={inputMasterPasswordRetype}
              type="password"
              placeholder="Re-Type Master Password"
            />
          </label>
          <p className="forgot">Already have an account? Click here</p>
          <div>
            <input
              type="button"
              value="Create Account"
              className="login_button"
              onClick={handleClick}
            />
          </div>
          <br />
          <p className="copyright">@PassGuard, inc</p>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
