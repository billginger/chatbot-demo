const { handleSuccess, handleFail } = require('../libs/handle.js');
const { getPassword, getToken } = require('../libs/crypto.js');
const User = require('../models/user.js');

exports.userLogin = (req, res, next) => {
	const un = req.body.un && req.body.un.trim();
	const pw = req.body.pw && req.body.pw.trim();
	const name = new RegExp(`^${un}$`, 'i');
	const password = getPassword(pw);
	const token = getToken();
	User.findOneAndUpdate({ name, password, isDeleted: false }, { token }, (err, doc) => {
		if (err) return next(err);
		if (!doc) return handleFail(req, res, `[login] [name:${un}] [no found]`, 'msgLoginFailed');
		if (doc.isLocked) return handleFail(req, res, `[login] [name:${doc.name}] [locked]`, 'msgUserLocked');
		res.cookie('uid', doc._id);
		res.cookie('token', token);
		handleSuccess(req, res, `[login] [id:${doc._id}] [name:${doc.name}]`, 'ok');
	});
};

exports.userLogout = (req, res) => {
	res.send('Logging out...');
};
