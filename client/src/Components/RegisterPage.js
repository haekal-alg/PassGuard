import "./RegisterPage.css";
import { useRef } from "react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const cipher = require('./../libs/cipher');

function encryptPasswordAndHashKey(emailField, masterPassField) {
	const masterKey = cipher.hashDataWithSalt(masterPassField, emailField); // 128 bit
	const symmetricKey = cipher.generateSymmetricKey();
	const iv = cipher.generateIV();
	
	const masterPasswordHash = cipher.hashDataWithSalt(masterPassField, masterKey); // 128 bit
	const protectedSymmetricKey = cipher.aes256(iv, masterKey, symmetricKey); // 288 bit

	return [iv, masterPasswordHash, protectedSymmetricKey];
}

function RegisterPage() {
	const inputEmail = useRef(null);
	const inputUsername = useRef(null);
	const inputMasterPassword = useRef(null);
	const inputMasterPasswordRetype = useRef(null);

	async function createAccountHandler() {
		if (inputEmail.current.value === '' ) {
			// this works 
			//toast.warning('Warning Notification !', {
			//	position: toast.POSITION.TOP_LEFT
			//});
			if (/^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w{2,3})+$/.test(inputEmail.current.value))  {
				alert("Please enter a valid email address");
				return;
			}
			alert('Please enter an email address');
			return;
		}
		
		if (inputUsername.current.value === '' ) {
			alert('Please enter the username field');
			return;
		}
		if (inputMasterPassword.current.value === '' ) {
			alert('Please enter a master password');
			return;
		}
		if (inputMasterPasswordRetype.current.value === '' ) {
			alert('Please Re-type the master password');
			return;
		}
		if (inputMasterPassword.current.value !== inputMasterPasswordRetype.current.value) {
			alert('Master password that you have entered is different, try again!');
			return;
		}

		var toastID = toast.loading("Please wait...");
		await new Promise(r => setTimeout(r, 50)); // have to add delay. if not, somehow the notification doesnt show up

		const nameField = inputUsername.current.value;
		const emailField = inputEmail.current.value;
		const masterPassField = inputMasterPassword.current.value;
		const [iv, masterPasswordHash, protectedSymmetricKey] = encryptPasswordAndHashKey(emailField, masterPassField);

		// send data to server at /api/register
		const registerData = {
				name		: nameField,
				email		: emailField,
				password	: masterPasswordHash,
				key			: protectedSymmetricKey,
				iv			: iv.toString('hex')
		}
		console.log(registerData);
		// [TODO] simpan url dalam config file atau variabel
		const response = await fetch('http://localhost:8080/api/register', {
							method: 'POST',
							body: JSON.stringify(registerData), // you have to use json.stringify otherwise it throws cors error? wat?!?
							headers: { 'Content-type': 'application/json' }
						});
			
		const data = await response.json();
		if (data.message === 'Duplicate email') {
			toast.update(toastID, { render: "This email has already been taken", type: "error" });
			setTimeout(() => { toast.dismiss(toastID); }, 2000);
			return;
		}
		
		toast.update(toastID, { render: "Your account has been successfully registered ", type: "success" });
		setTimeout(() => { toast.dismiss(toastID); }, 2000);
	}

	return (
		<div className="body">
			<div className="topnav">
				<a href="#Logo">Logo</a>
				<a href="#PassGuard">PassGuard</a>
				<div className="topnav-right">
					<a href="#Home">Home</a>
					<a href="#Login">Login</a>
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
							ref={inputMasterPassword}
							type="password"
							placeholder="Master Password"
						/>
					</label>

					<label id="master_password">
						<input
							ref={inputMasterPasswordRetype}
							type="password"
							placeholder="Re-Type Master Password"
						/>
					</label>

					{/* [TODO] pas di textnya di klik redirect ke login page */}
					<p className="forgot">Already have an account? Click here</p>

					<div>
						<input
							type="button"
							value="Create Account"
							className="login_button"
							onClick={createAccountHandler}
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