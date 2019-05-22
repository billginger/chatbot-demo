const config = require('../config.js');
const { handleFail, handleSuccess } = require('../libs/handle.js');

const ip_whitelist = config.ip_whitelist;

if (!ip_whitelist) {
	throw 'Please check config.js!';
}

exports.ipCheck = (req, res, next) => {
	const ip = req.headers['x-forwarded-for'] || req.ip;
	if (ip_whitelist.indexOf(ip) < 0) {
		return handleFail(req, res, `[check] [ip]`);
	}
	handleSuccess(req, res, `[check] [ip]`);
	next();
};
