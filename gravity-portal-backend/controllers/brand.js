const { handleSuccess, handleFail } = require('../libs/handle.js');
const Brand = require('../models/brand.js');

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
		Brand.create({ name, createdBy }, (err, doc) => {
			if (err) return next(err);
			const id = doc._id.toString();
			handleSuccess(req, res, `[brand] [add] [id:${id}] [name:${doc.name}]`, doc);
		});
	});
};

exports.brandDetail = (req, res) => {
	const _id = req.params.id;
	Brand.findOne({ _id, isDeleted: false }, (err, doc) => {
		if (err) return next(err);
		if (!doc) return handleFail(req, res, `[brand] [detail] [id:${_id}] [not found]`, 'msgNotFound');
		handleSuccess(req, res, `[brand] [detail] [id:${_id}] [name:${doc.name}]`, doc);
	});
};
