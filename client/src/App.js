import React, { useContext } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

// import LoginPage from "./components/Authentication/LoginPage";
// import RegisterPage from "./components/Authentication/RegisterPage";
// import VaultPage from "components/Vault/VaultPage.js";
import TestPage from "./components/TestPage";
import NotFoundPage from "components/Others/NotFoundPage";
import LandingPage from "components/Others/LandingPage.js";

import AuthContext from "store/auth-context";
// import ModeSecureNotes from "./components/ModeSecureNotes";
// import ModeCard from "./components/ModeCard";
// import ModeLogin from "./components/ModeLogin";

import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
// import "./App.css";
import NewLogin from "./components/Authentication/NewLogin";
import NewRegister from "./components/Authentication/NewRegister";
import RegisterPage from "components/Authentication/RegisterPage";

function App() {
  const authCtx = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        {/* 
        <Route
          path="/vault"
          element={
            authCtx.isLoggedIn ? <VaultPage /> : <Navigate to="/login" />
          }
        /> */}
        {/* <Route
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
        /> */}
        {/* <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} /> */}

        <Route
          path="/test"
          element={authCtx.isLoggedIn ? <TestPage /> : <Navigate to="/login" />}
        />

        <Route path="*" element={<NotFoundPage redirect={"not found"} />} />
        <Route path="/register" element={<NewRegister />} />
        <Route path="/login" element={<NewLogin />} />
        <Route
          path="/test"
          element={authCtx.isLoggedIn ? <TestPage /> : <Navigate to="/login" />}
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
