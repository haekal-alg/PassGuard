//import HomePage from "./Components/HomePage";
import LoginPage from "./Components/LoginPage";
import RegisterPage from "./Components/RegisterPage";
// import VaultPage from "./Components/VaultPage";
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<RegisterPage/>} />
        <Route path="/login" element={<LoginPage/>} />
      </Routes>
      <ToastContainer />
    </BrowserRouter>
  );
}

export default App;