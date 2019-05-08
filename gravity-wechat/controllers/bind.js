const config = require('../config.js');
const httpsRequest = require('../libs/httpsRequest.js');
const Component = require('../models/component.js');

const component_appid = config.component_appid;

if (!component_appid) {
	throw 'Please check config.js!';
}

let options = {
	hostname: 'api.weixin.qq.com',
	path: '/cgi-bin/component/api_create_preauthcode?component_access_token=',
	method: 'POST',
	headers: { 'Content-Type': 'application/json' }
};

exports.handleBind = (req, res, next) => {
	const id = req.params.id;
	Component.findOne({}, (err, doc) => {
		if (err) return next(err);
		if (!doc) return send('No component found!');
		// Request pre_auth_code
		options.path += doc.component_access_token;
		console.log(options);
		const postData = JSON.stringify({ component_appid });
		console.log(postData);
		httpsRequest(options, postData, (err, data) => {
			if (err) return next(err);
			if (!data.pre_auth_code) return send(`No pre_auth_code in:\n${data}`);
			const url = 'https://mp.weixin.qq.com/cgi-bin/componentloginpage?component_appid=' + component_appid
				+ '&pre_auth_code=' + data.pre_auth_code + '&redirect_uri=https://gravity.nodejs.top/wechat/bound/'
				+ id;
			res.send({ url });
		});
	});
};
