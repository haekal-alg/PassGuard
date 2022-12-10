import React, { useState, useEffect, useCallback } from 'react';

/*
[TODO]: local storage is cleared whenever the user,
		1. [DONE] logout
		2. closing the page
*/
let logoutTimer;

// init values
const AuthContext = React.createContext({
	token: '',
	isLoggedIn: false,
	vault: '',
	masterKey: '', // only used in the first time user logged in
	symkey: '',
	login: (token) => {},
	logout: () => {},
	sync: (vault) => {},
	save: (symkey) => {},
});

const calculateRemainingTime = (expirationTime) => {
	const currentTime = new Date().getTime();
	const adjExpirationTime = new Date(expirationTime).getTime();

	const remainingDuration = adjExpirationTime - currentTime;

	return remainingDuration;
};

const retrieveStoredToken = () => {
	const storedToken = localStorage.getItem('token');
	const storedExpirationDate = localStorage.getItem('expirationTime');

	const remainingTime = calculateRemainingTime(storedExpirationDate);

	if (remainingTime <= 0) {
		localStorage.removeItem('token');
		localStorage.removeItem('expirationTime');
		return null;
	}

	return {
		token: storedToken,
		duration: remainingTime,
	};
};

export const AuthContextProvider = (props) => {
	const tokenData = retrieveStoredToken();

	let initialToken;
	if (tokenData) {
		initialToken = tokenData.token;
	}

	const [token, setToken] = useState(initialToken);
	const [vault, setVault] = useState(null);
	const [masterKey, setMasterKey] = useState(null);

	const userIsLoggedIn = !!token;

	const logoutHandler = useCallback(() => {
		setToken(null);
		setVault(null);
		setMasterKey(null);
		localStorage.removeItem('token');
		localStorage.removeItem('expirationTime');
		localStorage.removeItem('symkey');

		if (logoutTimer) {
			clearTimeout(logoutTimer);
		}
	}, [])


	const loginHandler = (token, expirationTime, masterKey) => {
		setToken(token);
		setMasterKey(masterKey);
		localStorage.setItem('token', token);
		localStorage.setItem('expirationTime', expirationTime);

		const remainingTime = calculateRemainingTime(expirationTime);

		logoutTimer = setTimeout(logoutHandler, remainingTime);
	};

	// only store vault data in memory
	const vaultHandler = (vault) => {
		setVault(vault);
	}

	const keyHandler = (symkey) => {
		localStorage.setItem('symkey', symkey);
	}

	useEffect(() => {
		if (tokenData) {
			//console.log(tokenData.duration);
			logoutTimer = setTimeout(logoutHandler, tokenData.duration);
		}
	}, [tokenData, logoutHandler]);


	const contextValue = {
		token: token,
		isLoggedIn: userIsLoggedIn,
		vault: vault,
		masterKey: masterKey,
		login: loginHandler,
		logout: logoutHandler,
		sync: vaultHandler,
		save: keyHandler,
	};

	return (
	<AuthContext.Provider value={contextValue}>
		{props.children}
	</AuthContext.Provider>
	);
};

export default AuthContext;