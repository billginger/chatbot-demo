const { log } = require('./log.js');

const handleSuccess = (req, res, logText, data) => {
	const ip = req.headers['x-forwarded-for'] || req.ip;
	log.info(`[success]`, logText, `[${ip}]`);
	data && res.send(data);
};

const handleFail = (req, res, logText, statusText) => {
	const ip = req.headers['x-forwarded-for'] || req.ip;
	log.warn(`[fail]`, logText, `[${ip}]`);
	res.statusMessage = statusText;
	res.status(400).end();
};

const handleError = (err, req, res, next) => {
	log.error(err);
	res.sendStatus(err.status || 500);
};

module.exports = { handleSuccess, handleFail, handleError };
