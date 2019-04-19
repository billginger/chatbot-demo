const crypto = require('crypto');
const config = require('../config.js');
const xmlPick = require('../libs/xmlPick.js');
const { log } = require('../libs/log.js');
const msgCrypto = require('../libs/msgCrypto');
const httpsRequest = require('../libs/httpsRequest.js');
const Component = require('../models/component.js');

const component_appid = config.component_appid;
const component_appsecret = config.component_appsecret;
const verification_token = config.verification_token;
const encoding_key = config.encoding_key;

if (!component_appid || !component_appsecret || !verification_token || !encoding_key) {
	throw 'Please check config.js!';
}

const options = {
	hostname: 'api.weixin.qq.com',
	path: '/cgi-bin/component/api_component_token',
	method: 'POST',
	headers: { 'Content-Type': 'application/json' }
};

const getComponentAccessToken = xml => {
	log.debug(xml);
	const component_verify_ticket = xmlPick(xml, 'ComponentVerifyTicket');
	if (!component_verify_ticket) {
		return log.error(`No ComponentVerifyTicket in:\n${xml}`);
	}
	const postData = JSON.stringify({ component_appid, component_appsecret, component_verify_ticket });
	const anHourAgo = new Date() - 3600;
	log.debug(anHourAgo);
	Component.findOne({}, (err, doc) => {
		if (err) return log.error(err);
		if (doc.updatedAt > anHourAgo) return;
		log.debug('come in!');
		httpsRequest(options, postData, (err, data) => {
			if (err) return log.error(err);
			log.info(data);
		});
	});
};

const updateAuthorizer = xml => {

}

exports.handleAuth = (req, res) => {
	let data = '';
	req.setEncoding('utf8');
	req.on('data', d => {
		data += d;
	});
	req.on('end', () => {
		// XML Parsing
		const encrypt = xmlPick(data, 'Encrypt');
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
		const infoType = xmlPick(xml, 'InfoType');
		if (!infoType) {
			return log.error(`No InfoType in:\n${xml}`);
		}
		switch (infoType) {
			case 'component_verify_ticket':
				getComponentAccessToken(xml);
				break;
			case 'unauthorized':
				updateAuthorizer(xml);
				break;
		}
	});
};
