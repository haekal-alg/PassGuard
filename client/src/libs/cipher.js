const crypto = require('crypto');

const HASH_TYPE = 'sha256'
const ITERATION = 10000;

// these length are in bytes
const SYMKEY_LENGTH = 32; // or 256 bit
const SALT_LENGTH = 64;
const IV_LENGTH =  16;
const KEYLENGTH = 32;

function generateSymmetricKey() {
    return crypto.randomBytes(SYMKEY_LENGTH);
}

function generateSalt() {
    return crypto.randomBytes(SALT_LENGTH);
}

function generateIV() {
    return crypto.randomBytes(IV_LENGTH);
}

function hashDataWithSalt(payload, salt) {
    const derivedKey = crypto.pbkdf2Sync(payload, salt, ITERATION, KEYLENGTH, HASH_TYPE);
    return derivedKey;
}

function hashData(payload) {
    const randomSalt = generateSalt();
    const derivedKey = crypto.pbkdf2Sync(payload, randomSalt, ITERATION, KEYLENGTH, HASH_TYPE);

    return [derivedKey, randomSalt];
}

function aes256Encrypt(iv, payload, key) {
    let cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
    let encrypted = cipher.update(payload);
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    return encrypted;
}

function aes256Decrypt(iv, encrypted, key) {
    let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
    let decrypted = decipher.update(encrypted);
    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted;
}

// paramaters are plaintext user input (string)
function encryptPasswordAndHashKey(emailField, masterPassField) {
	const masterKey = hashDataWithSalt(masterPassField, emailField); // BYTE ARRAY
	const symmetricKey = generateSymmetricKey(); // BYTE ARRAY

	const iv = generateIV();

    //console.log("[ORIGINAL] masterkey => ", Buffer.from(masterKey).toString("base64"));
    //console.log("[ORIGINAL] symkey => ", Buffer.from(symmetricKey).toString("base64"));
    //console.log("[ORIGINAL] IV => ", Buffer.from(iv).toString("base64"));
	
	const masterPasswordHash = hashDataWithSalt(masterPassField, masterKey); // BYTE ARRAY
	const protectedSymmetricKey = aes256Encrypt(iv, symmetricKey, masterKey);

	return [iv, masterPasswordHash, protectedSymmetricKey];
}

module.exports.generateSymmetricKey = generateSymmetricKey;
module.exports.generateIV = generateIV;
module.exports.hashData = hashData;
module.exports.hashDataWithSalt = hashDataWithSalt;
module.exports.aes256Encrypt = aes256Encrypt;
module.exports.aes256Decrypt = aes256Decrypt;
module.exports.encryptPasswordAndHashKey = encryptPasswordAndHashKey