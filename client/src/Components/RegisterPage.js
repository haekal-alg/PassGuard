import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import PasswordStrengthMeter from "./PasswordStrengthMeter";
import "./RegisterPage.css";

const cipher = require("../libs/cipher");

function RegisterPage() {
	const navigate = useNavigate();

	const inputEmail = useRef(null);
	const inputUsername = useRef(null);
	const inputMasterPassword = useRef(null);
	const inputMasterPasswordRetype = useRef(null);

  const [ isLoading, setIsLoading ] = useState(false);

	async function createAccountHandler() {
		var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
		if (inputEmail.current.value === "") {
			inputEmail.current.focus();
			alert("Please enter an email address");
			return;
		}
		if (inputEmail.current.value !== "") {
			if (!inputEmail.current.value.match(validRegex)) {
				alert("Please enter a valid email address");
				inputEmail.current.focus();
				return;
			}
			return;
		}
		if (inputUsername.current.value === "") {
			alert("Please enter the username field");
			inputUsername.current.focus();
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
		if (inputMasterPasswordRetype.current.value === "") {
			alert("Please Re-type the master password");
			inputMasterPasswordRetype.current.focus();
			return;
		}
		if (
			inputMasterPassword.current.value !==
			inputMasterPasswordRetype.current.value
		) {
			alert("Master password that you have entered is different, try again!");
			inputMasterPasswordRetype.current.focus();
			return;
		}

		/* Construct payloads */
		setIsLoading(true);
		await new Promise((r) => setTimeout(r, 50)); // have to add delay. if not, somehow the notification doesnt show up

		const nameField = inputUsername.current.value;
		const emailField = inputEmail.current.value;
		const masterPassField = inputMasterPassword.current.value;

		const [iv, masterPasswordHash, protectedSymmetricKey] =
			cipher.encryptPasswordAndHashKey(emailField, masterPassField);

		// send data to server at /api/register
		const registerData = {
			name: nameField,
			email: emailField,
			password: Buffer.from(masterPasswordHash).toString("base64"),
			key: Buffer.from(protectedSymmetricKey).toString("base64"),
			iv: Buffer.from(iv).toString("base64"),
		};
		// [TODO] simpan url dalam config file atau variabel
		const response = await fetch("http://localhost:8080/api/register", {
			method: "POST",
			body: JSON.stringify(registerData), // you have to use json.stringify otherwise it throws cors error? wat?!?
			headers: { "Content-type": "application/json" },
		});

		const data = await response.json();
		//console.log(data);
		setIsLoading(false);

		// [TODO] Lakukan pengecekan breached password sebelum melakukan register.
		// 		  Jika terdeteksi maka beritahu user apakah ingin melanjutkan apa tidak.  

		if (data.status === "success") {
			navigate("/login");
		} else if (data.status === "error") {
			toast.error(data.message);
		}
	}

	const [ Masterpassword, setMPValue ] = useState("");
  
	return (
		<div className="body">
			<div className="topnavRegister">
				<a href="#Logo">Logo</a>
				<a href="#PassGuard">PassGuard</a>
				<div className="topnav-rightRegister">
					<a href="/">Home</a>
					<a href="/login">Login</a>
				</div>
			</div>

			<div className="main">
				<div className="efek">
					<h1>Register</h1>
					<h5>Sign-up for New Account</h5>

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

					<label id="username">
						<input ref={inputUsername} type="text" placeholder="Username" />
					</label>

					<label id="master_password">
						<input
							value={Masterpassword}
							ref={inputMasterPassword}
							type="password"
							placeholder="Master Password"
							onChange={(e) => setMPValue(e.target.value)}
						/>
						<label id="passwordStrengthMeter">
							<PasswordStrengthMeter password={Masterpassword} />
						</label>
					</label>
					<br />
					<br />
					<br />
					<label id="retypeMaster_password">
						<input
							ref={inputMasterPasswordRetype}
							type="password"
							placeholder="Re-Type Master Password"
						/>
					</label>

					<a href="/login" className="forgot">Already have an account? Click here to login</a>

					<div>
						<input
							type="button"
							value={(isLoading) ? "Creating..." : "Create Account"}
							className={(isLoading) ? "login_button_loading" : "login_button"}
							onClick={createAccountHandler}
							disabled={(isLoading) ? true : false}
						/>
					</div>

					<br />
					<p className="copyright">@PassGuard, inc</p>
				</div>
			</div>
		</div>
	);
}

export default RegisterPage;
