// import styled, { css } from "styled-components";
import React from "react";
import { useRef } from "react";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./LoginPage.css";

const cipher = require('./../libs/cipher');
const toastifyWrapper = require('../libs/toastifyWrapper');

function LoginPage() {
	const inputEmail = useRef(null);
	const inputMasterPassword = useRef(null);

	async function loginHandler() {
		if (inputEmail.current.value === '' ) {
			alert('Please enter the username field');
			return;
		}
		if (inputMasterPassword.current.value === '' ) {
			alert('Please enter a master password');
			return;
		}

		let toastID = toast.loading("Trying to login...");
		await new Promise(r => setTimeout(r, 50)); 
		
		const emailField = inputEmail.current.value;
		const masterPassField = inputMasterPassword.current.value;

		const masterPasswordKey = cipher.hashDataWithSalt(masterPassField, emailField);
		const masterPasswordHash = cipher.hashDataWithSalt(masterPassField, masterPasswordKey);

		const loginData = {
				email		: emailField,
				password	: Buffer.from(masterPasswordHash).toString('base64'),
		}
		const response = await fetch('http://localhost:8080/api/login', {
						method: 'POST',
						body: JSON.stringify(loginData), 
						headers: { 'Content-type': 'application/json' }
					});
			
		const data = await response.json();
		if (data.status === 'success') {
			// navigate to fault
			toastifyWrapper.update(toast, toastID, "Login success", "success");
		}
		else if (data.status === 'error') {
			toastifyWrapper.update(toast, toastID, data.message, "error");
		}
	}

	return (
		<body>
			<div className="topnav">
				<a href="#Logo">Logo</a>
				<a href="#PassGuard">PassGuard</a>
				<div className="topnav-right">
					<a href="/home">Home</a>
					<a href="/register">Register</a>
				</div>
			</div>
			<div className="main">
				<div className="efek">
					<h1>Login</h1>
					<h5>Sign-in to your account</h5>

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

					<label id="master_password">
						<input
							ref={inputMasterPassword}
							type="password"
							placeholder="Master Password"
						/>
					</label>

					<div>
						<input 
							type="button"
							value="Login"
							className="login_button"
							onClick={loginHandler}
						/>
					</div>

					<br />
					<p className="copyright">@PassGuard, inc</p>
				</div>
			</div>
		</body>
	);
}

export default LoginPage;
