const config = require('../config.js');
const httpsRequest = require('../libs/httpsRequest.js');

const component_appid = config.component_appid;

if (!component_appid) {
	throw 'Please check config.js!';
}

let options = {
	hostname: 'api.weixin.qq.com',
	method: 'POST',
	headers: { 'Content-Type': 'application/json' }
};

exports.getAuthorization = (req, res, next) => {
	const authorization_code = req.query.auth_code;
	options.path = `/cgi-bin/component/api_query_auth?component_access_token=${req.component.accessToken}`;
	const postData = JSON.stringify({ component_appid, authorization_code });
	httpsRequest(options, postData, (err, data) => {
		if (err) return next(err);
		if (!data.authorization_info) return send(`No authorization_info in:\n${data}`);
		req.authorization_info = data.authorization_info;
		next();
	});
};

exports.getAuthorizer = (req, res, next) => {
	const authorizer_appid = req.authorization_info.authorizer_appid;
	options.path = `/cgi-bin/component/api_get_authorizer_info?component_access_token=${req.component.accessToken}`;
	const postData = JSON.stringify({ component_appid, authorizer_appid });
	httpsRequest(options, postData, (err, data) => {
		if (err) return next(err);
		if (!data.authorizer_info) return send(`No authorizer_info in:\n${data}`);
		req.authorizer_info = data.authorizer_info;
		next();
	});
};

exports.wechatBind = (req, res, next) => {
	const authorization_info = req.authorization_info;
	const authorizer_info = req.authorizer_info;
	console.log('------');
	console.log(authorization_info);
	console.log('------');
	console.log(authorizer_info);
	console.log('------');
	res.send('ok');
};
