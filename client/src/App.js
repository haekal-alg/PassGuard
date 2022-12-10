import React, { useContext } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

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

function App() {
  const authCtx = useContext(AuthContext);

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
