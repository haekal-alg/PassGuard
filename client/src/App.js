import React, { useContext } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";

import { ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LandingPage from "components/Others/LandingPage.js";
import NewRegister from "./components/Authentication/NewRegister";
import NewLogin from "./components/Authentication/NewLogin";
import NewVault from "components/Vault/NewVault";
import NotFoundPage from "components/Others/NotFoundPage";

import AuthContext from "store/auth-context";

function App() {
  const authCtx = useContext(AuthContext);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<NewRegister />} />
        <Route path="/login" element={<NewLogin />} />
        <Route
          path="/vault"
          element={
            authCtx.isLoggedIn ? <NewVault /> : <Navigate to="/login" />
          }
        />
        <Route path="*" element={<NotFoundPage redirect={"not found"} />} />
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
