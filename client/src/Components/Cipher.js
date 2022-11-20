const crypto = require('crypto');

const ITERATION = 100000;
const SALTLENGTH = 64;

function getSalt() {
    const randomSalt = crypto.randomBytes(SALTLENGTH).toString('hex');
    return randomSalt;
}

function hashDataWithSalt(payload, salt) {
    const derivedKey = crypto.pbkdf2Sync(payload, salt, ITERATION, 64, 'sha512').toString('hex');
    return derivedKey;
}

function hashData(payload) {
    const randomSalt = getSalt();
    const derivedKey = crypto.pbkdf2Sync(payload, randomSalt, ITERATION, 64, 'sha512').toString('hex');

    return [derivedKey, randomSalt];
}


module.exports.hashData = hashData;
module.exports.hashDataWithSalt = hashDataWithSalt;