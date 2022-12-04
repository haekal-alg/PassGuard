/* Page sementara untuk menampung berbagai modul/komponen yang belum di integrasi*/
import React, { useRef, useContext, useEffect, useState } from "react";
import AuthContext from '../store/auth-context';

const hibp = require("../libs/alertBreached");
var generator = require('generate-password');


function TestPage() {
    const nameRef = useRef(null);
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);
    
    const authCtx = useContext(AuthContext);

    const [ isVaultChanged, setIsVaultChanged ] = useState(false);

    // This hook will get all user data when the page is first opened OR user make changes to their vault
    // The data is then parsed and displayed accordingly on the page
    useEffect(() => {
        /* [TODO] add validation. if error occured do not sync */
        async function syncVault() {
            const response = await fetch(`${process.env.process.env.REACT_APP_API_URL}/api/sync`, {
                headers: { "Authorization": 'Bearer ' + authCtx.token }
            });
            let data = await response.json();

            // store user data in memory
            authCtx.sync(data);

            /* [TODO] Parse data here */
            console.log(data);

            setIsVaultChanged(false);
        }
        syncVault();
    }, [isVaultChanged]);

    const logoutHandler = () => {
        authCtx.logout();
    }

    /* Check for breached password */
    const check = async () => {
       const text = passwordRef.current.value;

       if (text === "") {
            alert("Please fill the password field"); 
            return;
        }
        const times = await hibp.checkBreachedPassword(text);
        alert(times);
    }


    /* Generate secure random password */
    function generateSecurePassword() {
        const password = generator.generate({
            length: 14,
            numbers: true,
            uppercase: true,
            excludeSimilarCharacters: true
        });
        passwordRef.current.value = password;
    }

    async function createHandler() {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/loginInfo`, {
			method: "POST",
			body: JSON.stringify({
                userId: authCtx.login,  
				name: nameRef.current.value,
                username:usernameRef.current.value, 
				password: passwordRef.current.value
			}),
			headers: { 
                "Content-type": "application/json" ,
                "Authorization": 'Bearer ' + authCtx.token
            },
		});

        const data = await response.json();
        console.log(data);

        if (!(data.status && data.status === 'error'))
            setIsVaultChanged(true); // has to exist for every handler that changes the vault
    }
    

    return (
        <div>
            <label>Name </label>
            <input ref={nameRef}></input>
            <br />
            <label>Username </label>
            <input ref={usernameRef}></input>
            <br />
            <label>Password </label>
            <input ref={passwordRef}></input>
            <button onClick={check}>Alert Breached</button>
            <button onClick={generateSecurePassword} >Generate Password</button>
            <button onClick={logoutHandler} >Logout</button>
            <br />
            <button onClick={createHandler}>Create</button>
            
        </div>
    );
}
export default TestPage;