const crypto = require('crypto');
const fs = require('fs');

const {ENCRYPT_ALGO, ENCRYPT_KEY} = require('../../config/keys');

var  hashKey = crypto.createHash('sha256').update(String(ENCRYPT_KEY)).digest('base64').substr(0,32);
const iv = crypto.randomBytes(16);

function Encrypt (inputFile, encryptedFile, hashKey, iv,callback) {

    const readStream = fs.createReadStream(inputFile);
    const writeStream = fs.createWriteStream(encryptedFile);
    const cipher = crypto.createCipheriv(ENCRYPT_ALGO, hashKey, iv);
    
    readStream.pipe(cipher).pipe(writeStream);
    writeStream.on('finish',callback);
}

exports.EncryptFile = (inputFile,encryptedFile,callback) => {
    Encrypt(inputFile,encryptedFile,hashKey,iv,callback)
}

function Decrypt (encryptedFile, decryptedFile, key, iv,callback) {
    const readStream = fs.createReadStream(encryptedFile);
    const writeStream = fs.createWriteStream(decryptedFile);
    const decipher = crypto.createDecipheriv(ENCRYPT_ALGO, key, iv);

    readStream.pipe(decipher).pipe(writeStream);
    writeStream.on('finish',callback);
}

exports.DecryptFile = (encryptedFile, decryptedFile,callback) =>{
    Decrypt(encryptedFile, decryptedFile, hashKey, iv,callback) 
}