import React, {
  Component,
  useRef,
  useState,
  useContext,
  useEffect,
} from "react";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import AuthContext from "../../store/auth-context";
import "react-toastify/dist/ReactToastify.css";
import "./NewLogin.css";
const cipher = require("../../libs/cipher");

function NewLogin() {
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
      // navigate("/test"); /* FOR TESTING ONLY. Real value is /vault */
      alert("login success");
    } else if (data.status === "error") {
      alert("gagal");
      toast.error(data.message);
    } else {
      toast.error("The server seems to be down. Please try again.");
    }
  }
  return (
    <div className="App">
      <nav className="navbar navbar-expand-lg navbar-light fixed-top">
        <div className="container">
          <img
            src="./PG_logo.png"
            classname="app-logo"
            style={{ width: "150px", height: "45px" }}
          ></img>
          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul className="navbar-nav ml-auto"></ul>
          </div>
        </div>
      </nav>
      <div className="auth-wrapper">
        <div className="auth-inner">
          <form>
            <h3 style={{ color: "white", fontWeight: "bold" }}>Sign In</h3>
            <div className="mb-3">
              <label style={{ color: "white", fontWeight: "bold" }}>
                Email address
              </label>
              <input
                type="email"
                className="form-control"
                placeholder="Enter email"
                ref={inputEmail}
                autoComplete="off"
              />
            </div>
            <div className="mb-3">
              <label style={{ color: "white", fontWeight: "bold" }}>
                Password
              </label>
              <input
                type="password"
                className="form-control"
                placeholder="Enter password"
                ref={inputMasterPassword}
              />
            </div>
            <div className="mb-3">
              <div className="custom-control custom-checkbox">
                <input
                  type="checkbox"
                  className="custom-control-input"
                  id="customCheck1"
                />
                <label
                  style={{ color: "white" }}
                  className="custom-control-label"
                  htmlFor="customCheck1"
                >
                  Remember me
                </label>
              </div>
            </div>
            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-primary"
                value={isLoading ? "Logging in..." : "Login"}
                // className={isLoading ? "loginButtonLoading" : "loginButton"}
                onClick={loginHandler}
                disabled={isLoading ? true : false}
                style={{ background: "#4e2fff" }}
              >
                Submit
              </button>
            </div>
            <p
              style={{ color: "white", fontWeight: "bold" }}
              className="forgot-password text-right"
            >
              Don't have an{" "}
              <a
                style={{ color: "white", fontWeight: "bold" }}
                href="/register"
              >
                account?
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
export default NewLogin;
