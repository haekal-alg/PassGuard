const crypto = require("crypto");

const ITERATION = 100000;
const SALTLENGTH = 64;

function getSalt() {
  const randomSalt = crypto.randomBytes(SALTLENGTH).toString("hex");
  return randomSalt;
}

function hashDataWithSalt(payload, salt) {
  const derivedKey = crypto
    .pbkdf2Sync(payload, salt, ITERATION, 64, "sha256")
    .toString("hex");
  return derivedKey;
}

function hashData(payload) {
  const randomSalt = getSalt();
  const derivedKey = crypto
    .pbkdf2Sync(payload, randomSalt, ITERATION, 64, "sha256")
    .toString("hex");

  return [derivedKey, randomSalt];
}

function aes256(iv, payload, key) {
  // Creating Cipheriv with its parameter
  let cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);

  // Updating text
  let encrypted = cipher.update(payload);

  // Using concatenation
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  const encryptedData = encrypted.toString("hex")
  return encryptedData;
}

module.exports.hashData = hashData;
module.exports.hashDataWithSalt = hashDataWithSalt;
module.exports.aes256 = aes256;
