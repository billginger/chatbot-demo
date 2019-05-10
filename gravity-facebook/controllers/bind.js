const Account = require('../models/account.js');

const appid = '256113305335648';
const facebook = 'Gravity Prototype';

exports.handleBind = (req, res, next) => {
	const brand = req.params.id;
	const data = {
		appid,
		brand,
		isDeleted: false
	};
	Account.updateOne({ appid }, data, { upsert: true }, err => {
		if (err) return next(err);
		res.send({ facebook });
	});
};
