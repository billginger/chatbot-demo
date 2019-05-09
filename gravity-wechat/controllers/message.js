const crypto = require('crypto');
const config = require('../config.js');
const xmlPick = require('../libs/xmlPick.js');
const { log } = require('../libs/log.js');
const msgCrypto = require('../libs/msgCrypto');

const component_appid = config.component_appid;
const component_appsecret = config.component_appsecret;
const verification_token = config.verification_token;
const encoding_key = config.encoding_key;

if (!component_appid || !component_appsecret || !verification_token || !encoding_key) {
	throw 'Please check config.js!';
}

exports.message = (req, res) => {
	let data = '';
	req.setEncoding('utf8');
	req.on('data', d => {
		data += d;
	});
	req.on('end', () => {
		// Debug
		log.debug(data);
		// XML Parsing
		const encrypt = xmlPick(data, 'Encrypt');
		if (!encrypt) {
			log.error(`No Encrypt in:\n${data}`);
			return res.sendStatus(403);
		}
		// Debug
		log.debug(req.query);
		// Signature Verification
		const sha1 = crypto.createHash('sha1');
		const timestamp = req.query.timestamp;
		const nonce = req.query.nonce;
		const signature = sha1.update([verification_token, timestamp, nonce, encrypt].sort().join('')).digest('hex');
		const msgSignature = req.query.msg_signature;
		if (signature != msgSignature) {
			log.error('Verify signature failed!');
			return res.sendStatus(403);
		}
		res.send('success');
		// Message Decryption
		const xml = new msgCrypto(component_appid, encoding_key).decryptMsg(encrypt);
		// Debug
		log.debug(xml);
		// Waiting
	});
};
