const config = require('../config.js');
const { log } = require('../libs/log.js');

const ip_whitelist = config.ip_whitelist;

if (!ip_whitelist) {
	throw 'Please check config.js!';
}

exports.ipCheck = (req, res, next) => {
	const ip = req.headers['x-forwarded-for'] || req.ip;
	if (ip_whitelist.indexOf(ip) < 0) {
		log.warn(`IP blocked: ${ip}`);
		return res.sendStatus(403);
	}
	log.info(`IP passed: ${ip}`);
	next();
};
