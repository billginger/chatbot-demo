const config = require('../config.js');
const xmlPick = require('../libs/xmlPick.js');
const { log } = require('../libs/log.js');
const httpsRequest = require('../libs/httpsRequest.js');
const Component = require('../models/component.js');

const component_appid = config.component_appid;
const component_appsecret = config.component_appsecret;

if (!component_appid || !component_appsecret) {
	throw 'Please check config.js!';
}

const options = {
	hostname: 'api.weixin.qq.com',
	path: '/cgi-bin/component/api_component_token',
	method: 'POST',
	headers: { 'Content-Type': 'application/json' }
};

const getComponentAccessToken = xml => {
	const component_verify_ticket = xmlPick(xml, 'ComponentVerifyTicket');
	if (!component_verify_ticket) {
		return log.error(`No ComponentVerifyTicket in:\n${xml}`);
	}
	const postData = JSON.stringify({ component_appid, component_appsecret, component_verify_ticket });
	const anHourAgo = new Date() - 3600000;
	Component.findOne({}, (err, doc) => {
		if (err) return log.error(err);
		if (doc && doc.updatedAt > anHourAgo) return;
		// Request new component_access_token
		httpsRequest(options, postData, (err, data) => {
			if (err) return log.error(err);
			if (!data.component_access_token) return log.error(`No component_access_token in:\n${data}`);
			// Save new component_access_token
			doc = {
				verifyTicket: component_verify_ticket,
				accessToken: data.component_access_token
			};
			Component.updateOne({}, doc, { upsert: true }, err => {
				if (err) return log.error(err);
				log.info('component_access_token has updated!');
			});
		});
	});
};

const updateAuthorizer = xml => {
	log.debug('will update Authorizer');
}

exports.auth = (req, res) => {
	const xml = req.xml;
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
		default:
			log.warn(`Unknow InfoType in:\n${xml}`);
	}
};
