import React, { useState, useEffect, useCallback } from 'react';

/*
[TODO]: local storage is cleared whenever the user,
		1. logout
		2. closing the page
*/
let logoutTimer;

// init values
const AuthContext = React.createContext({
	token: '',
	isLoggedIn: false,
	vault: '',
	login: (token) => {},
	logout: () => {},
	sync: (vault) => {},
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
	const userIsLoggedIn = !!token;


	const logoutHandler = useCallback(() => {
		setToken(null);
		setVault(null);
		localStorage.removeItem('token');
		localStorage.removeItem('expirationTime');

		if (logoutTimer) {
			clearTimeout(logoutTimer);
		}
	}, [])


	const loginHandler = (token, expirationTime) => {
		setToken(token);
		localStorage.setItem('token', token);
		localStorage.setItem('expirationTime', expirationTime);

		const remainingTime = calculateRemainingTime(expirationTime);

		logoutTimer = setTimeout(logoutHandler, remainingTime);
	};

	// only store vault data in memory
	const vaultHandler = (vault) => {
		setVault(vault);
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
		login: loginHandler,
		logout: logoutHandler,
		sync: vaultHandler,
	};

	return (
	<AuthContext.Provider value={contextValue}>
		{props.children}
	</AuthContext.Provider>
	);
};

export default AuthContext;