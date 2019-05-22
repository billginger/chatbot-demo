const { log } = require('./log.js');

const handleSuccess = (req, res, logText, data) => {
	const ip = req.headers['x-forwarded-for'] || req.ip;
	log.info(`[success]`, logText, `[${ip}]`);
	data && res.send(data);
};

const handleFail = (req, res, logText, statusText) => {
	const ip = req.headers['x-forwarded-for'] || req.ip;
	log.warn(`[fail]`, logText, `[${ip}]`);
	if (!statusText) {
		return res.sendStatus(403);
	}
	res.statusMessage = statusText;
	res.status(403).end();
};

const handleError = (err, req, res, next) => {
	log.error(err);
	res.sendStatus(err.status || 500);
};

module.exports = { handleSuccess, handleFail, handleError };
