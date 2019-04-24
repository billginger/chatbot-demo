const { log } = require('./log.js');

const handleSuccess = (req, res, logMsg, data) => {
	log.info(`[success]`, logMsg, `[${req.ip}]`);
	res.send(data);
};

const handleFail = (req, res, logMsg, failMsg) => {
	log.warn(`[fail]`, logMsg, `[${req.ip}]`);
	res.status(400).send(failMsg);
};

const handleError = (err, req, res, next) => {
	log.error(err);
	res.sendStatus(err.status || 500);
};

module.exports = { handleSuccess, handleFail, handleError };
