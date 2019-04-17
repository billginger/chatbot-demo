const { log } = require('./log.js');

module.exports = (err, req, res, next) => {
	log.error(err);
	res.sendStatus(err.status || 500);
};
