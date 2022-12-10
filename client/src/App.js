import React, { useContext } from "react";

//import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import VaultPage from "./components/VaultPage";
import TestPage from "./components/TestPage";
import HomePage from "./components/HomePage";
import NotFoundPage from "./components/others/NotFoundPage";
import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AuthContext from "./store/auth-context";
import ModeSecureNotes from "./components/ModeSecureNotes";
import ModeCard from "./components/ModeCard";
import ModeLogin from "./components/ModeLogin";

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Login from "./components/newLogin";
import SignUp from "./components/newSignup";

/*
 <Router>
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
            <Routes>
              <Route exact path="/" element={<Login />} />
              <Route path="/sign-in" element={<Login />} />
              <Route path="/sign-up" element={<SignUp />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
*/

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/vault"
          element={
            authCtx.isLoggedIn ? <VaultPage /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/vault/note"
          element={
            authCtx.isLoggedIn ? <ModeSecureNotes /> : <Navigate to="/login" />
          }
        />
        <Route
          path="/vault/card"
          element={authCtx.isLoggedIn ? <ModeCard /> : <Navigate to="/login" />}
        />
        <Route
          path="/vault/loginInfo"
          element={
            authCtx.isLoggedIn ? <ModeLogin /> : <Navigate to="/login" />
          }
        />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* <Route path="/card" element={<ModeCard />} />  */}
        {/* <Route path="/" element={<NotFoundPage redirect={"construction"} />} /> */}
        <Route path="*" element={<NotFoundPage redirect={"not found"} />} />
        <Route path="/" element={<HomePage />} />
        <Route
          path="/test"
          element={
            authCtx.isLoggedIn ? <TestPage /> : <Navigate to="/login" />
          }
        />
      </Routes>
      <ToastContainer
        transition={Zoom}
        hideProgressBar={true}
        autoClose={3000}
      />
    </BrowserRouter>
  );
}

export default App;
