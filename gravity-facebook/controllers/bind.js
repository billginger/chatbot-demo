const Account = require('../models/account.js');
const { log } = require('../libs/log.js');

const appid = '832604503740298';
const facebook = 'Gravity Prototype';

exports.handleBind = (req, res, next) => {
	const brand = req.params.id;
	const data = {
		appid,
		brand,
		isDeleted: false
	};
	Account.count({ appid }, (err, count) => {
		if (err) return next(err);
		if (count) return res.send({ bound: 1 });
		Account.updateOne({ appid }, data, { upsert: true }, err => {
			if (err) return next(err);
			log.info('Account binding success!');
			res.send({ facebook });
		});
	});
};
