const { log } = require('../libs/log.js');
const { handleSuccess, handleFail } = require('../libs/handle.js');

exports.brandAdd = (req, res) => {
	const name = req.body.name && req.body.name.trim();
};
