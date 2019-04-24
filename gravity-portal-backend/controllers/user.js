const { log } = require('../libs/log.js');

exports.userLogin = (req, res) => {
	const un = req.body.un && req.body.un.trim();
	const pw = req.body.pw && req.body.pw.trim();
	log.debug(un);
	log.debug(pw);
	res.sendStatus(403);
};

exports.userLogout = (req, res) => {
	res.send('Logging out...');
};
