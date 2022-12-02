const crypto = require('crypto');

const HASH_TYPE = 'sha256'
const ITERATION = 10000;

// these length are in bytes
const SYMKEY_LENGTH = 32; // or 256 bit
const SALT_LENGTH = 64;
const IV_LENGTH =  16;

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
    const derivedKey = crypto.pbkdf2Sync(payload, salt, ITERATION, 64, HASH_TYPE);
    return derivedKey;
}

function hashData(payload) {
    const randomSalt = generateSalt();
    const derivedKey = crypto.pbkdf2Sync(payload, randomSalt, ITERATION, 64, HASH_TYPE);

    return [derivedKey, randomSalt];
}

function aes256Encrypt(iv, payload, key) {
  // Creating Cipheriv with its parameter
  let cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);

  // Updating text
  let encrypted = cipher.update(payload);

  // Using concatenation
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  //const encryptedData = encrypted.toString("hex")

  return encrypted;
}

function encryptPasswordAndHashKey(emailField, masterPassField) {
	const masterKey = hashDataWithSalt(masterPassField, emailField);
	const symmetricKey = generateSymmetricKey();
	const iv = generateIV();
	
	const masterPasswordHash = hashDataWithSalt(masterPassField, masterKey);
	const protectedSymmetricKey = aes256Encrypt(iv, masterKey, symmetricKey);

	return [iv, masterPasswordHash, protectedSymmetricKey];
}

module.exports.generateSymmetricKey = generateSymmetricKey;
module.exports.generateIV = generateIV;
module.exports.hashData = hashData;
module.exports.hashDataWithSalt = hashDataWithSalt;
module.exports.aes256 = aes256Encrypt;
module.exports.encryptPasswordAndHashKey = encryptPasswordAndHashKey