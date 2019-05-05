const { handleSuccess } = require('../libs/handle.js');

exports.systemHome = (req, res) => {
	const data = req.profile;
	handleSuccess(req, res, `[home]`, data);
};
