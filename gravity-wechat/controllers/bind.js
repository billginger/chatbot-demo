const config = require('../config.js');
const { log } = require('../libs/log.js');
const httpsRequest = require('../libs/httpsRequest.js');
const Account = require('../models/account.js');

const component_appid = config.component_appid;

if (!component_appid) {
	throw 'Please check config.js!';
}

const options = {
	hostname: 'api.weixin.qq.com',
	method: 'POST',
	headers: { 'Content-Type': 'application/json' }
};

exports.getAuthorization = (req, res, next) => {
	const authorization_code = req.query.auth_code;
	const path = `/cgi-bin/component/api_query_auth?component_access_token=${req.component.accessToken}`;
	const postOptions = { ...options, path };
	const postData = JSON.stringify({ component_appid, authorization_code });
	httpsRequest(postOptions, postData, (err, data) => {
		if (err) return next(err);
		if (!data.authorization_info) return res.send(`No authorization_info in:\n${data}`);
		req.authorization_info = data.authorization_info;
		next();
	});
};

exports.getAuthorizer = (req, res, next) => {
	const authorizer_appid = req.authorization_info.authorizer_appid;
	const path = `/cgi-bin/component/api_get_authorizer_info?component_access_token=${req.component.accessToken}`;
	const postOptions = { ...options, path };
	const postData = JSON.stringify({ component_appid, authorizer_appid });
	httpsRequest(postOptions, postData, (err, data) => {
		if (err) return next(err);
		if (!data.authorizer_info) return res.send(`No authorizer_info in:\n${data}`);
		req.authorizer_info = data.authorizer_info;
		next();
	});
};

exports.updateAccount = (req, res, next) => {
	const brand = req.params.id;
	const appid = req.authorization_info.authorizer_appid;
	const data = {
		appid,
		accessToken: req.authorization_info.authorizer_access_token,
		refreshToken: req.authorization_info.authorizer_refresh_token,
		funcInfo: req.authorization_info.func_info,
		name: req.authorizer_info.nick_name,
		avatar: req.authorizer_info.head_img,
		serviceType: req.authorizer_info.service_type_info,
		verifyType: req.authorizer_info.verify_type_info,
		originalId: req.authorizer_info.user_name,
		alias: req.authorizer_info.alias,
		qrcodeUrl: req.authorizer_info.qrcode_url,
		businessInfo: req.authorizer_info.business_info,
		idc: req.authorizer_info.idc,
		principalName: req.authorizer_info.principal_name,
		signature: req.authorizer_info.signature,
		brand,
		isDeleted: false
	};
	Account.countDocuments({ appid }, (err, count) => {
		if (err) return next(err);
		if (count) {
			const warnMessage = 'Binding failed! Already bound to other brand.';
			log.warn(warnMessage);
			return res.send(warnMessage);
		}
		Account.updateOne({ appid }, data, { upsert: true }, err => {
			if (err) return next(err);
			log.info('Account binding success!');
			next();
		});
	});
};

exports.updatePortal = (req, res, next) => {
	const id = req.params.id;
	const wechat = req.authorizer_info.nick_name;
	const postOptions = {
		hostname: 'gravity.nodejs.top',
		path: `/api/brand/wechat/bind/${id}`,
		method: 'POST',
		headers: { 'Content-Type': 'application/json' }
	};
	const postData = JSON.stringify({ wechat });
	httpsRequest(postOptions, postData, (err, data) => {
		if (err) return next(err);
		const url = `https://gravity.nodejs.top/brand/${id}`;
		res.redirect(url);
	});
};
