const config = require('../config.js');
const { handleFail } = require('../libs/handle.js');

// const ip_whitelist = config.ip_whitelist;
const ip_whitelist = ['127.0.0.1'];

if (!ip_whitelist) {
	throw 'Please check config.js!';
}

exports.ipCheck = (req, res, next) => {
	const ip = req.headers['x-forwarded-for'] || req.ip;
	if (ip_whitelist.indexOf(ip) < 0) {
		return handleFail(req, res, `[check] [ip]`);
	}
	next();
};
