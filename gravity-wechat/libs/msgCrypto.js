const crypto = require('crypto');
const pkcs7Encoder = require('./pkcs7Encoder');

module.exports = class msgCrypto {
	constructor(appid, encodingKey) {
		if (!appid || !encodingKey) {
			throw new Error('please check arguments');
		}
		var AESKey = new Buffer(encodingKey + '=', 'base64');
		if (AESKey.length !== 32) {
			throw new Error('encodingKey invalid');
		}
		this.appid = appid;
		this.AESKey = AESKey;
		this.iv = AESKey.slice(0, 16);
	}
	encryptMsg(text) {
		var randomString = crypto.pseudoRandomBytes(16);
		var msg = new Buffer(text);
		var id = new Buffer(this.appid);
		var msgLength = new Buffer(4);
		msgLength.writeUInt32BE(msg.length, 0);
		var bufMsg = Buffer.concat([randomString, msgLength, msg, id]);
		var encoded = pkcs7Encoder.encode(bufMsg);
		var cipher = crypto.createCipheriv('aes-256-cbc', this.AESKey, this.iv);
		cipher.setAutoPadding(false);
		var cipheredMsg = Buffer.concat([cipher.update(encoded), cipher.final()]);
		return cipheredMsg.toString('base64');
	}
	decryptMsg(msg_encrypt) {
		try {
			var decipher = crypto.createDecipheriv('aes-256-cbc', this.AESKey, this.iv);
			decipher.setAutoPadding(false);
			var deciphered = Buffer.concat([decipher.update(msg_encrypt, 'base64'), decipher.final()]);
			deciphered = pkcs7Encoder.decode(deciphered);
			var content = deciphered.slice(16);
			var length = content.slice(0, 4).readUInt32BE(0);
		} catch (err) {
			throw new Error(err);
		}
		return content.slice(4, length + 4).toString();
	}
};
