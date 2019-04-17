const crypto = require('crypto');
const config = require('../config.js');
const xmlPick = require('../libs/xmlPick.js');
const { log } = require('../libs/log.js');
const msgCrypto = require('../libs/msgCrypto');

const appid = config.appid;
const verification_token = config.verification_token;
const encoding_key = config.encoding_key;

exports.handleAuth = (req, res, next) => {
	let data = '';
	req.setEncoding('utf8');
	req.on('data', d => {
		data += d;
	});
	req.on('end', () => {
		// XML Parsing
		const encrypt = xmlPick(data, 'Encrypt');
		if (!encrypt) {
			log.warn(`Get encrypt failed from:\n${data}`);
			return res.sendStatus(403);
		}
		// Signature Verification
		const sha1 = crypto.createHash('sha1');
		const timestamp = req.query.timestamp;
		const nonce = req.query.nonce;
		const signature = sha1.update([verification_token, timestamp, nonce, encrypt].sort().join('')).digest('hex');
		const msgSignature = req.query.msg_signature;
		if (signature != msgSignature) {
			log.warn('Verify signature failed!');
			return res.sendStatus(403);
		}
		res.send('success');
		// Message Decryption
		const xml = new msgCrypto(appid, encoding_key).decryptMsg(encrypt);
		log.debug(xml);
	});
};
