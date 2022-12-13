import ReactDOM from "react-dom/client";
import React from "react";
import "./index.css"; //FILE CSS JANGAN SAMPE DIHAPUS SOALNYA NGARUH KE LOGIN SAMA REGISTER
import App from "./App";
import { AuthContextProvider } from "./store/auth-context";
// import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <AuthContextProvider>
    <App />
  </AuthContextProvider>
);

// reportWebVitals();
