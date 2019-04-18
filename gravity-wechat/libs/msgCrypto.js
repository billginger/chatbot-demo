const crypto = require('crypto');
const pkcs7Encoder = require('./pkcs7Encoder');

module.exports = class msgCrypto {
	constructor(component_appid, encoding_key) {
		if (!component_appid || !encoding_key) {
			throw 'Please check arguments!';
		}
		const AESKey = Buffer.from(encoding_key + '=', 'base64');
		if (AESKey.length != 32) {
			throw 'encoding_key invalid!';
		}
		this.appid = component_appid;
		this.AESKey = AESKey;
		this.iv = AESKey.slice(0, 16);
	}
	encryptMsg(text) {
		const randomBytes = crypto.pseudoRandomBytes(16);
		const msg = Buffer.from(text);
		const appid = Buffer.from(this.appid);
		let msgLength = Buffer.alloc(4);
		msgLength.writeUInt32BE(msg.length, 0);
		const bufMsg = Buffer.concat([randomBytes, msgLength, msg, appid]);
		const encoded = pkcs7Encoder.encode(bufMsg);
		let cipher = crypto.createCipheriv('aes-256-cbc', this.AESKey, this.iv);
		cipher.setAutoPadding(false);
		const cipheredMsg = Buffer.concat([cipher.update(encoded), cipher.final()]);
		return cipheredMsg.toString('base64');
	}
	decryptMsg(msg_encrypt) {
		try {
			let decipher = crypto.createDecipheriv('aes-256-cbc', this.AESKey, this.iv);
			decipher.setAutoPadding(false);
			let deciphered = Buffer.concat([decipher.update(msg_encrypt, 'base64'), decipher.final()]);
			deciphered = pkcs7Encoder.decode(deciphered);
			const content = deciphered.slice(16);
			const length = content.slice(0, 4).readUInt32BE(0);
			return content.slice(4, length + 4).toString();
		} catch (err) {
			throw err;
		}
	}
};
