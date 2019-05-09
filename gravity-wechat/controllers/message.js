const crypto = require('crypto');
const xml2js = require('xml2js');
const config = require('../config.js');
const { log } = require('../libs/log.js');
const msgCrypto = require('../libs/msgCrypto');

const parser = new xml2js.Parser({ explicitArray: false });

const component_appid = config.component_appid;
const component_appsecret = config.component_appsecret;
const verification_token = config.verification_token;
const encoding_key = config.encoding_key;

if (!component_appid || !component_appsecret || !verification_token || !encoding_key) {
	throw 'Please check config.js!';
}

const xmlParsing = (req, res, next, data) => {
	parser.parseString(data, (err, result) => {
		if (err) {
			log.error(err);
			return res.sendStatus(403);
		}
		log.debug(result);
		const encrypt = result.Encrypt;
		if (!encrypt) {
			log.error(`No Encrypt in:\n${data}`);
			return res.sendStatus(403);
		}
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
		log.info(xml);
		parser.parseString(xml, (err, result) => {
			if (err) return log.error(err);
			log.debug(result);
			req.xml = xml;
			req.message = result.xml;
			next();
		});
	});

};

exports.getMessage = (req, res, next) => {
	let data = '';
	req.setEncoding('utf8');
	req.on('data', d => {
		data += d;
	});
	req.on('end', () => {
		xmlParsing(req, res, next, data);
	});
};

exports.handleMessage = (req, res, next) => {
	const ToUserName = req.message.ToUserName;
	log.debug(ToUserName);
};
