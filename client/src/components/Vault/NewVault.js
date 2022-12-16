import React, { useRef, useContext, useEffect, useState } from "react";
import "./NewVault.css";
import AuthContext from "store/auth-context";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import LoginIcon from "@mui/icons-material/Login";
import { orange, grey, deepPurple } from "@mui/material/colors";
import NoteIcon from "@mui/icons-material/Note";
import SpeakerNotesIcon from "@mui/icons-material/SpeakerNotes";
import CommentIcon from "@mui/icons-material/Comment";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const cipher = require("libs/cipher");
const hibp = require("libs/alertBreached");
var generator = require("generate-password");

function NewVault() {
	const authCtx = useContext(AuthContext);
	const [isVaultChanged, setIsVaultChanged] = useState(false);
	const [globalSymkey] = useState(localStorage.getItem("symkey"));

	const nameRef = useRef(null);
	const usernameRef = useRef(null);
	const passwordRef = useRef(null);

	const nameNoteRef = useRef(null);
	const messageNoteRef = useRef(null);

	const newNoteName = useRef(null);
	const newNoteMessage = useRef(null);

	const newLoginName = useRef(null);
	const newUsername = useRef(null);
	const newPassword = useRef(null);

	const tempNameLogin = [];
	const tempUsernameLogin = [];
	const tempPasswordLogin = [];
	const tempNameNote = [];
	const tempMessageNote = [];

	// state
	const [isNote, setisNote] = useState(false);
	const [isEditLogin, setIsEditLogin] = useState(false);
	const [isEditNote, setIsEditNote] = useState(false);
	const [indexEditNote, setIndexEditNote] = useState(0);
	const [indexEditLogin, setIndexEditLogin] = useState(0);

	// console.log(indexEditNote);
	// console.log(indexEditLogin);

	const logoutHandler = () => {
		authCtx.logout();
	};

	useEffect(() => {
		/* [TODO] add validation. if error occured do not sync */
		async function syncVault() {
			const response = await fetch(
				`${process.env.REACT_APP_API_URL}/api/sync`,
				{
					headers: { Authorization: "Bearer " + authCtx.token },
				}
			);
			const data = await response.json();
			//console.log("syncvault() => ", data)

			// store user data in memory
			authCtx.sync(data);
			authCtx.dataNameLoginSync(tempNameLogin);
			authCtx.dataUsernameLoginSync(tempUsernameLogin);
			authCtx.dataPasswordLoginSync(tempPasswordLogin);
			authCtx.dataNameNoteSync(tempNameNote);
			authCtx.dataMessageNoteSync(tempMessageNote);

			setIsVaultChanged(false);

			return data;
		}

		async function parseData() {
			let symkey;
			const data = await syncVault();

			const iv = Buffer.from(data.profile.iv, "base64");

			// Get the master key by decrypting protected master key
			// This condition is only true only when user first logged in
			if (!(authCtx.masterKey === null)) {
				const protectedSymmKey = Buffer.from(
					data.profile.protectedKey,
					"base64"
				);
				const masterKey = authCtx.masterKey;

				symkey = cipher.aes256Decrypt(iv, protectedSymmKey, masterKey);
				symkey = Buffer.from(symkey).toString("base64");

				authCtx.save(symkey); // save to local
			}

			// Parse encrypted user data
			if (globalSymkey === null) {
				symkey = Buffer.from(symkey, "base64");
			}
			else {
				symkey = Buffer.from(globalSymkey, "base64");
			}

			data.loginData.forEach(function (item) {
				let itemName = decodeURIComponent(item.name);
				let itemPassword = decodeURIComponent(item.password);
				let itemUsername = decodeURIComponent(item.username);
				
				itemName = Buffer.from(itemName, "base64");
				itemPassword = Buffer.from(itemPassword, "base64");
				itemUsername = Buffer.from(itemUsername, "base64");

				const decryptedName = cipher
					.aes256Decrypt(iv, itemName, symkey)
					.toString();
				const decryptedPassword = cipher
					.aes256Decrypt(iv, itemPassword, symkey)
					.toString();
				const decryptedUsername = cipher
					.aes256Decrypt(iv, itemUsername, symkey)
					.toString();

				tempNameLogin.push(decryptedName);
				tempUsernameLogin.push(decryptedUsername);
				tempPasswordLogin.push(decryptedPassword);
			});

			data.noteData.forEach(function (item) {
				let itemNoteName = decodeURIComponent(item.name);
				let itemNoteMessage = decodeURIComponent(item.notes);

				itemNoteName = Buffer.from(itemNoteName, "base64");
				itemNoteMessage = Buffer.from(itemNoteMessage, "base64");

				const decryptedNoteName = cipher
					.aes256Decrypt(iv, itemNoteName, symkey)
					.toString();
				const decryptedNoteMessage = cipher
					.aes256Decrypt(iv, itemNoteMessage, symkey)
					.toString();
				tempNameNote.push(decryptedNoteName);
				tempMessageNote.push(decryptedNoteMessage);
			});
		}

		parseData();
	}, [isVaultChanged]);

	// console.log(authCtx.vault);

	// Mengedit Item Vault
	async function editLogin(item) {
		if ( newLoginName.current.value !== "" && newUsername.current.value !== "" && newPassword.current.value !== "" ) {
			const symkey = Buffer.from(globalSymkey, "base64");
			const iv = Buffer.from(authCtx.vault.profile.iv, "base64");

			const encryptedNewLoginName = cipher.aes256Encrypt(iv, newLoginName.current.value, symkey); // encrypt
			newLoginName.current.value = Buffer.from(encryptedNewLoginName).toString("base64"); // encode with base64
			let encodeName = encodeURIComponent(newLoginName.current.value);

			const encryptedNewLoginUsername = cipher.aes256Encrypt(iv, newUsername.current.value, symkey); // encrypt
			newUsername.current.value = Buffer.from(encryptedNewLoginUsername).toString("base64"); // encode with base64
			let encodeUsername = encodeURIComponent(newUsername.current.value);

			const encryptedNewLoginPassword = cipher.aes256Encrypt(iv, newPassword.current.value, symkey); // encrypt
			newPassword.current.value = Buffer.from(encryptedNewLoginPassword).toString("base64"); // encode with base64
			let encodePassword = encodeURIComponent(newPassword.current.value);


			// send data to server to update data
			const response = await fetch(
				`${process.env.REACT_APP_API_URL}/api/user/loginInfo?loginInfoId=${item.loginInfoId}&name=${encodeName}&username=${encodeUsername}&password=${encodePassword}`,
				{
					method: "PATCH",
					headers: {
						"Content-type": "application/json",
						Authorization: "Bearer " + authCtx.token,
					},
				}
			);

			const data = await response.json();
			if (!(data.status && data.status === "error")) {
				setIsVaultChanged(true);
				window.location.reload();
			}
			toast.success("Item successfully Edited");
		} else {
			toast.error("Please fill the required field");
		}
	}

	async function editNote(item) {
		if (newNoteName !== "" && newNoteMessage !== "") {
			const symkey = Buffer.from(globalSymkey, "base64");
			const iv = Buffer.from(authCtx.vault.profile.iv, "base64");

			const encryptedNewNoteName = cipher.aes256Encrypt(
				iv,
				newNoteName.current.value,
				symkey
			); // encrypt
			newNoteName.current.value = Buffer.from(encryptedNewNoteName).toString("base64"); // encode with base64
			let encodeNoteName = encodeURIComponent(newNoteName.current.value);

			const encryptedNewNoteMessage = cipher.aes256Encrypt(
				iv,
				newNoteMessage.current.value,
				symkey
			); // encrypt
			newNoteMessage.current.value = Buffer.from(encryptedNewNoteMessage).toString("base64"); // encode with base64
			let encodeNoteMessage = encodeURIComponent(newNoteMessage.current.value);

			// send data to server to update data
			const response = await fetch(
				`${process.env.REACT_APP_API_URL}/api/user/secureNote?secureNoteId=${item.secureNoteId}&name=${encodeNoteMessage}&notes=${encodeNoteName}`,
				{
					method: "PATCH",
					headers: {
						"Content-type": "application/json",
						Authorization: "Bearer " + authCtx.token,
					},
				}
			);

			const data = await response.json();

			if (!(data.status && data.status === "error")) {
				setIsVaultChanged(true);
				window.location.reload();
			}
			toast.success("Item successfully Edited");
		} else {
			toast.error("Please fill the required field");
		}
	}

	// Menampilkan Item Vault
	function displayLogin(item, index) {
		return (
			<>
				<li
					key={authCtx.vault.loginData[index].loginInfoId}
					className="item-list"
				>
					<LoginIcon sx={{ color: orange[50] }} fontSize="small" />
					<div className="list-content">
						<button className="website" onClick={() => editLoginHandler(index)}>
							{item}
						</button>
						<button className="website-username" onClick={() => editLoginHandler(index)}>
							{authCtx.usernameLoginVault[index]}
						</button>
					</div>
					<button type="button" className="del-btn" testid="delete">
						<img
							src="https://assets.ccbp.in/frontend/react-js/password-manager-delete-img.png"
							className="del-image"
							alt="delete"
							onClick={() => deleteLogin(authCtx.vault.loginData[index])}
						/>
					</button>
				</li>
			</>
		);
	}

	function displayNote(item, index) {
		return (
			<>
				<li
					key={authCtx.vault.noteData[index].secureNoteId}
					className="item-list"
				>
					<NoteIcon sx={{ color: orange[50] }} fontSize="small" />
					<div className="list-content">
						<button className="website" onClick={() => editNoteHandler(index)}>
							{item}
						</button>
					</div>
					<button type="button" className="del-btn" testid="delete">
						<img
							src="https://assets.ccbp.in/frontend/react-js/password-manager-delete-img.png"
							className="del-image"
							alt="delete"
							onClick={() => deleteNote(authCtx.vault.noteData[index])}
						/>
					</button>
				</li>
			</>
		);
	}

	// Delete Item Vault
	async function deleteNote(item) {
		const response = await fetch(
			`${process.env.REACT_APP_API_URL}/api/user/secureNote?secureNoteId=${item.secureNoteId}`,
			{
				method: "DELETE",
				headers: {
					"Content-type": "application/json",
					Authorization: "Bearer " + authCtx.token,
				},
			}
		);

		const data = await response.json();
		if (!(data.status && data.status === "error")) {
			setIsVaultChanged(true);
			toast.success("Item successfully deleted");
		} // has to exist for every handler that changes the vault
	}

	async function deleteLogin(item) {
		const response = await fetch(
			`${process.env.REACT_APP_API_URL}/api/user/loginInfo?loginInfoId=${item.loginInfoId}`,
			{
				method: "DELETE",
				headers: {
					"Content-type": "application/json",
					Authorization: "Bearer " + authCtx.token,
				},
			}
		);

		const data = await response.json();
		if (!(data.status && data.status === "error")) {
			setIsVaultChanged(true);
			toast.success("Item successfully deleted");
		} // has to exist for every handler that changes the vault
	}

	// return a json object with all its values encrypted
	async function userDataEncryptionHandler(userData) {
		const symkey = Buffer.from(globalSymkey, "base64");
		const iv = Buffer.from(authCtx.vault.profile.iv, "base64");

		for (let key in userData) {
			const encrypted = cipher.aes256Encrypt(iv, userData[key], symkey); // encrypt
			userData[key] = Buffer.from(encrypted).toString("base64"); // encode with base64
			userData[key] = encodeURIComponent(userData[key]);
		}

		return userData;
	}

	/* Check for breached password */
	const check = async () => {
		const text = passwordRef.current.value;

		if (text === "") {
			toast.error("Please fill the password field");
			return;
		}
		const times = await hibp.checkBreachedPassword(text);
		toast.info("Your password has been breached " + times + " times");
	};

	const checkEdit = async () => {
		const text = newPassword.current.value;

		if (text === "") {
			toast.error("Please fill the password field");
			return;
		}
		const times = await hibp.checkBreachedPassword(text);
		toast.info("Your password has been breached " + times + " times");
	};

	/* Generate secure random password */
	const generateSecurePassword = () => {
		const password = generator.generate({
			length: 14,
			numbers: true,
			uppercase: true,
			excludeSimilarCharacters: true,
		});
		passwordRef.current.value = password;
	};

	const generateSecurePasswordEdit = () => {
		const password = generator.generate({
			length: 14,
			numbers: true,
			uppercase: true,
			excludeSimilarCharacters: true,
		});
		newPassword.current.value = password;
	};

	// Add Item Vault
	async function addLogin() {
		if (nameRef !== "" && usernameRef !== "" && passwordRef !== "") {
			let userData = {
				name: nameRef.current.value,
				username: usernameRef.current.value,
				password: passwordRef.current.value,
			};

			userData = await userDataEncryptionHandler(userData);
			// console.log(userData);

			const response = await fetch(
				`${process.env.REACT_APP_API_URL}/api/user/loginInfo`,
				{
					method: "POST",
					body: JSON.stringify(userData),
					headers: {
						"Content-type": "application/json",
						Authorization: "Bearer " + authCtx.token,
					},
				}
			);

			const data = await response.json();
			// console.log(data);

			if (!(data.status && data.status === "error")) {
				setIsVaultChanged(true);
				toast.success("Item successfully added");
			}
		} else {
			toast.error("Please fill the required field");
		}
	}

	async function addNote() {
		if (
			nameNoteRef.current.value !== "" &&
			messageNoteRef.current.value !== ""
		) {
			let userData = {
				name: nameNoteRef.current.value,
				notes: messageNoteRef.current.value,
			};

			userData = await userDataEncryptionHandler(userData);
			// console.log(userData);

			const response = await fetch(
				`${process.env.REACT_APP_API_URL}/api/user/secureNote`,
				{
					method: "POST",
					body: JSON.stringify(userData),
					headers: {
						"Content-type": "application/json",
						Authorization: "Bearer " + authCtx.token,
					},
				}
			);

			const data = await response.json();
			// console.log(data);

			if (!(data.status && data.status === "error")) {
				setIsVaultChanged(true);
				window.location.reload();
			}
			toast.success("Item successfully added");
		} else {
			toast.error("Please fill the required field");
		}
	}

	// conditional rendering
	const noteHandler = () => {
		setisNote(true);
		setIsEditLogin(false);
	};
	const loginHandler = () => {
		setisNote(false);
		setIsEditNote(false);
	};
	const editLoginHandler = (index) => {
		setIsEditLogin(true);
		setIndexEditLogin(index);
	};
	const editNoteHandler = (index) => {
		console.log("edit");
		setIsEditNote(true);
		setIndexEditNote(index);
	};

	// Toogle Password Visibility
	const [passwordShown, setPasswordShown] = useState(false);

	// Password toggle handler
	const togglePassword = () => {
		setPasswordShown(!passwordShown);
	};

	// yang akan ditampilkan di browser
	return (
		<div className="main-container">
			{authCtx.vault && (
				<>
					<div className="navbar">
						<img src="./PG_logo.png" className="app-logo" alt="app logo" />
						<AccountCircleIcon sx={{ color: deepPurple[50] }} fontSize="large" className="iconProfile"/>
						<p className="profile">{authCtx.vault.profile.name}</p>
						<button className="logoutButtonVault" onClick={logoutHandler}>
							logout
						</button>
					</div>
					{!isNote && (
						<>
							<div className="sub-div1">
								{!isEditLogin && (
									<>
										<form className="add-details">
											<h1 className="detail-heading">Add New Login Info</h1>
											<div className="input-holder">
												<img
													src="https://assets.ccbp.in/frontend/react-js/password-manager-website-img.png"
													className="input-image"
													alt="website"
												/>
												<input
													type="text"
													className="input-element"
													placeholder="Enter Website Name"
													ref={nameRef}
												/>
											</div>

											<div className="input-holder">
												<img
													src="https://assets.ccbp.in/frontend/react-js/password-manager-username-img.png"
													className="input-image"
													alt="username"
												/>
												<input
													type="text"
													className="input-element"
													placeholder="Enter Username"
													ref={usernameRef}
												/>
											</div>
											<div className="input-holder">
												<img
													src="https://assets.ccbp.in/frontend/react-js/password-manager-password-img.png"
													className="input-image"
													alt="password"
												/>
												<input
													type={passwordShown ? "text" : "password"}
													className="input-element"
													placeholder="Enter Password"
													ref={passwordRef}
												/>
												<input
													type="button"
													value="show password"
													className="toggle-button"
													onClick={() => togglePassword()}
												/>
											</div>
											<div className="button">
												<input
													type="button"
													value="Alert Breached"
													onClick={check}
													className="check-btn"
												/>
												<input
													type="button"
													value="Generate Password"
													onClick={() => generateSecurePassword()}
													className="generate-btn"
												/>
												<input
													type="button"
													value="Add"
													className="add-btn"
													onClick={addLogin}
												/>
											</div>
										</form>
										<img
											src="https://assets.ccbp.in/frontend/react-js/password-manager-lg-img.png"
											className="sub-div1-image1"
											alt="password manager"
										/>
									</>
								)}
								{isEditLogin && (
									<>
										<form className="add-details">
											<h1 className="detail-heading">Edit Login Info</h1>
											<div className="input-holder">
												<img
													src="https://assets.ccbp.in/frontend/react-js/password-manager-website-img.png"
													className="input-image"
													alt="website"
												/>
												<input
													type="text"
													className="input-element"
													placeholder="Enter Website Name"
													ref={newLoginName}
													defaultValue={authCtx.nameLoginVault[indexEditLogin]}
												/>
											</div>

											<div className="input-holder">
												<img
													src="https://assets.ccbp.in/frontend/react-js/password-manager-username-img.png"
													className="input-image"
													alt="username"
												/>
												<input
													type="text"
													className="input-element"
													placeholder="Enter Username"
													ref={newUsername}
													defaultValue={
														authCtx.usernameLoginVault[indexEditLogin]
													}
												/>
											</div>
											<div className="input-holder">
												<img
													src="https://assets.ccbp.in/frontend/react-js/password-manager-password-img.png"
													className="input-image"
													alt="password"
												/>
												<input
													type={passwordShown ? "text" : "password"}
													className="input-element"
													placeholder="Enter Password"
													ref={newPassword}
													defaultValue={
														authCtx.passwordLoginVault[indexEditLogin]
													}
												/>
												<input
													type="button"
													value="show password"
													className="toggle-button"
													onClick={() => togglePassword()}
												/>
											</div>
											<div className="button">
												<input
													type="button"
													onClick={checkEdit}
													className="check-btn"
													value="Alert Breached"
												/>
												<input
													type="button"
													onClick={() => generateSecurePasswordEdit()}
													className="generate-btn"
													value="Generate Password"
												/>
												<input
													type="button"
													value="Edit Vault"
													className="add-btn"
													onClick={() =>
														editLogin(authCtx.vault.loginData[indexEditLogin])
													}
												/>
											</div>
										</form>
										<img
											src="https://assets.ccbp.in/frontend/react-js/password-manager-lg-img.png"
											className="sub-div1-image1"
											alt="password manager"
										/>
									</>
								)}
							</div>
							<div className="sub-div2">
								<div className="first-div">
									<div className="your-password">
										<h1 className="heading-name">Your Vault</h1>
										<p className="colored-text">
											{authCtx.nameLoginVault.length}
										</p>
									</div>
									<div className="mode">
										<button
											className="modeLoginButton-login"
											onClick={() => loginHandler()}
										>
											Login
										</button>
										<button
											className="modeNoteButton"
											onClick={() => noteHandler()}
										>
											Note
										</button>
									</div>
								</div>
								<hr />
								<ul className="result-container">
									{authCtx.nameLoginVault.map(displayLogin)}
								</ul>
							</div>
						</>
					)}
					{isNote && (
						<>
							<div className="sub-div1">
								{!isEditNote && (
									<>
										<form className="add-details">
											<h1 className="detail-heading">Add New Secure Notes</h1>
											<div className="input-holder">
												<SpeakerNotesIcon
													sx={{ color: grey[600] }}
													fontSize="20px"
													className="input-image"
												/>
												<input
													type="text"
													className="input-element"
													placeholder="Enter Note Name"
													ref={messageNoteRef}
												/>
											</div>

											<div className="input-holder-note">
												<CommentIcon
													sx={{ color: grey[600] }}
													fontSize="20px"
													className="input-image"
												/>
												<textarea
													className="input-element-message"
													placeholder="Enter Message"
													ref={nameNoteRef}
												/>
											</div>
											<input
												type="button"
												value="Add"
												className="add-btn"
												onClick={addNote}
											/>
										</form>
										<img
											src="https://assets.ccbp.in/frontend/react-js/password-manager-lg-img.png"
											className="sub-div1-image1"
											alt="password manager"
										/>
									</>
								)}
								{isEditNote && (
									<>
										<form className="add-details">
											<h1 className="detail-heading">Edit Secure Notes</h1>
											<div className="input-holder">
												<SpeakerNotesIcon
													sx={{ color: grey[600] }}
													fontSize="20px"
													className="input-image"
												/>
												<input
													type="text"
													className="input-element"
													placeholder="Enter Note Name"
													ref={newNoteName}
													defaultValue={authCtx.messageNoteVault[indexEditNote]}
												/>
											</div>

											<div className="input-holder-note">
												<CommentIcon
													sx={{ color: grey[600] }}
													fontSize="20px"
													className="input-image"
												/>
												<textarea
													className="input-element-message"
													placeholder="Enter Message"
													ref={newNoteMessage}
													defaultValue={authCtx.nameNoteVault[indexEditNote]}
												/>
											</div>
											<input
												type="button"
												value="Edit Vault"
												className="add-btn"
												onClick={() =>
													editNote(authCtx.vault.noteData[indexEditNote])
												}
											/>
										</form>
										<img
											src="https://assets.ccbp.in/frontend/react-js/password-manager-lg-img.png"
											className="sub-div1-image1"
											alt="password manager"
										/>
									</>
								)}
							</div>
							<div className="sub-div2">
								<div className="first-div">
									<div className="your-password">
										<h1 className="heading-name">Your Vault</h1>
										<p className="colored-text">
											{authCtx.nameNoteVault.length}
										</p>
									</div>
									<div className="mode">
										<button
											className="modeLoginButton"
											onClick={() => loginHandler()}
										>
											Login
										</button>
										<button
											className="modeNoteButton-note"
											onClick={() => noteHandler()}
										>
											Note
										</button>
									</div>
								</div>
								<hr />
								<ul className="result-container">
									{authCtx.messageNoteVault.map(displayNote)}
								</ul>
							</div>
						</>
					)}
				</>
			)}
		</div>
	);
}

export default NewVault;
