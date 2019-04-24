const { log } = require('./log.js');

const handleSuccess = (req, res, logText, data) => {
	log.info(`[success]`, logText, `[${req.ip}]`);
	res.send(data);
};

const handleFail = (req, res, logText, statusText) => {
	log.warn(`[fail]`, logText, `[${req.ip}]`);
	res.statusMessage = statusText;
	res.status(400).end();
};

const handleError = (err, req, res, next) => {
	log.error(err);
	res.sendStatus(err.status || 500);
};

module.exports = { handleSuccess, handleFail, handleError };
