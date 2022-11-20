import "./RegisterPage.css";
import { useRef } from "react";

const chiper = require('./Cipher')
const crypto = require('crypto');

function RegisterPage() {
  const inputEmail = useRef(null);
  const inputUsername = useRef(null);
  const inputMasterPassword = useRef(null);
  const inputMasterPasswordRetype = useRef(null);

  function handleClick() {
    if (inputEmail.current.value === '' ) {
      alert('Please enter an email address');
    }
    else {
      if (inputUsername.current.value === '' ) {
        alert('Please enter the username field');
      }
      else {
        if (inputMasterPassword.current.value === '' ) {
          alert('Please enter a master password');
        }
        else {
          if (inputMasterPasswordRetype.current.value === '' ) {
            alert('Please Re-type the master password');
          }
          else {
            if (inputMasterPassword.current.value !== inputMasterPasswordRetype.current.value) {
              alert('Master password that you have entered is different, try again!');
            }
            else {
              if (inputMasterPassword.current.value === inputMasterPasswordRetype.current.value) {
                if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(inputEmail.current.value)) {
                  // print semua input ke console
                  console.log(inputEmail.current.value);
                  console.log(inputUsername.current.value);
                  console.log(inputMasterPassword.current.value);
                  console.log(inputMasterPasswordRetype.current.value);

                  // Master Key (result : 128 bit)
                  const masterKey = chiper.hashDataWithSalt(inputMasterPassword.current.value, inputEmail.current.value);
                  console.log(masterKey);
            
                  // Master Password Hash (result : 128 bit)
                  const masterPasswordHash = chiper.hashDataWithSalt(inputMasterPassword.current.value, masterKey);
                  console.log(masterPasswordHash);
            
                  // Defining key
                  const symmetricKey = crypto.randomBytes(32);
                  
                  // Defining iv
                  const iv = crypto.randomBytes(16);
                  
                  // Protected Private Key (result : 288 bit)
                  const protectedPrivateKey = chiper.aes256(iv, masterKey, symmetricKey);
                  console.log(protectedPrivateKey);
                }
                else {
                  alert('Please enter a valid email address');
                }
              }
            }
          }
        }
      }
    }
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
