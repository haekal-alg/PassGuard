import React, { useRef, useContext, useEffect, useState } from "react";
import AuthContext from "store/auth-context";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./NewVault.css";

import LoginIcon from "@mui/icons-material/Login";
import { orange, grey, deepPurple } from "@mui/material/colors";
import NoteIcon from "@mui/icons-material/Note";
import SpeakerNotesIcon from "@mui/icons-material/SpeakerNotes";
import CommentIcon from "@mui/icons-material/Comment";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const cipher = require("libs/cipher");
const hibp = require("libs/alertBreached");
const generator = require("generate-password");

function NewVault() {
	useEffect(() => {
		document.title = "Vaults | PassGuard";
	}, []);

	const authCtx = useContext(AuthContext);
	const [isVaultChanged, setIsVaultChanged] = useState(false);
	const [globalSymkey] = useState(localStorage.getItem("symkey"));

	const nameRef = useRef(null);
	const usernameRef = useRef(null);
	const passwordRef = useRef(null);

	const nameNoteRef = useRef(null);
	const messageNoteRef = useRef(null);

	const newNoteNameRef = useRef(null);
	const newNoteMessageRef = useRef(null);
	const newLoginNameRef = useRef(null);

	const newUsername = useRef(null);
	const newPasswordRef = useRef(null);

	const tempNameLogin = [];
	const tempUsernameLogin = [];
	const tempPasswordLogin = [];
	const tempNameNote = [];
	const tempMessageNote = [];

	// states
	const [isNote, setisNote] = useState(false);
	const [isEditLogin, setIsEditLogin] = useState(false);
	const [isEditNote, setIsEditNote] = useState(false);
	const [isTrue, setiIsTrue] = useState(false);
	const [isTrueLogin, setiIsTrueLogin] = useState(false);
	const [indexEditNote, setIndexEditNote] = useState(0);
	const [indexEditLogin, setIndexEditLogin] = useState(0);

	const authHeader =  {
		"Content-type": "application/json",
		Authorization: "Bearer " + authCtx.token,
	}

	const logoutHandler = () => {
		authCtx.logout();
	};

	useEffect(() => {
		async function syncVault() {
			const response = await fetch(
				`${process.env.REACT_APP_API_URL}/api/sync`,
				{
					headers: { Authorization: "Bearer " + authCtx.token },
				}
			);
			const data = await response.json();

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
				window.location.reload();
			}
			else {
				symkey = Buffer.from(globalSymkey, "base64");
			}

			if (data.noteData.length === 0) {
				setiIsTrue(false);
			}
			else {
				setiIsTrue(true);
			}

			if (data.loginData.length === 0) {
				setiIsTrueLogin(false);
			}
			else {
				setiIsTrueLogin(true);
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

	// return a json object with all its values encrypted
	async function userDataEncryptionHandler(userData) {
		const symkey = Buffer.from(globalSymkey, "base64");
		const iv = Buffer.from(authCtx.vault.profile.iv, "base64");

		for (let key in userData) {
			const encrypted = cipher.aes256Encrypt(iv, userData[key], symkey); 	// encrypt
			userData[key] = Buffer.from(encrypted).toString("base64"); 			// base64 encode
			userData[key] = encodeURIComponent(userData[key]); 					// URI encode
		}

		return userData;
	}

	async function editLogin(item) {
		const loginName = newLoginNameRef.current.value;
		const loginUsername = newUsername.current.value;
		const loginPassword = newPasswordRef.current.value;

		if (loginName === "" || loginUsername === "" || loginPassword === "") {
			toast.error("Please fill the required field");
			return;
		}

		let userData = {
			name: loginName,
			username: loginUsername,
			password: loginPassword
		}
		userData = await userDataEncryptionHandler(userData);

		const url = `${process.env.REACT_APP_API_URL}/api/user/loginInfo?
					loginInfoId=${item.loginInfoId}&name=${userData.name}&username=${userData.username}&password=${userData.password}`
					
		const response = await fetch(url, { method: "PATCH", headers: authHeader });
		const data = await response.json();

		if (!(data.status && data.status === "error")) {
			setIsVaultChanged(true);
			setIsEditLogin(false);

			toast.success("Login Info Item successfully Edited");
		}
	}

	async function editNote(item) {
		const noteName = newNoteNameRef.current.value;
		const noteMessage = newNoteMessageRef.current.value;
		
		if (noteName === "" || noteMessage === "") {
			toast.error("Please fill the required field");
			return;
		}

		let userData = { name: noteName, message: noteMessage }
		userData = await userDataEncryptionHandler(userData);

		const url = `${process.env.REACT_APP_API_URL}/api/user/secureNote?
					secureNoteId=${item.secureNoteId}&name=${userData.name}&notes=${userData.message}`;

		const response = await fetch(url, { method: "PATCH", headers: authHeader });
		const data = await response.json();
		
		if (!(data.status && data.status === "error")) {
			newNoteNameRef.current.value = "";
			newNoteMessageRef.current.value = "";

			setIsVaultChanged(true);
			setIsEditNote(false);

			toast.success("Secure note is successfully edited");
		}
	}

	/* Displays vault items */
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

	async function deleteNote(item) {
		const url = `${process.env.REACT_APP_API_URL}/api/user/secureNote?secureNoteId=${item.secureNoteId}`;
		const response = await fetch(url, { method: "DELETE", headers: authHeader });
		const data = await response.json();

		if (!(data.status && data.status === "error")) {
			setIsVaultChanged(true);
			toast.success("Item successfully deleted");
		}
	}

	async function deleteLogin(item) {
		const url = `${process.env.REACT_APP_API_URL}/api/user/loginInfo?loginInfoId=${item.loginInfoId}`;
		const response = await fetch(url, { method: "DELETE", headers: authHeader });
		const data = await response.json();

		if (!(data.status && data.status === "error")) {
			setIsVaultChanged(true);
			toast.success("Item successfully deleted");
		}
	}


	/* Check for breached password */
	const checkBreached = async (event) => {
		let text;

		if (event.target.className === "check-btn-edit") text = newPasswordRef.current.value;
		else text = passwordRef.current.value;

		if (text === "") {
			toast.error("Please fill the password field");
			return;
		}

		const times = await hibp.checkBreachedPassword(text);
		toast.info("Your password has been breached " + times + " times");
	};

	/* Generate secure random password */
	const generateSecurePassword = (event) => {
		const password = generator.generate({
			length: 14,
			numbers: true,
			uppercase: true,
			excludeSimilarCharacters: true,
		});

		if (event.target.className === "generate-btn-edit")
			newPasswordRef.current.value = password;
		else
			passwordRef.current.value = password;
	};

	// Add Item Vault
	async function addLogin() {
		if (nameRef.current.value !== "" && usernameRef.current.value !== "" && passwordRef.current.value !== "") {
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
				nameRef.current.value = "";
				usernameRef.current.value = "";
				passwordRef.current.value = "";
				toast.success("Item successfully added");
			}
		} else {
			toast.error("Please fill the required field");
		}
	}

	async function addNote() {
		if ( nameNoteRef.current.value !== "" && messageNoteRef.current.value !== "" ) {
			let userData = {
				name: nameNoteRef.current.value,
				notes: messageNoteRef.current.value,
			};

			userData = await userDataEncryptionHandler(userData);

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

			if (!(data.status && data.status === "error")) {
				setIsVaultChanged(true);
				nameNoteRef.current.value = "";
				messageNoteRef.current.value = "";
				toast.success("Item successfully added");
			}
		} else {
			toast.error("Please fill the required field");
		}
	}

	// for conditional rendering
	const noteHandler = () => {
		setisNote(true);
		setIsEditLogin(false);
	};

	const loginHandler = () => {
		setisNote(false);
		setIsEditNote(false);
	};

	// handles button click for each login info item
	const editLoginHandler = (index) => {
		setIndexEditLogin(index);
		setIsEditLogin(true);

		setNewLoginNameValue(authCtx.nameLoginVault[index]);
		setNewLoginUsernameValue(authCtx.usernameLoginVault[index]);
		setNewLoginPasswordValue(authCtx.passwordLoginVault[index]);
	};

	const editNoteHandler = async(index) => {
		setIndexEditNote(index);
		setIsEditNote(true);

		setNewNoteNameValue(authCtx.nameNoteVault[index]);
		setNewNoteMessageValue(authCtx.messageNoteVault[index]);
	};

	// Password toggle handler
	const [passwordShown, setPasswordShown] = useState(false);
	const togglePassword = () => {
		setPasswordShown(!passwordShown);
	};
	
	/* HANDLERS FOR LOGININFO FORMS IN EDIT MODE */
	const [newLoginNameValue, setNewLoginNameValue] = useState("");
	const [newLoginUsernameValue, setNewLoginUsernameValue] = useState("");
	const [newLoginPasswordValue, setNewLoginPasswordValue] = useState("");

	const handleEditLoginName = event => {
		setNewLoginNameValue(event.target.value);
	};

	const handleEditLoginUsername = event => {
		setNewLoginUsernameValue(event.target.value);
	};

	const handleEditLoginPassword = event => {
		setNewLoginPasswordValue(event.target.value);
	};

	/* HANDLERS FOR SECURENOTE FORMS IN EDIT MODE */
	const [newNoteNameValue, setNewNoteNameValue] = useState("");
	const [newNoteMessageValue, setNewNoteMessageValue] = useState("");

	const handleEditNoteName = event => {
		setNewNoteNameValue(event.target.value);
	};

	const handleEditNoteMessage = event => {
		setNewNoteMessageValue(event.target.value);
	};

	// yang akan ditampilkan di browser
	return (
		<div className="main-container">
			{authCtx.vault && (
				<>
					<div className="navbar-vault">
						<img src="PG_logo.png" className="app-logo" alt="app logo" />
						<AccountCircleIcon sx={{ color: deepPurple[50] }} fontSize="large" className="iconProfile"/>
						<p className="profile">{authCtx.vault.profile.name}</p>
						<button className="logoutButtonVault" onClick={logoutHandler}>
							Logout
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
													onClick={checkBreached}
													className="check-btn"
												/>
												<input
													type="button"
													value="Generate Password"
													onClick={generateSecurePassword}
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
													ref={newLoginNameRef}
													value={newLoginNameValue}
													onChange={handleEditLoginName}
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
													value={newLoginUsernameValue}
													onChange={handleEditLoginUsername}
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
													ref={newPasswordRef}
													value={newLoginPasswordValue}
													onChange={handleEditLoginPassword}
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
													onClick={checkBreached}
													className="check-btn-edit"
													value="Alert Breached"
												/>
												<input
													type="button"
													onClick={generateSecurePassword}
													className="generate-btn-edit"
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
								{!isTrueLogin && (
									<div className="empty-state">
									<img
										src="https://assets.ccbp.in/frontend/react-js/no-passwords-img.png"
										className="empty-image"
										alt="no passwords"
									/>
									<p className="no-passwords">There's No Login Info Item</p>
									</div>
								)}
								{isTrueLogin && (
									<ul className="result-container">
										{authCtx.nameLoginVault.map(displayLogin)}
									</ul>
								)}
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
													ref={nameNoteRef}
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
													ref={messageNoteRef}
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
													ref={newNoteNameRef}
													value={newNoteNameValue}
													onChange={handleEditNoteName}
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
													ref={newNoteMessageRef}
													value={newNoteMessageValue}
													onChange={handleEditNoteMessage}
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
								{!isTrue && (
									<div className="empty-state">
										<img
										src="https://assets.ccbp.in/frontend/react-js/no-passwords-img.png"
										className="empty-image"
										alt="no passwords"
										/>
										<p className="no-passwords">There's No Secure Note Item</p>
									</div>
								)}
								{isTrue && (
									<ul className="result-container">
										{authCtx.nameNoteVault.map(displayNote)}
									</ul>
								)}
							</div>
						</>
					)}
				</>
			)}
		</div>
	);
}

export default NewVault;
