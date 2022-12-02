import React, { useContext } from 'react';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';

//import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
//import VaultPage from "./components/VaultPage";
//import TestPage from "./components/TestPage";

import NotFoundPage from './components/others/NotFoundPage';

import { ToastContainer, Zoom } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import AuthContext from './store/auth-context';

function App() {
	const authCtx = useContext(AuthContext);

	return (
		<BrowserRouter>
			<Routes>
				<Route path="/register" element={<RegisterPage/>} />
				<Route path="/login" 	element={<LoginPage/>} />
				<Route path="/"			element={<NotFoundPage redirect={"construction"}/>} />
				<Route path="/vault"	element={<NotFoundPage redirect={"construction"}/>} />
				<Route path="*" 		element={<NotFoundPage redirect={"not found"}/>} />

				{/* [TODO] test ganti vault */}
				{/* <Route path="/test" element={ 
					(authCtx.isLoggedIn) ? <TestPage/> : <Navigate to='/login' />
				} /> */}
			</Routes>
			<ToastContainer transition={Zoom} hideProgressBar={true} autoClose={3000}/>
		</BrowserRouter>
	);
}

export default App;