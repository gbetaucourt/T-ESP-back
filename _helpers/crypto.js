var crypto = require('crypto');
var key = require(__dirname + '/../env').encryptionKey
var algorithm = 'aes256';
var key = '';


module.exports = {
    encrypt: (text) => {
        var cipher = crypto.createCipheriv(algorithm, key);  
        return cipher.update(text, 'utf8', 'hex') + cipher.final('hex');
    },
    decrypt: (text) => {
        var decipher = crypto.createDecipheriv(algorithm, key);
        return decipher.update(text, 'hex', 'utf8') + decipher.final('utf8');
    }
}


assert.equal(decrypted, text);
