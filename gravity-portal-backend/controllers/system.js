const { log } = require('../libs/log.js');
const { handleSuccess, handleFail } = require('../libs/handle.js');

exports.systemHome = (req, res) => {
	res.send(req.profile);
};
