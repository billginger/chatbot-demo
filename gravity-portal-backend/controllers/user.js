const { log } = require('../libs/log.js');
const { handleSuccess, handleFail } = require('../libs/handle.js');
const { getPassword, getToken } = require('../libs/crypto.js');
const User = require('../models/user.js');

exports.userLogin = (req, res, next) => {
	const un = req.body.un && req.body.un.trim();
	const pw = req.body.pw && req.body.pw.trim();
	const name = new RegExp(`^${un}$`, 'i');
	const password = getPassword(pw);
	const token = getToken();
	const cookieOptions = { httpOnly: true, secure: true };
	User.findOneAndUpdate({ name, password, isDeleted: false }, { token }, (err, user) => {
		if (err) return next(err);
		if (!user) return handleFail(req, res, `[login] [name:${un}] [not found]`, 'msgLoginFailed');
		if (user.isLocked) return handleFail(req, res, `[login] [name:${user.name}] [locked]`, 'msgUserLocked');
		const id = user._id.toString();
		res.cookie('uid', id, cookieOptions);
		res.cookie('token', token, cookieOptions);
		handleSuccess(req, res, `[login] [id:${id}] [name:${user.name}]`, 'ok');
	});
};

exports.userCheck = (req, res, next) => {
	const _id = req.cookies.uid;
	const token = req.cookies.token;
	if (!_id || !token) {
		return handleFail(req, res, `[check] [no cookie]`, 'msgNeedLogin');
	}
	User.findOne({ _id, token, isDeleted: false }, '-password -token -isDeleted', (err, user) => {
		if (err) return next(err);
		if (!user) return handleFail(req, res, `[check] [id:${_id}] [not found]`, 'msgLoginExpired');
		if (user.isLocked) return handleFail(req, res, `[check] [id:${_id}] [locked]`, 'msgUserLocked');
		req.profile = user;
		next();
	});
};

exports.userProfile = (req, res) => {
	res.send(req.profile);
};

exports.userLogout = (req, res) => {
	const _id = req.cookies.uid;
	const token = req.cookies.token;
	res.clearCookie('uid');
	res.clearCookie('token');
	res.redirect('/login');
	if (_id && token) {
		const newToken = getToken();
		User.findOneAndUpdate({ _id, token, isLocked: false, isDeleted: false }, { token: newToken }, (err, user) => {
			if (err) return log.error(err);
			if (user) {
				const id = user._id.toString();
				handleSuccess(req, res, `[logout] [id:${id}] [name:${user.name}]`);
			}
		});
	}
};

exports.userBrand = (req, res) => {
	const _id = req.profile._id;
	const brand = req.params.id;
	User.findOneAndUpdate({ _id }, { brand }, (err, user) => {
		if (err) return next(err);
		handleSuccess(req, res, `[brand] [select] [user:${_id}] [brand:${brand}]`, 'ok');
	});
};
