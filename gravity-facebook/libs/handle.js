const { log } = require('./log.js');

const handleError = (err, req, res, next) => {
	log.error(err);
	res.sendStatus(err.status || 500);
};

module.exports = { handleError };
