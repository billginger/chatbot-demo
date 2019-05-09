const config = require('../config.js');
const httpsRequest = require('../libs/httpsRequest.js');

const component_appid = config.component_appid;

if (!component_appid) {
	throw 'Please check config.js!';
}

const options = {
	hostname: 'api.weixin.qq.com',
	method: 'POST',
	headers: { 'Content-Type': 'application/json' }
};

exports.accountAuth = (req, res, next) => {
	const id = req.params.id;
	const path = `/cgi-bin/component/api_create_preauthcode?component_access_token=${req.component.accessToken}`;
	const postOptions = { ...options, path };
	const postData = JSON.stringify({ component_appid });
	httpsRequest(postOptions, postData, (err, data) => {
		if (err) return next(err);
		if (!data.pre_auth_code) return res.send(`No pre_auth_code in:\n${data}`);
		const url = `https://mp.weixin.qq.com/cgi-bin/componentloginpage?component_appid=${component_appid}
			&pre_auth_code=${data.pre_auth_code}&redirect_uri=https://gravity.nodejs.top/wechat/bind/${id}`;
		res.send({ url });
	});
};
