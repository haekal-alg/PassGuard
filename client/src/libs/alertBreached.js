const crypto = require('crypto');

// https://stackoverflow.com/questions/2901102/how-to-format-a-number-with-commas-as-thousands-separators
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/* 
Description:
    This function will call HIBP API to check how many times has that password 
    have been breached.
Parameter:
    Plaintext password.
Return:
    Number of times (string) that password has been breached.
*/
export async function checkBreachedPassword(password) {
    // generate sha1 hash
    const passwordHash = crypto.createHash('sha1').update(password).digest("hex").toUpperCase();
    const prefix = passwordHash.substring(0, 5);
    const suffix = passwordHash.substring(5, passwordHash.length);

    // send prefix to api
    const url = "https://api.pwnedpasswords.com/range/" + prefix;
    const response = await fetch(url);
    const data = await response.text();
    
    // parse data
    const arrayOfHashes = data.split("\n");
    let num  = "0";
    for (let i = 0; i < arrayOfHashes.length; i++) {
        const [ currentHash, breachedNumber ] = arrayOfHashes[i].split(":");

        if (currentHash === suffix) {
            num = breachedNumber;
            break;
        }
    }

    return numberWithCommas(num);
}