const { log } = require('./log.js');

const handleError = (err, req, res, next) => {
	log.error(err);
	res.status(err.status || 500).end();
};

module.exports = { handleError };
