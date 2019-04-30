const { handleSuccess, handleFail } = require('../libs/handle.js');
const Brand = require('../models/brand.js');
const User = require('../models/user.js');

exports.brandAdd = (req, res) => {
	const name = req.body.name && req.body.name.trim();
	const nameAnyCase = new RegExp(`^${name}$`, 'i');
	Brand.count({ name: nameAnyCase }, (err, count) => {
		if (err) return next(err);
		if (count) {
			const statusText = JSON.stringify({ id: 'msgExist', key: 'labelName', value: name });
			return handleFail(req, res, `[brand] [add] [name:${name}] [exist]`, statusText);
		}
		const createdBy = req.profile._id;
		Brand.create({ name, createdBy }, (err, brand) => {
			if (err) return next(err);
			const id = brand._id.toString();
			handleSuccess(req, res, `[brand] [add] [id:${id}] [name:${name}]`, brand);
		});
	});
};

exports.brandDetail = (req, res) => {
	const _id = req.params.id;
	Brand.findOne({ _id, isDeleted: false }, (err, brand) => {
		if (err) return next(err);
		if (!brand) return handleFail(req, res, `[brand] [detail] [id:${_id}] [not found]`, 'msgNotFound');
		User.findById(brand.createdBy, (err, user) => {
			if (user) {
				brand = { ...brand._doc, createdBy: user.name };
			}
			handleSuccess(req, res, `[brand] [detail] [id:${_id}] [name:${brand.name}]`, brand);
		});
	});
};
