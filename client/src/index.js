import ReactDOM from "react-dom/client";

import "./index.css";
import App from "./App";
import { AuthContextProvider } from "./store/auth-context";
import reportWebVitals from "./reportWebVitals";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthContextProvider>
    <App />
  </AuthContextProvider>
);

reportWebVitals();
