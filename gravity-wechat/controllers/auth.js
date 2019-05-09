const config = require('../config.js');
const { log } = require('../libs/log.js');
const httpsRequest = require('../libs/httpsRequest.js');
const Component = require('../models/component.js');
const Account = require('../models/account.js');

const component_appid = config.component_appid;
const component_appsecret = config.component_appsecret;

if (!component_appid || !component_appsecret) {
	throw 'Please check config.js!';
}

const options = {
	hostname: 'api.weixin.qq.com',
	method: 'POST',
	headers: { 'Content-Type': 'application/json' }
};

const refreshAccountToken = (component_access_token, authorizer_appid, authorizer_refresh_token) => {
	const path = `/cgi-bin/component/api_authorizer_token?component_access_token=${component_access_token}`;
	const postOptions = { ...options, path };
	const postData = JSON.stringify({ component_appid, authorizer_appid, authorizer_refresh_token });
	httpsRequest(postOptions, postData, (err, data) => {
		if (err) return log.error(err);
		if (!data.authorizer_access_token) return log.error(`No authorizer_access_token in:\n${data}`);
		// Save new authorizer_access_token
		const appid = authorizer_appid;
		const accessToken = data.authorizer_access_token;
		const refreshToken = data.authorizer_refresh_token;
		Account.updateOne({ appid }, { accessToken, refreshToken }, err => {
			if (err) return log.error(err);
			log.info('authorizer_access_token has been updated!');
		});
	});
};

const refreshAccountsToken = token => {
	Account.find({ isDeleted: false }, 'appid refreshToken', (err, accounts) => {
		if (err) return log.error(err);
		if (!accounts) return;
		for (let account of accounts) {
			refreshAccountToken(token, account.appid, account.refreshToken);
		}
	});
};

const getComponentAccessToken = (xml, json) => {
	const component_verify_ticket = json.ComponentVerifyTicket;
	if (!component_verify_ticket) {
		return log.error(`No ComponentVerifyTicket in:\n${xml}`);
	}
	const anHourAgo = new Date() - 3600000;
	Component.findOne({}, (err, component) => {
		if (err) return log.error(err);
		// if (component && component.updatedAt > anHourAgo) return;
		// Request new component_access_token
		const path = '/cgi-bin/component/api_component_token';
		const postOptions = { ...options, path };
		const postData = JSON.stringify({ component_appid, component_appsecret, component_verify_ticket });
		httpsRequest(postOptions, postData, (err, data) => {
			if (err) return log.error(err);
			if (!data.component_access_token) return log.error(`No component_access_token in:\n${data}`);
			// Save new component_access_token
			const verifyTicket = component_verify_ticket;
			const accessToken = data.component_access_token;
			Component.updateOne({}, { verifyTicket, accessToken }, { upsert: true }, err => {
				if (err) return log.error(err);
				log.info('component_access_token has been updated!');
			});
			// Refresh Accounts Token
			refreshAccountsToken(data.component_access_token);
		});
	});
};

const updateAuthorizer = (xml, json) => {
	log.debug('will update Authorizer');
}

exports.handleAuth = (req, res) => {
	const xml = req.xml;
	const json = req.json;
	const infoType = json.InfoType;
	if (!infoType) {
		return log.error(`No InfoType in:\n${xml}`);
	}
	switch (infoType) {
		case 'component_verify_ticket':
			getComponentAccessToken(xml, json);
			break;
		case 'unauthorized':
			updateAuthorizer(xml, json);
			break;
		default:
			log.warn(`Unknow InfoType in:\n${xml}`);
	}
};
