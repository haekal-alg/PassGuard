/* Page sementara untuk menampung berbagai modul/komponen yang belum di integrasi*/
import React, { useRef, useContext, useEffect, useState } from "react";
import AuthContext from '../store/auth-context';

const cipher = require("../libs/cipher");
const hibp = require("../libs/alertBreached");
var generator = require('generate-password');


function TestPage() {
    const nameRef = useRef(null);
    const usernameRef = useRef(null);
    const passwordRef = useRef(null);
    
    const authCtx = useContext(AuthContext);

    const [ globalSymkey ] = useState(localStorage.getItem("symkey"));

    const [ isVaultChanged, setIsVaultChanged ] = useState(false);

    // This hook will get all user data when the page is first opened OR user make changes to their vault
    // The data is then parsed and displayed accordingly on the page
    useEffect(() => {
        /* [TODO] add validation. if error occured do not sync */
        async function syncVault() {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/sync`, {
                headers: { "Authorization": 'Bearer ' + authCtx.token }
            });
            const data = await response.json();
            console.log("syncvault() => ", data)

            // store user data in memory
            authCtx.sync(data);
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
                const protectedSymmKey = Buffer.from(data.profile.protectedKey, "base64");
                const masterKey = authCtx.masterKey;

                symkey = cipher.aes256Decrypt(iv, protectedSymmKey, masterKey);
                symkey = Buffer.from(symkey).toString("base64");

                authCtx.save(symkey); // save to local storage
            }
            
            // Parse encrypted user data
            symkey = Buffer.from(globalSymkey, "base64");

            (data.loginData).forEach(function (item) {
                const itemName = Buffer.from(item.name, "base64");
                const decrypted = cipher.aes256Decrypt(iv, itemName, symkey).toString();

                console.log(`${item.name} => ${decrypted}`);
            });
            
        }

        parseData();
    }, [isVaultChanged]);


    // return a json object with all its values encrypted
    async function userDataEncryptionHandler(userData) {
        const symkey = Buffer.from(globalSymkey, "base64");
        const iv = Buffer.from(authCtx.vault.profile.iv, "base64");

        for (let key in userData) {
            const encrypted = cipher.aes256Encrypt(iv, userData[key], symkey);  // encrypt
            userData[key] = Buffer.from(encrypted).toString("base64");          // encode with base64 
        }

        return userData;
    }

    async function createHandler() {
		let userData = {
                    name: nameRef.current.value,
                    username: usernameRef.current.value, 
                    password: passwordRef.current.value
                };

                
        //console.log(userData)

        userData = await userDataEncryptionHandler(userData);
        
        // console.log(userData)
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/user/loginInfo`, {
			method: "POST",
			body: JSON.stringify(userData),
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

    const logoutHandler = () => {
        authCtx.logout();
    }

    return (
        <div>
        {authCtx.vault && (
        <>
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
            
        </>
        )}
        </div>
    );
}
export default TestPage;